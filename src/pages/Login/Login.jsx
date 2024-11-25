import classNames from "classnames/bind";
import style from "./Login.module.scss";

const cx = classNames.bind(style);

function Login() {
  return ( 
    <div className={cx('wrapper')}>
      <h1>Login</h1>
    </div>
   );
}

export default Login;