import { useEffect, useRef } from 'react';
import { Game } from '../types/Game';

interface GameCanvasProps {
  game: Game;
}

export const GameCanvas = (props: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawGame(props.game, canvasRef.current);
    }
  }, [props.game]);

  return <canvas ref={canvasRef} />;
};

function drawGame(game: Game, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  game.players.forEach((player) => {
    ctx.fillStyle = 'red';
    ctx.fillRect(player.positionX, player.positionY, 10, 10);
  });
}
