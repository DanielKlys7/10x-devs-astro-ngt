import { useQuery } from "@tanstack/react-query";
import type { UserDTO } from "@/types";
import queryClient from "@/queryClient";

interface UseUserRoleReturn {
  role: "administrator" | "user" | undefined;
  isLoading: boolean;
  error: unknown;
}

export function useUserRole(): UseUserRoleReturn {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<UserDTO>(
    {
      queryKey: ["user"],
      queryFn: async () => {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          throw new Error("Nie udało się pobrać danych użytkownika");
        }
        return response.json();
      },
    },
    queryClient
  );

  return {
    role: user?.role as "administrator" | "user" | undefined,
    isLoading,
    error,
  };
}
