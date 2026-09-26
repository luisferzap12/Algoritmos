/* =====================================================================
   mapa.js  —  Integrante 2
   Dibujo del grafo en SVG.

   Los elementos se crean con createElementNS y no concatenando cadenas
   en innerHTML: SVG pertenece a otro espacio de nombres, y así los
   nombres de las sedes se insertan como texto y nunca como marcado.

   Formato de entrada (el que produce Grafo.construir):
     grafo.nodos[id] = { nombre, x, y }
     grafo.aristas   = [ [origen, destino, peso], ... ]
   ===================================================================== */

var Mapa = (function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  function elemento(etiqueta, atributos) {
    var nodo = document.createElementNS(NS, etiqueta);
    for (var clave in atributos) {
      if (Object.prototype.hasOwnProperty.call(atributos, clave)) {
        nodo.setAttribute(clave, atributos[clave]);
      }
    }
    return nodo;
  }

  /* ¿La arista a–b forma parte de la ruta encontrada? */
  function enRuta(ruta, a, b) {
    for (var i = 0; i < ruta.length - 1; i++) {
      if ((ruta[i] === a && ruta[i + 1] === b) ||
          (ruta[i] === b && ruta[i + 1] === a)) return true;
    }
    return false;
  }

  /* -------------------------------------------------------------------
     render(): pinta el grafo completo.
     opciones.ruta   -> arreglo de ids a resaltar
     opciones.orden  -> orden en que Dijkstra visitó los nodos
     ------------------------------------------------------------------- */
  function render(svg, grafo, opciones) {
    if (!svg || !grafo) return;

    var config = opciones || {};
    var ruta = config.ruta || [];
    var orden = config.orden || [];

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    var capaVias = elemento('g', { 'class': 'capa-vias' });
    var capaPesos = elemento('g', { 'class': 'capa-pesos' });
    var capaNodos = elemento('g', { 'class': 'capa-nodos' });

    grafo.aristas.forEach(function (arista) {
      var idA = arista[0];
      var idB = arista[1];
      var peso = arista[2];

      var A = grafo.nodos[idA];
      var B = grafo.nodos[idB];
      if (!A || !B) return; // arista que apunta a un nodo inexistente

      var destacada = enRuta(ruta, idA, idB);

      capaVias.appendChild(elemento('line', {
        'class': destacada ? 'via via--ruta' : 'via',
        x1: A.x, y1: A.y, x2: B.x, y2: B.y
      }));

      // La etiqueta no va en el punto medio exacto: se corre al 42 % del
      // tramo y se desplaza en perpendicular, para que dos aristas que
      // se cruzan no superpongan sus números.
      var dx = B.x - A.x;
      var dy = B.y - A.y;
      var largo = Math.sqrt(dx * dx + dy * dy) || 1;
      var mx = A.x + dx * 0.42 + (-dy / largo) * 10;
      var my = A.y + dy * 0.42 + (dx / largo) * 10;

      var texto = String(peso);
      var ancho = 9 + texto.length * 7;

      capaPesos.appendChild(elemento('rect', {
        'class': destacada ? 'peso-fondo peso-fondo--ruta' : 'peso-fondo',
        x: mx - ancho / 2, y: my - 9, width: ancho, height: 17, rx: 2
      }));

      var etiqueta = elemento('text', {
        'class': destacada ? 'peso peso--ruta' : 'peso',
        x: mx, y: my + 4, 'text-anchor': 'middle'
      });
      etiqueta.textContent = texto;
      capaPesos.appendChild(etiqueta);
    });

    Grafo.listaNodos(grafo).forEach(function (id) {
      var nodo = grafo.nodos[id];
      var posicion = orden.indexOf(id);
      var claseNodo = 'nodo';

      if (ruta.indexOf(id) !== -1) claseNodo += ' nodo--ruta';
      else if (posicion !== -1) claseNodo += ' nodo--visitado';

      capaNodos.appendChild(elemento('circle', {
        'class': claseNodo, cx: nodo.x, cy: nodo.y, r: 11
      }));

      // Número que indica en qué turno lo visitó el algoritmo.
      if (posicion !== -1) {
        var indice = elemento('text', {
          'class': 'orden-visita', x: nodo.x, y: nodo.y + 4, 'text-anchor': 'middle'
        });
        indice.textContent = String(posicion + 1);
        capaNodos.appendChild(indice);
      }

      var nombre = elemento('text', {
        'class': ruta.indexOf(id) !== -1 ? 'nombre nombre--ruta' : 'nombre',
        x: nodo.x, y: nodo.y + 28, 'text-anchor': 'middle'
      });
      nombre.textContent = nodo.nombre;
      capaNodos.appendChild(nombre);
    });

    svg.appendChild(capaVias);
    svg.appendChild(capaPesos);
    svg.appendChild(capaNodos);
  }

  return { render: render, enRuta: enRuta };
})();
