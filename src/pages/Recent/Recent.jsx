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
        <h3><b>Recently</b></h3>
        <ul>
          <li>
            <ItemTitle name="Name" updated_at="Last edited" parent="File size" />
          </li>
          <li className={cx('today')}>
            Today
          </li>
          <li>
            <ItemFolder name="Đồ án chuyên ngành 3 - Hội đồng 3-SE" updated_at={formatDate('2024-12-28 22:27:23')} parent="" />
          </li>
          <li>
            <ItemFolder name="Tiếng anh chuyên ngành 2 (IT) (1)_GIT" updated_at={formatDate('2024-12-28 20:27:23')} parent="" />
          </li>
          <li>
            <ItemFolder name="Thiết kế web (13)" updated_at={formatDate('2024-12-28 20:20:23')} parent="" />
          </li>
          <hr></hr>
          <li>
            <ItemFolder name="Đồ án chuyên ngành 3 - Hội đồng 5-SE" updated_at={formatDate('2024-12-27 12:17:23')} parent="" />
          </li>
        </ul>
      </section>
    </div>
  );
}

export default Recent;