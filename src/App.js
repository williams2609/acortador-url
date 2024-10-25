
import './App.css';
import BarraNavegacion from './Componentes/BarraNavegacion';
import Home from './Paginas/Home';
import { Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Subscripcion from './Paginas/Subscripcion';
import Login from './Paginas/Login';
import Register from './Paginas/Register';

function App() {
  return (
    <div className="App">
      <Router>
        <BarraNavegacion/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/Subscripción' element={<Subscripcion/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
        </Routes>
     </Router>
    </div>
  );
}

export default App;
