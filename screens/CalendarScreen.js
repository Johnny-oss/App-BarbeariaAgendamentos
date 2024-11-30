import React, { useState, useContext, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Text, Button, TextInput, IconButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppointmentContext } from '../context/AppointmentContext';
import { loadAppointmentsByDate } from '../database/database'; 

export default function CalendarScreen() {
  const { state, addAppointment, removeAppointment, loadAppointmentsForDate } = useContext(AppointmentContext);
  const [clientName, setClientName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const allTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  ];

  useEffect(() => {
    const fetchAppointmentsAndTimes = async () => {
      if (!selectedDate) return;
  
      try {
        // Busca os agendamentos para a data selecionada
        const appointments = await loadAppointmentsByDate(selectedDate);
  
        // Atualiza os horários disponíveis
        const bookedTimes = appointments.map((appt) => appt.time);
        const available = allTimes.filter((time) => !bookedTimes.includes(time));
  
        setAvailableTimes(available); 
        loadAppointmentsForDate(selectedDate);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os horários disponíveis.');
      }
    };
  
    fetchAppointmentsAndTimes();
  }, [selectedDate]);

  const updateAvailableTimes = async (date) => {
    try {
      const appointments = await loadAppointmentsByDate(date);
      const bookedTimes = appointments.map((appt) => appt.time);
      const available = allTimes.filter((time) => !bookedTimes.includes(time));
      setAvailableTimes(available);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os horários disponíveis.');
    }
  };

  const handleSaveAppointment = async () => {
    if (!clientName.trim() || !selectedDate || !selectedTime) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    const newAppointment = { clientName, date: selectedDate, time: selectedTime };

    try {
      await addAppointment(newAppointment);
      Alert.alert('Sucesso', 'Agendamento salvo!');
      setClientName('');
      setSelectedTime('');
      updateAvailableTimes(selectedDate);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o agendamento.');
    }
  };

  const handleDeleteAppointment = (id) => {
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

  const onDateChange = (event, date) => {
    if (event.type === 'set' && date) {
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];
  
      // Só atualiza se a data for diferente da atual
      if (localDate !== selectedDate) {
        setSelectedDate(localDate);
      }
    }
    setShowDatePicker(false); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendamentos</Text>
      <Button mode="contained" onPress={() => setShowDatePicker(true)}>
        Selecionar Data
      </Button>
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      <Text style={styles.selectedDate}>
        Data Selecionada: {selectedDate ? selectedDate.split('-').reverse().join('/') : ''}
      </Text>
      <TextInput
        label="Nome do Cliente"
        value={clientName}
        onChangeText={setClientName}
        style={styles.input}
      />
      <Picker
        selectedValue={selectedTime}
        onValueChange={setSelectedTime}
        enabled={availableTimes.length > 0}
        style={styles.picker}
      >
        <Picker.Item label="Selecione um horário" value="" />
        {availableTimes.map((time) => (
          <Picker.Item label={time} value={time} key={time} />
        ))}
      </Picker>
      <Button mode="contained" onPress={handleSaveAppointment}>
        Salvar
      </Button>
      <FlatList
        data={state.appointments.filter((item) => item.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time))}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.itemName}>{item.clientName}</Text>
              <Text style={styles.itemTime}>{item.time}</Text>
            </View>
            <IconButton
              icon="delete"
              color="#ff0000"
              size={20}
              onPress={() => handleDeleteAppointment(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  selectedDate: {
    fontSize: 16,
    marginVertical: 8,
    textAlign: 'center',
  },
  input: {
    marginVertical: 10,
  },
  picker: {
    marginVertical: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginVertical: 5,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 4,
  },
});