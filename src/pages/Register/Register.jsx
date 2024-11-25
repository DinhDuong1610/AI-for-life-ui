import classNames from "classnames/bind";
import style from "./Register.module.scss";

const cx = classNames.bind(style);

function Register() {
  return ( 
    <div className={cx('wrapper')}>
      <h1>Register</h1>
    </div>
   );
}

export default Register;