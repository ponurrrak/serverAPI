import React from 'react';

import { Alert, Container } from 'reactstrap';

const Prices = () => (
  <Container>
    <h1>Prices</h1>
    <p>Prices may differ according the day of the festival. Remember that ticket includes not only the star performance, but also 10+ workshops. We gathered several genre teachers to help you increase your vocal skills, as well as self confidence.</p>

    <Alert color="info">
        Attention! <strong>Children under 4 can go freely with you without any other fee!</strong>
    </Alert>

    <h2>Day one</h2>
    <p>Price: 25$</p>
    <p>Workshops: &quot;Rock Music Style&quot;, &quot;How to make you voice grooowl&quot;, &quot;Make your voice stronger&quot;, &quot;History of Rock&quot;</p>
    <h2>Day Two</h2>
    <p>Price: 25$</p>
    <p>Workshops: &quot;Find your real tune&quot;, &quot;Find your real YOU&quot;, &quot;Fell the music&quot;, &quot;Jam session&quot;</p>
    <h2>Day three</h2>
    <p>Price: 50$</p>
    <p>Workshops: &quot;Increase your vocal range&quot;, &quot;How to properly warmup before singing&quot;, &quot;It&apos;s time for YOU!&quot;</p>
  </Container>
);

export default Prices;
