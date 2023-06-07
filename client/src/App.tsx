import React, { useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { Game, isGame } from './types/Game';
import { isPlayer } from './types/Player';

function App() {
  const [game, setGame] = React.useState<Game | null>(null);

  useEffect(() => {
    console.log(websocket(setGame));
  }, []);

  useEffect(() => {
    if (game) {
      console.log(game);
    }
  }, [game]);

  return <div className="App"></div>;
}

function websocket(setGame: React.Dispatch<React.SetStateAction<Game | null>>) {
  const SOCKET_URL = 'http://localhost:8080/ws';

  const socket = new SockJS(SOCKET_URL);
  const stompClient = Stomp.over(socket);

  stompClient.connect({}, function (frame) {
    stompClient.subscribe('/game/current', ({ body }: { body: string }) => {
      const game = JSON.parse(body);
      if (isGame(game)) {
        setGame(game);
      }
    });

    // TODO: Send a player to the server when joining
    // stompClient.send('/join', {}, JSON.stringify({ name: 'Player 1' }));

    stompClient.send('/game/join', {});
  });
}

export default App;
