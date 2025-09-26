
import { BrowserRouter as Router, Routes, Route } from'react-router-dom';
import Home from './Home';
import Services from './Services';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Services" element={<Services />} />
        
      </Routes>
    </Router>
  );
}

export default App;
