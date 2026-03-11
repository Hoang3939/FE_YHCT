export const Header = () => {
  return (
    <div className="w-[1440px] h-[80px] flex items-center justify-between py-[30px] px-[78px] box-border text-[20px] text-[#898c85] font-['Inter'] z-50 absolute top-0 left-0">
      <div className="flex items-center gap-[140px] shrink-0 w-full justify-center">
        {/* combinedLogo */}
        <div className="h-[40px] w-[179px] flex items-center py-[5.7px] px-[9.1px] box-border gap-[4.5px] text-left text-[22.74px] text-white font-['Playfair_Display']">
          <div className="flex items-center">
            {/* Replace src with actual logo if available */}
            <div className="w-[22.7px] h-[22.7px] bg-gray-500 rounded-full"></div>
          </div>
          <div className="relative leading-[125%]">Logo</div>
        </div>
        
        {/* menu */}
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

        {/* buttonMenuParent */}
        <div className="w-[251px] flex items-center gap-[10px]">
          <div className="w-[109px] flex flex-col items-center justify-center gap-[1px]">
            <div className="relative cursor-pointer hover:text-white transition-colors">Đăng nhập</div>
            <div className="w-[1px] h-[1px] relative rounded-[10px] bg-[#d9d9d9] opacity-0" />
          </div>
          <button className="h-[35px] w-[130px] rounded-[30px] bg-[#008b74] hover:bg-[#007461] transition-colors flex items-center justify-center p-[10px] box-border text-[18px] text-white cursor-pointer">
            <div className="relative shrink-0">Start Demo</div>
          </button>
        </div>
      </div>
    </div>
  );
};
