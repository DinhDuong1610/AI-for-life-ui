import classNames from "classnames/bind";
import style from "./Item-image.module.scss";

const cx = classNames.bind(style);

function ItemImage({name, updated_at, parent}) {
  return ( 
    <div className={cx("item-image")}>
        <i class="fa-solid fa-file-image"></i>
        <span className={cx("name")}>{name}</span>
        <span className={cx("updated_at")}>{updated_at}</span>
        {/* <span className={cx("parent")}>{parent}</span> */}
        <span className={cx("parent")}>{parent} <span className={cx("tooltip")}>{name}</span></span>
    </div>
   );
}

export default ItemImage;