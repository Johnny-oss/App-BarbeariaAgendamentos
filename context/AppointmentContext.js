import React, { createContext, useReducer, useEffect, useState } from 'react'; 
import { loadAppointmentsByDate, saveAppointment, deleteAppointment } from '../database/database'; 
import { auth } from '../src/firebase'; 

export const AppointmentContext = createContext();

const initialState = {
  appointments: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_APPOINTMENTS':
      return { ...state, appointments: action.payload };
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] };
    case 'DELETE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.filter((item) => item.id !== action.payload),
      };
    default:
      return state;
  }
}

export const AppointmentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        if (auth.currentUser) {
          await loadAppointmentsForToday();
        } else {
          console.error("Usuário não está logado no início");
        }
        setLoading(false);
      } catch (error) {
        console.error('Erro ao configurar o banco de dados no AppointmentContext:', error);
        setLoading(false);
      }
    };

    const loadAppointmentsForToday = async () => {
      const today = new Date().toISOString().split('T')[0];

      try {
        const data = await loadAppointmentsByDate(today); 
        dispatch({ type: 'SET_APPOINTMENTS', payload: data });
      } catch (error) {
        console.error('Erro ao carregar agendamentos: ', error);
      }
    };

    
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        console.log('Usuário logado:', user.uid);
        setupDatabase(); 
      } else {
        console.log('Usuário não está logado');
        setLoading(false); 
      }
    });

    
    return () => unsubscribe();

  }, []); 

  const loadAppointmentsForDate = async (date) => {
    try {
      const appointments = await loadAppointmentsByDate(date); 
      dispatch({ type: 'SET_APPOINTMENTS', payload: appointments });
    } catch (error) {
      console.error('Erro ao carregar agendamentos por data:', error);
    }
  };
  

  const setAppointments = (appointments) => {
    dispatch({ type: 'SET_APPOINTMENTS', payload: appointments });
  };

  const addAppointment = async (appointment) => {
    try {
      const id = await saveAppointment(appointment); 
      dispatch({ type: 'ADD_APPOINTMENT', payload: { ...appointment, id } });
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
    }
  };

  const removeAppointment = async (id) => {
    try {
      await deleteAppointment(id);
      dispatch({ type: 'DELETE_APPOINTMENT', payload: id });
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
    }
  };

  if (loading) {
    console.log('Carregando...');
  }

  return (
    <AppointmentContext.Provider value={{ state, addAppointment, setAppointments, removeAppointment, loadAppointmentsForDate }}>
      {children}
    </AppointmentContext.Provider>
  );
};
