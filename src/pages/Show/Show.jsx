import classNames from "classnames/bind";
import style from "./Show.module.scss";

import { useNavigate, useLocation } from "react-router-dom";

import ItemFolder from "../../components/Item-folder";
import ItemTitle from "../../components/Item-title";

const cx = classNames.bind(style);

function Show() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const params = {
    faculty: queryParams.get('faculty'),
    year: queryParams.get('year'),
    clas: queryParams.get('clas'),
    course: queryParams.get('course'),
    section: queryParams.get('section'),
  };
  
  const order = ['faculty', 'year', 'clas', 'course', 'section'];
  
  let current = '';
  let next = '';
  
  for (let i = order.length - 1; i >= 0; i--) {
    if (params[order[i]]) {
      current = order[i];
      next = order[i + 1] || ''; 
      console.log(current);
      break;
    }
  }

  const handleButtonClick = (name) => {
    let url = '/show/?'; 

    if(current === 'faculty') {
      url += `faculty=${params.faculty}&year=${name}`;
    } else if(current === 'year') {
      url += `faculty=${params.faculty}&year=${params.year}&clas=${name}`;
    } else if(current === 'clas') {
      url += `faculty=${params.faculty}&year=${params.year}&clas=${params.clas}&course=${name}`;
    } else if(current === 'course') {
      url += `faculty=${params.faculty}&year=${params.year}&clas=${params.clas}&course=${params.course}&section=${name}`;
    }
    console.log(url);
    navigate(url);
  };

  return ( 
    <div className={cx('wrapper')}>
        <section className={cx("header")}>
        <input type="text" placeholder="Search" />
        <button><i class="fa-solid fa-folder-plus"></i> Add folder</button>
      </section>

      <section className={cx("folders")}>
        <h3>Folders</h3>
        <ul>
          <li>
            <ItemTitle name="Name" updated_at="Last edited" parent="Location" />
          </li>
          <li onClick={handleButtonClick('K23')}>
            <ItemFolder name="Khoá 2023" updated_at="7h30pm - Nov 20, 2024" parent="/Khoa KHMT" />
          </li>
          <li>
            <ItemFolder name="Khoá 2023" updated_at="7h30pm - Nov 20, 2024" parent="/Khoa KHMT" />
          </li>
          <li onClick={handleButtonClick('Java')}>
            <ItemFolder name="Khoá 2023" updated_at="7h30pm - Nov 20, 2024" parent="/Khoa KHMT" />
          </li>
          <li onClick={handleButtonClick('Java(9)')}>
            <ItemFolder name="Khoá 2023" updated_at="7h30pm - Nov 20, 2024" parent="/Khoa KHMT" />
          </li>
          <li onClick={handleButtonClick}>
            <ItemFolder name="Khoá 2023" updated_at="7h30pm - Nov 20, 2024" parent="/Khoa KHMT" />
          </li>
        </ul>
      </section>
    </div>
  );
}

export default Show;