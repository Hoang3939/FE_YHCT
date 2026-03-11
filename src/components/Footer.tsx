export const Footer = () => {
  return (
    <div className="w-[1440px] flex flex-col items-center px-[20px] pb-[20px] box-border text-left text-[14px] text-[#fbf7ef] font-['Geist'] z-50 mt-[50px]">
      <div className="w-full shadow-[0px_4px_24px_rgba(0,0,0,0.04)] backdrop-blur-[84px] rounded-[20px] bg-[rgba(75,82,73,0.32)] border border-[rgba(159,163,198,0.2)] box-border flex flex-col items-end p-[40px_40px_20px] gap-[131px] max-w-full">
        <div className="self-stretch flex items-start gap-[16px]">
          {/* Resources Col 1 */}
          <div className="flex-1 flex flex-col items-start gap-[12px]">
            <div className="relative leading-[100%] font-medium">Resources</div>
            <div className="relative leading-[100%] cursor-pointer hover:underline text-[#dad4cb]">Documentation</div>
            <div className="relative leading-[100%] cursor-pointer hover:underline text-[#dad4cb]">Blog</div>
            <div className="relative leading-[100%] cursor-pointer hover:underline text-[#dad4cb]">Community</div>
          </div>
          
          {/* Resources Col 2 */}
          <div className="flex-1 flex flex-col items-start gap-[12px]">
            <div className="relative leading-[100%] font-medium">Resources</div>
            <div className="relative leading-[100%] cursor-pointer hover:underline text-[#dad4cb]">Documentation</div>
            <div className="relative leading-[100%] cursor-pointer hover:underline text-[#dad4cb]">Blog</div>
            <div className="relative leading-[100%] cursor-pointer hover:underline text-[#dad4cb]">Community</div>
          </div>

          {/* Sản phẩm */}
          <div className="flex-1 flex flex-col items-start gap-[12px]">
            <div className="relative leading-[100%] font-medium">Sản phẩm</div>
            <div className="relative leading-[100%] cursor-pointer hover:underline text-[#dad4cb]">Y-RAG</div>
            <div className="relative leading-[100%] cursor-pointer hover:underline text-[#dad4cb]">E-book</div>
            <div className="relative leading-[100%] cursor-pointer hover:underline text-[#dad4cb]">Dashboard</div>
          </div>

          {/* Liên hệ */}
          <div className="flex-1 flex flex-col items-start gap-[12px]">
            <div className="relative leading-[100%] font-medium">Liên hệ</div>
            <div className="relative leading-[100%] cursor-pointer hover:underline text-[#dad4cb]">X</div>
            <div className="relative leading-[100%] cursor-pointer hover:underline text-[#dad4cb]">Instagram</div>
            <div className="relative leading-[100%] cursor-pointer hover:underline text-[#dad4cb]">Linkedin</div>
          </div>

          {/* Chính sách */}
          <div className="flex-1 flex flex-col items-start gap-[12px]">
            <div className="relative leading-[100%] cursor-pointer hover:underline text-[#dad4cb]">Chính sách</div>
            <div className="relative leading-[100%] cursor-pointer hover:underline text-[#dad4cb]">Bảo mật</div>
          </div>
        </div>

        {/* Bottom */}
        <div className="self-stretch flex items-end justify-between gap-[20px]">
          <div className="relative leading-[100%]">©2026 Team7.</div>
          <div className="h-[48.1px] flex items-center p-[6.9px_11.1px] box-border gap-[5.6px] text-[27.75px] font-['Playfair_Display'] text-white">
            <div className="flex items-center">
              <div className="w-[27.8px] h-[27.8px] bg-gray-500 rounded-full"></div>
            </div>
            <div className="relative leading-[125%]">LOGO</div>
          </div>
          <div className="relative leading-[100%]">©2025 Discourse Inc.</div>
        </div>
      </div>
    </div>
  );
};
