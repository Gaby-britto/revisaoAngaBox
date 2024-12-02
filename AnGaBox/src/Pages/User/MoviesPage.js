import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Header from "../../Componentes/Header/Header";
import CardMovie from "../../Componentes/Cards/CardMovie";
import Footer from "../../Componentes/Footer/Footer";
import { useRoute } from "@react-navigation/native";
import axios from "axios";

export default function MoviesPage() {
  // Estados para armazenar os dados do usuário e o estado de carregamento
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carregamento

  const route = useRoute();
  const { id } = route.params || {};

  // Função para buscar os dados do usuário pela API
  const listUser = async () => {
    try {
      const response = await axios.get(
        `http://192.168.3.6:8080/api/user/${id}`
      );
      setUserState(response.data.user);
      setLoading(false); // Dados do usuário carregados, desativa o loading
      console.log("Usuário:", response.data.user);
    } catch (error) {
      console.error("Erro ao buscar o usuário:", error.message);
      if (error.response) {
        console.error("Código de status da resposta:", error.response.status);
      }
      setLoading(false); // Mesmo em caso de erro, desativa o loading
    }
  };

  useEffect(() => {
    if (id) {
      listUser(); // Busca os dados do usuário
    } else {
      console.log("ID do usuário não fornecido.");
      setLoading(false); // Caso o ID não seja fornecido, desativa o carregamento
    }
  }, [id]);

  // Exibição enquanto os dados estão carregando
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  // Obtém o nome do usuário a partir do estado
  const userName = user.nameUser;
  console.log(userName);

  return (
    <View style={styles.container}>
      <Header user={userName} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cardMovieContainer}>
          {[...Array(1)].map((_, index) => (
          <CardMovie key={index} />
        ))}
        </View>
      </ScrollView>
      <Footer id={id} userName={userName} />
    </View>
  );
}

// Estilização da página
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
});
