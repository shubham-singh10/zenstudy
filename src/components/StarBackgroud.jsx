import React, { useEffect, useRef } from 'react';

const StarBackground = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = container.offsetWidth;
    let height = container.offsetHeight;

    canvas.width = width;
    canvas.height = height;

    const stars = [];
    const starCount = Math.floor(width * height / 5000);

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2,
        alpha: Math.random() * 0.5 + 0.5,
        direction: Math.random() > 0.5 ? 1 : -1,
        speed: Math.random() * 0.002 + 0.001
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach(star => {
        star.alpha += star.direction * star.speed;

        if (star.alpha <= 0.5 || star.alpha >= 1) {
          star.direction *= -1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      />
    </div>
  );
};

export default StarBackground;
