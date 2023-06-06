import React, { useCallback, useEffect, useRef } from 'react';

const Canvas = ({ player, ...props }) => {
  const canvasRef = useRef(null);

  const draw = useCallback(
    (ctx) => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.fillStyle = 'red';
      ctx.fillRect(player.x, player.y, 10, 10);
    },
    [player.x, player.y]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    draw(context);
  }, [draw, player.x, player.y]);

  return <canvas ref={canvasRef} {...props} />;
};

export default Canvas;
