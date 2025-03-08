import { Home } from "./pages/home"
import {List} from "./pages/list"
import { About } from "./pages/about";
import { Register } from "./pages/register";
import { Signin } from "./pages/signin";
import { Signup } from "./pages/signup";
import { Map } from "./pages/map";
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agricultores" element={<List />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/registrar" element={<Register />} />
        <Route path="/mapa-calor" element={<Map />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App