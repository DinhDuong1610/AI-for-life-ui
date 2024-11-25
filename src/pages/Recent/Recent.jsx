import classNames from "classnames/bind";
import style from './Recent.module.scss';

const cx = classNames.bind(style);

function Recent() {
  return ( 
    <div className={cx('wrapper')}>
      Recent
    </div>
  );
}

export default Recent;