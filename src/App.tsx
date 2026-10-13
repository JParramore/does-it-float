import inspectFloat from './lib/inspect-float'
import './App.css';

function App() {
  return <>{JSON.stringify(inspectFloat(16.0))}</>;
}

export default App;
