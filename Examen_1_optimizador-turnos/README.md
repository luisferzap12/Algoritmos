# Optimizador de turnos y tiempos de espera

Tablero web que reorganiza una cola de atención con el algoritmo voraz **Shortest Processing Time First (SPT)** y muestra, sobre la misma cola, cuánta espera se ahorra frente al orden de llegada y frente a un orden aleatorio.

Examen 1 · Análisis de Algoritmos · Institución Universitaria ITM
Fecha de entrega: 2 de septiembre de 2026

**Video de sustentación:** _(pegar aquí la URL de YouTube o Loom antes de la entrega)_
Demo en línea: https://luisferzap12.github.io/Algoritmos/Examen_1_optimizador-turnos/

---

## 1. El problema

En un centro médico, los turnos se atienden en estricto orden de llegada (FIFO). Cuando las duraciones son muy heterogéneas, una sola solicitud larga al frente de la cola penaliza de forma acumulativa a todas las que vienen detrás: cada minuto que esa persona ocupa la ventanilla se suma a la espera de las demás.

Caso del enunciado, con una sola ventanilla:

| Turno | Duración |
|---|---|
| Consulta médica general | 45 min |
| Vacunación | 5 min |
| Lectura de exámenes | 10 min |
| Curación básica | 15 min |

| Estrategia | Secuencia | Espera total | Espera promedio |
|---|---|---|---|
| Orden de llegada | 45 → 5 → 10 → 15 | 155 min | 38,75 min |
| **Greedy SPT** | 5 → 10 → 15 → 45 | **50 min** | **12,50 min** |
| Más largo primero (peor caso) | 45 → 15 → 10 → 5 | 175 min | 43,75 min |

La espera promedio baja **67,7 %** sin contratar a nadie más y sin recortar la atención de nadie: solo cambia el orden.

Un detalle que el tablero deja explícito: el **cierre de la cola es de 75 minutos en las tres estrategias**. Reordenar no elimina trabajo, redistribuye la espera. Lo que se optimiza es la suma de esperas, no la hora de salida del último turno.

## 2. El algoritmo

La **elección voraz** es: de las solicitudes pendientes, atender siempre la de menor duración. Aplicar esa elección *n* veces equivale a ordenar la cola ascendentemente por duración.

La espera de quien ocupa la posición *i* es la suma de las duraciones que la preceden:

$$W_i = \sum_{j=1}^{i-1} t_j \qquad\Longrightarrow\qquad T = \sum_{i=1}^{n} (n - i)\cdot t_i$$

Cada duración pesa tantas veces como personas queden detrás. Para minimizar la suma, los coeficientes grandes $(n-i)$ deben multiplicar las duraciones pequeñas.

**Demostración por intercambio.** Supongamos un orden óptimo $S$ con dos turnos contiguos $k$ y $k+1$ tales que $t_k > t_{k+1}$. Si los intercambiamos, la espera del resto no cambia (el bloque ocupa el mismo intervalo) y la variación total es:

$$\Delta T = t_{k+1} - t_k < 0$$

El intercambio reduce la espera total, lo que contradice que $S$ fuera óptimo. Por lo tanto ningún orden con una inversión puede serlo, y ordenar ascendentemente alcanza el **mínimo global**.

**Dónde deja de valer.** SPT es óptimo bajo estos supuestos: un solo servidor, todas las solicitudes disponibles en $t=0$, sin interrupciones y sin prioridades. Con llegadas escalonadas el criterio óptimo pasa a ser SRPT (con interrupción), y en un servicio de urgencias la prioridad clínica manda sobre la eficiencia estadística. El tablero lo declara en pantalla porque es la primera pregunta que cabe esperar en la sustentación.

## 3. Complejidad

| Etapa | Complejidad | Justificación |
|---|---|---|
| Ordenamiento (Merge Sort propio) | O(n log n) | log n niveles de partición, O(n) trabajo de mezcla por nivel; es el peor caso, no el promedio |
| Cálculo de esperas | O(n) | un recorrido lineal acumulando el reloj |
| Memoria auxiliar | O(n) | copia permutada de la cola y arreglos de mezcla |
| **Total** | **O(n log n)** | domina el ordenamiento |

El ordenamiento está implementado a mano en `js/algoritmo.js` en vez de usar `Array.prototype.sort()`. Así el algoritmo evaluado es nuestro, podemos contar las comparaciones reales y el botón **Ejecutar la medición** contrasta el tiempo medido con la curva n·log n para colas de hasta 100.000 turnos.

## 4. Cómo ejecutarlo

No requiere instalación ni compilación.

```bash
git clone https://github.com/luisferzap12/Algoritmos.git 
cd optimizador-turnos
```

Luego abrir `index.html` en el navegador (doble clic funciona; los scripts son clásicos, no módulos ES). Se necesita conexión a internet la primera vez porque Chart.js y las tipografías se cargan por CDN.

Para servirlo localmente:

```bash
python -m http.server 8000    # y abrir http://localhost:8000
```

## 5. Estructura del repositorio

```
optimizador-turnos/
├── index.html            estructura del tablero
├── css/
│   └── estilos.css       paleta, tipografía, línea de tiempo y responsive
├── js/
│   ├── algoritmo.js      Merge Sort propio, SPT, LPT, barajado, benchmark
│   ├── escenarios.js     juegos de datos de control y carga por lote
│   ├── metricas.js       simulación de la cola, esperas, ahorro
│   ├── graficos.js       línea de tiempo, barras comparativas, curva n·log n
│   ├── ui.js             estado de la cola, validación y renderizado
│   └── main.js           conexión entre eventos y módulos
├── docs/
│   └── guia-git.md       plan de commits y comandos paso a paso
└── README.md
```

## 6. Integrantes y responsabilidades

| Integrante | Responsabilidad | Archivos |
|---|---|---|
| Luis Fernando Zapata Castaño | Estructura del tablero, captura de solicitudes, validación y renderizado | `index.html`, `js/ui.js`, `js/main.js` |
| luz Mallely Zapata| Identidad visual, responsive y las tres visualizaciones | `css/estilos.css`, `js/graficos.js` |
| Juan Andrés Gallego | Merge Sort instrumentado, elección voraz SPT, contraejemplo LPT, benchmark y juegos de datos | `js/algoritmo.js`, `js/escenarios.js` |
| Jorge Elias Builes| Simulación de la cola, indicadores, documentación y video | `js/metricas.js`, `README.md`,  |

Cada quien hace sus propios commits desde su cuenta de GitHub. 

