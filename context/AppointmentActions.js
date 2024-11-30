
export const ADD_APPOINTMENT = 'ADD_APPOINTMENT';
export const REMOVE_APPOINTMENT = 'REMOVE_APPOINTMENT';

// Adicionar um agendamento
export const addAppointment = (appointment) => ({
  type: ADD_APPOINTMENT,
  payload: appointment,
});

// Remover um agendamento
export const removeAppointment = (id) => ({
  type: REMOVE_APPOINTMENT,
  payload: id,
});
