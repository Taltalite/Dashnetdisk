import { USER_LOG } from "../actionTypes";

const initialState = {
  username: "default Name",
  userid: "default ID"
};

export default function(state = initialState, action) {
  switch (action.type) {
    case USER_LOG: {
      const { username,userid } = action.payload;
      console.log(state)
      return {
        ...state,
        username: username,
        userid: userid
      };
    }
    // case TOGGLE_TODO: {
    //   const { id } = action.payload;
    //   return {
    //     ...state,
    //     byIds: {
    //       ...state.byIds,
    //       [id]: {
    //         ...state.byIds[id],
    //         completed: !state.byIds[id].completed
    //       }
    //     }
    //   };
    // }
    default:
      return state;
  }
}