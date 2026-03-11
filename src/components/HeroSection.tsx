import { Background } from '@/components/Background';

export const HeroSection = () => {
  return (
    <div className="relative w-[1440px] pt-[150px] pb-[100px] flex flex-col items-center z-10">
      {/* Main Content Wrap */}
      <div className="flex flex-col items-center gap-[40px] z-10 w-full">
        {/* Tag */}
        <div className="rounded-[20px] bg-[#021b13] border border-[#01422d] box-border w-[350px] h-[30px] flex items-center justify-center py-[4px] px-[25px] text-center">
          <div className="text-[14px]">RAG-Powered · Verified Knowledge</div>
        </div>

        {/* Title */}
        <div className="text-[50px] text-center font-semibold font-['Playfair_Display'] text-transparent bg-clip-text bg-[linear-gradient(0deg,#00d492,#c0e8c6_50.48%,#fff)] leading-tight">
          Tra cứu Y học cổ truyền minh xác <br />với AI có trích dẫn nguồn
        </div>

        {/* Subtitle */}
        <div className="text-[20px] text-center font-medium text-[#898c85] w-[495px]">
          Nền tảng ứng dụng RAG giúp truy xuất bài thuốc và dược liệu từ kho tri thức chính thống
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-[32px] text-[25px] text-white mt-[12px]">
          <button className="h-[55px] w-[241px] rounded-[30px] bg-[#021b13] border border-white box-border flex items-center justify-center p-[10px] hover:bg-white hover:text-black transition-colors cursor-pointer">
            <div className="relative">Xem thư viện</div>
          </button>
          <button className="h-[55px] w-[230px] rounded-[30px] bg-[#008b74] hover:bg-[#007461] transition-colors flex items-center justify-center p-[10px] box-border gap-[10px] cursor-pointer">
            <div className="relative">Start Demo</div>
            <svg className="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>

        {/* Features List Parent */}
        <div className="flex items-center gap-[24px] text-[16px] text-white mt-[30px] mb-[60px]">
          <div className="flex items-center gap-[11px]">
            <svg className="w-[20px] h-[20px] text-[#00d492]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div className="relative">Có trích dẫn nguồn</div>
          </div>
          <div className="flex items-center gap-[11px]">
            <svg className="w-[20px] h-[20px] text-[#00d492]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div className="relative">Liên kết Wikipedia</div>
          </div>
          <div className="flex items-center gap-[11px]">
            <svg className="w-[20px] h-[20px] text-[#00d492]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div className="relative">Hạn chế ảo giác LLM</div>
          </div>
          <div className="flex items-center gap-[11px]">
            <svg className="w-[20px] h-[20px] text-[#00d492]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div className="relative">Chuẩn hóa từ dược điển</div>
          </div>
        </div>
        
        {/* Main Image */}
        <div className="relative flex justify-center items-center w-full mt-[20px] z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center z-0 pointer-events-none">
            <Background />
          </div>
          <img 
            src="/images/rag-landing-page.png" 
            alt="RAG Interface" 
            className="rounded-[20px] w-[1010.7px] border border-[#01422d] shadow-[0px_4px_44px_rgba(0,212,146,0.15)] relative z-10" 
          />
        </div>
      </div>
    </div>
  );
};

