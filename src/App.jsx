import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import classNames from "classnames/bind";
import style from './App.module.scss';
import Dashboard from '../src/pages/Dashboard/Dashboard';
import Home from '../src/pages/Home/Home';
import Trash from '../src/pages/Trash/Trash';
import Recent from '../src/pages/Recent/Recent';
import Sidebar from '../src/partials/Sidebar';
import Show from '../src/pages/Show/Show';
import Result from '../src/pages/Result/Result';

const cx = classNames.bind(style);

function App() {
  return (
      <div className={cx('wrapper')}>
        <div className={cx('sidebar')}>
          <Sidebar />
        </div>
  
        <div className={cx('content')}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recent" element={<Recent />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trash" element={<Trash />} />
            <Route path="/show" element={<Show />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </div>
      </div>
  );
}

export default App;
