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
        <h3><b>Recently files</b></h3>
        <ul>
          <li>
            <ItemTitle name="Name" updated_at="Last edited" parent="File size" />
          </li>
          <li className={cx('today')}>
            Today
          </li>
          <li>
            <ItemExcel name="Tiếng anh chuyên ngành 2 (IT) (5) - Học kỳ 2, Năm học 2023-2024 - KHOA KHOA HỌC MÁY TÍNH.xlsx" updated_at={formatDate('2024-11-30 06:24:08')} parent="7.720 MB" />
          </li>
          <li>
            <ItemImage name="TACN2(5)_4.png" updated_at={formatDate('2024-11-30 06:04:01')} parent="123.367 MB" />
          </li>
          <hr></hr>
          <li>
            <ItemExcel name="Lập trình Java (9) - Học kỳ 2, Năm học 2023-2024 - KHOA KHOA HỌC MÁY TÍNH.xlsx" updated_at={formatDate('2024-11-29 21:03:20')} parent="4.797 MB" />
          </li>
          <li>
            <ItemImage name="Java9_4.png" updated_at={formatDate('2024-11-29 21:01:17')} parent="170.939 MB" />
          </li>
        </ul>
      </section>
    </div>
  );
}

export default Recent;