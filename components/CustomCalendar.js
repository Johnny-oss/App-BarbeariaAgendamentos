import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';

export default function CustomCalendar({ selectedDate, onDayPress }) {
  const [date, setDate] = useState(new Date());

  const handleConfirm = (selected) => {
    setDate(selected);
    onDayPress({ dateString: selected.toISOString().split('T')[0] });
  };

  return (
    <View style={styles.container}>
      <DatePicker
        date={date}
        mode="date"
        onDateChange={handleConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
});