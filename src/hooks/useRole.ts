"use client";

import { useState, useEffect } from "react";

/**
 * Admin role type matching BE AccountRole.
 * 'admin' sees everything; 'expert' sees only contributions.
 */
export type AdminRole = "admin" | "expert";

/**
 * Pragmatic role hook for admin area.
 *
 * Reads role from localStorage key "admin_role".
 * When a real auth system is integrated, replace this with
 * token decoding or profile API call.
 *
 * Default: "admin" (backwards-compatible with existing admin UI).
 */
export function useRole(): AdminRole {
  const [role, setRole] = useState<AdminRole>("admin");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("admin_role");
      if (stored === "expert" || stored === "admin") {
        setRole(stored);
      }
    } catch {
      // SSR or localStorage unavailable — keep default
    }
  }, []);

  return role;
}
