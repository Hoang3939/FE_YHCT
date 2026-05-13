"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { hasSession, logoutSession } from "@/lib/session";

export const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const syncSession = () => {
      setIsAuthenticated(hasSession());
    };

    syncSession();
    window.addEventListener("storage", syncSession);

    return () => {
      window.removeEventListener("storage", syncSession);
    };
  }, []);

  const handleLogout = async () => {
    await logoutSession();
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <div className="w-[1440px] h-[80px] flex items-center justify-between py-[30px] px-[78px] box-border text-[20px] text-[#898c85] font-['Inter'] z-50 absolute top-0 left-0">
      <div className="flex items-center gap-[140px] shrink-0 w-full justify-center">
        <div className="h-[40px] w-[179px] flex items-center py-[5.7px] px-[9.1px] box-border gap-[4.5px] text-left text-[22.74px] text-white font-['Playfair_Display']">
          <div className="flex items-center">
            <div className="w-[22.7px] h-[22.7px] bg-gray-500 rounded-full"></div>
          </div>
          <div className="relative leading-[125%]">Logo</div>
        </div>

        <div className="flex items-center justify-center gap-[42px]">
          <div className="w-[101px] flex flex-col items-center justify-center gap-[1px]">
            <div className="relative cursor-pointer hover:text-white transition-colors">Tính năng</div>
            <div className="w-[1px] h-[1px] relative rounded-[10px] bg-[#d9d9d9] opacity-0" />
          </div>
          <div className="w-[160px] flex flex-col items-center justify-center gap-[1px]">
            <div className="relative cursor-pointer hover:text-white transition-colors">Cách hoạt động</div>
            <div className="w-[1px] h-[1px] relative rounded-[10px] bg-[#d9d9d9] opacity-0" />
          </div>
          <div className="flex flex-col items-center justify-center gap-[1px]">
            <div className="relative cursor-pointer hover:text-white transition-colors">Thư viện</div>
            <div className="w-[1px] h-[1px] relative rounded-[10px] bg-[#d9d9d9] opacity-0" />
          </div>
          <div className="flex flex-col items-center justify-center gap-[1px]">
            <div className="relative cursor-pointer hover:text-white transition-colors">Đóng góp</div>
            <div className="w-[1px] h-[1px] relative rounded-[10px] bg-[#d9d9d9] opacity-0" />
          </div>
        </div>

        <div className="w-[251px] flex items-center gap-[10px]">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                void handleLogout();
              }}
              className="w-[109px] flex flex-col items-center justify-center gap-[1px]"
            >
              <span className="relative cursor-pointer hover:text-white transition-colors">Đăng xuất</span>
              <span className="w-[1px] h-[1px] relative rounded-[10px] bg-[#d9d9d9] opacity-0" />
            </button>
          ) : (
            <Link
              href="/login"
              className="w-[109px] flex flex-col items-center justify-center gap-[1px]"
            >
              <span className="relative cursor-pointer hover:text-white transition-colors">Đăng nhập</span>
              <span className="w-[1px] h-[1px] relative rounded-[10px] bg-[#d9d9d9] opacity-0" />
            </Link>
          )}
          <button className="h-[35px] w-[130px] rounded-[30px] bg-[#008b74] hover:bg-[#007461] transition-colors flex items-center justify-center p-[10px] box-border text-[18px] text-white cursor-pointer">
            <div className="relative shrink-0">Start Demo</div>
          </button>
        </div>
      </div>
    </div>
  );
};
