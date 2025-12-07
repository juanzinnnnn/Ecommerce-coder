import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { obtenerProductos } from '../store/slices/productsSlice';
import ProductItem from '../components/ProductItem/ProductItem';

const ProductsScreen = ({ route, navigation }) => {
  const { categoriaId, categoriaTitulo } = route.params || {};
  const dispatch = useDispatch();
  const { items, estado } = useSelector((state) => state.products);

  useEffect(() => {
    if (estado === 'idle') {
      dispatch(obtenerProductos());
    }
  }, [estado, dispatch]);

  const productosFiltrados = categoriaId
    ? items.filter(
        (p) =>
          p.categoriaId === categoriaId ||
          p.categoryId === categoriaId ||
          p.category === categoriaId
      )
    : items;

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>{categoriaTitulo || 'Productos'}</Text>
      {estado === 'cargando' && <Text>Cargando productos...</Text>}
      {estado === 'error' && <Text>Ocurrió un error al cargar los productos</Text>}
      {estado === 'exitoso' && (
        <FlatList
          data={productosFiltrados}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <ProductItem
              producto={item}
              onPress={() =>
                navigation.navigate('DetalleProducto', {
                  id: item.id,
                  producto: item,
                })
              }
            />
          )}
        />
      )}
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
});

export default ProductsScreen;
