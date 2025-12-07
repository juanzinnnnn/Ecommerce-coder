import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { logout, updateEmailAuth, updatePasswordAuth } from '../store/slices/authSlice';
import {
  obtenerConfiguracionUsuario,
  guardarConfiguracionUsuario,
} from '../database/sqlite';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [foto, setFoto] = useState(null);
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');

  useEffect(() => {
    (async () => {
      // Pedir permisos de cámara
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permisos de cámara',
          'Para que puedas personalizar tu perfil con una foto, la aplicación necesita acceso a la cámara. Podés cambiar este permiso más adelante desde la configuración de tu dispositivo.'
        );
        return;
      }

      try {
        const config = await obtenerConfiguracionUsuario();
        if (config?.foto) {
          setFoto(config.foto);
        }
      } catch (e) {
        // ignorar errores silenciosamente
      }
    })();
  }, []);

  const tomarFoto = async () => {
    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
    });
    if (!resultado.canceled) {
      const uri = resultado.assets[0].uri;
      setFoto(uri);
      try {
        await guardarConfiguracionUsuario({
          nombre: user?.email || null,
          foto: uri,
        });
      } catch (e) {
        // ignorar errores de guardado
      }
    }
  };

  const elegirDeGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso de galería',
        'Necesitamos acceso a tu galería para que puedas elegir una foto existente.'
      );
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.5,
    });

    if (!resultado.canceled) {
      const uri = resultado.assets[0].uri;
      setFoto(uri);
      try {
        await guardarConfiguracionUsuario({
          nombre: user?.email || null,
          foto: uri,
        });
      } catch (e) {
        // ignorar errores de guardado
      }
    }
  };

  const elegirOrigenFoto = () => {
    Alert.alert('Foto de perfil', '¿Cómo querés seleccionar tu foto?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cámara', onPress: tomarFoto },
      { text: 'Galería', onPress: elegirDeGaleria },
    ]);
  };

  const manejarGuardarCambios = async () => {
    try {
      if (email && email !== user?.email) {
        await dispatch(updateEmailAuth(email)).unwrap();
      }
      if (password && password.length >= 6) {
        await dispatch(updatePasswordAuth(password)).unwrap();
        setPassword('');
      }
      Alert.alert('Perfil actualizado', 'Tus datos se actualizaron correctamente.');
    } catch (e) {
      Alert.alert(
        'Error al actualizar',
        'No pudimos actualizar tus datos en este momento. Verificá tu conexión o vuelve a intentar.'
      );
    }
  };

  const manejarCerrarSesion = () => {
    dispatch(logout());
  };

  return (
    <View style={styles.contenedor}>
      <TouchableOpacity onPress={elegirOrigenFoto}>
        <Image
          source={{
            uri:
              foto ||
              'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
          }}
          style={styles.avatar}
        />
      </TouchableOpacity>
      <Text style={styles.nombre}>{user?.email || 'Invitado'}</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Nueva contraseña</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Dejar en blanco para no cambiarla"
        />

        <TouchableOpacity style={styles.botonGuardar} onPress={manejarGuardarCambios}>
          <Text style={styles.textoBoton}>Guardar cambios</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.boton} onPress={manejarCerrarSesion}>
        <Text style={styles.textoBoton}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    backgroundColor: '#f2f2f2',
  },
  nombre: {
    fontSize: 18,
    marginBottom: 16,
  },
  form: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
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
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botonGuardar: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
});

export default ProfileScreen;
