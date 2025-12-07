import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import colors from '../../constants/colors';

const Boton = ({
  titulo,
  onPress,
  cargando = false,
  deshabilitado = false,
  estilo,
  estiloTexto,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.boton, estilo, (cargando || deshabilitado) && styles.deshabilitado]}
      disabled={cargando || deshabilitado}
    >
      {cargando ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text style={[styles.texto, estiloTexto]}>{titulo}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  boton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  texto: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  deshabilitado: {
    opacity: 0.6,
  },
});

export default Boton;
