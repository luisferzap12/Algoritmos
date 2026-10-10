/* =====================================================================
   graficas.js  —  Integrante 2
   Las dos gráficas de los experimentos, con Chart.js.
   ===================================================================== */

var Graficas = (function () {
  'use strict';

  var grafGrupos = null;
  var grafCapacidad = null;

  /* Chart.js llega por CDN. Sin conexión el resto del tablero debe
     seguir funcionando: los números del experimento salen igual. */
  function hayChart(canvas) {
    if (typeof Chart !== 'undefined') return true;

    var aviso = canvas.parentNode.querySelector('.sin-grafico');
    if (!aviso) {
      aviso = document.createElement('p');
      aviso.className = 'sin-grafico';
      aviso.textContent = 'No se pudo cargar Chart.js. Revisa la conexión: los resultados numéricos siguen apareciendo debajo.';
      canvas.parentNode.appendChild(aviso);
    }
    return false;
  }

  /* -------------------------------------------------------------------
     Crecer el número de grupos. Escala logarítmica en el eje vertical
     porque la fuerza bruta crece tan rápido que, en escala lineal, la
     curva de la programación dinámica quedaría pegada al eje.
     ------------------------------------------------------------------- */
  function porGrupos(canvas, mediciones) {
    if (!hayChart(canvas)) return;
    if (grafGrupos) grafGrupos.destroy();

    grafGrupos = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: mediciones.map(function (m) { return m.n; }),
        datasets: [
          {
            label: 'Programación dinámica — Θ(n·C)',
            data: mediciones.map(function (m) { return m.msDP; }),
            borderColor: '#1E7A6A',
            backgroundColor: '#1E7A6A',
            tension: 0.25,
            pointRadius: 3
          },
          {
            label: 'Fuerza bruta — Θ(2ⁿ)',
            data: mediciones.map(function (m) { return m.msBruta; }),
            borderColor: '#C0463B',
            backgroundColor: '#C0463B',
            tension: 0.25,
            pointRadius: 3,
            spanGaps: false
          }
        ]
      },
      options: opciones('Cantidad de grupos (n)', 'Milisegundos (escala logarítmica)', true)
    });
  }

  /* -------------------------------------------------------------------
     Crecer la capacidad del aula. El eje horizontal lleva la capacidad
     y, entre paréntesis, los bits que hacen falta para escribirla: el
     tiempo sube mucho mientras la entrada crece un bit por paso.
     ------------------------------------------------------------------- */
  function porCapacidad(canvas, mediciones) {
    if (!hayChart(canvas)) return;
    if (grafCapacidad) grafCapacidad.destroy();

    grafCapacidad = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: mediciones.map(function (m) {
          return m.capacidad.toLocaleString('es-CO') + ' (' + m.bits + ' bits)';
        }),
        datasets: [{
          label: 'Tiempo de llenado de la tabla',
          data: mediciones.map(function (m) { return m.ms; }),
          borderColor: '#D99A2B',
          backgroundColor: '#D99A2B',
          tension: 0.25,
          pointRadius: 3
        }]
      },
      options: opciones('Capacidad del aula (y bits para escribirla)', 'Milisegundos', false)
    });
  }

  function opciones(tituloX, tituloY, logaritmica) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              if (ctx.parsed.y === null) return ctx.dataset.label + ': no corre';
              return ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(2) + ' ms';
            }
          }
        }
      },
      scales: {
        y: {
          type: logaritmica ? 'logarithmic' : 'linear',
          beginAtZero: !logaritmica,
          title: { display: true, text: tituloY },
          grid: { color: '#E7E3DA' }
        },
        x: {
          title: { display: true, text: tituloX },
          grid: { display: false }
        }
      }
    };
  }

  return {
    porGrupos: porGrupos,
    porCapacidad: porCapacidad
  };
})();
