import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { agregarAlCarrito } from '../../store/slices/cartSlice';

const ProductItem = ({ producto, onPress }) => {
  const dispatch = useDispatch();

  const manejarAgregar = () => {
    dispatch(agregarAlCarrito(producto));
  };

  return (
    <TouchableOpacity style={styles.contenedor} onPress={onPress}>
      <Image
        source={{ uri: producto.imagen || 'https://via.placeholder.com/150' }}
        style={styles.imagen}
      />
      <View style={styles.info}>
        <Text numberOfLines={2} style={styles.titulo}>
          {producto.titulo}
        </Text>
        <Text style={styles.precio}>${producto.precio}</Text>
        <TouchableOpacity style={styles.botonAgregar} onPress={manejarAgregar}>
          <Text style={styles.textoAgregar}>Agregar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  imagen: {
    width: '100%',
    height: 120,
    backgroundColor: '#f2f2f2',
  },
  info: {
    padding: 8,
  },
  titulo: {
    fontSize: 14,
    marginBottom: 4,
  },
  precio: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  botonAgregar: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  textoAgregar: {
    color: '#fff',
    fontSize: 12,
  },
});

export default ProductItem;
