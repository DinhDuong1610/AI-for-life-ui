import classNames from "classnames/bind";
import style from "./Item-excel.module.scss";

const cx = classNames.bind(style);

function ItemExcel() {
  return ( 
    <div className={cx("item-excel")}>
      <div className={cx("item-excel__title")}>Item Excel</div>
    </div>
  );
}

export default ItemExcel;
