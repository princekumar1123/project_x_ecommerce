import './App.css';
import { Routes, Route } from "react-router-dom";
import Credential from './pages/credential';
import CategoriesList from './pages/CategoriesList';
import DashboardMainContent from './components/DashboardMainContent';
import DashBoard from './pages/DashBoad';
import CardDetails from './pages/CardDetails';
import AddProduct from './pages/AddProduct';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<DashBoard />}>
          <Route index element={<DashboardMainContent />} />
          <Route path='category' element={<CategoriesList />} />
          <Route path='detail' element={<CardDetails />} />
          <Route path='newproduct' element={<AddProduct />} />
        </Route>
        <Route path='/credential' element={<Credential />} />
      </Routes>
    </>
  );
}

export default App;