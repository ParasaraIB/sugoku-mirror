import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  StyleSheet,
  View,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { fetchSolvedBoard, fetchValidation } from "../store/actions";

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const convert = (seconds) => {
  let hrs = Math.floor(seconds / 3600);
  let min = Math.floor(seconds / 60) % 60;
  let sec = seconds % 60;
  return [hrs, min, sec].map(v => v < 10 ? "0" + v : v).filter((v,i) => v !== "00" || i > 0).join(":");
}

const timeLimit = 600;

const Board = (props) => {
  const [ board, setBoard ] = useState([]);
  const [ validation, setValidation ] = useState(false);
  const [ cellInput, setCellInput ] = useState([]);
  const [ time, setTime ] = useState("");
  const [ timerDisplay, setTimerDisplay ] = useState("");
  const [ seconds, setSeconds ] = useState(timeLimit);
  const [ delay, setDelay ] = useState(1000);

  const unsolvedBoard = useSelector((state) => state.sudokuReducer.unsolvedBoard);
  const solvedBoard = useSelector((state) => state.sudokuReducer.solvedBoard);
  const validated = useSelector((state) => state.sudokuReducer.validated);
  
  const { username } = props;

  const navigation = useNavigation();
  const dispatch = useDispatch();

  ///// TIMER /////
  useInterval(() => {
    console.log(convert(seconds), "<<<<<<< time ticking");
    setTimerDisplay(convert(seconds));
    setTime(timeLimit - seconds);
    setSeconds(seconds - 1);
  }, delay);

  useEffect(() => {
    dispatch(fetchSolvedBoard(unsolvedBoard));
    setBoard(unsolvedBoard);
    setValidation(validated);
    setCellInput(unsolvedBoard);
  }, [dispatch, unsolvedBoard, validated]);

  const solveBoard = () => {
    setBoard(solvedBoard);
    setCellInput(solvedBoard);
  };

  const updateBoard = (i, j, input) => {
    console.log({
      i,
      j,
      input
    });
    let newInput = [];
    let temp = [];
    for (let x = 0; x < cellInput.length; x++) {
      for (let y = 0; y < cellInput[x].length; y++) {
        temp.push(Number(cellInput[x][y]));
      }
      newInput.push(temp);
      temp = [];
    };
    newInput[i][j] = Number(input);
    setCellInput(newInput);
  };

  const validateBoard = () => {
    dispatch(fetchValidation(cellInput));
  };

  const undoGame = unsolvedBoard;
  const undoBoard = () => {
    setBoard(undoGame);
  };

  const endGame = () => {
    if (!validation) {
      Alert.alert(
        "Error",
        "Please finish the game first & validate the board first!",
        [
          {
            text: "OK", 
            onPress: () => console.log("OK Pressed")
          },
          {
            text: "Cancel", 
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          }
        ],
        {
          cancelable: false
        }
      );
    } else {
      setDelay(null);
      AsyncStorage.getItem("leaderboard")
        .then((req) => {
          return JSON.parse(req);
        })
        .then((data) => {
          let tmpUsername = data;
          if (tmpUsername === null) {
            tmpUsername = [];
          }
          tmpUsername.push({ username, time, timerDisplay: convert(time) });
          return AsyncStorage.setItem("leaderboard", JSON.stringify(tmpUsername));
        })
        .then(() => {
          navigation.navigate("Finish", { username });
        })
        .catch((err) => {
          console.log(err, "<<<< endGame");
        });
    }
  };

  return (
    <View>
      <Text style={{ justifyContent: "center" }}>
        {timerDisplay}
      </Text>
      <View style={styles.board}>
        {
          board.length ? (
            board.map((rows, i) => (
              <View key={i} style={styles.rows}>
                {
                  rows.map((row, j) => (
                    <View key={j} style={styles.columns}>
                      {
                        row ? (
                          <Text style={styles.cell}>{row}</Text>
                        ) : (
                          <TextInput 
                            onChangeText={(input) => updateBoard(i, j, input)}
                            style={styles.cellTextInput}
                            maxLength={1}
                            keyboardType="numeric"
                          />
                        )
                      }
                    </View>
                  ))
                }
              </View>
            ))
          ) : (
            <ActivityIndicator 
              size="large"
              color="#0000ff"
            />
          )
        }
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <TouchableOpacity style={styles.button} onPress={solveBoard}>
          <Text style={styles.textButton}>Solve</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={validateBoard}>
          <Text style={styles.textButton}>Validate</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <TouchableOpacity
        style={styles.button} onPress={undoBoard}>
          <Text style={styles.textButton}>Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={endGame}>
          <Text style={styles.textButton}>Finish</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.validation}>Solved?</Text>
      <Text style={styles.validation}>{validation ? "SOLVED" : "NOT YET!"}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  board: {
    borderWidth: 1,
    borderColor: "black",
    borderStyle: "solid",
    margin: 2,
    padding: 1,
    backgroundColor: "powderblue"
  },
  rows: {
    flexDirection: "row",
    justifyContent: "center"
  },
  columns: {
    borderWidth: 1,
    borderColor: "black",
    borderStyle: "solid",
    margin: 2
  },
  cell: {
    height: 25,
    width: 25,
    color: "black",
    textAlign: "center"
  },
  cellTextInput: {
    backgroundColor: "white",
    height: 25,
    width: 25,
    color: "black",
    textAlign: "center"
  },
  button: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    alignItems: "center",
    backgroundColor: "powderblue",
    margin: 5,
    padding: 2,
    elevation: 5
  },
  textButton: {
    width: 100,
    padding: 5,
    color: "black",
    textAlign: "center"
  },
  validation: {
    marginTop: 19,
    fontSize: 20,
    textAlign: "center"
  }
})

export default Board;