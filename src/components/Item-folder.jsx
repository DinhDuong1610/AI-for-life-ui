import classNames from "classnames/bind";
import style from "./Item-folder.module.scss";

const cx = classNames.bind(style);

function ItemFolder() {
  return ( 
    <div className={cx("item-folder")}>
      <p>Folder</p>
    </div>
  );
}

export default ItemFolder;
