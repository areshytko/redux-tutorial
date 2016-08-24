/*

Redux: Reducer Composition with Objects

*/

import { createStore } from 'redux';
import expect from 'expect';
import deepFreeze from 'deep-freeze';

const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                {
                    id: action.id,
                    text: action.text,
                    completed: false
                }
            ];
        case 'TOGGLE_TODO':
            return state.map((todo) => {
                return todo.id === action.id ?
                    {
                        ...todo,
                        completed: !todo.completed
                    } :
                    todo;
            });
        default:
            return state;
    }
};


const visibilityFilter = (state = 'SHOW_ALL', action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

const todoApp = (state = {}, action) => {
    return {
        todos: todos(state.todos, action),
        visibilityFilter: visibilityFilter(state.filter, action)
    };
};

const testAddTodo = () => {
    const stateBefore = [];
    const action = {
        id: 0,
        type: "ADD_TODO",
        text: "Learn Redux"
    };
    const stateAfter = [
        {
            id: 0,
            text:"Learn Redux",
            completed: false
        }
    ];

    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(todos(stateBefore, action)).toEqual(stateAfter);
};


const testToggleTodo = () => {
    const stateBefore = [
        {
            id: 0,
            text: "some text",
            completed: false
        },
        {
            id: 1,
            text: "another text",
            completed: false
        }
    ];
    const action = {
        type: "TOGGLE_TODO",
        id: 0
    };
    const stateAfter = [
        {
            id: 0,
            text: "some text",
            completed: true
        },
        {
            id: 1,
            text: "another text",
            completed: false
        }
    ];

    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(todos(stateBefore, action)).toEqual(stateAfter);
    expect(todos(todos(stateBefore, action), action)).toEqual(stateBefore);
};


let store = createStore(todoApp);

testAddTodo();
testToggleTodo();
console.log('Tests passed');