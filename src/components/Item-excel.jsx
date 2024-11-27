import classNames from "classnames/bind";
import style from "./Item-excel.module.scss";

const cx = classNames.bind(style);

function ItemExcel({name, updated_at, parent}) {
  return ( 
    <div className={cx("item-excel")}>
        <i class="fa-solid fa-file-excel"></i>
        <span className={cx("name")}>{name}</span>
        <span className={cx("updated_at")}>{updated_at}</span>
        <span className={cx("parent")}>{parent}</span>
    </div>
  );
}

export default ItemExcel;
