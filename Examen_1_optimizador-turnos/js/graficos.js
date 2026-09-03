/* =====================================================================
   graficos.js  —  Integrante 2
   Visualizaciones: línea de tiempo de la sala de espera, barras
   comparativas y curva empírica de complejidad.
   ===================================================================== */

var Graficos = (function () {
  'use strict';

  var graficoBarras = null;
  var graficoComplejidad = null;
  var MAX_FILAS = 12; // más filas que esto se resumen para no romper el layout

  /* Chart.js llega por CDN. Si el equipo está sin conexión, el resto del
     tablero debe seguir funcionando en vez de romperse con un error. */
  function hayChart(canvas) {
    if (typeof Chart !== 'undefined') return true;
    var aviso = canvas.parentNode.querySelector('.sin-grafico');
    if (!aviso) {
      aviso = document.createElement('p');
      aviso.className = 'sin-grafico';
      aviso.textContent = 'No se pudo cargar Chart.js. Revisa la conexión: el resto del tablero sigue funcionando.';
      canvas.parentNode.appendChild(aviso);
    }
    return false;
  }

  /* -------------------------------------------------------------------
     Línea de tiempo: una fila por persona. El tramo claro es la espera,
     el tramo sólido es la atención. Ambas columnas comparten la misma
     escala (el makespan), así la comparación es honesta.
     ------------------------------------------------------------------- */
  function renderLineaTiempo(contenedor, resultado, escalaMax) {
    contenedor.innerHTML = '';
    var filas = resultado.detalle.slice(0, MAX_FILAS);

    filas.forEach(function (d, indice) {
      var fila = document.createElement('div');
      fila.className = 'gantt-fila';

      var etiqueta = document.createElement('span');
      etiqueta.className = 'gantt-nombre';
      etiqueta.textContent = (indice + 1) + '. ' + d.nombre;
      etiqueta.title = d.nombre;

      var pista = document.createElement('div');
      pista.className = 'gantt-pista';

      var espera = document.createElement('div');
      espera.className = 'gantt-espera';
      espera.style.width = porcentaje(d.espera, escalaMax);
      if (d.espera > 0) espera.textContent = d.espera + '\u2032';

      var atencion = document.createElement('div');
      atencion.className = 'gantt-atencion';
      atencion.style.width = porcentaje(d.duracion, escalaMax);
      atencion.textContent = d.duracion + '\u2032';

      pista.appendChild(espera);
      pista.appendChild(atencion);
      fila.appendChild(etiqueta);
      fila.appendChild(pista);
      contenedor.appendChild(fila);
    });

    if (resultado.detalle.length > MAX_FILAS) {
      var resto = document.createElement('p');
      resto.className = 'gantt-resto';
      resto.textContent = 'y ' + (resultado.detalle.length - MAX_FILAS) + ' turnos más en la simulación';
      contenedor.appendChild(resto);
    }
  }

  function porcentaje(valor, total) {
    if (total <= 0) return '0%';
    return ((valor / total) * 100).toFixed(3) + '%';
  }

  /* -------------------------------------------------------------------
     Barras: espera promedio de las cuatro estrategias.
     ------------------------------------------------------------------- */
  function renderComparativa(canvas, estrategias) {
    if (!hayChart(canvas)) return;
    if (graficoBarras) graficoBarras.destroy();

    graficoBarras = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Más largo primero', 'Orden aleatorio', 'Orden de llegada', 'Greedy SPT'],
        datasets: [{
          data: [
            estrategias.lpt.esperaPromedio,
            estrategias.aleatorio.esperaPromedio,
            estrategias.fifo.esperaPromedio,
            estrategias.spt.esperaPromedio
          ],
          backgroundColor: ['#8C2F26', '#C0463B', '#D99A2B', '#1E7A6A'],
          borderRadius: 2,
          maxBarThickness: 54
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 350 },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (ctx) { return ctx.parsed.y.toFixed(1) + ' min de espera promedio'; }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Minutos de espera promedio' },
            grid: { color: '#E7E3DA' }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }

  /* -------------------------------------------------------------------
     Complejidad: tiempo real medido contra la curva n·log n escalada.
     Si ambas series se superponen, el comportamiento es O(n log n).
     ------------------------------------------------------------------- */
  function renderComplejidad(canvas, mediciones) {
    if (!hayChart(canvas)) return;
    if (graficoComplejidad) graficoComplejidad.destroy();

    graficoComplejidad = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: mediciones.map(function (m) { return m.n.toLocaleString('es-CO'); }),
        datasets: [
          {
            label: 'Tiempo medido (ms)',
            data: mediciones.map(function (m) { return m.ms; }),
            borderColor: '#1E7A6A',
            backgroundColor: '#1E7A6A',
            tension: 0.25,
            pointRadius: 3
          },
          {
            label: 'Curva n·log n (escalada)',
            data: mediciones.map(function (m) { return m.teoricoEscalado; }),
            borderColor: '#9A958A',
            borderDash: [5, 4],
            pointRadius: 0,
            tension: 0.25
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Milisegundos' }, grid: { color: '#E7E3DA' } },
          x: { title: { display: true, text: 'Cantidad de turnos (n)' }, grid: { display: false } }
        }
      }
    });
  }

  return {
    renderLineaTiempo: renderLineaTiempo,
    renderComparativa: renderComparativa,
    renderComplejidad: renderComplejidad
  };
})();
