import { GameCanvas } from './components/GameCanvas';
import { useGameWebSocket } from './hooks/useGameWebSocket';

function App() {
  const { game } = useGameWebSocket();

  return (
    <div className="App">
      {game && <GameCanvas game={game} />}
    </div>
  );
}

export default App;
