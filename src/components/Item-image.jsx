import classNames from "classnames/bind";
import style from "./Item-image.module.scss";

const cx = classNames.bind(style);

function ItemImage() {
  return ( 
    <div className={cx("item-image")}>
      <img src="https://images.unsplash.com/photo-1522071820081-009f5f77689e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y29tcHV0ZXJ8ZW58MHx8MHx8&w=1000&q=80" alt="anh" />
    </div>
   );
}

export default ItemImage;