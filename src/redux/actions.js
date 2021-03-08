// import { ADD_TODO, TOGGLE_TODO, SET_FILTER } from "./actionTypes";
import { USER_LOG } from "./actionTypes";

let nextTodoId = 0;

export const userLog = (userid,username) => ({
    type: USER_LOG,
    payload:{
        userid,
        username
    }
});

// export const addTodo = content => ({
//   type: ADD_TODO,
//   payload: {
//     id: ++nextTodoId,
//     content
//   }
// });

// export const toggleTodo = id => ({
//   type: TOGGLE_TODO,
//   payload: { id }
// });

// export const setFilter = filter => ({ type: SET_FILTER, payload: { filter } });