import { useEffect, useState } from 'react';
import Canvas from './Components/Canvas';

function App() {
  const [player, setPlayer] = useState({
    x: 10,
    y: 10,
  });

  useEffect(() => {
    console.log(player);
  }, [player]);

  function handlePlayerMovement({ key }) {
    const keyCommands = {
      ArrowUp: () => setPlayer((p) => ({ ...p, y: p.y - 10 })),
      ArrowDown: () => setPlayer((p) => ({ ...p, y: p.y + 10 })),
      ArrowRight: () => setPlayer((p) => ({ ...p, x: p.x + 10 })),
      ArrowLeft: () => setPlayer((p) => ({ ...p, x: p.x - 10 })),
    };

    if (keyCommands[key]) {
      keyCommands[key]();
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handlePlayerMovement);

    return () => window.removeEventListener('keydown', handlePlayerMovement);
  }, []);

  return (
    <div>
      <Canvas player={player} />
    </div>
  );
}

export default App;
