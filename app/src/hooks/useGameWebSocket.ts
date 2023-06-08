import React, { useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { Game } from '../types/Game';
import { Player } from '../types/Player';
import { joinGame } from '../api/joinGame';

export function useGameWebSocket() {
  const SOCKET_URL = 'http://localhost:8080/ws';
  const socket = new SockJS(SOCKET_URL);
  const stompClient = Stomp.over(socket);
  const [connected, setConnected] = React.useState(false);
  const [game, setGame] = React.useState<Game | null>(null);
  const [currentPlayer, setCurrentPlayer] = React.useState<Player | null>(null);

  useEffect(() => {
    console.log('game: ', game);
  }, [game]);

  useEffect(() => {
    stompClient.connect({}, async () => {
      setConnected(true);

      stompClient.subscribe('/game/current', ({ body }) => {
        const game = JSON.parse(body);
        setGame(game);
      });

      const player = await joinGame();

      setCurrentPlayer(player);

      stompClient.subscribe(`/game/player/${player.id}`, ({ body }) => {
        const player = JSON.parse(body);
        setCurrentPlayer(player);
      });
    });
  }, []);

  function sendMovementMessage({ positionX, positionY, id }: Player) {
    stompClient.send(
      '/game/movecurrentplayer',
      {},
      JSON.stringify({
        positionX,
        positionY,
        id,
      })
    );
  }

  useEffect(() => {
    function handleMovement(event: KeyboardEvent) {
      if (currentPlayer === null) return;

      const { key } = event;

      const movements: { [index: string]: any } = {
        ArrowUp: () =>
          sendMovementMessage({
            positionX: currentPlayer.positionX,
            positionY: currentPlayer.positionY - 30,
            id: currentPlayer.id,
          }),
        ArrowDown: () =>
          sendMovementMessage({
            positionX: currentPlayer.positionX,
            positionY: currentPlayer.positionY + 30,
            id: currentPlayer.id,
          }),
        ArrowLeft: () =>
          sendMovementMessage({
            positionX: currentPlayer.positionX - 30,
            positionY: currentPlayer.positionY,
            id: currentPlayer.id,
          }),
        ArrowRight: () =>
          sendMovementMessage({
            positionX: currentPlayer.positionX + 30,
            positionY: currentPlayer.positionY,
            id: currentPlayer.id,
          }),
      };

      if (movements[key]) {
        movements[key]();
      }
    }

    window.addEventListener('keydown', handleMovement);

    return () => {
      window.removeEventListener('keydown', handleMovement);
    };
  }, [currentPlayer]);

  return { connected, game, currentPlayer, stompClient };
}
