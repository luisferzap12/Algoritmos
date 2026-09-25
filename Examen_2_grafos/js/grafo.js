// =====================================================
// CONSTRUCCIÓN DEL GRAFO
// =====================================================

// Crea una lista de adyacencia a partir de las vías
function construirGrafo(vias) {
  const grafo = {};

  // Crear una lista vacía para cada lugar
  Object.keys(lugares).forEach((lugar) => {
    grafo[lugar] = [];
  });

  // Como el grafo es no dirigido,
  // cada conexión se agrega en los dos sentidos.
  vias.forEach(([origen, destino, peso]) => {
    grafo[origen].push({
      destino: destino,
      peso: peso
    });

    grafo[destino].push({
      destino: origen,
      peso: peso
    });
  });

  return grafo;
}

// Construimos el grafo utilizando los datos de datos.js
const grafo = construirGrafo(vias);
