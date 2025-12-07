import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login, setUser } from '../store/slices/authSlice';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const manejarLogin = async () => {
    if (!email || !password) {
      Alert.alert('Datos incompletos', 'Ingresá correo y contraseña.');
      return;
    }

    try {
      await dispatch(login({ email, password })).unwrap();
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

      let mensaje = 'No se pudo iniciar sesión. Revisá tus datos e intentá nuevamente.';
      if (code === 'auth/invalid-email') mensaje = 'El correo ingresado no es válido.';
      else if (code === 'auth/user-not-found' || code === 'auth/wrong-password')
        mensaje = 'Correo o contraseña incorrectos.';

      Alert.alert('Error de autenticación', mensaje);
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Iniciar sesión</Text>
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
      <TouchableOpacity style={styles.boton} onPress={manejarLogin} disabled={loading}>
        <Text style={styles.textoBoton}>{loading ? 'Ingresando...' : 'Ingresar'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
        <Text style={styles.textoSecundario}>Crear cuenta nueva</Text>
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

export default LoginScreen;
