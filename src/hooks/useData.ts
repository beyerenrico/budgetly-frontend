import { useEffect, useState } from "react";

export const useData = <T>(service: Service<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await service.findAll();
        setData(response);
      } catch (error: unknown) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [service]);

  return { data, loading, error };
};
