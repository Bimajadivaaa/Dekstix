import { useState, useEffect } from 'react';

export const useEthPrice = () => {
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=idr'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch ETH price');
        }

        const data = await response.json();
        setEthPrice(data.ethereum.idr);
        setError(null);
      } catch (err) {
        console.error('Error fetching ETH price:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch ETH price');
        // Fallback price if API fails
        setEthPrice(30260715.43);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch initial price
    fetchEthPrice();

    // Update price every 1 minute
    const interval = setInterval(fetchEthPrice, 60000);

    return () => clearInterval(interval);
  }, []);

  const convertEthToIdr = (ethAmount: number | string): string => {
    const ethValue = typeof ethAmount === "string" ? parseFloat(ethAmount) : ethAmount;
    const idrValue = ethValue * (ethPrice || 30260715.43); // Use fallback if price not available

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(idrValue);
  };

  return {
    ethPrice,
    isLoading,
    error,
    convertEthToIdr
  };
}; 