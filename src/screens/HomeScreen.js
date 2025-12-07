import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ProductItem from '../components/ProductItem/ProductItem';
import { obtenerProductos } from '../store/slices/productsSlice';
import colors from '../constants/colors';

const productosMockLocales = [
  { id: '1', titulo: 'Auriculares Bluetooth', precio: 12999 },
  { id: '2', titulo: 'Zapatillas Urbanas', precio: 18999 },
  { id: '3', titulo: 'Notebook 14"', precio: 399999 },
  { id: '4', titulo: 'Smartwatch Fitness', precio: 45999 },
  { id: '5', titulo: 'Mochila Casual', precio: 15999 },
  { id: '6', titulo: 'Sillón Gamer', precio: 289999 },
  { id: '7', titulo: 'Lámpara de escritorio LED', precio: 9999 },
  { id: '8', titulo: 'Parlante Portátil', precio: 21999 },
];

const categoriasRapidas = [
  'Ofertas',
  'Tecnología',
  'Hogar',
  'Electro',
  'Moda',
  'Belleza',
  'Deportes',
];

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, estado, error } = useSelector((state) => state.products);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    if (estado === 'idle') {
      dispatch(obtenerProductos());
    }
  }, [estado, dispatch]);

  const dataBase = items && items.length ? items : productosMockLocales;

  const dataProductos = dataBase.filter((p) => {
    if (!busqueda.trim()) return true;
    const q = busqueda.trim().toLowerCase();
    const titulo = (p.titulo || '').toLowerCase();
    const descripcion = (p.descripcion || '').toLowerCase();
    const categoria = (p.categoria || p.category || '').toLowerCase();
    return (
      titulo.includes(q) ||
      descripcion.includes(q) ||
      categoria.includes(q)
    );
  });

  return (
    <View style={styles.contenedor}>
      <View style={styles.headerSuperior}>
        <TextInput
          style={styles.buscador}
          placeholder="Buscar productos"
          placeholderTextColor={colors.textSecondary}
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitulo}>Ofertas para vos</Text>
          <Text style={styles.bannerSubtitulo}>Hasta 40% OFF en tecnología</Text>
        </View>

        <View style={styles.categoriasContenedor}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categoriasRapidas.map((cat) => (
              <View key={cat} style={styles.chipCategoria}>
                <Text style={styles.chipTexto}>{cat}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.seccionTituloFila}>
          <Text style={styles.seccionTitulo}>Recomendados</Text>
        </View>

        {estado === 'cargando' && (
          <ActivityIndicator size="large" color={colors.primary} />
        )}

        {estado === 'error' && (
          <Text style={styles.textoError}>Error al cargar productos: {error}</Text>
        )}

        <FlatList
          data={dataProductos}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          scrollEnabled={false}
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerSuperior: {
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: colors.primary,
  },
  buscador: {
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
  },
  banner: {
    marginTop: 12,
    marginHorizontal: 16,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
  },
  bannerTitulo: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bannerSubtitulo: {
    marginTop: 4,
    color: colors.text,
    fontSize: 13,
  },
  categoriasContenedor: {
    marginTop: 12,
    paddingHorizontal: 16,
  },
  chipCategoria: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  chipTexto: {
    fontSize: 12,
    color: colors.text,
  },
  seccionTituloFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  seccionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  textoError: {
    color: 'red',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
});

export default HomeScreen;
