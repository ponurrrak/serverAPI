const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const server = require('../../../server');
const Concert = require('../../../models/concert.model');
const Seat = require('../../../models/seat.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('GET /api/concerts', () => {

  before(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/NewWaveDBtest', { useNewUrlParser: true, useUnifiedTopology: true });
      const testConcertOne = new Concert({
        _id: '5d9f1140f10a81216cfd4408',
        performer: 'Artist 1',
        genre: 'country',
        price: 25,
        day: 1,
        image: '/img/uploads/1fsd324fsdg.jpg',
      });
      await testConcertOne.save();
      const testConcertTwo = new Concert({
        _id: '5d9f1159f81ce8d1ef2bee48',
        performer: 'Artist 2',
        genre: 'pop',
        price: 35,
        day: 2,
        image: '/img/uploads/1fsd879fsdh.jpg',
      });
      await testConcertTwo.save();
      const testSeatOne = new Seat({
        _id: '5d9f1140f10a81216cfd8765',
        seat: 1,
        day: 1,
        email: 'client1@test.com',
        client: 'client1',
      });
      await testSeatOne.save();
      const testSeatTwo = new Seat({
        _id: '5d9f1140f10a81216cfd5678',
        seat: 10,
        day: 1,
        email: 'client2@test.com',
        client: 'client2',
      });
      await testSeatTwo.save();
      const testSeatThree = new Seat({
        _id: '5d9f1140f10a81216cfd1234',
        seat: 1,
        day: 2,
        email: 'client3@test.com',
        client: 'client3',
      });
      await testSeatThree.save();
    } catch(err) {
      console.error(err);
    }
  });

  after(async () => {
    await Concert.deleteMany();
    await Seat.deleteMany();
    try {
      await mongoose.disconnect();
    } catch(err) {
      console.error(err);
    }
  });

  it('/ should return all concerts with available tickets info ', async () => {
    const res = await request(server).get('/api/concerts');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(2);
    for(const concert of res.body) {
      expect(concert.performer).to.be.oneOf(['Artist 1', 'Artist 2']);
      if(concert.performer === 'Artist 1') {
        expect(concert.tickets).to.be.equal(48);
      }
      if(concert.performer === 'Artist 2') {
        expect(concert.tickets).to.be.equal(49);
      }
    }
  });

  it('/:id should return one concert by :id including available tickets info ', async () => {
    const res = await request(server).get('/api/concerts/5d9f1140f10a81216cfd4408');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body.performer).to.be.equal('Artist 1');
    expect(res.body.tickets).to.be.equal(48);

  });

  it('/random should return one random concert including available tickets info ', async () => {
    const res = await request(server).get('/api/concerts/random');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body.performer).to.be.oneOf(['Artist 1', 'Artist 2']);
    if(res.body.performer === 'Artist 1') {
      expect(res.body.tickets).to.be.equal(48);
    } else {
      expect(res.body.tickets).to.be.equal(49);
    }
  });

});
