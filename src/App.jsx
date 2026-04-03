import './App.css';
import AppRoutes from './routes/AppRoutes.jsx';
import useGlobalFx from './hooks/useGlobalFx.jsx';

function App() {
  useGlobalFx();
  return <AppRoutes />
};

export default App;
