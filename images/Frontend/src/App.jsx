import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
import Login from './routes/Login';
import Register from './routes/Register';
import Profile from './routes/Profile';

function App() {

  return (
    <Router>
        <Routes  location={location} key={location.pathname}>
          <Route path="/login" element={<Login />}  />
          <Route path="/register" element={<Register/>} />
          <Route path="/" element={<Home/>} />
          <Route path="/profile" element={<Profile/>} />
        </Routes>
    </Router>
  );
}

export default App;
