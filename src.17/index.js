/*

 React Todo List Example

*/

import { createStore, combineReducers } from 'redux';
import ReactDom from 'react-dom';
import React from 'react';

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


const todoApp = combineReducers({
    todos,
    visibilityFilter
});


let store = createStore(todoApp, window.devToolsExtension && window.devToolsExtension());

const FilterLink = ({
    filter,
    currentFilter,
    children
}) => {
    if( filter === currentFilter) {
        return <span>{children}</span>
    }

    return (
        <a href="#"
           onClick={e => {
                    e.preventDefault();
                    store.dispatch({
                        type: 'SET_VISIBILITY_FILTER',
                        filter
                    });
           }}
        >
            {children}
        </a>
    );
};

const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_ACTIVE':
            return todos.filter( t => !t.completed );
        case 'SHOW_COMPLETE':
            return todos.filter( t => t.completed );
    }
};

class TodoComponent extends React.Component {
    render() {

        const {
            todos,
            visibilityFilter
        } = this.props;

        const visibleTodos = getVisibleTodos(todos, visibilityFilter);

        return (
            <div>
                <input ref={(node) => this.input = node }/>
                <button onClick={ () => {
                    store.dispatch({
                        type: "ADD_TODO",
                        id: this.props.todos.length,
                        text: this.input.value
                        });
                    this.input.value = '';
                }}>
                    Add ToDo
                </button>
                <ul>
                    {
                        visibleTodos.map((todo) =>
                            <li key={todo.id}
                                onClick={ () => store.dispatch({ type: 'TOGGLE_TODO', id: todo.id }) }
                                style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                            >
                                {todo.text}
                            </li>)
                    }
                </ul>
                <p>
                    Show:
                    {'  '}
                    <FilterLink filter='SHOW_ALL' currentFilter={visibilityFilter}>
                        All
                    </FilterLink>
                    {'  '}
                    <FilterLink filter='SHOW_ACTIVE' currentFilter={visibilityFilter}>
                        Active
                    </FilterLink>
                    {'  '}
                    <FilterLink filter='SHOW_COMPLETE' currentFilter={visibilityFilter}>
                        Completed
                    </FilterLink>
                </p>
            </div>
        );
    }
}


const render = () => {
    ReactDom.render(
        <TodoComponent { ...store.getState() }/>,
        document.getElementById("root")
    );
};

render();
store.subscribe(render);