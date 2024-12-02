import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Header from "../../Componentes/Header/Header";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import CardMovieAdmin from "../../Componentes/Cards/CardMovieadmin";
import FooterAdmin from "../../Componentes/Footer/FooterAdmin";

export default function MoviesPage() {
  // Estados para armazenar os dados do usuário e o estado de carregamento
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carregamento

  const route = useRoute();
  const { id } = route.params || {}; 
  console.log("id do adm", id);

  // Função para buscar os dados do usuário
  const listUser = async () => {
    try {
      const response = await axios.get(`http://192.168.3.6:8080/api/adm/${id}`);
      if (response.data && response.data.adm) {
        setUserState(response.data.adm);
      } else {
        console.log("Dados do administrador não encontrados");
      }
      setLoading(false); // Dados carregados, desativa o loading
      console.log("Usuário:", response.data.adm);
      console.log("Resposta da API:", response.data);
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

  // Exibição enquanto os dados estão carregando ou se os dados do usuário não estiverem disponíveis
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Dados do administrador não encontrados.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header user={user.admName || "Administrador"} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cardMovieContainer}>
          {[...Array(1)].map((_, index) => (
            <CardMovieAdmin key={index} />
          ))}
        </View>
      </ScrollView>
      <FooterAdmin id={id} />
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
  },
});
