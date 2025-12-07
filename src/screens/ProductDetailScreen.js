import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { agregarAlCarrito } from '../store/slices/cartSlice';

const ProductDetailScreen = ({ route }) => {
  const { id, producto: productoParam } = route.params || {};
  const dispatch = useDispatch();
  const productoRedux = useSelector((state) =>
    state.products.items.find((p) => p.id === id)
  );
  const producto = productoParam || productoRedux;

  if (!producto) {
    return (
      <View style={styles.centrado}>
        <Text>Producto no encontrado</Text>
      </View>
    );
  }

  const manejarAgregar = () => {
    dispatch(agregarAlCarrito(producto));
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Image
        source={{ uri: producto.imagen || 'https://via.placeholder.com/300' }}
        style={styles.imagen}
      />
      <View style={styles.info}>
        <Text style={styles.titulo}>{producto.titulo}</Text>
        <Text style={styles.precio}>${producto.precio}</Text>
        <Text style={styles.descripcion}>{producto.descripcion || 'Sin descripción.'}</Text>
        <TouchableOpacity style={styles.boton} onPress={manejarAgregar}>
          <Text style={styles.textoBoton}>Agregar al carrito</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagen: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },
  info: {
    marginTop: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  precio: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descripcion: {
    fontSize: 14,
    marginBottom: 16,
  },
  boton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;
