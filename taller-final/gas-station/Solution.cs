public class Solution {
    public int CanCompleteCircuit(int[] gas, int[] cost) {
        int total = 0, tanque = 0, inicio = 0;
        for (int i = 0; i < gas.Length; i++) {
            int diff = gas[i] - cost[i];
            total += diff;
            tanque += diff;
            if (tanque < 0) {
                inicio = i + 1;
                tanque = 0;
            }
        }
        return total < 0 ? -1 : inicio;
    }
}