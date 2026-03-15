export const Background = () => {
  const columnHeights = [550, 650, 750, 850, 950, 1020, 1050, 1050, 1020, 950, 850, 750, 650, 550];

  return (
    <div className="relative w-[1440px] h-[1066.1px] z-0 overflow-visible flex items-center justify-center">
      {/* Glow Elements */}
      <div
        className="absolute top-[400px] -right-[5%] w-[800px] h-[561.4px] rounded-[50%] origin-center -rotate-[14.6deg]"
        style={{
          filter: 'blur(300px)',
          backgroundColor: 'rgba(67, 133, 76, 0.6)'
        }}
      />
      <div
        className="absolute top-[400px] -left-[5%] w-[800px] h-[561.4px] rounded-[50%] origin-center -rotate-[165.4deg]"
        style={{
          filter: 'blur(300px)',
          backgroundColor: 'rgba(179, 255, 76, 0.1)'
        }}
      />
      <div
        className="absolute top-[350px] left-1/2 -translate-x-1/2 w-[1000px] h-[580px] rounded-[50%] mix-blend-linear-dodge"
        style={{
          filter: 'blur(272px)',
          background:
            'linear-gradient(180deg, rgba(118, 255, 212, 0.6) 13.46%, #00d492 57.69%, rgba(68, 135, 78, 0))'
        }}
      />

      {/* Hill Columns */}
      <div className="absolute bottom-[0px] left-1/2 -translate-x-1/2 flex items-end w-screen opacity-40 pointer-events-none z-10">
        {columnHeights.map((height, index) => {
          const distanceFromCenter = Math.abs(index - 6.5);
          const intensity = Math.max(0.2, 1 - distanceFromCenter / 6.5);

          return (
            <div
              key={`hill-column-${index}`}
              style={{
                width: 'calc(100vw / 14)',
                height: `${height}px`,
                background: `linear-gradient(180deg, rgba(0, 212, 146, ${0.08 * intensity}) 0%, rgba(0, 212, 146, ${0.18 * intensity}) 55%, rgba(0, 212, 146, ${0.45 * intensity}) 100%)`,
                borderLeft: `1px solid rgba(0, 212, 146, ${0.12 * intensity})`,
                borderRight: `1px solid rgba(0, 212, 146, ${0.08 * intensity})`,
                boxShadow: `0 0 12px rgba(0, 212, 146, ${0.18 * intensity})`
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
