# Ocupación de aulas con programación dinámica

Aplicación web que decide qué combinación de grupos aprovecha mejor un aula sin pasarse de su capacidad. Es el problema de la mochila 0/1 aplicado a la asignación de salones, resuelto con programación dinámica.

Examen 3 · Análisis de Algoritmos · ITM
Fecha de entrega: sábado 10 de octubre de 2026

Repositorio: https://github.com/luisferzap12/Algoritmos/Examen_3_programacion_dinamica

Video de sustentación:
Demo en línea: https://luisferzap12.github.io/Algoritmos/Examen_3_programacion_dinamica/index.html



## 1. El problema

Un aula tiene una capacidad fija de puestos. Para un mismo bloque horario llegan varias solicitudes clases, monitorías, laboratorios, eventos y cada una trae un número distinto de estudiantes. No caben todas. ¿Qué combinación ocupa mejor el aula sin excederla?

Es un problema real de coordinación académica, y tiene una propiedad que lo hace interesante: no se puede resolver con una regla simple. Las dos reglas que uno intentaría de entrada fallan:

- Meter primero al grupo más grande. Un grupo grande puede bloquear el aula entera. Con 45 puestos y grupos de 24, 22, 22, 2 y 1, esa regla ocupa 27 puestos; el óptimo es 45.
- Meter primero al más pequeño. Fragmenta el aula. Sobre esos mismos datos ocupa 25.

La aplicación trae ese caso como escenario para demostrarlo en vivo. El punto no es que haya que elegir mejor el orden: es que ningún orden fijo funciona siempre, y por eso no existe una elección voraz segura. Ahí es donde entra la programación dinámica.

## 2. El algoritmo: mochila 0/1

Cada grupo entra o no entra —no se puede partir un grupo por la mitad, y lo que se maximiza es la cantidad de puestos ocupados, que coincide con el peso de cada objeto. Es mochila 0/1 con valor igual al peso.

### Estado

```
dp[i][c] = máxima cantidad de puestos que se pueden ocupar
           usando solo los primeros i grupos de la lista,
           en un aula con c puestos disponibles
```

El estado necesita los dos parámetros. Con solo `i` no se sabría cuánto espacio queda; con solo `c` no se sabría qué grupos siguen disponibles.

### Recurrencia

```
dp[i][c] = max( dp[i−1][c],                      ← el grupo i no entra
                tam_i + dp[i−1][c − tam_i] )     ← el grupo i entra, si tam_i ≤ c
```

Son las dos únicas decisiones posibles sobre el grupo `i`. Si entra, los `c − tam_i` puestos restantes se reparten entre los grupos anteriores, y ese subproblema **ya está resuelto** en la fila de arriba. Esa es la subestructura óptima: el óptimo se arma con óptimos de trozos más chicos.

Los subproblemas además se repiten: la misma pareja (grupo, capacidad restante) aparece por muchos caminos distintos. Por eso guardar cada resultado una sola vez cambia la familia de complejidad.

### Casos base

```
dp[0][c] = 0   para todo c    sin grupos disponibles no se ocupa nada
dp[i][0] = 0   para todo i    sin puestos libres no entra nadie
```

En la tabla de la aplicación son la primera fila y la primera columna, sombreadas.

### Reconstrucción

La tabla dice cuántos puestos se ocupan, no quiénes entran. Para saberlo se camina hacia atrás desde `dp[n][C]`:

- si `dp[i][c] == dp[i−1][c]`, el grupo `i` no se asignó: se sube una fila;
- si no, el grupo `i` sí entró: se sube una fila y se baja a la columna `c − tam_i`.

Cuesta `O(n)`, una celda por fila. La aplicación resalta ese camino sobre la tabla.

## 3. Complejidad

| Etapa | Complejidad | Por qué |
|---|---|---|
| Llenado de la tabla | Θ(n · C) | Hay (n+1)(C+1) estados y cada uno se resuelve en O(1) |
| Reconstrucción | O(n) | Una celda por fila |
| Memoria | Θ(n · C) | La tabla completa; Θ(C) si solo se quiere el número |
| Fuerza bruta (comparación) | Θ(2ⁿ · n) | Todos los subconjuntos posibles |
| Greedy (comparación) | Θ(n log n) | Ordenar y recorrer una vez; no es exacto |

### Por qué Θ(n·C) no es polinomial

Este es el punto fino del proyecto y la aplicación lo mide en vivo.

La complejidad parece polinomial porque es un producto de dos números. Pero el tamaño de una entrada no se mide por el valor de los números, sino por los bits que ocupa escribirlos. La capacidad `C` se escribe con `log₂ C` bits: un aula de 400.000 puestos cabe en 19 bits.

Entonces, si la capacidad se duplica:

- el tiempo se duplica,
- la entrada crece un solo bit.

El tiempo es lineal en el valor de `C` y exponencial en el número de dígitos de `C`. Eso se llama pseudo-polinomial, y el segundo experimento de la aplicación lo demuestra: con los mismos 20 grupos, pasar de 10.000 a 400.000 puestos multiplica el tiempo por unas siete veces mientras el dato de entrada pasa de 14 a 19 bits.

## 4. Qué hace la aplicación

- Resuelve la asignación óptima y muestra qué grupos entran.
- Dibuja la tabla `dp[i][c]` completa, con los casos base sombreados y el camino de reconstrucción resaltado.
- Explica paso a paso cómo se reconstruyó la respuesta, con las celdas concretas que se compararon.
- Compara contra dos estrategias voraces y contra fuerza bruta, y verifica que la programación dinámica coincida con la fuerza bruta: eso prueba que es exacta y no una aproximación.
- Compara tabulación contra memoización y muestra cuántos estados se ahorra cada enfoque.
- Mide empíricamente el crecimiento con `n` (contra fuerza bruta) y con `C` (la demostración de lo pseudo-polinomial).
- Trae cinco escenarios, incluidos el caso donde fallan los dos greedy y el caso donde **ningún grupo cabe**, cuya respuesta correcta es cero y no un error.

## 5. Cómo ejecutarlo

```bash
git clone https://github.com/luisferzap12/Algoritmos.git
cd Algoritmos/Examen_3_aulas
```

Abrir `index.html` en el navegador. No hay que instalar nada; los scripts son clásicos, no módulos ES, así que funciona con doble clic. Se necesita conexión la primera vez porque Chart.js y las tipografías se cargan por CDN; sin red, la tabla y el algoritmo siguen funcionando y solo faltan las dos gráficas.

## 6. Estructura del repositorio

```
Examen_3_aulas/
├── index.html
├── css/
│   └── estilos.css
├── js/
│   ├── datos.js          aulas, grupos y escenarios
│   ├── modelo.js         validación y métricas de ocupación
│   ├── dp.js             tabulación, reconstrucción y variante de una fila
│   ├── memo.js           memoización y recursión sin memoria
│   ├── alternativos.js   fuerza bruta y las dos estrategias voraces
│   ├── experimento.js    mediciones de complejidad
│   ├── tabla.js          dibujo de la matriz dp[i][c]
│   ├── graficas.js       gráficas de los experimentos
│   ├── ui.js             estado de la pantalla y renderizado
│   └── main.js           orquestación
│   
│   
└── README.md
```

## 7. Integrantes y responsabilidades

| Integrante | Responsabilidad | Archivos |
|---|---|---|
| Jorge Elias Bulies | Interfaz, captura de datos, validación y orquestación | `index.html`, `css/estilos.css`, `js/ui.js`, `js/main.js` |
| Juan Andrés Gallego | Modelado del problema, datos y visualización de la tabla | `js/datos.js`, `js/modelo.js`, `js/tabla.js`, `js/graficas.js` |
| Luz Mallely Zapata | El algoritmo: tabulación, reconstrucción y memoización | `js/dp.js`, `js/memo.js` |
| Luis Fernando Zapata | Estrategias de contraste, experimentos y documentación | `js/alternativos.js`, `js/experimento.js`, `README.md` |



## 8. Alcance y límites

Los datos son sintéticos, construidos para el ejercicio; no provienen de la programación académica real de ninguna universidad.

El modelo resuelve un aula y un bloque horario a la vez. Asignar todas las aulas simultáneamente con prioridades es un problema NP difícil, y la programación dinámica tampoco lo resolvería en tiempo razonable: el estado tendría que incluir el espacio restante de cada aula, y el número de estados explotaría. Resolver aula por aula es donde esta técnica da el óptimo exacto, y por eso el proyecto se acotó ahí.
