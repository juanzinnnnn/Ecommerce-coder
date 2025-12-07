import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CategoryItem = ({ categoria, onPress }) => {
  return (
    <TouchableOpacity style={styles.contenedor} onPress={onPress}>
      <View style={styles.circulo} />
      <Text style={styles.texto}>{categoria.titulo}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 4,
    borderRadius: 8,
  },
  circulo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    marginRight: 10,
  },
  texto: {
    fontSize: 14,
  },
});

export default CategoryItem;
