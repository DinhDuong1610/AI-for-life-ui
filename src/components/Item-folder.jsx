import classNames from "classnames/bind";
import style from "./Item-folder.module.scss";

const cx = classNames.bind(style);

function ItemFolder({name, updated_at, parent}) {
  return ( 
    <div className={cx("item-folder")}>
      <i class="fa-solid fa-folder"></i>
      <span className={cx("name")}>{name}</span>
      <span className={cx("updated_at")}>{updated_at}</span>
      <span className={cx("parent")}>{parent}</span>
    </div>
  );
}

export default ItemFolder;
