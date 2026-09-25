/* =====================================================
   mapa.js
   Dibujo del grafo utilizando SVG
   ===================================================== */

var Mapa = (function () {
  "use strict";

  function render(svg, grafo, opciones) {
    var ruta = opciones && opciones.ruta ? opciones.ruta : [];

    if (!svg) {
      return;
    }

    var enRuta = function (a, b) {
      for (var i = 0; i < ruta.length - 1; i++) {
        if (
          (ruta[i] === a && ruta[i + 1] === b) ||
          (ruta[i] === b && ruta[i + 1] === a)
        ) {
          return true;
        }
      }

      return false;
    };

    var html = "";

    // Dibujar las vías
    grafo.aristas.forEach(function (arista) {
      var a = arista[0];
      var b = arista[1];
      var peso = arista[2];

      var A = grafo.nodos[a];
      var B = grafo.nodos[b];

      var perteneceARuta = enRuta(a, b);

      // FIX: el CSS define los modificadores en formato BEM
      // (.via--ruta, .peso--ruta), no como clase suelta ".ruta".
      var claseVia = perteneceARuta ? "via via--ruta" : "via";
      var clasePeso = perteneceARuta ? "peso peso--ruta" : "peso";

      html +=
        '<line class="' +
        claseVia +
        '" x1="' +
        A.x +
        '" y1="' +
        A.y +
        '" x2="' +
        B.x +
        '" y2="' +
        B.y +
        '" />';

      html +=
        '<text class="' +
        clasePeso +
        '" x="' +
        (A.x + B.x) / 2 +
        '" y="' +
        ((A.y + B.y) / 2 - 6) +
        '">' +
        peso +
        "</text>";
    });

    // Dibujar los nodos
    Grafo.listaNodos(grafo).forEach(function (id) {
      var nodo = grafo.nodos[id];

      var perteneceARuta = ruta.indexOf(id) !== -1;

      // FIX: mismo caso — "nodo--ruta" y "nombre--ruta", no clases sueltas.
      var claseNodo = perteneceARuta ? "nodo nodo--ruta" : "nodo";
      var claseNombre = perteneceARuta ? "nombre nombre--ruta" : "nombre";

      html +=
        '<circle class="' +
        claseNodo +
        '" cx="' +
        nodo.x +
        '" cy="' +
        nodo.y +
        '" r="12" />';

      html +=
        '<text class="' +
        claseNombre +
        '" x="' +
        nodo.x +
        '" y="' +
        (nodo.y + 30) +
        '">' +
        nodo.nombre +
        "</text>";
    });

    svg.innerHTML = html;
  }

  return {
    render: render
  };
})();
