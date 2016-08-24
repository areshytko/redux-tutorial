/*

 Added Action Creators

*/

import { createStore, combineReducers } from 'redux';
import ReactDom from 'react-dom';
import React from 'react';
import { Provider, connect } from 'react-redux';

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


const setVisibilityFilterAction = (filter) => ({
    type: 'SET_VISIBILITY_FILTER',
    filter
});

const addTodoAction = (id, text) => ({
    type: "ADD_TODO",
    id,
    text
});

const toggleTodoAction = (id) => ({
    type: 'TOGGLE_TODO',
    id
});

const Link = ({
    active,
    onClick,
    children
}) => {
    if( active ) {
        return <span>{children}</span>
    }

    return (
        <a href="#"
           onClick={e => {
                    e.preventDefault();
                    onClick();
           }}
        >
            {children}
        </a>
    );
};


const mapLinkStateToProps = (state, ownProps) => ({
    active: ownProps.filter == state.visibilityFilter,
    children: ownProps.children
});

const mapLinkDispatchToProps = (dispatch, ownProps) => ({
    onClick: () => dispatch( setVisibilityFilterAction(ownProps.filter) )
});

const FilterLink = connect(mapLinkStateToProps, mapLinkDispatchToProps)(Link);



const TodoItem = ({ onClick, completed, text }) => (
    <li
        onClick={onClick}
        style={{ textDecoration: completed ? 'line-through' : 'none' }}
    >
        {text}
    </li>
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

const TodoList = ({ todos, onTodoClick }) => (
    <ul>
        {
            todos.map((todo) => <TodoItem key={todo.id}
                                          onClick={ () => onTodoClick(todo.id) }
                                          { ...todo } />)
        }
    </ul>
);

const mapTodoListStateToProps = (state) => ({
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
});

const mapTodoListDispatchToProps = (dispatch) => ({
    onTodoClick: (id) => dispatch( toggleTodoAction(id) )
});

const VisibleTodoList = connect(mapTodoListStateToProps, mapTodoListDispatchToProps)(TodoList);


let AddTodo = (props, context) => {
    let input;
    return (
        <div>
            <input ref={(node) => input = node }/>
            <button onClick={ () => {
                props.dispatch( addTodoAction(context.store.getState().todos.length, input.value) );
                input.value = '';
            }}>
                Add ToDo
            </button>
        </div>
    );
};

AddTodo.contextTypes = {
    store: React.PropTypes.object
};

AddTodo = connect(null, null)(AddTodo);

const Footer = ({}) => (
    <p>
        Show:
        {'  '}
        <FilterLink filter='SHOW_ALL'>
            All
        </FilterLink>
        {'  '}
        <FilterLink filter='SHOW_ACTIVE'>
            Active
        </FilterLink>
        {'  '}
        <FilterLink filter='SHOW_COMPLETE'>
            Completed
        </FilterLink>
    </p>
);


const TodoApp = ({}) => (
    <div>
        <AddTodo />
        <VisibleTodoList />
        <Footer />
    </div>
);


ReactDom.render(
    <Provider store={createStore(todoApp, window.devToolsExtension && window.devToolsExtension())}>
        <TodoApp />
    </Provider>,
    document.getElementById("root")
);
