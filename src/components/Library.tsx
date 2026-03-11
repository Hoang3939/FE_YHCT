export const Library = () => {
  return (
    <div className="w-[1280px] flex flex-col items-center gap-[80px] pt-[250px] z-10">
      <div className="w-[418px] flex flex-col items-center justify-center gap-[35px] text-[#00d492]">
        <div className="w-[164px] relative inline-block shrink-0 text-center">THƯ VIỆN E-BOOK</div>
        <div className="w-[518px] relative text-[50px] font-semibold font-['Playfair_Display'] text-white text-center leading-tight">
          Sách chuyên ngành được yêu thích
        </div>
      </div>

      <div className="flex justify-center items-center gap-[40px] text-left text-[14px] text-white w-full">
        {/* Book 1 */}
        <div className="h-[550px] w-[400px] flex flex-col items-start justify-end p-[30px_25px] box-border relative isolate gap-[10px]">
          <div className="w-[400px] h-[550px] absolute m-0 top-0 left-0 shadow-[1px_1px_200px_rgba(187,230,216,0.2)] z-0 shrink-0">
            <div className="absolute top-0 left-0 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[20px] bg-white border border-[#021b13] box-border w-[400px] h-[550px]" />
            <img src="/images/y-hoc-co-truyen.png" alt="Y Học Cổ Truyền" className="absolute top-[36px] left-[29px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[20px] w-[343px] h-[474px] object-cover" />
            <div className="absolute top-[319px] left-0 blur-[20px] rounded-[0px_0px_20px_20px] bg-[linear-gradient(180deg,rgba(18,149,107,0.4),rgba(6,47,34,0.8)_49.52%,rgba(0,0,0,0.8))] w-[400px] h-[230px]" />
          </div>
          <div className="w-[360px] flex flex-col items-start gap-[13px] z-10 shrink-0">
            <div className="self-stretch relative text-[24px] font-semibold font-['Playfair_Display']">Y Học Cổ Truyền</div>
            <div className="self-stretch relative text-[16px] text-[#69ffb9]">PGS. TS. Nguyễn Nhược Kim</div>
            <div className="self-stretch relative font-medium text-[#898c85]">2022</div>
            <div className="w-[360px] h-[70px] relative font-medium leading-normal inline-block shrink-0 line-clamp-3">
              Sách “Y học cổ truyền” được biên soạn dựa trên chương trình giáo dục đại học của Trường Đại học Y Hà Nội trên cơ sở chương trình khung đã được phê duyệt.
            </div>
          </div>
        </div>

        {/* Book 2 */}
        <div className="h-[550px] w-[400px] flex flex-col items-start justify-end p-[30px_25px] box-border relative isolate gap-[10px]">
          <div className="w-[400px] h-[550px] absolute m-0 top-0 left-0 shadow-[1px_1px_200px_rgba(187,230,216,0.2)] z-0 shrink-0">
            <div className="absolute top-0 left-0 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[20px] bg-white border border-[#021b13] box-border w-[400px] h-[550px]" />
            <img src="/images/hai-thuong-y-tam-linh.png" alt="Hải Thượng Y Tông Tâm Lĩnh" className="absolute top-[36px] left-[29px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[20px] w-[343px] h-[474px] object-cover" />
            <div className="absolute top-[320px] left-0 blur-[20px] rounded-[0px_0px_20px_20px] bg-[linear-gradient(180deg,rgba(18,149,107,0.4),rgba(6,47,34,0.8)_49.52%,rgba(0,0,0,0.8))] w-[400px] h-[230px]" />
          </div>
          <div className="w-[360px] flex flex-col items-start gap-[13px] z-10 shrink-0">
            <div className="self-stretch relative text-[24px] font-semibold font-['Playfair_Display']">Hải Thượng Y Tông Tâm Lĩnh</div>
            <div className="self-stretch relative text-[16px] text-[#69ffb9]">Hải Thượng Lãn Ông</div>
            <div className="self-stretch relative font-medium text-[#898c85]">1770</div>
            <div className="self-stretch h-[70px] relative font-medium leading-normal inline-block shrink-0 line-clamp-3">
              Bộ sách y học đồ sộ gồm 28 tập của danh y Lê Hữu Trác, được coi là đỉnh cao của y học cổ truyền Việt Nam.
            </div>
          </div>
        </div>

        {/* Book 3 */}
        <div className="h-[550px] w-[400px] flex flex-col items-start justify-end p-[30px_25px] box-border relative isolate gap-[10px]">
          <div className="w-[400px] h-[550px] absolute m-0 top-0 left-0 shadow-[1px_1px_200px_rgba(187,230,216,0.2)] z-0 shrink-0">
            <div className="absolute top-0 left-0 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[20px] bg-white border border-[#021b13] box-border w-[400px] h-[550px]" />
            <img src="/images/nam-duoc-than-hieu.png" alt="Nam Dược Thần Hiệu" className="absolute top-[36px] left-[29px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[20px] w-[343px] h-[474px] object-cover" />
            <div className="absolute top-[320px] left-0 blur-[20px] rounded-[0px_0px_20px_20px] bg-[linear-gradient(180deg,rgba(18,149,107,0.4),rgba(6,47,34,0.8)_49.52%,rgba(0,0,0,0.8))] w-[400px] h-[230px]" />
          </div>
          <div className="w-[360px] flex flex-col items-start gap-[13px] z-10 shrink-0">
            <div className="self-stretch relative text-[24px] font-semibold font-['Playfair_Display']">Nam Dược Thần Hiệu</div>
            <div className="self-stretch relative text-[16px] text-[#69ffb9]">Tuệ Tĩnh</div>
            <div className="self-stretch relative font-medium text-[#898c85]">1417</div>
            <div className="self-stretch h-[70px] relative font-medium leading-normal inline-block shrink-0 line-clamp-3">
              Kiệt tác y học cổ điển của đại danh y Tuệ Tĩnh, ghi chép hàng trăm bài thuốc nam từ nguyên liệu bản địa Việt Nam.
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[30px] mt-[40px] bg-[#021b13] border border-[#898c85] box-border w-[332px] h-[55px] flex items-center justify-center p-[10px] gap-[10px] text-[25px] text-[#898c85] hover:bg-white hover:text-black transition-colors cursor-pointer">
        <div className="relative">Xem toàn bộ thư viện</div>
        <svg className="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
      </div>
    </div>
  );
};
