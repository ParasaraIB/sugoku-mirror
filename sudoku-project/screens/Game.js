import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { useDispatch } from "react-redux";

import Board from "../components/Board.js";
import { fetchUnsolvedBoard } from "../store/actions";

const leaderboard = AsyncStorage.getItem("leaderboard");

const Game = ({ route }) => {
  const { username, difficulty } = route.params;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!leaderboard) {
      AsyncStorage.setItem("leaderboard", []);
    }
    dispatch(fetchUnsolvedBoard(difficulty));
  }, [dispatch, difficulty]);

  return (
    <View style={styles.container}>
      <View style={{ padding: 5, margin: 10 }}>
        <Text style={{ textAlign: "center" }}>
          Enjoy the game, {username}!
        </Text>
        <Text style={{ textAlign: "center" }}>
          Difficulty level: {difficulty}
        </Text>
      </View>
      <Board username = {username} />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default Game;