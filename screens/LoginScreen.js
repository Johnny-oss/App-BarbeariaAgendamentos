import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Button, Image, Alert } from "react-native";
import { auth } from "../src/firebase"; 

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  
  const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  };

  
  const handleLogin = () => {
    
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erro", "Todos os campos são obrigatórios. Por favor, preencha todos.");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Erro", "O email fornecido não é válido. Exemplo: exemplo@dominio.com");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    
    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert("Sucesso", "Login realizado com sucesso!");
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/user-not-found':
            Alert.alert("Erro", "Usuário não encontrado. Verifique o email e tente novamente.");
            break;
          case 'auth/wrong-password':
            Alert.alert("Erro", "Senha incorreta. Tente novamente.");
            break;
          case 'auth/invalid-email':
            Alert.alert("Erro", "O email fornecido é inválido.");
            break;
          case 'auth/invalid-credential': 
            Alert.alert(
            "Erro",
            "Usuário ou senha inválidos. Verifique suas credenciais e tente novamente.");
            break;
          default:
            Alert.alert("Erro", error.message);
        }
      });
  };

  
  const handleRegister = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erro", "Todos os campos são obrigatórios para cadastro.");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Erro", "O email fornecido não é válido. Exemplo: exemplo@dominio.com");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert("Sucesso", "Cadastro realizado com sucesso! Faça login com seus dados.");
        setEmail(''); 
        setPassword(''); 
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/email-already-in-use':
            Alert.alert("Erro", "Este email já está em uso. Tente outro.");
            break;
          case 'auth/weak-password':
            Alert.alert("Erro", "A senha é muito fraca. Use pelo menos 6 caracteres.");
            break;
          default:
            Alert.alert("Erro", error.message);
        }
      });
  };

  return (
    <View style={styles.container}>      
      <Image source={require('../assets/Quintal.png')} style={styles.logo} />
      <Text style={styles.title}>Quintal Barbearia</Text>

      
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      
      <Button title="Login" onPress={handleLogin} color="#007BFF" />

      
      <Text style={styles.infoText}>
        Para cadastrar um novo usuário, insira um email e senha válidos e clique em "Cadastrar".
      </Text>

      
      <Button title="Cadastrar" onPress={handleRegister} color="#007BFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  logo: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginVertical: 15,
  },
});
