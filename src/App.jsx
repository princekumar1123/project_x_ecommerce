import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashBoard from './pages/DashBoad';
import Credential from './pages/credential';


function App() {
  return (
    <>
      
        <Routes>
          <Route path='/' element={<DashBoard/>} />
          <Route path='/credential' element={<Credential/>} />
        </Routes>


    </>
  );
}

export default App;
