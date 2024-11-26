import classNames from "classnames/bind";
import style from './Recent.module.scss';

import ItemFolder from "../../components/Item-folder";
import ItemTitle from "../../components/Item-title";

const cx = classNames.bind(style);

function Recent() {
  return ( 
    <div className={cx('wrapper')}>
      <section className={cx("header")}>
        <input type="text" placeholder="Search" />
      </section>

      <section className={cx("recently-file")}>
        <h3>Recently files</h3>
        <ul>
          <li>
            <ItemTitle name="Name" updated_at="Last edited" parent="Location" />
          </li>
          <li className={cx('today')}>
            Today
          </li>
          <li>
            <ItemFolder name="Khoá 2023" updated_at="7h30pm - Nov 20, 2024" parent="/Khoa KHMT" />
          </li>
          <li>
            <ItemFolder name="Khoá 2023" updated_at="7h30pm - Nov 20, 2024" parent="/Khoa KHMT" />
          </li>
          <hr></hr>
          <li>
            <ItemFolder name="Khoá 2023" updated_at="7h30pm - Nov 20, 2024" parent="/Khoa KHMT" />
          </li>
          <li>
            <ItemFolder name="Khoá 2023" updated_at="7h30pm - Nov 20, 2024" parent="/Khoa KHMT" />
          </li>
          <li>
            <ItemFolder name="Khoá 2023" updated_at="7h30pm - Nov 20, 2024" parent="/Khoa KHMT" />
          </li>
        </ul>
      </section>
    </div>
  );
}

export default Recent;