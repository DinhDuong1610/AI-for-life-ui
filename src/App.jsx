import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from '../src/pages/Dashboard/Dashboard';
import Home from '../src/pages/Home/Home';
import Trash from '../src/pages/Trash/Trash';
import Recent from '../src/pages/Recent/Recent';
import Sidebar from '../src/partials/Sidebar';

function App() {
  return (
      <div className="App">
        <div className='sidebar'>
          <Sidebar />
        </div>
  
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recent" element={<Recent />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trash" element={<Trash />} />
        </Routes>
      </div>
  );
}

export default App;
