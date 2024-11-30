import classNames from "classnames/bind";
import style from "./Trash.module.scss";

import { format } from "date-fns";

import ItemFolder from "../../components/Item-folder";
import ItemTitle from "../../components/Item-title";
import ItemImage from "../../components/Item-image";
import ItemExcel from "../../components/Item-excel";

const cx = classNames.bind(style);

function Trash() {

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return format(date, 'h:mm a - MMM dd, yyyy');
  };

  return (
    <div className={cx("wrapper")}>
      <section className={cx("header")}>
        <input type="text" placeholder="Search" />
      </section>

      <section className={cx("recently-delete")}>
        <h3>Trash</h3>
        <ul>
          <li>
            <ItemTitle
              name="Name"
              updated_at="Last edited"
              parent="File size"
            />
          </li>
          <li className={cx("today")}>Today</li>
          <hr></hr>
          <li>
            <ItemImage
              name="DACN1(14)_1.png"
              updated_at={formatDate("2024-11-29 23:13:11")}
              parent="137.803 MB"
            />
          </li>
          <li>
            <ItemImage
              name="DACN1(14)_2.png"
              updated_at={formatDate("2024-11-29 23:13:11")}
              parent="140.823 MB"
            />
          </li>
          <li>
            <ItemImage
              name="DACN1(14)_3.png"
              updated_at={formatDate("2024-11-29 23:13:11")}
              parent="120.353 MB"
            />
          </li>
          <li>
            <ItemExcel
              name="Đồ án chuyên ngành 1 (IT) - Hội đồng 14 - MC - Học kỳ 2, Năm học 2023-2024 - KHOA KHOA HỌC MÁY TÍNH.xlsx"
              updated_at={formatDate("2024-11-29 23:13:59")}
              parent="6.555 MB"
            />
          </li>
        </ul>
      </section>
    </div>
  );
}

export default Trash;
