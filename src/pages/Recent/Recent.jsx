import classNames from "classnames/bind";
import style from './Recent.module.scss';

import { format } from 'date-fns';

import ItemFolder from "../../components/Item-folder";
import ItemTitle from "../../components/Item-title";
import ItemImage from "../../components/Item-image";
import ItemExcel from "../../components/Item-excel";

const cx = classNames.bind(style);

function Recent() {
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return format(date, 'h:mm a - MMM dd, yyyy');
  };

  return ( 
    <div className={cx('wrapper')}>
      <section className={cx("header")}>
        <input type="text" placeholder="Search" />
      </section>

      <section className={cx("recently-file")}>
        <h3>Recently files</h3>
        <ul>
          <li>
            <ItemTitle name="Name" updated_at="Last edited" parent="File size" />
          </li>
          <li className={cx('today')}>
            Today
          </li>
          <li>
            <ItemExcel name="Thiết kế web (12) - HK2, 2023-2024 - Khoa KHMT" updated_at={formatDate('2024-11-28 14:22:39')} parent="21.3 MB" />
          </li>
          <li>
            <ItemImage name="java9_01.jpg" updated_at={formatDate('2024-11-27 14:01:39')} parent="15.5 MB" />
          </li>
          <hr></hr>
          <li>
            <ItemExcel name="Lập trình java (6) - HK1, 2023-2024 - Khoa KHMT" updated_at={formatDate('2024-11-26 11:02:39')} parent="26.5 MB" />
          </li>
          <li>
            <ItemImage name="anh2.jpg" updated_at={formatDate('2024-11-23 10:01:39')} parent="11.5 MB" />
          </li>
        </ul>
      </section>
    </div>
  );
}

export default Recent;