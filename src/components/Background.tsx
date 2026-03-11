import { FunctionComponent } from 'react';

export const Background = () => {
  return (
    <div className="relative w-[1440px] h-[1066.1px] z-0 overflow-visible flex items-center justify-center">
      {/* Glow Elements */}
      {/* Right Element (Rotated -14.6deg) */}
      <div 
        className="absolute top-[400px] -right-[5%] w-[800px] h-[561.4px] rounded-[50%] origin-center -rotate-[14.6deg]"
        style={{
          filter: 'blur(300px)',
          backgroundColor: 'rgba(67, 133, 76, 0.6)'
        }}
      />
      {/* Left Element (Rotated -165.4deg) */}
      <div 
        className="absolute top-[400px] -left-[5%] w-[800px] h-[561.4px] rounded-[50%] origin-center -rotate-[165.4deg]"
        style={{
          filter: 'blur(300px)',
          backgroundColor: 'rgba(179, 255, 76, 0.1)'
        }}
      />
      {/* Center Element (Mix Blend Linear Dodge) */}
      <div 
        className="absolute top-[350px] left-1/2 -translate-x-1/2 w-[1000px] h-[580px] rounded-[50%] mix-blend-linear-dodge"
        style={{
          filter: 'blur(272px)',
          background: 'linear-gradient(180deg, rgba(118, 255, 212, 0.6) 13.46%, #00d492 57.69%, rgba(68, 135, 78, 0))'
        }}
      />

      {/* Right Rectangles */}
      <div className="absolute top-[-116px] right-0 w-[720px] h-[1299.2px] origin-center rotate-180 opacity-60 mix-blend-screen overflow-hidden">
        <div 
          className="absolute top-[-300px] left-0 w-[102.9px] h-[1066.1px] border-l-[3px] border-transparent box-border"
          style={{
            background: 'radial-gradient(298.37% 184.73% at 100% 71.16%, rgba(255, 255, 255, 0) 16%, rgba(0, 0, 0, 0.75) 74%, #000) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, rgba(255, 255, 255, 0.4)) border-box'
          }}
        />
        <div 
          className="absolute top-[-200px] left-[102.86px] w-[102.9px] h-[1066.1px] border-l-[3px] border-transparent box-border"
          style={{
            background: 'radial-gradient(298.37% 184.73% at 100% 71.16%, rgba(255, 255, 255, 0) 16%, rgba(0, 0, 0, 0.75) 74%, #000) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, rgba(255, 255, 255, 0.4)) border-box'
          }}
        />
        <div 
          className="absolute top-[0px] left-[205.71px] w-[102.9px] h-[1066.1px] border-l-[3px] border-transparent box-border"
          style={{
            background: 'radial-gradient(298.37% 184.73% at 100% 71.16%, rgba(255, 255, 255, 0) 16%, rgba(0, 0, 0, 0.75) 74%, #000) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, rgba(255, 255, 255, 0.4)) border-box'
          }}
        />
        <div 
          className="absolute top-[0px] left-[308.57px] w-[102.9px] h-[1066.1px] border-l-[3px] border-transparent box-border"
          style={{
            background: 'radial-gradient(298.37% 184.73% at 100% 71.16%, rgba(255, 255, 255, 0) 16%, rgba(0, 0, 0, 0.75) 74%, #000) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, rgba(255, 255, 255, 0.4)) border-box'
          }}
        />
        <div 
          className="absolute top-[0px] left-[411.43px] w-[102.9px] h-[1066.1px] border-l-[3px] border-transparent box-border"
          style={{
            background: 'radial-gradient(298.37% 184.73% at 100% 71.16%, rgba(255, 255, 255, 0) 16%, rgba(0, 0, 0, 0.75) 74%, #000) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, rgba(255, 255, 255, 0.4)) border-box'
          }}
        />
        <div 
          className="absolute top-[0px] left-[514.29px] w-[102.9px] h-[1066.1px] border-l-[3px] border-transparent box-border"
          style={{
            background: 'radial-gradient(298.37% 184.73% at 100% 71.16%, rgba(255, 255, 255, 0) 16%, rgba(0, 0, 0, 0.75) 74%, #000) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, rgba(255, 255, 255, 0.4)) border-box'
          }}
        />
        <div 
          className="absolute top-[0px] left-[617.14px] w-[102.9px] h-[1066.1px] border-l-[3px] border-transparent box-border"
          style={{
            background: 'radial-gradient(336.52% 208.35% at 100% 94.79%, rgba(255, 255, 255, 0) 16%, rgba(0, 0, 0, 0.75) 74%, #000) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, #fff) border-box'
          }}
        />
        
        {/* Mask Overlay Right */}
        <div className="absolute top-0 left-0 w-full h-[1299.2px] pointer-events-none mix-blend-multiply opacity-50">
          <div 
            className="absolute top-[99.18px] left-0 w-[102.9px] h-[1066.1px] border-l-[1.6px] border-transparent box-border"
            style={{
              background: 'linear-gradient(0deg, #000 37.45%, rgba(255, 255, 255, 0)) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, #fff) border-box'
            }}
          />
          <div 
            className="absolute top-[32.74px] left-[102.86px] w-[102.9px] h-[1066.1px] border-l-[1.6px] border-transparent box-border"
            style={{
              background: 'linear-gradient(0deg, #000 37.45%, rgba(255, 255, 255, 0)) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, #fff) border-box'
            }}
          />
          <div 
            className="absolute top-[0px] left-[205.71px] w-[102.9px] h-[1066.1px] border-l-[1.6px] border-transparent box-border"
            style={{
              background: 'linear-gradient(0deg, #000 37.45%, rgba(255, 255, 255, 0)) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, #fff) border-box'
            }}
          />
          <div 
            className="absolute top-[15.41px] left-[308.57px] w-[102.9px] h-[1066.1px] border-l-[1.6px] border-transparent box-border"
            style={{
              background: 'linear-gradient(0deg, #000 37.45%, rgba(255, 255, 255, 0)) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, #fff) border-box'
            }}
          />
          <div 
            className="absolute top-[52.96px] left-[411.43px] w-[102.9px] h-[1066.1px] border-l-[1.6px] border-transparent box-border"
            style={{
              background: 'linear-gradient(0deg, #000 37.45%, rgba(255, 255, 255, 0)) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, #fff) border-box'
            }}
          />
          <div 
            className="absolute top-[116.52px] left-[514.29px] w-[102.9px] h-[1066.1px] border-l-[1.6px] border-transparent box-border"
            style={{
              background: 'linear-gradient(0deg, #000 37.45%, rgba(255, 255, 255, 0)) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, #fff) border-box'
            }}
          />
          <div 
            className="absolute top-[233.03px] left-[617.14px] w-[102.9px] h-[1066.1px] border-l-[1.6px] border-transparent box-border"
            style={{
              background: 'linear-gradient(0deg, #000 15.27%, rgba(255, 255, 255, 0)) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, #fff) border-box'
            }}
          />
        </div>
      </div>

      {/* Left Rectangles */}
      <div className="absolute top-[-116px] left-0 w-[720px] h-[1299.2px] origin-center -scale-x-100 rotate-180 opacity-60 mix-blend-screen overflow-hidden">
        <div 
          className="absolute top-[-300px] left-0 w-[102.9px] h-[1066.1px] border-l-[3px] border-transparent box-border"
          style={{
            background: 'radial-gradient(298.37% 184.73% at 100% 71.16%, rgba(255, 255, 255, 0) 16%, rgba(0, 0, 0, 0.75) 74%, #000) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, rgba(255, 255, 255, 0.4)) border-box'
          }}
        />
        <div 
          className="absolute top-[-200px] left-[102.86px] w-[102.9px] h-[1066.1px] border-l-[3px] border-transparent box-border"
          style={{
            background: 'radial-gradient(298.37% 184.73% at 100% 71.16%, rgba(255, 255, 255, 0) 16%, rgba(0, 0, 0, 0.75) 74%, #000) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, rgba(255, 255, 255, 0.4)) border-box'
          }}
        />
        <div 
          className="absolute top-[0px] left-[205.71px] w-[102.9px] h-[1066.1px] border-l-[3px] border-transparent box-border"
          style={{
            background: 'radial-gradient(298.37% 184.73% at 100% 71.16%, rgba(255, 255, 255, 0) 16%, rgba(0, 0, 0, 0.75) 74%, #000) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, rgba(255, 255, 255, 0.4)) border-box'
          }}
        />
        <div 
          className="absolute top-[0px] left-[308.57px] w-[102.9px] h-[1066.1px] border-l-[3px] border-transparent box-border"
          style={{
            background: 'radial-gradient(298.37% 184.73% at 100% 71.16%, rgba(255, 255, 255, 0) 16%, rgba(0, 0, 0, 0.75) 74%, #000) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, rgba(255, 255, 255, 0.4)) border-box'
          }}
        />
        <div 
          className="absolute top-[0px] left-[411.43px] w-[102.9px] h-[1066.1px] border-l-[3px] border-transparent box-border"
          style={{
            background: 'radial-gradient(298.37% 184.73% at 100% 71.16%, rgba(255, 255, 255, 0) 16%, rgba(0, 0, 0, 0.75) 74%, #000) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, rgba(255, 255, 255, 0.4)) border-box'
          }}
        />
        <div 
          className="absolute top-[0px] left-[514.29px] w-[102.9px] h-[1066.1px] border-l-[3px] border-transparent box-border"
          style={{
            background: 'radial-gradient(298.37% 184.73% at 100% 71.16%, rgba(255, 255, 255, 0) 16%, rgba(0, 0, 0, 0.75) 74%, #000) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, rgba(255, 255, 255, 0.4)) border-box'
          }}
        />
        <div 
          className="absolute top-[0px] left-[617.14px] w-[102.9px] h-[1066.1px] border-l-[3px] border-transparent box-border"
          style={{
            background: 'radial-gradient(336.52% 208.35% at 100% 94.79%, rgba(255, 255, 255, 0) 16%, rgba(0, 0, 0, 0.75) 74%, #000) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, #fff) border-box'
          }}
        />

        {/* Mask Overlay Left */}
        <div className="absolute top-0 left-0 w-full h-[1299.2px] pointer-events-none mix-blend-multiply opacity-50">
          <div 
            className="absolute top-[99.18px] left-0 w-[102.9px] h-[1066.1px] border-l-[1.6px] border-transparent box-border"
            style={{
              background: 'linear-gradient(0deg, #000 37.45%, rgba(255, 255, 255, 0)) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, #fff) border-box'
            }}
          />
          <div 
            className="absolute top-[32.74px] left-[102.86px] w-[102.9px] h-[1066.1px] border-l-[1.6px] border-transparent box-border"
            style={{
              background: 'linear-gradient(0deg, #000 37.45%, rgba(255, 255, 255, 0)) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, #fff) border-box'
            }}
          />
          <div 
            className="absolute top-[0px] left-[205.71px] w-[102.9px] h-[1066.1px] border-l-[1.6px] border-transparent box-border"
            style={{
              background: 'linear-gradient(0deg, #000 37.45%, rgba(255, 255, 255, 0)) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, #fff) border-box'
            }}
          />
          <div 
            className="absolute top-[15.41px] left-[308.57px] w-[102.9px] h-[1066.1px] border-l-[1.6px] border-transparent box-border"
            style={{
              background: 'linear-gradient(0deg, #000 37.45%, rgba(255, 255, 255, 0)) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, #fff) border-box'
            }}
          />
          <div 
            className="absolute top-[52.96px] left-[411.43px] w-[102.9px] h-[1066.1px] border-l-[1.6px] border-transparent box-border"
            style={{
              background: 'linear-gradient(0deg, #000 37.45%, rgba(255, 255, 255, 0)) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, #fff) border-box'
            }}
          />
          <div 
            className="absolute top-[116.52px] left-[514.29px] w-[102.9px] h-[1066.1px] border-l-[1.6px] border-transparent box-border"
            style={{
              background: 'linear-gradient(0deg, #000 37.45%, rgba(255, 255, 255, 0)) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, #fff) border-box'
            }}
          />
          <div 
            className="absolute top-[233.03px] left-[617.14px] w-[102.9px] h-[1066.1px] border-l-[1.6px] border-transparent box-border"
            style={{
              background: 'linear-gradient(0deg, #000 15.27%, rgba(255, 255, 255, 0)) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, #fff) border-box'
            }}
          />
        </div>
      </div>
    </div>
  );
};
