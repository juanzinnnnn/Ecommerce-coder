import { openDatabaseSync } from 'expo-sqlite';

const db = openDatabaseSync('ecommerce.db');

export const inicializarBD = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS carrito (
          id INTEGER PRIMARY KEY NOT NULL,
          productoId TEXT NOT NULL,
          titulo TEXT NOT NULL,
          precio REAL NOT NULL,
          cantidad INTEGER NOT NULL,
          imagen TEXT
        );`,
        [],
        () => {},
        (_, error) => {
          reject(error);
          return true;
        }
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS configuracion_usuario (
          id INTEGER PRIMARY KEY NOT NULL,
          nombre TEXT,
          foto TEXT,
          modoOscuro INTEGER DEFAULT 0
        );`,
        [],
        () => resolve(),
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

export const obtenerConfiguracionUsuario = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM configuracion_usuario LIMIT 1',
        [],
        (_, resultado) => {
          const filas = resultado.rows._array;
          resolve(filas.length ? filas[0] : null);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

export const guardarConfiguracionUsuario = ({ nombre, foto, modoOscuro = 0 }) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'REPLACE INTO configuracion_usuario (id, nombre, foto, modoOscuro) VALUES (1, ?, ?, ?)',
        [nombre || null, foto || null, modoOscuro ? 1 : 0],
        () => resolve(),
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

export const obtenerItemsCarrito = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM carrito',
        [],
        (_, resultado) => resolve(resultado.rows._array),
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

export const insertarItemCarrito = (item) => {
  const { id, titulo, precio, cantidad, imagen } = item;
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO carrito (productoId, titulo, precio, cantidad, imagen) VALUES (?,?,?,?,?)',
        [id, titulo, precio, cantidad, imagen || null],
        (_, resultado) => resolve(resultado.insertId),
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

export const actualizarCantidadCarrito = (productoId, cantidad) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE carrito SET cantidad = ? WHERE productoId = ?',
        [cantidad, productoId],
        () => resolve(),
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

export const borrarItemCarrito = (productoId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM carrito WHERE productoId = ?',
        [productoId],
        () => resolve(),
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

export const limpiarCarritoBD = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM carrito',
        [],
        () => resolve(),
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};
