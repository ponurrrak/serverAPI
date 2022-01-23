import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

// import reducers
import concerts from './concertsRedux';
import seats from './seatsRedux';

// combine reducers
const rootReducer = combineReducers({
  concerts,
  seats,
});

let store;
if(window.__REDUX_DEVTOOLS_EXTENSION__){
  store = createStore(
    rootReducer,
    compose(
  		applyMiddleware(thunk),
  		window.__REDUX_DEVTOOLS_EXTENSION__()
  	)
  );
} else {
  store = createStore(
    rootReducer,
    compose(
  		applyMiddleware(thunk)
  	)
  );
}

export default store;
