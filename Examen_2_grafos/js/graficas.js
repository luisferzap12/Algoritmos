/* =====================================================================
   graficas.js  —  Integrante 2
   Gráfica del experimento de complejidad con Chart.js.
   ===================================================================== */

var Graficas = (function () {
  'use strict';

  var instancia = null;

  /* Chart.js llega por CDN. Sin conexión, el resto del tablero debe
     seguir funcionando en lugar de romperse. */
  function hayChart(canvas) {
    if (typeof Chart !== 'undefined') return true;

    var aviso = canvas.parentNode.querySelector('.sin-grafico');
    if (!aviso) {
      aviso = document.createElement('p');
      aviso.className = 'sin-grafico';
      aviso.textContent = 'No se pudo cargar Chart.js. Revisa la conexión: los números del experimento siguen apareciendo abajo.';
      canvas.parentNode.appendChild(aviso);
    }
    return false;
  }

  function complejidad(canvas, mediciones) {
    if (!hayChart(canvas)) return;
    if (instancia) instancia.destroy();

    instancia = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: mediciones.map(function (m) { return m.V.toLocaleString('es-CO'); }),
        datasets: [
          {
            label: 'Con montículo — O((V + E) log V)',
            data: mediciones.map(function (m) { return m.msHeap; }),
            borderColor: '#1E7A6A',
            backgroundColor: '#1E7A6A',
            tension: 0.25,
            pointRadius: 3
          },
          {
            label: 'Búsqueda lineal del mínimo — O(V²)',
            data: mediciones.map(function (m) { return m.msSimple; }),
            borderColor: '#C0463B',
            backgroundColor: '#C0463B',
            tension: 0.25,
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(1) + ' ms';
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Milisegundos' },
            grid: { color: '#E7E3DA' }
          },
          x: {
            title: { display: true, text: 'Nodos del grafo (V)' },
            grid: { display: false }
          }
        }
      }
    });
  }

  return { complejidad: complejidad };
})();
