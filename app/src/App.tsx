import { useGameWebSocket } from './hooks/useGameWebSocket';

function App() {
  const { connected, currentPlayer, game, stompClient } = useGameWebSocket();

  return <div className="App"></div>;
}

export default App;
