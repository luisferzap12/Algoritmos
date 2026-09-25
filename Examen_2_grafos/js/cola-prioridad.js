/* =====================================================================
   cola-prioridad.js  —  Integrante 3
   Montículo binario mínimo (min-heap) escrito a mano.

   Es la estructura que hace eficiente a Dijkstra. Sin ella, buscar el
   nodo no visitado con menor distancia cuesta O(V) y el algoritmo
   completo O(V²). Con el montículo, sacar el mínimo cuesta O(log V) y
   el algoritmo baja a O((V + E) log V).

   Un montículo es un árbol binario guardado en un arreglo: el hijo
   izquierdo de la posición i está en 2i+1, el derecho en 2i+2 y el
   padre en floor((i-1)/2). La propiedad que se mantiene siempre es que
   ningún padre es mayor que sus hijos, así que el mínimo está en la
   raíz, la posición 0.
   ===================================================================== */

var ColaPrioridad = (function () {
  'use strict';

  function crear() {
    return { datos: [], operaciones: 0 };
  }

  function vacia(cola) {
    return cola.datos.length === 0;
  }

  function tamano(cola) {
    return cola.datos.length;
  }

  /* Inserta al final y sube el elemento hasta su lugar. O(log n). */
  function insertar(cola, valor, prioridad) {
    cola.datos.push({ valor: valor, prioridad: prioridad });
    subir(cola, cola.datos.length - 1);
  }

  function subir(cola, i) {
    while (i > 0) {
      var padre = Math.floor((i - 1) / 2);
      cola.operaciones++;
      if (cola.datos[padre].prioridad <= cola.datos[i].prioridad) break;
      intercambiar(cola, i, padre);
      i = padre;
    }
  }

  /* Saca la raíz (el mínimo), pone el último elemento arriba y lo baja
     hasta restaurar la propiedad del montículo. O(log n). */
  function extraerMin(cola) {
    if (vacia(cola)) return null;

    var minimo = cola.datos[0];
    var ultimo = cola.datos.pop();

    if (!vacia(cola)) {
      cola.datos[0] = ultimo;
      bajar(cola, 0);
    }
    return minimo;
  }

  function bajar(cola, i) {
    var n = cola.datos.length;

    while (true) {
      var izquierda = 2 * i + 1;
      var derecha = 2 * i + 2;
      var menor = i;

      if (izquierda < n) {
        cola.operaciones++;
        if (cola.datos[izquierda].prioridad < cola.datos[menor].prioridad) menor = izquierda;
      }
      if (derecha < n) {
        cola.operaciones++;
        if (cola.datos[derecha].prioridad < cola.datos[menor].prioridad) menor = derecha;
      }
      if (menor === i) break;

      intercambiar(cola, i, menor);
      i = menor;
    }
  }

  function intercambiar(cola, i, j) {
    var tmp = cola.datos[i];
    cola.datos[i] = cola.datos[j];
    cola.datos[j] = tmp;
  }

  /* Comprobación de la invariante. No se usa en producción; sirve para
     demostrar en la sustentación que la estructura es correcta. */
  function esMonticuloValido(cola) {
    for (var i = 1; i < cola.datos.length; i++) {
      var padre = Math.floor((i - 1) / 2);
      if (cola.datos[padre].prioridad > cola.datos[i].prioridad) return false;
    }
    return true;
  }

  return {
    crear: crear,
    vacia: vacia,
    tamano: tamano,
    insertar: insertar,
    extraerMin: extraerMin,
    esMonticuloValido: esMonticuloValido
  };
})();
