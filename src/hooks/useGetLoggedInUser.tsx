import { useEffect, useState } from "react";
import authAxios from "../api/auth-axios";
import { ApiEndpoints } from "../api/api-endpoints";
import type { IUser } from "../utils/interfaces/user-interface";
import { useLocation } from "react-router-dom";

export const useLoggedInUser = (ignoreCache: boolean = false) => {
  const [user, setUser] = useState<IUser>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const handleResponse = (response: any) => {
    if (response?.status === 200) {
      const fetchedUser = response?.data;
      setUser(fetchedUser);
      sessionStorage.setItem("user", JSON.stringify(fetchedUser));
    }

    if (
      response?.status === 401 &&
      response?.data?.message === "password changed, please login again"
    ) {
      sessionStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  const fetchUserFromAPI = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await authAxios(true, ApiEndpoints.getLoggedInUser);
      handleResponse(response);
    }
  };

  const fetchUser = async () => {
    setLoading(true);
    setError(null);

    try {
      const storedUser = sessionStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (ignoreCache) {
        await fetchUserFromAPI();
      } else if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      } else if (token) {
        await fetchUserFromAPI();
      }
    } catch (err) {
      setError("Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [ignoreCache, location.pathname]);

  return { user, loading, error, setUser };
};
