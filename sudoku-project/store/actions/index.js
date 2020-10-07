import {
  SET_BOARD,
  SOLVE_BOARD,
  VALIDATE_BOARD
} from "../actionTypes.js";
import { Alert } from "react-native";

const baseURI = "https://sugoku.herokuapp.com";

const encodeBoard = (board) =>
  board.reduce(
    (result, row, i) =>
      result + `%5B${encodeURIComponent(row)}%5D${i === board.length - 1 ? '' : '%2C'}`,
    ''
  );

const encodeParams = (params) =>
  Object.keys(params)
    .map((key) => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
    .join('&');

export const fetchUnsolvedBoard = (difficulty) => {
  return (dispatch, getState) => {
    fetch(`${baseURI}/board?difficulty=${difficulty}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data, "<<<< fetchUnsolvedBoard")
        dispatch({
          type: SET_BOARD,
          payload: data.board
        });
      })
      .catch((err) => {
        console.log(err, "<<<< error in fetchUnsolvedBoard");
      });
  };
};

export const fetchSolvedBoard = (board) => {
  const data = {
    board,
  };
  return (dispatch, getState) => {
    fetch(`${baseURI}/solve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: encodeParams(data)
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data, "<<<< fetchSolvedBoard");
        dispatch({
          type: SOLVE_BOARD,
          payload: data.solution
        });
      })
      .catch((err) => {
        console.log(err, "<<<< error in fetchSolvedBoard");
      });
  };
};

export const fetchValidation = (board) => {
  const data = {
    board,
  };
  return (dispatch, getState) => {
    let validated = false;
    fetch(`${baseURI}/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: encodeParams(data)
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data, "<<<< fetchValidation");
        if (data.status === "solved") {
          validated = true;
          dispatch({
            type: VALIDATE_BOARD,
            payload: validated
          });
          Alert.alert(
            "Success",
            "The board has been validated!",
            [
              {
                text: "OK",
                onPress: () => console.log("OK Pressed")
              }
            ],
            {
              cancelable: false
            }
          );
        } else {
          validated = false;
          dispatch({
            type: VALIDATE_BOARD,
            payload: validated
          })
          Alert.alert(
            "Wrong Answer",
            "Please re-check your answer!",
            [
              {
                text: "OK",
                onPress: () => console.log("OK Pressed")
              }
            ],
            {
              cancelable: false
            }
          );
        }
      })
      .catch((err) => {
        console.log(err, "<<<< error in fetchValidation");
      });
  };
};