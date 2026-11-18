class Solution:
    def lengthOfLIS(self, nums):
        n = len(nums)

        # dp[i] = longitud de la subsecuencia estrictamente creciente
        # más larga que TERMINA en el índice i
        dp = [1] * n  # base: cada elemento solo ya es una subsecuencia de largo 1

        for i in range(1, n):
            for j in range(i):
                if nums[j] < nums[i]:
                    dp[i] = max(dp[i], dp[j] + 1)

        # la LIS no tiene por qué terminar en el último elemento
        return max(dp)
