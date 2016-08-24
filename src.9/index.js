/*

 Redux: Avoiding Array Mutations with concat(), slice(), and ...spread

*/

import deepFreeze from 'deep-freeze';
import expect from 'expect';

const addCounter = (list) => {
    return [...list, 0];
};


const testAddCounter = () => {
    const listBefore = [];
    const listAfter = [0];

    deepFreeze(listBefore);

    expect(addCounter(listBefore)).toEqual(listAfter);
};


const incrementCounter = (list, index) => {
    return [...list.slice(0, index),
            list[index] + 1,
            ...list.slice(index + 1)];
};

const testIncrementCounter = () => {
    const listBefore = [10, 20, 30];
    const listAfter = [10, 21, 30];

    deepFreeze(listBefore);

    expect(incrementCounter(listBefore, 1)).toEqual(listAfter);
};


testAddCounter();
testIncrementCounter();
console.log('Tests passed!');

