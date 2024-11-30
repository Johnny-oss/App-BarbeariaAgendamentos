import { auth } from '../src/firebase';
import * as SQLite from 'expo-sqlite';

// Inicializa o banco de dados
const dbPromise = SQLite.openDatabaseAsync('appointments.db');

// Executa as migrações necessárias
async function initializeDatabase() {
  const db = await dbPromise;

  
  const DATABASE_VERSION = 2;

  try {
    // Tenta obter a versão atual do banco de dados
    const currentVersionResult = await db.getFirstAsync('PRAGMA user_version');
    console.log('Resultado do PRAGMA user_version:', currentVersionResult);

    const currentVersion = currentVersionResult ? currentVersionResult.user_version : 0;

    
    if (currentVersion === 0 || currentVersion < DATABASE_VERSION) {
      console.log('Criando a tabela appointments (ou realizando migração)...');

      
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS appointments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL,
          time TEXT NOT NULL,
          clientName TEXT,
          userId TEXT NOT NULL
        );
      `);

      console.log('Tabela "appointments" criada com sucesso!');

      
      await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
    }

    
    if (currentVersion === 1) {
      console.log('Realizando migração para versão 2...');

      
      const columnsResult = await db.getAllAsync('PRAGMA table_info(appointments)');
      const hasUserIdColumn = columnsResult.some(col => col.name === 'userId');

      if (!hasUserIdColumn) {
        await db.execAsync(`
          ALTER TABLE appointments ADD COLUMN userId TEXT NOT NULL;
        `);
        console.log('Coluna "userId" adicionada com sucesso!');
      } else {
        console.log('Coluna "userId" já existe, não será adicionada novamente.');
      }

      
      await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
    }
    
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
    throw error; 
  }
}

// Salva um novo agendamento
async function saveAppointment(appointment) {
  const db = await dbPromise;
  const userId = auth.currentUser.uid; 
  const result = await db.runAsync(
    'INSERT INTO appointments (date, time, clientName, userId) VALUES (?, ?, ?, ?)',
    [appointment.date, appointment.time, appointment.clientName, userId] 
  );
  return result.lastInsertRowId;
}

// Carrega agendamentos por data
async function loadAppointmentsByDate(date) {
  try {
    const db = await dbPromise;
    const userId = auth.currentUser.uid; 

    if (!userId) {
      throw new Error('Usuário não está logado');
    }

    if (!date) {
      throw new Error('A data fornecida é inválida ou indefinida.');
    }

    
    const formattedDate = date instanceof Date
      ? date.toISOString().split('T')[0] 
      : date; 

    console.log('Executando query com a data formatada:', formattedDate);

    
    const results = await db.getAllAsync(
      'SELECT * FROM appointments WHERE date = ? AND userId = ? ORDER BY time ASC',
      [formattedDate, userId] 
    );

    console.log('Resultados obtidos da query:', results);
    return results;
  } catch (error) {
    console.error('Erro ao carregar agendamentos:', error);
    throw error;
  }
}

// Deleta um agendamento
async function deleteAppointment(id) {
  const db = await dbPromise;
  const userId = auth.currentUser.uid; 

  
  await db.runAsync('DELETE FROM appointments WHERE id = ? AND userId = ?', [id, userId]);
}

export {
  initializeDatabase,
  saveAppointment,
  loadAppointmentsByDate,
  deleteAppointment,
};
