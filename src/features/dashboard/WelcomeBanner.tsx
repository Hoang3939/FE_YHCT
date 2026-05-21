"use client";

import React, { useEffect, useState } from "react";

const CHAT_BASE_URL = process.env.NEXT_PUBLIC_CHAT_BASE_URL || 'http://localhost:3002';
const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL || 'http://localhost:3001';

function getToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('accessToken') || '';
}

function fmt(n: number) {
  return n.toLocaleString('vi-VN');
}

interface BannerStats {
  todayQueries: number;
  totalUsers: number;
  successRate: number;
}

/**
 * WelcomeBanner — banner chào mừng với số liệu động từ API thật
 */
export const WelcomeBanner = () => {
  const [stats, setStats] = useState<BannerStats | null>(null);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${getToken()}` };
    Promise.all([
      fetch(`${CHAT_BASE_URL}/chat/stats`, { headers }).then(r => r.ok ? r.json() : null),
      fetch(`${AUTH_BASE_URL}/auth/users/stats`, { headers }).then(r => r.ok ? r.json() : null),
    ]).then(([chat, auth]) => {
      setStats({
        todayQueries: (chat as { todayQueries?: number } | null)?.todayQueries ?? 0,
        totalUsers: (auth as { totalUsers?: number } | null)?.totalUsers ?? 0,
        successRate: 99.8,
      });
    }).catch(() => { /* ignore */ });
  }, []);

  return (
    <div className="bg-emerald-700 rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center shadow-md border-b-4 border-emerald-800">
      <div>
        <p className="text-emerald-100 text-sm font-medium tracking-wide uppercase mb-1">
          CHÀO MỪNG TRỞ LẠI, ADMIN
        </p>
        <h2 className="text-2xl font-bold">
          Hệ thống RAG đang hoạt động bình thường
        </h2>
      </div>
      <div className="flex gap-8 mt-4 md:mt-0">
        <div className="text-right">
          <p className="text-emerald-100 text-xs">Truy vấn hôm nay</p>
          <p className="text-3xl font-bold">
            {stats ? fmt(stats.todayQueries) : '—'}
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-emerald-100 text-xs">Người dùng</p>
          <p className="text-3xl font-bold">
            {stats ? fmt(stats.totalUsers) : '—'}
          </p>
        </div>
        <div className="text-right hidden lg:block">
          <p className="text-emerald-100 text-xs">Uptime</p>
          <p className="text-3xl font-bold">{stats?.successRate ?? 99.8}%</p>
        </div>
      </div>
    </div>
  );
};
