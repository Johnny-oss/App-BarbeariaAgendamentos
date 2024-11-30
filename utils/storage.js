import AsyncStorage from '@react-native-async-storage/async-storage';

// Função para salvar dados
export const saveData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Erro ao salvar dados no AsyncStorage:', error);
  }
};

// Função para buscar dados
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Erro ao buscar dados no AsyncStorage:', error);
  }
};

// Função para remover dados
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Erro ao remover dados do AsyncStorage:', error);
  }
};
