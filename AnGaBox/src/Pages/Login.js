import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import MyButton from "../Componentes/Button";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://192.168.3.6:8080/api/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        Alert.alert("Sucesso", "Login realizado com sucesso!");
        const id = response.data.userId;
        console.log("ID do usuário:", id);
        navigation.navigate("Home", { id:id});
      } else {
        Alert.alert("Erro", "Falha no login. Verifique suas credenciais.");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao realizar login. Tente novamente.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#9400D3" />;
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../Assets/Images/logoImage.png")}
      />
      <Text style={styles.logo}>SIGN IN</Text>

      <TextInput
        style={styles.input}
        placeholder="Your Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Your Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator size="large" color="#9400D3" />
      ) : (
        <MyButton title="Login" onPress={handleLogin} />
      )}
      <View style={styles.containerText}>
        <Text style={styles.question}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.login}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    flex: 1,
  },
  image: {
    marginTop: 100,
    width: 300,
    height: 300,
  },
  logo: {
    marginTop: 15,
    fontSize: 30,
    marginBottom: 35,
    color: "black",
    fontFamily: "Montserrat_400Regular",
  },
  question: {
    color: "gray",
    marginTop: 40,
    fontFamily: "Montserrat_400Regular",
  },
  login: {
    marginTop: 40,
    marginLeft: 5,
    color: "#9400D3",
    fontFamily: "Montserrat_400Regular",
  },
  containerText: {
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  input: {
    marginTop: 27,
    height: 50,
    width: 330,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 5,
    fontFamily: "Montserrat_400Regular",
  },
});
