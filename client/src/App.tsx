import React, { useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { Game, isGame } from './types/Game';
import { GameCanvas } from './components/GameCanvas';
import { Player, isPlayer } from './types/Player';
import { joinGame } from './api/joinGame';

function App() {
  const [game, setGame] = React.useState<Game | null>(null);
  const [currentPlayer, setCurrentPlayer] = React.useState<Player | null>(null);
  const stompClientRef = React.useRef<Stomp.Client | null>(null);
  const [connected, setConnected] = React.useState(false);

  useEffect(() => {
    function handleMovement(event: KeyboardEvent) {
      if (currentPlayer === null) return;

      const { key } = event;
      const player = { ...currentPlayer };
      if (key === 'ArrowUp') {
        player.positionY = currentPlayer.positionY - 30;
      }

      if (key === 'ArrowDown') {
        player.positionY = currentPlayer.positionY + 30;
      }

      if (key === 'ArrowLeft') {
        player.positionX = currentPlayer.positionX - 30;
      }

      if (key === 'ArrowRight') {
        player.positionX = currentPlayer.positionX + 30;
      }

      stompClientRef.current?.send(
        '/game/movecurrentplayer',
        {},
        JSON.stringify(player)
      );
    }

    window.addEventListener('keydown', handleMovement);

    return () => {
      window.removeEventListener('keydown', handleMovement);
    };
  }, [currentPlayer]);

  useEffect(() => {
    const { stompClient } = websocket(
      setGame,
      setCurrentPlayer,
      setConnected,
      currentPlayer
    );
    stompClientRef.current = stompClient;
  }, []);

  return <div className="App">{game && <GameCanvas game={game} />}</div>;
}

function websocket(
  setGame: React.Dispatch<React.SetStateAction<Game | null>>,
  setCurrentPlayer: React.Dispatch<React.SetStateAction<Player | null>>,
  setConnected: React.Dispatch<React.SetStateAction<boolean>>,
  currentPlayer: Player | null
) {
  const SOCKET_URL = 'http://localhost:8080/ws';

  const socket = new SockJS(SOCKET_URL);
  const stompClient = Stomp.over(socket);

  stompClient.connect({}, async function () {
    setConnected(true);

    stompClient.subscribe('/game/current', ({ body }: { body: string }) => {
      const game = JSON.parse(body);
      if (isGame(game)) {
        if (currentPlayer) {
          setCurrentPlayer(
            game.players.find((player) => player.id === currentPlayer.id) ??
              null
          );
        }
        setGame(game);
      }
    });

    // TODO: Send a player to the server when joining
    stompClient.send('/join', {}, JSON.stringify({ name: 'Player 1' }));

    const player = await joinGame();

    if (isPlayer(player)) {
      setCurrentPlayer(player);
    }
  });

  return { stompClient };
}

export default App;
