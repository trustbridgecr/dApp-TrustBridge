import { 
  calculateDashboardMetrics, 
  formatCurrency, 
  calculatePercentageChange 
} from '../user-positions.helper';

describe('User Positions Helper', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,235');
      expect(formatCurrency(0)).toBe('$0');
      expect(formatCurrency(1000000)).toBe('$1,000,000');
    });
  });

  describe('calculateDashboardMetrics', () => {
    it('should calculate metrics correctly', () => {
      const mockPositions = [
        {
          asset: 'USDC',
          symbol: 'USDC',
          supplied: 100000,
          borrowed: 0,
          collateral: false,
          apy: 3.2,
          usdValue: 100000,
        },
        {
          asset: 'XLM',
          symbol: 'XLM',
          supplied: 50000,
          borrowed: 25000,
          collateral: true,
          apy: 2.8,
          usdValue: 50000,
        },
      ];

      const metrics = calculateDashboardMetrics(mockPositions);

      expect(metrics.totalSupplied).toBe(150000);
      expect(metrics.totalBorrowed).toBe(25000);
      expect(metrics.activeLoans).toBe(1);
      expect(metrics.availableBalance).toBe(130000); // 150000 - (25000 * 0.8)
    });

    it('should handle empty positions', () => {
      const metrics = calculateDashboardMetrics([]);

      expect(metrics.totalSupplied).toBe(0);
      expect(metrics.totalBorrowed).toBe(0);
      expect(metrics.activeLoans).toBe(0);
      expect(metrics.availableBalance).toBe(0);
    });
  });

  describe('calculatePercentageChange', () => {
    it('should calculate positive change correctly', () => {
      const result = calculatePercentageChange(110, 100);
      expect(result.value).toBe('+10.0%');
      expect(result.type).toBe('positive');
    });

    it('should calculate negative change correctly', () => {
      const result = calculatePercentageChange(90, 100);
      expect(result.value).toBe('-10.0%');
      expect(result.type).toBe('negative');
    });

    it('should handle zero previous value', () => {
      const result = calculatePercentageChange(100, 0);
      expect(result.value).toBe('0%');
      expect(result.type).toBe('neutral');
    });

    it('should handle no change', () => {
      const result = calculatePercentageChange(100, 100);
      expect(result.value).toBe('+0.0%');
      expect(result.type).toBe('neutral');
    });
  });
}); 