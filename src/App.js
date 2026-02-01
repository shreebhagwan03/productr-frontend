import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Otp from "./auth/Otp";
import Layout from "./layout/layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Signup from "./auth/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
<Route path="/otp" element={<Otp />} />

        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
        </Route>

        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
