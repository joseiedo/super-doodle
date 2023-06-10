import React, { useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { Game } from '../types/Game';
import { Player } from '../types/Player';
import { joinGame } from '../api/joinGame';
import { Direction } from '../types/Direction';

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

      stompClient.send('/game/join')
      // const player = await joinGame();
      // setCurrentPlayer(player);
    });
  }, []);

  const sendMovementMessage = (direction: Direction) => {
    stompClient.send(
      '/game/movecurrentplayer',
      {},
      JSON.stringify({
        id: 1,
        direction,
      })
    );
  };

  useEffect(() => {
    function handleMovement(event: KeyboardEvent) {
      const { key } = event;

      const movements: { [index: string]: any } = {
        ArrowUp: () => sendMovementMessage('UP'),
        ArrowDown: () => sendMovementMessage('DOWN'),
        ArrowLeft: () => sendMovementMessage('LEFT'),
        ArrowRight: () => sendMovementMessage('RIGHT'),
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
