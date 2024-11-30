import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppointmentContext } from '../context/AppointmentContext';
import { loadAppointmentsByDate } from '../database/database';

export default function HomeScreen() {
  const { state, removeAppointment } = useContext(AppointmentContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);

  const allTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  ];

  useEffect(() => {
    updateAvailableTimes(selectedDate);
    
  }, [selectedDate, state.appointments]);

  

  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  

  const formatDate = (date) => {
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const updateAvailableTimes = async (date) => {
    const formattedDate = getFormattedDate(date);
    try {
      const appointments = await loadAppointmentsByDate(formattedDate);
      const bookedTimes = appointments.map((appt) => appt.time);
      const available = allTimes.filter((time) => !bookedTimes.includes(time));
      setAvailableTimes(available);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os horários disponíveis.');
    }
  };

  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
       
    }
  };

  const handleRemoveAppointment = async (id) => {
    Alert.alert('Confirmação', 'Deseja excluir este agendamento?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        onPress: async () => {
          try {
            await removeAppointment(id);
            Alert.alert('Sucesso', 'Agendamento excluído!');
            updateAvailableTimes(selectedDate);
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir o agendamento.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Quintal Barbearia!</Text>
      <Button mode="contained" onPress={() => setShowDatePicker(true)}>
        Selecionar Data
      </Button>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <Text style={styles.selectedDate}>
        Horários disponíveis para o dia {formatDate(selectedDate)}:
      </Text>

      {availableTimes.length > 0 ? (
        <FlatList
          data={availableTimes}
          renderItem={({ item }) => {
            const formattedSelectedDate = getFormattedDate(selectedDate);
            const appointment = state.appointments.find(
              (appt) =>
                appt.date === formattedSelectedDate &&
                appt.time === item
            );

            return (
              <View style={styles.timeItem}>
                <Text style={styles.timeText}>{item}</Text>
                {appointment && (
                  <TouchableOpacity onPress={() => handleRemoveAppointment(appointment.id)}>
                    <Text style={styles.removeText}>Excluir</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
          keyExtractor={(item) => item}
        />
      ) : (
        <Text style={styles.noTimesText}>Nenhum horário disponível para este dia.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    marginBottom: 34,
    marginTop: 10,
  },
  selectedDate: {
    fontSize: 16,
    marginVertical: 12,
    textAlign: 'center',
  },
  timeItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
  },
  noTimesText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 16,
    color: '#888',
  },
  removeText: {
    color: 'red',
    marginTop: 5,
    fontSize: 14,
  },
});
