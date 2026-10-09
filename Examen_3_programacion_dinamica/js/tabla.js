/* =====================================================================
   tabla.js  —  Integrante 2
   Dibuja la matriz dp[i][c] en pantalla.

   Es el entregable central del examen: el enunciado pide evidenciar el
   estado, la recurrencia y los casos base, y la tabla los muestra los
   tres a la vez. La fila 0 y la columna 0 en ceros son los casos base;
   cada celda interior es un estado; el camino resaltado es la
   reconstrucción de la respuesta.
   ===================================================================== */

var Tabla = (function () {
  'use strict';

  var MAX_COLUMNAS = 160;  // más allá, la tabla deja de ser legible

  function render(contenedor, resultado, grupos, capacidad) {
    contenedor.innerHTML = '';

    var columnas = Math.min(capacidad, MAX_COLUMNAS);
    var recortada = columnas < capacidad;

    // Las celdas del camino de reconstrucción, para marcarlas rápido.
    var enCamino = {};
    resultado.camino.forEach(function (p) {
      enCamino[p.fila + ':' + p.columna] = true;
    });

    var tabla = document.createElement('table');
    tabla.className = 'matriz';

    tabla.appendChild(encabezado(columnas, recortada));
    tabla.appendChild(cuerpo(resultado, grupos, columnas, capacidad, enCamino));

    contenedor.appendChild(tabla);

    if (recortada) {
      var nota = document.createElement('p');
      nota.className = 'nota';
      nota.textContent = 'Se muestran las primeras ' + MAX_COLUMNAS +
        ' columnas de ' + (capacidad + 1) + '. La última columna, dp[n][' + capacidad +
        '], es la que contiene la respuesta.';
      contenedor.appendChild(nota);
    }
  }

  function encabezado(columnas, recortada) {
    var thead = document.createElement('thead');
    var fila = document.createElement('tr');

    fila.appendChild(celda('th', 'Grupos \\ puestos', 'esquina'));

    for (var c = 0; c <= columnas; c++) {
      fila.appendChild(celda('th', c, c === 0 ? 'base' : ''));
    }
    if (recortada) fila.appendChild(celda('th', '…', ''));

    thead.appendChild(fila);
    return thead;
  }

  function cuerpo(resultado, grupos, columnas, capacidad, enCamino) {
    var tbody = document.createElement('tbody');
    var fragmento = document.createDocumentFragment();
    var n = grupos.length;

    for (var i = 0; i <= n; i++) {
      var fila = document.createElement('tr');

      var etiqueta = i === 0
        ? 'sin grupos'
        : (i + '. ' + grupos[i - 1].nombre + ' (' + grupos[i - 1].tamano + ')');
      fila.appendChild(celda('th', etiqueta, i === 0 ? 'rotulo base' : 'rotulo'));

      for (var c = 0; c <= columnas; c++) {
        var clases = [];
        if (i === 0 || c === 0) clases.push('base');
        if (enCamino[i + ':' + c]) clases.push('camino');
        if (i === n && c === capacidad) clases.push('respuesta');

        var td = celda('td', resultado.tabla[i][c], clases.join(' '));
        td.title = 'dp[' + i + '][' + c + '] = ' + resultado.tabla[i][c];
        fila.appendChild(td);
      }

      if (columnas < capacidad) fila.appendChild(celda('td', '…', ''));
      fragmento.appendChild(fila);
    }

    tbody.appendChild(fragmento);
    return tbody;
  }

  function celda(etiqueta, texto, clase) {
    var el = document.createElement(etiqueta);
    el.textContent = texto;
    if (clase) el.className = clase;
    return el;
  }

  return { render: render, MAX_COLUMNAS: MAX_COLUMNAS };
})();
