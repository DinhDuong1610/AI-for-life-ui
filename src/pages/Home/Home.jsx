import classNames from "classnames/bind";
import style from "./Home.module.scss";

import ItemFolder from "../../components/Item-folder";
import ItemTitle from "../../components/Item-title";

const cx = classNames.bind(style);

function Home() {
  return (
    <div className={cx("wrapper")}>
      <section className={cx("header")}>
        <input type="text" placeholder="Search" />
        <button><i class="fa-solid fa-folder-plus"></i> Add folder</button>
      </section>

      <section className={cx("suggested-folder")}>
        <h3>Suggested folders</h3>
        <ul>
          <li>Khoa KHMT</li>
          <li>Khoa KTS</li>
          <li>Khoa KTTM & ĐT</li>
        </ul>
      </section>

      <section className={cx("recently-file")}>
        <h3>Recently files</h3>
        <ul>
          <li>
            <ItemTitle name="Name" updated_at="         Last edited         " parent="Location" />
          </li>
          <li>
            <ItemFolder name="Khoá 2023" updated_at="7h30pm - Nov 20, 2024" parent="/Khoa KHMT" />
          </li>
          <li>
            <ItemFolder name="Khoá 2023" updated_at="7h30pm - Nov 20, 2024" parent="/Khoa KHMT" />
          </li>
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

export default Home;
