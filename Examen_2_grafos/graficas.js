/* =====================================================
   graficas.js
   Gráfica de comparación de tiempos
   ===================================================== */

var Graficas = (function () {
  "use strict";

  function complejidad(canvas, mediciones) {
    if (!canvas || !mediciones) {
      return;
    }

    var ctx = canvas.getContext("2d");

    var ancho = canvas.width;
    var alto = canvas.height;

    ctx.clearRect(0, 0, ancho, alto);

    if (mediciones.length === 0) {
      return;
    }

    var margen = 45;
    var anchoGrafica = ancho - margen * 2;
    var altoGrafica = alto - margen * 2;

    var maxX = 0;
    var maxY = 0;

    mediciones.forEach(function (m) {
      if (m.V > maxX) {
        maxX = m.V;
      }

      if (m.msHeap > maxY) {
        maxY = m.msHeap;
      }

      if (m.msSimple > maxY) {
        maxY = m.msSimple;
      }
    });

    if (maxY === 0) {
      maxY = 1;
    }

    // Ejes
    ctx.beginPath();
    ctx.moveTo(margen, margen);
    ctx.lineTo(margen, alto - margen);
    ctx.lineTo(ancho - margen, alto - margen);
    ctx.stroke();

    // Línea de la versión con montículo
    ctx.beginPath();

    mediciones.forEach(function (m, i) {
      var x =
        margen +
        (m.V / maxX) * anchoGrafica;

      var y =
        alto -
        margen -
        (m.msHeap / maxY) * altoGrafica;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Línea de la versión O(V²)
    ctx.beginPath();

    mediciones.forEach(function (m, i) {
      var x =
        margen +
        (m.V / maxX) * anchoGrafica;

      var y =
        alto -
        margen -
        (m.msSimple / maxY) * altoGrafica;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Título de los ejes
    ctx.font = "12px Arial";

    ctx.fillText(
      "Número de nodos (V)",
      ancho / 2 - 50,
      alto - 10
    );

    ctx.save();

    ctx.translate(15, alto / 2);
    ctx.rotate(-Math.PI / 2);

    ctx.fillText(
      "Tiempo (ms)",
      0,
      0
    );

    ctx.restore();
  }

  return {
    complejidad: complejidad
  };
})();
