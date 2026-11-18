/**
 * Autora: Luz Mallely Zapata
 * 1584. Min Cost to Connect All Points
 * https://leetcode.com/problems/min-cost-to-connect-all-points/
 *
 * Familia: grafos (árbol de recubrimiento mínimo).
 * Algoritmo usado: KRUSKAL con Union-Find.
 * Modelo: grafo completo NO DIRIGIDO. Vértices: los puntos; arista entre
 * cada pareja con peso = distancia de Manhattan |x1-x2| + |y1-y2|.
 *
 * No hay origen: se minimiza la SUMA de las aristas del árbol que deja a
 * todos conectados. Se ordenan las aristas por peso y se acepta cada una
 * solo si sus extremos están en componentes distintas; si cerraría un
 * ciclo se rechaza. Se termina al aceptar n-1 aristas.
 */

/** Union-Find (disjoint set) con compresión de ruta y unión por rango. */
class UnionFind {
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = Array(n).fill(0);
    }

    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]); // compresión de ruta
        }
        return this.parent[x];
    }

    /** @return {boolean} true si se unió; false si ya estaban conectados (ciclo). */
    union(a, b) {
        let rootA = this.find(a);
        let rootB = this.find(b);
        if (rootA === rootB) return false;

        if (this.rank[rootA] < this.rank[rootB]) {
            [rootA, rootB] = [rootB, rootA];
        }
        this.parent[rootB] = rootA;
        if (this.rank[rootA] === this.rank[rootB]) {
            this.rank[rootA]++;
        }
        return true;
    }
}

/**
 * @param {number[][]} points - puntos [x, y]
 * @return {number} - costo mínimo para conectar todos los puntos
 */
var minCostConnectPoints = function(points) {
    const n = points.length;
    const edges = [];

    // Grafo completo: Θ(n²) aristas posibles.
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const w = Math.abs(points[i][0] - points[j][0]) +
                      Math.abs(points[i][1] - points[j][1]);
            edges.push([w, i, j]);
        }
    }

    edges.sort((a, b) => a[0] - b[0]);

    const uf = new UnionFind(n);
    let cost = 0;
    let used = 0;

    for (const [w, u, v] of edges) {
        if (uf.union(u, v)) {
            cost += w;
            used++;
            if (used === n - 1) break; // el árbol de recubrimiento ya está completo
        }
    }

    return cost;
};

module.exports = minCostConnectPoints;
