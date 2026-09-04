# Guía de Git para los 4 integrantes

**Repositorio:** https://github.com/luisferzap12/Algoritmos.git
**Carpeta del proyecto:** `Examen_1_optimizador-turnos/`

El repositorio ya existe y es de la materia, así que **no se crea uno nuevo y no se corre `git init`**. Todo el examen vive dentro de esa carpeta; nada de este proyecto debe quedar suelto en la raíz.

La nota es individual y se calcula, entre otras cosas, con los commits de cada quien. Un repositorio con 47 commits de una sola persona y 1 de las otras tres reparte notas muy distintas. Esta guía deja el historial parejo y verificable.

---

## Paso 0 · Quién hace qué

| | Integrante | Archivos que le pertenecen (dentro de `Examen_1_optimizador-turnos/`) |
|---|---|---|
| 1 | | `index.html`, `js/ui.js`, `js/main.js` |
| 2 | | `css/estilos.css`, `js/graficos.js` |
| 3 | | `js/algoritmo.js`, `js/escenarios.js` |
| 4 | | `js/metricas.js`, `README.md`, `docs/guia-git.md` |

Escriban los nombres en esta tabla y en el README antes de empezar. Regla práctica: **nadie edita archivos de otro**; si hay que tocarlos, se avisa y se hace en una rama aparte.

## Paso 1 · Acceso al repositorio

El dueño del repositorio es **luisferzap12**. Él debe entrar a **Settings → Collaborators → Add people** e invitar a los otros tres integrantes. Sin eso, los demás pueden clonar (si el repositorio es público) pero no pueden hacer `push`.

## Paso 2 · Cada integrante clona y se identifica

```bash
git clone https://github.com/luisferzap12/Algoritmos.git
cd Algoritmos
git config user.name "Nombre Apellido"
git config user.email "el-correo-de-tu-cuenta-de-github@ejemplo.com"
```

El correo debe ser **el mismo de la cuenta de GitHub**. Si no coincide, el commit aparece sin foto ni enlace al perfil y no cuenta como aporte tuyo. Para verificar:

```bash
git config user.email
git branch --show-current
```

El segundo comando dice si la rama principal se llama `main` o `master`. **Usen el nombre que aparezca ahí** en todos los comandos siguientes; esta guía asume `main`.

## Paso 3 · Subir la carpeta del proyecto (solo una persona, una vez)

Copien la carpeta descargada dentro del repositorio clonado y renómbrenla:

```bash
cp -r ~/Descargas/optimizador-turnos ./Examen_1_optimizador-turnos
```

En Windows basta con arrastrar la carpeta dentro de `Algoritmos` y renombrarla a `Examen_1_optimizador-turnos`. Debe quedar así:

```
Algoritmos/
├── (otros trabajos de la materia)
└── Examen_1_optimizador-turnos/
    ├── index.html
    ├── css/estilos.css
    ├── js/{algoritmo,escenarios,metricas,graficos,ui,main}.js
    ├── docs/guia-git.md
    ├── .gitignore
    └── README.md
```

Y se sube el esqueleto:

```bash
git pull origin main
git add Examen_1_optimizador-turnos/README.md Examen_1_optimizador-turnos/.gitignore
git commit -m "chore(examen1): estructura inicial del optimizador de turnos"
git push origin main
```

Ojo: en este primer commit se suben **solo esos dos archivos**. El resto lo sube cada integrante con su propio commit; si se sube todo de una, los otros tres se quedan sin aportes que mostrar.

## Paso 4 · Trabajar en una rama propia

```bash
git checkout main
git pull origin main
git checkout -b integrante-3/algoritmo-spt
cd Examen_1_optimizador-turnos
```

Git funciona igual desde una subcarpeta, así que desde aquí las rutas de `git add` son relativas y quedan más cortas.

Nombres de rama sugeridos:

- `integrante-1/interfaz`
- `integrante-2/estilos-y-graficos`
- `integrante-3/algoritmo-spt`
- `integrante-4/metricas-y-docs`

## Paso 5 · Commits sugeridos

Ejecutar desde dentro de `Examen_1_optimizador-turnos/`. No los peguen todos de una vez: cada commit debe corresponder a un cambio real que ya hicieron. Tres o cuatro commits por persona se ven mucho mejor que uno solo gigante.

**Integrante 1 — interfaz**

```bash
git add index.html
git commit -m "feat(ui): estructura del tablero y formulario de solicitudes"

git add js/ui.js
git commit -m "feat(ui): estado de la cola, eliminacion de turnos y renderizado seguro"

git add index.html js/ui.js
git commit -m "feat(ui): carga por lote y fichas de escenarios de control"

git add js/main.js
git commit -m "feat(ui): conexion de eventos y simulacion automatica al cargar"
```

**Integrante 2 — estilos y gráficos**

```bash
git add css/estilos.css
git commit -m "style(css): paleta, tipografia y reticula del tablero"

git add css/estilos.css
git commit -m "style(css): linea de tiempo de espera y atencion"

git add js/graficos.js
git commit -m "feat(graficos): comparativa de las cuatro estrategias con Chart.js"

git add js/graficos.js css/estilos.css
git commit -m "feat(graficos): curva de complejidad y ajustes responsive"
```

**Integrante 3 — algoritmo**

```bash
git add js/algoritmo.js
git commit -m "feat(algoritmo): merge sort propio con contador de comparaciones"

git add js/algoritmo.js
git commit -m "feat(algoritmo): eleccion voraz SPT y contraejemplo LPT"

git add js/algoritmo.js
git commit -m "test(algoritmo): benchmark empirico hasta 100000 turnos"

git add js/escenarios.js
git commit -m "feat(datos): juegos de datos de control y lectura de listas por lote"
```

**Integrante 4 — métricas y documentación**

```bash
git add js/metricas.js
git commit -m "feat(metricas): simulacion de la cola y calculo de esperas"

git add js/metricas.js
git commit -m "fix(metricas): evitar division por cero con un solo turno en la cola"

git add js/metricas.js
git commit -m "feat(metricas): verificacion de la formula T = suma (n-i)*ti"

git add README.md docs/guia-git.md
git commit -m "docs(examen1): problema, algoritmo, complejidad y guia de trabajo"
```

## Paso 6 · Subir y abrir el Pull Request

```bash
git push -u origin integrante-3/algoritmo-spt
```

En GitHub aparece **Compare & pull request**. Título = lo que hicieron; en la descripción, dos o tres líneas explicándolo. Otro integrante lo revisa y le da **Merge pull request**. Así queda evidencia cruzada de revisión, que también suma en la sustentación.

## Paso 7 · Traer los cambios de los demás

Antes de seguir trabajando, siempre:

```bash
git checkout main
git pull origin main
git checkout mi-rama
git merge main
```

Si aparece un conflicto, el archivo queda marcado con `<<<<<<<` y `>>>>>>>`. Se edita a mano dejando la versión correcta, y luego:

```bash
git add archivo-en-conflicto
git commit
```

Como cada quien trabaja en archivos distintos, los conflictos deberían ser raros. Si aparecen, casi siempre es porque dos personas tocaron `index.html`.

## Paso 8 · Verificar el reparto antes de entregar

El repositorio tiene trabajos de toda la materia, así que hay que **filtrar por la carpeta del examen**. Sin el filtro se cuentan commits de otros trabajos y el número engaña:

```bash
git shortlog -sne -- Examen_1_optimizador-turnos/
```

Eso muestra cuántos commits hizo cada correo dentro de este examen. Si alguien aparece con cero o con un nombre raro, es porque `user.email` estaba mal configurado: se corrige y se hacen commits nuevos, no se reescribe la historia a última hora.

Para ver qué archivos tocó cada quien:

```bash
git log --author="Nombre" --name-only --oneline -- Examen_1_optimizador-turnos/
```

Y para revisar el historial completo del examen:

```bash
git log --oneline --graph -- Examen_1_optimizador-turnos/
```

## Paso 9 · Publicar el tablero (opcional pero recomendado)

En **Settings → Pages → Source: Deploy from a branch → main → / (root) → Save**.

Como el proyecto está en una subcarpeta, la URL incluye la carpeta:

```
https://luisferzap12.github.io/Algoritmos/Examen_1_optimizador-turnos/
```

Ese enlace va en el README y sirve para mostrar el proyecto en el video sin depender de la máquina de nadie. Prueben la URL en una ventana de incógnito antes de entregar: si el repositorio es privado, Pages no funciona en el plan gratuito.

## Checklist de entrega

- [ ] La carpeta se llama exactamente `Examen_1_optimizador-turnos`
- [ ] Nombres reales en el README y en la tabla del paso 0
- [ ] Link del video en el README, probado en incógnito (que no quede privado)
- [ ] Los 4 integrantes aparecen en `git shortlog -sne -- Examen_1_optimizador-turnos/`
- [ ] `index.html` abre sin errores en la consola del navegador
- [ ] Video de 5 a 7 minutos cubriendo los 5 puntos del enunciado
- [ ] Todo mezclado en `main` antes del miércoles 2 de septiembre
