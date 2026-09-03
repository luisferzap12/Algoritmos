# Guía de Git para los 4 integrantes

La nota es individual y se calcula, entre otras cosas, con los commits de cada quien. Un repositorio con 47 commits de una sola persona y 1 de las otras tres reparte notas muy distintas. Esta guía deja el historial parejo y verificable.

---

## Paso 0 · Quién hace qué

| | Integrante | Archivos que le pertenecen |
|---|---|---|
| 1 | Luis Fernando Zapata| `index.html`, `js/ui.js`, `js/main.js` |
| 2 |Luz Mallely Zapata | `css/estilos.css`, `js/graficos.js` |
| 3 | Juan Andres Gallego| `js/algoritmo.js`, `js/escenarios.js` |
| 4 |Jorge Elias Builes | `js/metricas.js`, `README.md`, `docs/guia-git.md` |

Escriban los nombres en esta tabla y en el README antes de empezar. Regla práctica: **nadie edita archivos de otro**; si hay que tocarlos, se avisa y se hace en una rama aparte.

## Paso 1 · Crear el repositorio (solo una persona)

En GitHub: **New repository** → nombre `optimizador-turnos` → público → sin README (ya lo tenemos).

Después, en la carpeta del proyecto:

```bash
cd optimizador-turnos
git init -b main
git add README.md .gitignore
git commit -m "chore: estructura inicial del repositorio"
git remote add origin https://github.com/USUARIO/optimizador-turnos.git
git push -u origin main
```

Luego: **Settings → Collaborators → Add people** e invitar a los otros tres.

## Paso 2 · Cada integrante clona y se identifica

```bash
git clone https://github.com/USUARIO/optimizador-turnos.git
cd optimizador-turnos
git config user.name "Nombre Apellido"
git config user.email "el-correo-de-tu-cuenta-de-github@ejemplo.com"
```

El correo debe ser **el mismo de la cuenta de GitHub**. Si no coincide, el commit aparece sin foto ni enlace al perfil y no cuenta como aporte tuyo. Para verificar:

```bash
git config user.email
```

## Paso 3 · Trabajar en una rama propia

```bash
git checkout main
git pull origin main
git checkout -b integrante-3/algoritmo-spt
```

Nombres de rama sugeridos:

- `integrante-1/interfaz`
- `integrante-2/estilos-y-graficos`
- `integrante-3/algoritmo-spt`
- `integrante-4/metricas-y-docs`

## Paso 4 · Commits sugeridos

No los peguen todos de una vez: cada commit debe corresponder a un cambio real que ya hicieron. Repartir el trabajo en 3 o 4 commits por persona se ve mucho mejor que uno solo gigante.

**Integrante 1 — interfaz**

```bash
git add index.html
git commit -m "feat(ui): estructura del tablero y formulario de solicitudes"

git add js/ui.js
git commit -m "feat(ui): estado de la cola, eliminacion de turnos y renderizado seguro"

git add js/ui.js
git commit -m "fix(ui): validacion de duracion entera y mensajes de error"

git add js/main.js
git commit -m "feat(ui): conexion de eventos y simulacion automatica al cargar"
```

**Integrante 2 — estilos y gráficos**

```bash
git add css/estilos.css
git commit -m "style(css): paleta, tipografia y retícula del tablero"

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
git commit -m "feat(algoritmo): barajado Fisher-Yates para el orden aleatorio"

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
git commit -m "docs: problema, algoritmo, complejidad y guia de trabajo"
```

## Paso 5 · Subir y abrir el Pull Request

```bash
git push -u origin integrante-3/algoritmo-spt
```

En GitHub aparece **Compare & pull request**. Título = lo que hicieron; en la descripción, dos o tres líneas explicándolo. Otro integrante lo revisa y le da **Merge pull request**. Así queda evidencia cruzada de revisión, que también suma en la sustentación.

## Paso 6 · Traer los cambios de los demás

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

## Paso 7 · Verificar el reparto antes de entregar

```bash
git shortlog -sne --all
```

Muestra cuántos commits hizo cada correo. Si alguien aparece con cero o con un nombre raro, es porque `user.email` estaba mal configurado: se corrige y se hacen commits nuevos, no se reescribe la historia a última hora.

También sirve ver los archivos que tocó cada quien:

```bash
git log --author="Nombre" --name-only --oneline
```

## Paso 8 · Publicar el tablero (opcional pero recomendado)

**Settings → Pages → Source: Deploy from a branch → main → / (root) → Save**. En un par de minutos queda en `https://USUARIO.github.io/optimizador-turnos/`. Ese enlace va en el README y sirve para mostrar el proyecto en el video sin depender de la máquina de nadie.

## Checklist de entrega

- [ ] Nombres reales en el README y en la tabla del paso 0
- [ ] Link del video en el README (probado en una ventana de incógnito, que no quede privado)
- [ ] Los 4 integrantes aparecen en `git shortlog -sne`
- [ ] `index.html` abre sin errores en la consola del navegador
- [ ] Video de 5 a 7 minutos cubriendo los 5 puntos del enunciado
- [ ] Todo en `main` antes del miércoles 2 de septiembre
