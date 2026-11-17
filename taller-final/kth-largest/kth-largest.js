/**
 *Autor : Luis Fernando Zapata Castaño
 * 215. Kth Largest Element in an Array
 * https://leetcode.com/problems/kth-largest-element-in-an-array/
 *
 * Familia: heap (el triaje de urgencias).
 * Se mantiene un MIN-heap con a lo sumo k elementos: si ya tiene k
 * y llega un valor mayor que la raíz (el menor de los k candidatos
 * que llevamos), se saca la raíz y entra el nuevo. Al terminar,
 * la raíz del heap es el k-ésimo mayor.
 */

class KthMinHeap {
    constructor() {
        this.heap = [];
    }

    size() {
        return this.heap.length;
    }

    peek() {
        return this.heap[0];
    }

    push(val) {
        this.heap.push(val);
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
            if (this.heap[parent] <= this.heap[i]) break;
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
            if (left < n && this.heap[left] < this.heap[smallest]) smallest = left;
            if (right < n && this.heap[right] < this.heap[smallest]) smallest = right;
            if (smallest === i) break;
            [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
            i = smallest;
        }
    }
}

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function(nums, k) {
    const heap = new KthMinHeap();

    for (const num of nums) {
        if (heap.size() < k) {
            heap.push(num);
        } else if (num > heap.peek()) {
            heap.pop();
            heap.push(num);
        }
        // si num <= heap.peek() y el heap ya tiene k elementos, se descarta:
        // no puede ser de los k mayores
    }

    return heap.peek();
};

module.exports = findKthLargest;
