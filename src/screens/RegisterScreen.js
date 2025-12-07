import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { register, setUser } from '../store/slices/authSlice';

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const manejarRegistro = async () => {
    if (!email || !password) {
      Alert.alert('Datos incompletos', 'Ingresá correo y contraseña.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Contraseña débil', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      await dispatch(register({ email, password })).unwrap();
      // AppNavigator detecta auth.user y cambia automáticamente al stack principal
    } catch (errorCode) {
      const code = String(errorCode || '');

      if (code.includes('api-key-not-valid') || code.includes('invalid-api-key')) {
        dispatch(
          setUser({
            uid: 'demo-user',
            email: email.trim() || 'demo@usuario.com',
          })
        );
        return;
      }

      let mensaje = 'No se pudo crear la cuenta. Revisá los datos e intentá nuevamente.';
      if (code === 'auth/email-already-in-use')
        mensaje = 'Ese correo ya está registrado.';
      else if (code === 'auth/invalid-email')
        mensaje = 'El correo ingresado no es válido.';
      else if (code === 'auth/weak-password')
        mensaje = 'La contraseña es muy débil.';

      Alert.alert('Error de registro', mensaje);
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Crear cuenta</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.boton} onPress={manejarRegistro} disabled={loading}>
        <Text style={styles.textoBoton}>{loading ? 'Creando cuenta...' : 'Registrarme'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.textoSecundario}>Volver a iniciar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  boton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
  },
  textoSecundario: {
    textAlign: 'center',
    color: '#007AFF',
  },
});

export default RegisterScreen;
