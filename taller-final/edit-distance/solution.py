class Solution:
    def minDistance(self, word1, word2):
        n = len(word1)
        m = len(word2)

        # dp[i][j] = mínimo de ediciones para convertir word1[0..i) en word2[0..j)
        dp = [[0] * (m + 1) for _ in range(n + 1)]

        # casos base
        for i in range(n + 1):
            dp[i][0] = i  # borrar las i letras de word1
        for j in range(m + 1):
            dp[0][j] = j  # insertar las j letras de word2

        for i in range(1, n + 1):
            for j in range(1, m + 1):
                if word1[i - 1] == word2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1]  # las letras coinciden: no cuesta nada
                else:
                    dp[i][j] = 1 + min(
                        dp[i - 1][j],      # borrar
                        dp[i][j - 1],      # insertar
                        dp[i - 1][j - 1],  # sustituir
                    )

        return dp[n][m]
