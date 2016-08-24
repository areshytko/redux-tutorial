/*

 Todo List Example refactorings

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
    onClick,
    children
}) => {
    if( filter === currentFilter) {
        return <span>{children}</span>
    }

    return (
        <a href="#"
           onClick={e => {
                    e.preventDefault();
                    onClick(filter);
           }}
        >
            {children}
        </a>
    );
};

const TodoItem = ({ onClick, completed, text }) => (
    <li
        onClick={onClick}
        style={{ textDecoration: completed ? 'line-through' : 'none' }}
    >
        {text}
    </li>
);

const TodoList = ({ todos, onTodoClick }) => (
    <ul>
        {
            todos.map((todo) => <TodoItem key={todo.id}
                                          onClick={ () => onTodoClick(todo.id) }
                                          { ...todo } />)
        }
    </ul>
);

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

const AddTodo = ({ onClick }) => {
    let input;
    return (
        <div>
            <input ref={(node) => input = node }/>
            <button onClick={ () => {
                onClick(input.value);
                input.value = '';
            }}>
                Add ToDo
            </button>
        </div>
    );
};

const Footer = ({
    visibilityFilter,
    onFilterClick
}) => (
    <p>
        Show:
        {'  '}
        <FilterLink filter='SHOW_ALL' currentFilter={visibilityFilter} onClick={onFilterClick}>
            All
        </FilterLink>
        {'  '}
        <FilterLink filter='SHOW_ACTIVE' currentFilter={visibilityFilter} onClick={onFilterClick}>
            Active
        </FilterLink>
        {'  '}
        <FilterLink filter='SHOW_COMPLETE' currentFilter={visibilityFilter} onClick={onFilterClick}>
            Completed
        </FilterLink>
    </p>
);


const TodoApp = ({
    todos,
    visibilityFilter
}) => (
    <div>
        <AddTodo onClick={(value) => store.dispatch({
        type: "ADD_TODO",
        id: todos.length,
        text: value
        })} />
        <TodoList onTodoClick={(id) => store.dispatch({ type: 'TOGGLE_TODO', id })}
                  todos={getVisibleTodos(todos, visibilityFilter)} />
        <Footer visibilityFilter={visibilityFilter} onFilterClick={(filter) => store.dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter
        })} />
    </div>
);



const render = () => {
    ReactDom.render(
        <TodoApp { ...store.getState() }/>,
        document.getElementById("root")
    );
};

render();
store.subscribe(render);