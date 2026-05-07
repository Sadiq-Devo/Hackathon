import {useState} from 'react';
import GameScreen from './GameScreen';
import './App.css';

function App () {
  const [gamestarted, setGameStarted] = useState(false);

  if (gamestarted) {
    return <GameScreen />;
  }
  return (
    <main> 
   <h1> Phishing escape </h1>
   <button onClick={() => setGameStarted(true)}> Start Game </button>
    </main>
  );
}
export default App;