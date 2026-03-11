export const BottomCTA = () => {
  return (
    <div className="w-[672px] flex flex-col items-center py-[10px] px-0 box-border gap-[16px] text-[14px] text-[#fbf7ef] font-['Playfair_Display'] pt-[250px] pb-[100px] z-10">
      <div className="self-stretch relative text-[56px] tracking-[-0.02em] leading-[110%] text-center">
        Bắt đầu tra cứu tri thức ngay hôm nay
      </div>
      <div className="self-stretch relative leading-[125%] font-['Geist'] text-[#dad4cb] text-center text-[18px]">
        Khám phá sức mạnh của RAG trong y học cổ truyền.
      </div>
      <button className="w-[124px] h-[40px] rounded-[30px] bg-[#008b74] hover:bg-[#007461] transition-colors flex items-center justify-center p-[10px] box-border text-[14px] text-white font-['Inter'] mt-[16px] cursor-pointer">
        <span className="relative">Start Demo</span>
      </button>
    </div>
  );
};
