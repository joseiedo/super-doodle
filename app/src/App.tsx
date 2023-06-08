import { GameCanvas } from './components/GameCanvas';
import { useGameWebSocket } from './hooks/useGameWebSocket';

function App() {
  const { connected, currentPlayer, game, stompClient } = useGameWebSocket();

  return (
    <div className="App">
      <h1>Game</h1>
      <p>Connected: {connected ? 'true' : 'false'}</p>
      <p>Current player: {currentPlayer?.id}</p>
      <p>Game: {game?.id}</p>
      {game && <GameCanvas game={game} />}
    </div>
  );
}

export default App;
