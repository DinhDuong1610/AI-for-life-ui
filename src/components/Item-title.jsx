import classNames from "classnames/bind";
import style from "./Item-title.module.scss";

const cx = classNames.bind(style);

function ItemTitle({name, updated_at, parent}) {
  return ( 
    <div className={cx("item-title")}>
      <i class="fa-solid fa-folder"></i>
      <span className={cx("name")}>{name}</span>
      <span className={cx("updated_at")}>{updated_at}</span>
      <span className={cx("parent")}>{parent}</span>
    </div>
  );
}

export default ItemTitle;