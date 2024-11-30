
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveAppointments = async (appointments) => {
    try {
      await AsyncStorage.setItem('@appointments', JSON.stringify(appointments));
    } catch (error) {
      console.error('Erro ao salvar agendamentos', error);
    }
  };

  export const loadAppointments = async () => {
    try {
      const appointments = await AsyncStorage.getItem('@appointments');
      return appointments ? JSON.parse(appointments) : [];
    } catch (error) {
      console.error('Erro ao carregar agendamentos', error);
      return [];
    }
  };
