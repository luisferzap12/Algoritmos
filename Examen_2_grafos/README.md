# Rutas entre sedes con el algoritmo de Dijkstra

Buscador de la ruta más rápida entre sedes del ITM y puntos de referencia de Medellín, modelado como un **grafo ponderado no dirigido** y resuelto con el **algoritmo de Dijkstra** sobre un montículo binario.

Examen 2 · Análisis de Algoritmos · Institución Universitaria Pascual Bravo
Fecha de entrega: domingo 27 de septiembre de 2026

Repositorio: https://github.com/luisferzap12/Algoritmos — carpeta `Examen_2_grafos/`
Video de sustentación:
Página en linea : https://luisferzap12.github.io/Algoritmos/Examen_2_grafos/index.html

---

## 1. El problema

Un estudiante necesita llegar de una sede a otra y quiere saber por dónde tarda menos. Hay varios caminos posibles y cada vía toma un tiempo distinto, así que la respuesta no es evidente: **el camino con menos tramos no es necesariamente el más rápido**.

Esa afirmación es el centro del proyecto y el tablero la demuestra. Entre Robledo e Industriales existe una vía perimetral directa, de un solo tramo, que toma 55 minutos. Buscar simplemente "el camino con menos paradas" elige esa vía. Dijkstra, que sí tiene en cuenta el tiempo de cada tramo, encuentra una ruta de tres tramos y 38 minutos: 17 minutos menos.

## 2. Cómo se modela como grafo

| Elemento del grafo | Qué representa aquí |
|---|---|
| Nodo (vértice) | Una sede o un punto de referencia. Hay 11. |
| Arista | Una vía que conecta dos puntos. Hay 20. |
| Peso | Minutos de recorrido de esa vía. |
| No dirigido | Cada vía se recorre en los dos sentidos con el mismo costo. |

La red se guarda como **lista de adyacencia** y no como matriz de adyacencia. Con 11 nodos y 20 aristas, la matriz gastaría 121 casillas para almacenar 40 valores útiles, y recorrer los vecinos de un nodo costaría O(V) en lugar de O(grado). Para grafos dispersos —que es el caso de casi cualquier red de calles— la lista gana en memoria y en tiempo.

Los tiempos son estimados para el ejercicio, no mediciones de tráfico real.

## 3. El algoritmo: Dijkstra

Dijkstra calcula la distancia mínima desde un origen hacia todos los demás nodos, siempre que **ningún peso sea negativo**.

1. Todas las distancias empiezan en infinito, salvo la del origen, que vale 0.
2. Se toma el nodo **no visitado con la menor distancia provisional** y se marca como visitado: su distancia ya es definitiva.
3. Se intenta ** promediar ** cada vecino: si llegar por el nodo actual sale más barato de lo que se tenía, se actualiza la distancia y se anota desde dónde se llegó.
4. Se repite hasta visitar el destino. La ruta se reconstruye hacia atrás siguiendo esos "desde dónde".

 Al cerrar el nodo con la menor distancia provisional, cualquier camino alternativo hacia él tendría que pasar por un nodo todavía abierto, cuya distancia ya es mayor o igual, y después sumar aristas. Como ninguna arista resta, ese camino no puede resultar más corto. Toda la corrección del algoritmo descansa sobre esa condición.

 Si una arista fuera negativa, el razonamiento anterior se cae: un camino más largo podría abaratarse después. El tablero incluye un grafo dirigido de cuatro nodos con una arista de −2 donde Dijkstra devuelve una distancia equivocada, y lo compara con **Bellman-Ford**, que relaja todas las aristas V−1 veces y sí lo resuelve. No es un adorno: es el límite del algoritmo, mostrado en vivo.

## 4. Complejidad

El costo depende de  cómo se busque el siguiente nodo a visitar, no del algoritmo en sí.

| Implementación | Complejidad | Por qué |
|---|---|---|
| Búsqueda lineal del mínimo | O(V²) | En cada una de las V vueltas se recorren los V nodos buscando el menor |
|  Con montículo binario | O((V + E) log V) | Cada nodo entra y sale del montículo en O(log V), y cada arista puede provocar una inserción |
| BFS (sin pesos) | O(V + E) | Solo cuenta tramos; no sirve si las aristas tienen costos distintos |
| Bellman-Ford | O(V · E) | V−1 pasadas sobre todas las aristas; admite pesos negativos |

El proyecto incluye 
* Las dos implementaciones de Dijkstra
* Un experimento que las corre sobre redes aleatorias de hasta 4.000 nodos midiendo el tiempo real. Sobre esa red, la versión con montículo resulta unas 25 veces más rápida. El experimento también verifica que   ambas devuelvan la misma distancia

## 5. Qué hace la aplicación

- Calcula la ruta más rápida entre dos sedes y la resalta sobre el mapa.
- Numera los nodos en el orden en que el algoritmo los visitó, que no es el orden de la ruta.
- Muestra la traza paso a paso*: qué nodo cerró, qué vecinos mejoraron y cuáles descartó. Las líneas las genera el propio algoritmo, no están escritas aparte.
- Compara el resultado con el camino de **menos tramos** (BFS) para evidenciar por qué las aristas llevan peso.
- Permite cambiar las condiciones de la red: hora pico, cierre de una vía, corredor del metro, o dejar una sede incomunicada para ver qué pasa cuando **no existe ruta**.
- Lista las **distancias mínimas a todos los nodos**, porque Dijkstra resuelve el origen contra todo el grafo, no solo contra el destino pedido.
- Mide empíricamente O(V²) contra O((V + E) log V).
- Demuestra el fallo con pesos negativos y su corrección con Bellman-Ford.

## 6. Cómo ejecutarlo

```bash
git clone https://github.com/luisferzap12/Algoritmos.git
cd Algoritmos/Examen_2_grafos
```

Abrir `index.html` en el navegador; 

## 7. Estructura del repositorio

```
Examen_2_grafos/
├── index.html
├── css/
│   └── estilos.css
├── js/
│   ├── grafo.js           estructura: lista de adyacencia, BFS de conexidad, estadísticas
│   ├── datos.js           sedes, vías, escenarios y el grafo con peso negativo
│   ├── cola-prioridad.js  montículo binario mínimo escrito a mano
│   ├── dijkstra.js        el algoritmo, en sus dos versiones, con traza
│   ├── alternativos.js    BFS y Bellman-Ford para contrastar
│   ├── experimento.js     medición empírica de la complejidad
│   ├── mapa.js            dibujo del grafo en SVG
│   ├── graficas.js        gráfica del experimento
│   ├── ui.js              controles, traza, tablas e indicadores
│   └── main.js            orquestación
├──
└── README.md
```

## 8. Integrantes y responsabilidades

| Integrante | Responsabilidad | Archivos |
|---|---|---|
| Juan Andrés Gallego | Interfaz, controles, traza en pantalla y orquestación | `index.html`, `css/estilos.css`, `js/ui.js`, `js/main.js` |
| Luz Mallely Zapata  | Modelado del grafo, datos del problema y visualización | `js/grafo.js`, `js/datos.js`, `js/mapa.js`, `js/graficas.js` |
| Jorge Elías Builes  | Montículo binario y algoritmo de Dijkstra | `js/cola-prioridad.js`, `js/dijkstra.js` |
| Luis Fernando Zapata  | Algoritmos de contraste, experimento y documentación | `js/alternativos.js`, `js/experimento.js`, `README.md`, `docs/` |


