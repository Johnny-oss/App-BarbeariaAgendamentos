import { ADD_APPOINTMENT, REMOVE_APPOINTMENT } from './AppointmentActions';

const initialState = {
  appointments: [],
};

export const appointmentReducer = (state = initialState, action) => {
  console.log('Ação recebida no reducer:', action);

  switch (action.type) {
    case ADD_APPOINTMENT:
      return {
        ...state,
        appointments: [...state.appointments, action.payload],
      };
    case REMOVE_APPOINTMENT:
      return {
        ...state,
        appointments: state.appointments.filter(
          (item) => item.id !== action.payload
        ),
      };
    default:
      return state;
  }
};
