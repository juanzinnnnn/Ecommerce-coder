import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  cargarCarritoDesdeBD,
  actualizarCantidadBD,
  quitarDelCarritoBD,
  limpiarCarritoCompletoBD,
} from '../store/slices/cartSlice';

const CartScreen = () => {
  const dispatch = useDispatch();
  const { items, total, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(cargarCarritoDesdeBD());
  }, [dispatch]);

  const manejarIncrementar = (id, cantidadActual) => {
    dispatch(actualizarCantidadBD({ id, cantidad: cantidadActual + 1 }));
  };

  const manejarDecrementar = (id, cantidadActual) => {
    const nueva = cantidadActual - 1;
    if (nueva <= 0) {
      dispatch(quitarDelCarritoBD(id));
    } else {
      dispatch(actualizarCantidadBD({ id, cantidad: nueva }));
    }
  };

  const manejarLimpiar = () => {
    dispatch(limpiarCarritoCompletoBD());
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Carrito</Text>
      {loading && <Text>Cargando carrito...</Text>}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nombre}>{item.titulo}</Text>
            <Text style={styles.precio}>${item.precio}</Text>
            <View style={styles.filaCantidad}>
              <TouchableOpacity
                style={styles.botonCantidad}
                onPress={() => manejarDecrementar(item.id, item.cantidad)}
              >
                <Text>-</Text>
              </TouchableOpacity>
              <Text style={styles.cantidad}>{item.cantidad}</Text>
              <TouchableOpacity
                style={styles.botonCantidad}
                onPress={() => manejarIncrementar(item.id, item.cantidad)}
              >
                <Text>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={styles.resumen}>
        <Text style={styles.total}>Total: ${total}</Text>
        <TouchableOpacity style={styles.botonPagar}>
          <Text style={styles.textoPagar}>Confirmar compra</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={manejarLimpiar}>
          <Text style={styles.textoLimpiar}>Vaciar carrito</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  item: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  nombre: {
    fontSize: 14,
    marginBottom: 4,
  },
  precio: {
    fontWeight: 'bold',
  },
  filaCantidad: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  botonCantidad: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  cantidad: {
    fontSize: 14,
  },
  resumen: {
    marginTop: 16,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  botonPagar: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  textoPagar: {
    color: '#fff',
    fontWeight: 'bold',
  },
  textoLimpiar: {
    textAlign: 'center',
    color: 'red',
  },
});

export default CartScreen;
