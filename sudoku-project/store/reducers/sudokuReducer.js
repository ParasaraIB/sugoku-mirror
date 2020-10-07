import {
  SET_BOARD,
  VALIDATE_BOARD,
  SOLVE_BOARD
} from "../actionTypes.js";

const initialState = {
  validated: false,
  unsolvedBoard: [],
  solvedBoard: []
};

const sudokuReducer = (state=initialState, action) => {
  switch(action.type) {
    case SET_BOARD:
      return {
        ...state,
        unsolvedBoard: action.payload
      };
    case VALIDATE_BOARD:
      return {
        ...state,
        validated: action.payload
      };
    case SOLVE_BOARD:
      return {
        ...state,
        solvedBoard: action.payload
      };
    default:
      return state;
  }
}

export default sudokuReducer;