import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  Picker
} from "react-native";

const Home = ({ navigation }) => {
  const [ username, setUsername ] = useState("");
  const [ difficulty, setDifficulty ] = useState("");
  let textInput;

  const handleUsernameInput = (input) => {
    setUsername(input);
  };

  const handleDifficultyInput = (input) => {
    setDifficulty(input);
  };

  const handleStartGame = () => {
    if (!username.length) {
      Alert.alert(
        "Error",
        "Please insert your name!",
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
    } else if (!difficulty) {
      Alert.alert(
        "Error",
        "Please select one difficulty level!",
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
      navigation.navigate("Game", {
        username,
        difficulty
      });
      textInput.clear();
      setUsername("");
      setDifficulty(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text 
        style={{ textAlign: "center", fontSize: 25 }}>
        Sudoku!
      </Text>
      <Image source={require("../assets/sudoku.png")} style={styles.image} />
      <View style={styles.playerInfo}>
        <Text style={{ margin: 5 }}>Username: {username}</Text>
        <Text style={{ margin: 5 }}>Difficulty: {difficulty}</Text>
      </View>
      <Text 
        style={{ textAlign: "center" }}>
        Please input your username to begin!
      </Text>
      <TextInput 
        ref={input => { textInput = input }}
        clearButtonMode="always"
        placeholder="your username"
        placeholderTextColor="#423231"
        onChangeText={(input) => handleUsernameInput(input)}
        style={styles.username}
      />
      <Text>Please select the difficulty!</Text>
      <View style={styles.selector}>
        <Picker 
          selectedValue={difficulty}
          onValueChange={(input) => handleDifficultyInput(input)}
        >
          <Picker.Item label="-- Choose the Difficulty --" value={null} />
          <Picker.Item label="EASY" value="easy" />
          <Picker.Item label="MEDIUM" value="medium" />
          <Picker.Item label="HARD" value="hard" />
        </Picker>
      </View>
      <TouchableOpacity onPress={handleStartGame}>
        <Text style={styles.button}>Start</Text>
      </TouchableOpacity>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  playerInfo: {
    backgroundColor: "powderblue",
    alignItems: "flex-start",
    padding: 10,
    width: 200
  },
  image: {
    height: 125,
    width: 125
  },
  username: {
    width: 150,
    backgroundColor: "white",
    padding: 5
  },
  selector: {
    backgroundColor: "white",
    fontSize: 20,
    color: "white",
    width: 200
  },
  button: {
    color: "black",
    width: 100,
    backgroundColor: "powderblue",
    textAlign: "center",
    padding: 10,
  }
});

export default Home;