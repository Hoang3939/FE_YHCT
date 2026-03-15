export const HowItWorks = () => {
  return (
    <div className="w-[903px] flex flex-col items-center gap-[107px] pt-[150px] z-10">
      <div className="w-[354px] flex flex-col items-center gap-[35px]">
        <div className="self-stretch relative text-[18px] text-center">QUY TRÌNH</div>
        <div className="self-stretch relative text-[50px] font-semibold font-['Playfair_Display'] text-white text-center">Cách hoạt động</div>
      </div>
      
      <div className="self-stretch flex flex-col items-center gap-[61px] text-left text-[46px] text-[#69ffb9] font-['Playfair_Display']">
        {/* Step 1 */}
        <div className="self-stretch flex items-center gap-[50px]">
          <div className="h-[169px] w-[156px] relative shrink-0">
            <div className="absolute top-[29px] left-0 shadow-[0.5px_0.5px_20px_rgba(255,255,255,0.1)] rounded-[40px] w-[140px] h-[140px] bg-[#021b13] flex items-center justify-center">
              <img src="/icons/Vector.svg" alt="Vector" className="w-[54px] h-[54px]" />
            </div>
            <div className="absolute top-0 left-[96px] w-[60px] h-[70px]">
              <div className="absolute top-[10px] left-0 rounded-[50%] bg-[#021b13] border border-[#272e3f] box-border w-[60px] h-[60px]" />
              <div className="absolute top-[26px] left-[23px] text-[18px] font-['Inter'] text-[#00d492]">1</div>
            </div>
          </div>
          <div className="w-[697px] flex flex-col items-start gap-[35px] text-[36px] text-white">
            <div className="self-stretch relative font-medium leading-tight">Dữ liệu sách cổ được OCR & làm sạch</div>
            <div className="self-stretch relative text-[20px] font-medium font-['Inter'] text-[#c7ccc0] leading-normal">
              Các tài liệu quý hiếm, sách cổ được số hóa bằng công nghệ OCR AI chính xác cao, loại bỏ nhiễu và chuẩn hóa từ vựng Hán-Nôm.
            </div>
          </div>
        </div>
        
        <svg className="w-[18px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>

        {/* Step 2 */}
        <div className="self-stretch flex items-center gap-[50px]">
          <div className="h-[169px] w-[156px] relative shrink-0">
            <div className="absolute top-[29px] left-0 shadow-[0.5px_0.5px_20px_rgba(255,255,255,0.1)] rounded-[40px] w-[140px] h-[140px] bg-[#021b13] flex items-center justify-center">
              <img src="/icons/cpu.svg" alt="CPU" className="w-[54px] h-[54px]" />
            </div>
            <div className="absolute top-0 left-[96px] w-[60px] h-[70px]">
              <div className="absolute top-[10px] left-0 rounded-[50%] bg-[#021b13] border border-[#272e3f] box-border w-[60px] h-[60px]" />
              <div className="absolute top-[26px] left-[23px] text-[18px] font-['Inter'] text-[#00d492]">2</div>
            </div>
          </div>
          <div className="w-[697px] flex flex-col items-start gap-[35px] text-[36px] text-white">
            <div className="self-stretch relative font-medium leading-tight">Vector hóa & lưu trữ vào Vector Database</div>
            <div className="self-stretch relative text-[20px] font-medium font-['Inter'] text-[#c7ccc0] leading-normal">
              Dữ liệu được chuyển đổi thành các vector ý nghĩa, giúp máy tính hiểu được ngữ cảnh sâu sắc của các bài thuốc thay vì chỉ khớp từ khóa.
            </div>
          </div>
        </div>
        
        <svg className="w-[18px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        
        {/* Step 3 */}
        <div className="self-stretch flex items-center gap-[50px]">
          <div className="h-[169px] w-[156px] relative shrink-0">
            <div className="absolute top-[29px] left-0 shadow-[0.5px_0.5px_20px_rgba(255,255,255,0.1)] rounded-[40px] w-[140px] h-[140px] bg-[#021b13] flex items-center justify-center">
              <img src="/icons/clipboard-check.svg" alt="Clipboard" className="w-[54px] h-[54px]" />
            </div>
            <div className="absolute top-0 left-[96px] w-[60px] h-[70px]">
              <div className="absolute top-[10px] left-0 rounded-[50%] bg-[#021b13] border border-[#272e3f] box-border w-[60px] h-[60px]" />
              <div className="absolute top-[26px] left-[23px] text-[18px] font-['Inter'] text-[#00d492]">3</div>
            </div>
          </div>
          <div className="w-[697px] flex flex-col items-start gap-[35px] text-[36px] text-white">
            <div className="self-stretch relative font-medium leading-tight">AI truy xuất ngữ nghĩa & sinh câu trả lời</div>
            <div className="self-stretch relative text-[20px] font-medium font-['Inter'] text-[#c7ccc0] leading-normal">
              Khi bạn đặt câu hỏi, AI tìm kiếm đoạn văn liên quan nhất trong kho tri thức và tóm tắt lại kèm theo trích dẫn sách và số trang cụ thể.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

