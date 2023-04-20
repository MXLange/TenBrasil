import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from "react-router-dom";
import Animals from './Pages/Animals';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Animals />} />
    </Routes>
  );
}

export default App;
