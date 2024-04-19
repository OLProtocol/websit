import React, { useEffect, useRef, RefObject } from 'react';

interface SatsRangeShowProps {
  // 定义组件的属性类型
}

export const SatsRangeShow: React.FC<SatsRangeShowProps> = () => {
  const canvasRef: RefObject<HTMLCanvasElement> = useRef(null);
  const totalSize = 1000;
  const ranges = [
    {
      start: '000000',
      offset: 10,
      size: 100,
      color: 'blue',
    },
    {
      start: '000000',
      offset: 300,
      size: 200,
      color: 'green',
    },
    {
      start: '000000',
      offset: 700,
      size: 1,
      color:'red',
    },
  ];
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext('2d');
    if (context) {
      // Clear the canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
  
      // Render a black bar across the entire width of the canvas
      context.fillStyle = 'black';
      context.fillRect(0, 0, totalSize, 30);
  
      // Draw additional segments based on the ranges data
      ranges.forEach((range) => {
        const start = range.offset;
        const end = range.offset + range.size;
        const segmentWidth = end - start;
  
        context.fillStyle = range.color;
        context.fillRect(start, 0, segmentWidth, 30);
  
        // Add text displaying the "start" value above each range
        context.fillStyle = 'white';
        context.font = '12px Arial';
        context.fillText(range.start, start, 12);
      });
    }
  };
  
  
  

  useEffect(() => {
    draw();
  }, []);

  return <canvas ref={canvasRef} width={1000} height={100} />;
};
