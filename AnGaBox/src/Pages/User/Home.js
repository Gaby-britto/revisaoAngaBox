import { Image, ScrollView, StyleSheet, View, Text } from "react-native";
import Header from "../../Componentes/Header/Header";
import Banner from "../../Componentes/Banner";
import CardMovie from "../../Componentes/Cards/CardMovie";
import Texts from "../../Componentes/Text";
import Footer from "../../Componentes/Footer/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import CardVideo from "../../Componentes/Cards/Card2";

export default function Home() {
  // Estado para armazenar os dados do usuário e filmes
  const [user, setUserState] = useState(null);
  const [movies, setMovies] = useState([]); // Armazena os filmes recebidos da API
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const route = useRoute();
  const { id } = route.params || {};

  // Função assíncrona para buscar os dados do usuário e filmes pela API
  const listUserAndMovies = async () => {
    try {
      // Buscando dados do usuário
      const userResponse = await axios.get(
        `http://192.168.3.6:8080/api/user/${id}`
      );
      setUserState(userResponse.data.user);

      // Buscando filmes
      const moviesResponse = await axios.get("http://192.168.3.6:8080/api/movie");
      setMovies(moviesResponse.data.movies); // Supondo que a resposta contenha um campo 'movies'

      setLoading(false); // Quando tudo estiver carregado, desativa o loading
    } catch (error) {
      console.error("Erro ao buscar os dados:", error.message);
      setLoading(false); // Mesmo em caso de erro, desativa o loading
    }
  };

  // useEffect para buscar os dados ao carregar o componente
  useEffect(() => {
    if (id) {
      listUserAndMovies();
    } else {
      console.log("ID do usuário não fornecido.");
      setLoading(false); // Caso o id não seja fornecido, desativa o loading
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

  // Caso o usuário não tenha sido carregado
  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text>Erro ao carregar dados do usuário.</Text>
      </View>
    );
  }

  // Obtém o nome do usuário a partir do estado
  const userName = user.nameUser;

  return (
    <View style={styles.containerPricipal}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Header user={userName} />
        <Banner />
        <Image
          style={styles.imageDecoration}
          source={require("../../Assets/Images/decoration.png")}
        />
        <Texts />

        {/* Renderiza os filmes da API */}
        <ScrollView
          horizontal
          style={styles.cardMovieContainer}
          showsHorizontalScrollIndicator={false}
        >
            {/* Renderiza 3 cartões de vídeos */}
        {[...Array(1)].map((_, index) => (
          <CardMovie key={index} userName={userName} />
        ))}
        </ScrollView>

        <Texts />

        {/* Renderiza 3 cartões de vídeos */}
        {[...Array(1)].map((_, index) => (
          <CardVideo key={index} />
        ))}
      </ScrollView>
      <Footer id={id} userName={userName} />
    </View>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  containerPricipal: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 60,
  },
  cardMovieContainer: {
    flexDirection: "row",
    marginHorizontal: 5,
    paddingVertical: 5,
  },
  imageDecoration: {
    height: 30,
    marginTop: 10,
    marginLeft: 150,
    width: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
