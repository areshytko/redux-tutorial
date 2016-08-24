/*

 Extracting Container components

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


class FilterLink extends React.Component {

    componentDidMount(){
        this.unsubscribe = store.subscribe(() =>{
            this.forceUpdate();
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const state = store.getState();

        return (
            <Link active={this.props.filter == state.visibilityFilter}
                  onClick={() => store.dispatch({ type: 'SET_VISIBILITY_FILTER', filter: this.props.filter })}>
                {this.props.children}
            </Link>
        );
    }
}

const TodoItem = ({ onClick, completed, text }) => (
    <li
        onClick={onClick}
        style={{ textDecoration: completed ? 'line-through' : 'none' }}
    >
        {text}
    </li>
);


class VisibleTodoList extends React.Component {

    componentDidMount(){
        this.unsubscribe = store.subscribe(() =>{
            this.forceUpdate();
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {

        const props = this.props;
        const state = store.getState();
        return (
            <TodoList todos={getVisibleTodos(state.todos, state.visibilityFilter)}
                      onTodoClick={(id) => store.dispatch({ type: 'TOGGLE_TODO', id })} />
        );
    }
}

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

const AddTodo = ({}) => {
    let input;
    return (
        <div>
            <input ref={(node) => input = node }/>
            <button onClick={ () => {
                store.dispatch({
                    type: "ADD_TODO",
                    id: store.getState().todos.length,
                    text: input.value
                });
                input.value = '';
            }}>
                Add ToDo
            </button>
        </div>
    );
};

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
        <TodoApp />,
        document.getElementById("root")
);
