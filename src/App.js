
import './App.css';
import BarraNavegacion from './Componentes/BarraNavegacion';
import Home from './Paginas/Home';
import { Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Subscripcion from './Paginas/Subscripcion';
import Login from './Paginas/Login';
import Register from './Paginas/Register';
import Perfil from './Paginas/Perfil';
import Estadisticas from './Paginas/Estadisticas';
import ApiUse from './Paginas/ApiUse';
import GenerateApiKey from './Paginas/GenerateApiKey';
import AuthProvider from './Componentes/AuthContext';

function App() {
  return (
    <div className="App">
      
        <Router>
          <AuthProvider>
          <BarraNavegacion/>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/Subscripción' element={<Subscripcion/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/perfil' element={<Perfil/>}/>
            <Route path='/estadisticas' element={<Estadisticas/>}/>
            <Route path='/resources/api-key' element={<ApiUse/>}/>
            <Route path='/resources/generate-api-key' element={<GenerateApiKey/>}/>
          </Routes>
          </AuthProvider>
      </Router>
     
    </div>
    
  );
}

export default App;
