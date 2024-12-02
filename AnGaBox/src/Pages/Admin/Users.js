import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HeaderImage from '../../Componentes/Header/HeaderImage';
import FooterAdmin from '../../Componentes/Footer/FooterAdmin';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const route = useRoute();
  const { id } = route.params || {};
  const listAllUsers = async () => {
    try {
      const response = await axios.get('http://192.168.3.6:8080/api/user');
      setUsers(response.data);
      setLoading(false); // Atualiza o estado de carregamento após os dados serem carregados
    } catch (error) {
      setLoading(false); // Mesmo se ocorrer erro, desativa o carregamento
      if (error.response) {
        // O servidor respondeu com um erro (status code 4xx ou 5xx)
        console.log('Erro na resposta:', error.response);
      } else if (error.request) {
        // A requisição foi feita, mas não houve resposta
        console.log('Sem resposta do servidor:', error.request);
      } else {
        // Outro tipo de erro
        console.log('Erro ao configurar a requisição:', error.message);
      }
      Alert.alert('Erro', 'Ocorreu um erro ao buscar os usuários.');
    }
  };
  

  // useEffect para buscar os dados ao carregar o componente
  useEffect(() => {
    if (id) {
      listAllUsers();
    } else {
      console.log("ID do usuário não fornecido.");
      setLoading(false);
    }
  }, [id]);
  
 // Função para excluir um usuário
const handleDelete = async (userId) => {
  try {
    await axios.delete(`http://192.168.3.6:8080/api/user/${userId}`);
    Alert.alert('Sucesso', 'Usuário deletado com sucesso.');
    listAllUsers(); // Atualiza a lista de usuários após a exclusão
  } catch (error) {
    console.log('Erro ao deletar usuário:', error);
  }
};

  // Confirmação antes de deletar
  const confirmDelete = (userId) => {
    Alert.alert(
      'Deletar Usuário',
      'Tem certeza que deseja deletar este usuário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sim', onPress: () => handleDelete(userId) },
      ],
      { cancelable: true }
    );
  };

  // Renderiza cada usuário
  const renderItem = ({ item }) => (
    <View style={styles.userItem}>
      <Text style={styles.userName}>{item.name}</Text>
      <TouchableOpacity onPress={() => confirmDelete(item.id)}>
        <Ionicons name="trash-bin" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  // Exibição de carregamento ou dados
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderImage />
      <Text style={styles.title}>Lista de Usuários</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>Nenhum usuário disponível</Text>
        }
      />
      <FooterAdmin id={id} />
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#9400D3',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 2,
    marginHorizontal: 20,
  },
  userName: {
    fontSize: 18,
    color: '#333',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
