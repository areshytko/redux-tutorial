/*

Simplest redux application

*/

import { createStore } from 'redux';

const counter = (state = 0, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
};

var store = createStore( counter );

const render = () => {
    document.body.innerText = store.getState();
};

store.subscribe(render);

render();

document.addEventListener('click', () => {
    console.log('clicked!');
    store.dispatch({ type: "INCREMENT" });
});