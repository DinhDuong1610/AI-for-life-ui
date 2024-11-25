import classNames from "classnames/bind";
import style from './Trash.module.scss';

const cx = classNames.bind(style);

function Trash() {
  return ( 
    <div className={cx('wrapper')}>
      <h1>Trash</h1>
    </div>
  );
}

export default Trash;