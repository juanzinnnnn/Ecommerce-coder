import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CategoryItem from '../components/CategoryItem/CategoryItem';
import { fetchCategories } from '../store/slices/categoriesSlice';

const categoriasMock = [
  { id: 'tecnologia', titulo: 'Tecnología' },
  { id: 'hogar', titulo: 'Hogar' },
  { id: 'moda', titulo: 'Moda' },
  { id: 'deportes', titulo: 'Deportes' },
];

const CategoriesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.categories);

  useEffect(() => {
    if (!items.length) {
      dispatch(fetchCategories());
    }
  }, [items.length, dispatch]);

  const data = items.length ? items : categoriasMock;

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Categorías</Text>
      {loading && <Text>Cargando categorías...</Text>}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CategoryItem
            categoria={item}
            onPress={() =>
              navigation.navigate('Productos', {
                categoriaId: item.id,
                categoriaTitulo: item.titulo,
              })
            }
          />
        )}
      />
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

export default CategoriesScreen;
