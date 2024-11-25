import classNames from "classnames/bind";
import style from './Dashboard.module.scss';

const cx = classNames.bind(style);

function Dashboard() {
  return (  
    <div className={cx('wrapper')}>
      <h1>Dashboard</h1>
    </div>
  );
}

export default Dashboard
