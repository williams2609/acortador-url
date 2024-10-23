
import './App.css';
import BarraNavegacion from './Componentes/BarraNavegacion';
import Home from './Paginas/Home';
import { Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Subscripcion from './Paginas/Subscripcion';

function App() {
  return (
    <div className="App">
      <Router>
        <BarraNavegacion/>
        <Routes>
          <Route path='/Subscripción' element={<Subscripcion/>}/>
          <Route path='/' element={<Home/>}/>
        </Routes>
     </Router>
    </div>
  );
}

export default App;
