import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { useNavigation } from "@react-navigation/native";

const Finish = ({ route }) => {
  const { username } = route.params;
  const [ leaderboard, setLeaderboard ] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    AsyncStorage.getItem("leaderboard")
      .then((req) => {
        return JSON.parse(req);
      })
      .then((data) => {
        console.log(data, "<<<< from AsyncStorage");
        data.sort((a, b) => {
          if (a.time > b.time) {
            return 1;
          } else {
            return -1;
          }
        });
        setLeaderboard(data);
      })
  }, []);

  const handlePlayAgain = () => {
    navigation.navigate("Home");
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={require("../assets/trophy.png")} style={styles.image} />
        <Text>Sudoku finished!</Text>
        <Text style={{ fontSize: 22 }}>Congrats {username}!</Text>
        {
          leaderboard.length ? (
            <View style={styles.leaderboard}>
              <Text style={{ fontSize: 22 }}>-- Leaderboard --</Text>
              {
                leaderboard.map((userData, i) => (
                  <Text key={i} style={{ margin: 2, padding: 3 }}>
                    { i+1 }. {`${userData.username}`} --- {`${userData.timerDisplay}`}
                  </Text>
                ))
              }
            </View>
          ): (
            <Text>
              There has no game master yet!
            </Text>
          )
        }
        <TouchableOpacity onPress={handlePlayAgain}>
          <Text style={styles.button}>Play again</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 0.75,
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    marginTop: 20,
    height: 125,
    width: 125
  },
  leaderboard: {
    backgroundColor: "white",
    margin: 5,
    padding: 10
  },
  button: {
    color: "black",
    width: 100,
    backgroundColor: "powderblue",
    textAlign: "center",
    padding: 10,
  }
});

export default Finish;