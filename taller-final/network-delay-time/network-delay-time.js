/**
 * Autora: Luz Mallely Zapata
 * 743. Network Delay Time
 * https://leetcode.com/problems/network-delay-time/
 *
 * Familia: grafos (Dijkstra).
 * Modelo: grafo DIRIGIDO y PONDERADO. Vértices: los n nodos; arco u -> v
 * con peso w = tiempo que tarda la señal en ir de u a v.
 *
 * Desde k se extrae siempre el nodo con MENOR TIEMPO ACUMULADO (heap) y se
 * relajan sus arcos de salida. La respuesta es la MAYOR distancia finita
 * (hay que esperar al nodo que más tarda); si algún nodo quedó en infinito,
 * no es alcanzable y se devuelve -1. BFS por número de arcos no sirve aquí:
 * los pesos no son todos iguales.
 */

/** Heap binario mínimo de pares [distancia, nodo]. */
class MinHeap {
    constructor() {
        this.heap = [];
    }

    size() {
        return this.heap.length;
    }

    push(pair) {
        this.heap.push(pair);
        this._bubbleUp(this.heap.length - 1);
    }

    pop() {
        const top = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this._bubbleDown(0);
        }
        return top;
    }

    _bubbleUp(i) {
        while (i > 0) {
            const parent = Math.floor((i - 1) / 2);
            if (this.heap[parent][0] <= this.heap[i][0]) break;
            [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
            i = parent;
        }
    }

    _bubbleDown(i) {
        const n = this.heap.length;
        while (true) {
            let smallest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;
            if (left < n && this.heap[left][0] < this.heap[smallest][0]) smallest = left;
            if (right < n && this.heap[right][0] < this.heap[smallest][0]) smallest = right;
            if (smallest === i) break;
            [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
            i = smallest;
        }
    }
}

/**
 * @param {number[][]} times - arcos dirigidos [u, v, w]
 * @param {number} n - cantidad de nodos (1..n)
 * @param {number} k - nodo desde el que se envía la señal
 * @return {number} - tiempo en que todos reciben la señal, o -1 si alguien no
 */
var networkDelayTime = function(times, n, k) {
    // Lista de adyacencia: los nodos van de 1 a n.
    const adj = Array.from({ length: n + 1 }, () => []);
    for (const [u, v, w] of times) {
        adj[u].push([v, w]);
    }

    const dist = Array(n + 1).fill(Infinity);
    dist[k] = 0;

    const heap = new MinHeap();
    heap.push([0, k]);

    while (heap.size() > 0) {
        const [t, u] = heap.pop();

        // Entrada obsoleta: ya encontramos un camino más corto a u.
        if (t > dist[u]) continue;

        for (const [v, w] of adj[u]) {
            if (t + w < dist[v]) {
                dist[v] = t + w;
                heap.push([dist[v], v]);
            }
        }
    }

    let answer = 0;
    for (let node = 1; node <= n; node++) {
        if (dist[node] === Infinity) return -1; // nodo inalcanzable
        answer = Math.max(answer, dist[node]);
    }
    return answer;
};

module.exports = networkDelayTime;
