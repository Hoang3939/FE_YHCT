export const Features = () => {
  return (
    <div className="w-[1242px] flex flex-col items-center gap-[100px] pt-[200px] z-10">
      <div className="w-[418px] flex flex-col items-center justify-center gap-[35px]">
        <div className="self-stretch relative text-[18px] text-center text-[#00d492]">NỀN TẢNG</div>
        <div className="self-stretch relative text-[50px] font-semibold font-['Playfair_Display'] text-white text-center">
          Tính năng nổi bật
        </div>
      </div>

      <div className="self-stretch flex flex-col items-start gap-[59px] text-left text-[32px] text-white">
        <div className="self-stretch flex items-center justify-center gap-[48px]">
          {/* Card 1 */}
          <div className="h-[294px] w-[693px] shadow-[2px_2px_15px_rgba(105,255,185,0.1)] rounded-[20px] bg-[#06110d] bg-clip-padding border-[3px] border-transparent box-border flex flex-col items-start justify-center p-[20px_28px] relative [background-image:linear-gradient(-90deg,#111c1b,#4f827d)]" style={{ backgroundOrigin: 'border-box' }}>
            <div className="absolute inset-0 bg-[#06110d] rounded-[17px] -z-10 m-[1px]"></div>
            <div className="w-[662px] h-[213px] flex flex-col items-start gap-[24px] shrink-0 z-10">
              <div className="w-[60px] h-[60px] shrink-0 bg-emerald-900 shadow-[0.5px_0.5px_20px_rgba(255,255,255,0.1)] rounded-[10px] flex items-center justify-center">
                <span
                  aria-hidden
                  style={{
                    width: 28,
                    height: 28,
                    backgroundColor: '#00d492',
                    WebkitMaskImage: "url('/icons/clipboard-check.svg')",
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    WebkitMaskSize: 'contain',
                    maskImage: "url('/icons/clipboard-check.svg')",
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    maskSize: 'contain'
                  }}
                />
              </div>
              <div className="self-stretch relative font-semibold leading-tight">Chatbox truy xuất minh xác (RAG-based)</div>
              <div className="w-[635px] flex-1 relative text-[20px] font-medium text-[#c7ccc0] leading-normal line-clamp-3">
                Câu trả lời được truy xuất trực tiếp từ kho tri thức chính thống, không sinh ngẫu nhiên. Mỗi đầu ra đều có nguồn kiểm chứng.
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="h-[294px] w-[507px] shadow-[2px_2px_15px_rgba(59,130,246,0.1)] rounded-[20px] bg-[#06110d] bg-clip-padding border-[3px] border-transparent box-border flex flex-col items-start justify-center p-[20px_28px] relative [background-image:linear-gradient(270deg,#111c1b,#216193)]" style={{ backgroundOrigin: 'border-box' }}>
            <div className="absolute inset-0 bg-[#06110d] rounded-[17px] -z-10 m-[1px]"></div>
            <div className="w-[448px] h-[229px] flex flex-col items-start gap-[24px] z-10">
              <div className="w-[60px] h-[60px] shrink-0 bg-blue-900 shadow-[0.5px_0.5px_20px_rgba(255,255,255,0.1)] rounded-[10px] flex items-center justify-center">
                <span
                  aria-hidden
                  style={{
                    width: 28,
                    height: 28,
                    backgroundColor: '#3b82f6',
                    WebkitMaskImage: "url('/icons/clipboard-check.svg')",
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    WebkitMaskSize: 'contain',
                    maskImage: "url('/icons/clipboard-check.svg')",
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    maskSize: 'contain'
                  }}
                />
              </div>
              <div className="self-stretch relative font-semibold leading-tight">Trích dẫn tên sách, số trang</div>
              <div className="w-[433px] flex-1 relative text-[20px] font-medium text-[#c7ccc0] leading-normal line-clamp-3">
                Tự động hiển thị tên tài liệu tham khảo, số trang và đoạn trích cụ thể cho mỗi câu trả lời.
              </div>
            </div>
          </div>
        </div>

        <div className="self-stretch flex items-center justify-center gap-[48px]">
          {/* Card 3 */}
          <div className="h-[294px] w-[507px] shadow-[2px_2px_15px_rgba(245,158,11,0.1)] rounded-[20px] bg-[#06110d] bg-clip-padding border-[3px] border-transparent box-border flex flex-col items-start justify-center p-[20px_28px] relative [background-image:linear-gradient(-90deg,#111c1b,#f59e0b)]" style={{ backgroundOrigin: 'border-box' }}>
            <div className="absolute inset-0 bg-[#06110d] rounded-[17px] -z-10 m-[1px]"></div>
            <div className="w-[448px] h-[229px] flex flex-col items-start gap-[24px] z-10">
              <div className="w-[60px] h-[60px] shrink-0 bg-orange-900 shadow-[0.5px_0.5px_20px_rgba(255,255,255,0.1)] rounded-[10px] flex items-center justify-center">
                <span
                  aria-hidden
                  style={{
                    width: 28,
                    height: 28,
                    backgroundColor: '#f59e0b',
                    WebkitMaskImage: "url('/icons/clipboard-check.svg')",
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    WebkitMaskSize: 'contain',
                    maskImage: "url('/icons/clipboard-check.svg')",
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    maskSize: 'contain'
                  }}
                />
              </div>
              <div className="self-stretch relative font-semibold leading-tight">Thư viện E-book</div>
              <div className="w-[433px] flex-1 relative text-[20px] font-medium text-[#c7ccc0] leading-normal line-clamp-3">
                Đọc toàn văn sách y học cổ truyền số hóa, đánh dấu đoạn quan trọng và tổ chức tài liệu cá nhân.
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="h-[294px] w-[693px] shadow-[2px_2px_15px_rgba(6,182,212,0.1)] rounded-[20px] bg-[#06110d] bg-clip-padding border-[3px] border-transparent box-border flex flex-col items-start justify-center p-[20px_28px] relative [background-image:linear-gradient(270deg,#111c1b,#06b6d4)]" style={{ backgroundOrigin: 'border-box' }}>
            <div className="absolute inset-0 bg-[#06110d] rounded-[17px] -z-10 m-[1px]"></div>
            <div className="w-[662px] h-[213px] flex flex-col items-start gap-[24px] z-10">
              <div className="w-[60px] h-[60px] shrink-0 bg-cyan-900 shadow-[0.5px_0.5px_20px_rgba(255,255,255,0.1)] rounded-[10px] flex items-center justify-center">
                <span
                  aria-hidden
                  style={{
                    width: 28,
                    height: 28,
                    backgroundColor: '#06b6d4',
                    WebkitMaskImage: "url('/icons/clipboard-check.svg')",
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    WebkitMaskSize: 'contain',
                    maskImage: "url('/icons/clipboard-check.svg')",
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    maskSize: 'contain'
                  }}
                />
              </div>
              <div className="self-stretch relative font-semibold leading-tight">Đóng góp tri thức cộng đồng (có duyệt)</div>
              <div className="w-[635px] flex-1 relative text-[20px] font-medium text-[#c7ccc0] leading-normal line-clamp-3">
                Cộng đồng nghiên cứu có thể đóng góp tài liệu và chuẩn hóa tri thức, mọi nội dung đều được kiểm duyệt bởi chuyên gia.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

