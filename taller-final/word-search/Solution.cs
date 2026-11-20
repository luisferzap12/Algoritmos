public class Solution {
    private char[][] board;
    private string word;
    private int m, n;

    public bool Exist(char[][] board, string word) {
        this.board = board;
        m = board.Length;
        n = board[0].Length;

        // Poda 1: la palabra no cabe en el tablero
        if (word.Length > m * n) return false;

        // Poda 2: al tablero le faltan letras que necesita la palabra
        var cuenta = new Dictionary<char, int>();
        foreach (var fila in board)
            foreach (var c in fila)
                cuenta[c] = cuenta.GetValueOrDefault(c) + 1;
        foreach (var c in word) {
            if (cuenta.GetValueOrDefault(c) == 0) return false;
            cuenta[c]--;
        }

        // Poda 3: empezar por la letra menos frecuente del tablero
        var freq = new Dictionary<char, int>();
        foreach (var fila in board)
            foreach (var c in fila)
                freq[c] = freq.GetValueOrDefault(c) + 1;
        if (freq[word[0]] > freq[word[^1]]) {
            var arr = word.ToCharArray();
            Array.Reverse(arr);
            word = new string(arr);
        }
        this.word = word;

        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (Dfs(i, j, 0)) return true;

        return false;
    }

    private bool Dfs(int i, int j, int k) {
        if (i < 0 || j < 0 || i >= m || j >= n || board[i][j] != word[k])
            return false;
        if (k == word.Length - 1) return true;

        char temp = board[i][j];
        board[i][j] = '#';          // marcar como visitada

        bool encontrado = Dfs(i + 1, j, k + 1) ||
                          Dfs(i - 1, j, k + 1) ||
                          Dfs(i, j + 1, k + 1) ||
                          Dfs(i, j - 1, k + 1);

        board[i][j] = temp;         // backtracking: restaurar la letra
        return encontrado;
    }
}