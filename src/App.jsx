import './App.css';
import { Routes, Route } from "react-router-dom";
import Credential from './pages/credential';
import CategoriesList from './pages/CategoriesList';
import DashboardMainContent from './components/DashboardMainContent';
import DashBoard from './pages/DashBoad';
import CardDetails from './pages/CardDetails';
import AddProduct from './pages/AddProduct';
import InfiniteScroll from './components/InfinityScroll';

function App() {

  // const product = {
  //           title: "Egate i9 Projector",
  //           quantity: 323,
  //           offers: [
  //               "5% Unlimited Cashback on Flipkart Axis Bank Credit Card",
  //               "10% Off up to ₹750 on HDFC Credit Card EMI",
  //               "Special Price: Get an extra 25% off",
  //           ],
  //           description:
  //               "Android Smart Projector with 4D Keystone, 720p native resolution, 1080p support, Netflix, Prime, Screen Mirroring, WiFi 6, and BT.",
  //           maxPrice: 9990,
  //           discount: 4000,
  //           image: [
  //               "https://picsum.photos/400/300?random=1" ,"https://picsum.photos/seed/picsum/200/300","https://picsum.photos/200/300?grayscale","https://picsum.photos/200/300/?blur=2","https://picsum.photos/id/237/200/300",
  //           ],
  //           rating: 4.8,
  //           review: ["Excellent product!"],
  //           sellerName: "Flipkart Seller",
  //           colors: ["#ffe5e5", "#872c2c", "#635a5a", "#ab0707"],
  //       };
  return (
    <>
      <Routes>
        <Route path='/' element={<DashBoard />}>
          <Route index element={<DashboardMainContent />} />
          <Route path='category' element={<CategoriesList />} />
          <Route path='detail' element={<CardDetails />} />
          <Route path='newproduct' element={<AddProduct />} />
          <Route path='infi' element={<InfiniteScroll />} />

        </Route>
        <Route path='/credential' element={<Credential />} />
      </Routes>
    </>
  );
}

export default App;