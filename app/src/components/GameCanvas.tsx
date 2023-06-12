import { useEffect, useRef } from 'react';
import { Game } from '../types/Game';

interface GameCanvasProps {
  game: Game;
}

export const GameCanvas = ({game}: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawGame(game, canvasRef.current);
    }
  }, [game]);

  return <canvas ref={canvasRef} width={game.width} height={game.height}/>;
};

function drawGame({players, fruit, width, height}: Game, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);

  players.forEach((player) => {
    ctx.fillStyle = 'red';
    ctx.fillRect(player.positionX, player.positionY, 10, 10);
  });

  ctx.fillStyle = 'green';
  ctx.fillRect(fruit.positionX, fruit.positionY, 10, 10);
}
