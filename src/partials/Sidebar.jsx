import classNames from "classnames/bind";
import style from './Sidebar.module.scss';

import { Link } from "react-router-dom";

const cx = classNames.bind(style);

function Sidebar() {
  return ( 
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <img src="assets/images/icon_01.png" alt="Logo" />
        <span>VKU</span>
      </div>
      <div className={cx('about')}>
        <span>Welcome <b>Admin</b></span>
      </div>
      <div className={cx('menu')}>
        <ul>
          <li>
            <Link to="/">
              <i class="fa-solid fa-house"></i>
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/recent">
              <i class="fa-solid fa-clock-rotate-left"></i>
              <span>Recent</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard">
              <i class="fa-solid fa-square-poll-vertical"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/trash">
              <i class="fa-solid fa-trash"></i>
              <span>Trash</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;