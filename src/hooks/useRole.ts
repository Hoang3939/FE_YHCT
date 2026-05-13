"use client";

import { useEffect, useState } from "react";
import { ensureValidAccessToken, readAdminRoleFromAccessToken } from "@/lib/session";

/**
 * Admin role type matching BE AccountRole.
 * Only admin/expert may access admin area.
 */
export type AdminRole = "admin" | "expert";

interface RoleState {
  role: AdminRole | null;
  isLoading: boolean;
}

function useRoleState(): RoleState {
  const [role, setRole] = useState<AdminRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const syncRole = async () => {
      try {
        const token = await ensureValidAccessToken();
        setRole(readAdminRoleFromAccessToken(token));
      } catch {
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    const handleStorage = () => {
      setIsLoading(true);
      void syncRole();
    };

    void syncRole();
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return { role, isLoading };
}

/**
 * Resolves admin role from the authenticated access token.
 * Returns null for regular users, missing tokens, or invalid payloads.
 */
export function useRole(): AdminRole | null {
  return useRoleState().role;
}

export function useRoleGuard(): RoleState {
  return useRoleState();
}
