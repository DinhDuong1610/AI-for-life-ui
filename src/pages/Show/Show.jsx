import classNames from "classnames/bind";
import style from "./Show.module.scss";

import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { format } from 'date-fns';

import Modal from "react-modal";

import ItemFolder from "../../components/Item-folder";
import ItemTitle from "../../components/Item-title";
import ItemImage from "../../components/Item-image";
import ItemExcel from "../../components/Item-excel";

const cx = classNames.bind(style);

function Show() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const params = {
    faculty: queryParams.get('faculty'),
    year: queryParams.get('year'),
    clas: queryParams.get('class'),
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
      if(next == 'clas') next = 'class';
      break;
    }
  }

  const [folders, setFolders] = useState([]);
  const [excels, setExcels] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [folderCurrent, setFolderCurrent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  let url = '?'; 
  if(params.faculty) url += `faculty=${params.faculty}`;
  if(params.year) url += `&year=${params.year}`;
  if(params.clas) url += `&class=${params.clas}`;
  if(params.course) url += `&course=${params.course}`;
  if(params.section) url += `&section=${params.section}`;

  console.log(url);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/show" + url);
        setFolders(response.data.folders);
        setExcels(response.data.excels);
        setImages(response.data.images);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchFolders();

    const fetchFolderParent = async () => {
      let requestData = {};

      if (params.faculty) {
        requestData.faculty = params.faculty;
      }
      if (params.year) {
        requestData.year = params.year;
      }
      if (params.clas) {
        requestData.class = params.clas;
      }
      if (params.course) {
        requestData.course = params.course;
      }
      if (params.section) {
        requestData.section = params.section;
      }

      try {
        const response = await axios.post("http://127.0.0.1:8000/api/folder/current", requestData);
        if(response.data.folder) {
          setFolderCurrent(response.data.folder);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchFolderParent();
  }, [folders]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleFolderNameChange = (event) => {
    setNewFolderName(event.target.value);
  };

  const handleCreateFolder = async () => {
    if(!newFolderName) {
      alert('Tên thư mục không thể trống');
      return;
    }
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/folder/store", {
        name: newFolderName,
        parent_id: folderCurrent.id
      });
      setFolders([...folders, response.data.data]);
      setNewFolderName("");
      closeModal();
    } catch (error) {
      setError(error);
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return format(date, 'h:mm a - MMM dd, yyyy');
  };


  const handleFolderClick = (name) => {
    navigate('/show' + url + '&' + next + '=' + name);
    console.log('/show' + url + '&' + next + '=' + name);
  };

  if(loading) {
    return <div>Loading...</div>;
  }

  if(error) {
    return <div>Error: {error.message}</div>;
  }

  return ( 
    <div className={cx('wrapper')}>
      <section className={cx("header")}>
        <input type="text" placeholder="Search" />
        {!params.course && <button onClick={openModal}><i class="fa-solid fa-folder-plus"></i> Add folder</button>}
        {params.course && <button><i class="fa-solid fa-upload"></i> Enter score</button>}
      </section>

      {folders.length > 0 && (
        <section className={cx("folder")}>
          <h3>Folder</h3>
          <ul>
            <li>
              <ItemTitle name="Name" updated_at="Last edited" parent="File size" />
            </li>
            {folders.map((folder) => (
              <li key={folder.id} onClick={() => handleFolderClick(folder.name)}>
                <ItemFolder
                  name={folder.name}
                  updated_at={formatDate(folder.updated_at)}
                  parent={"-"}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {(excels.length > 0 || images.length > 0) && (
        <section className={cx("recently-file")}>
          <h3>Files</h3>
          <ul>
            <li>
              <ItemTitle name="Name" updated_at="Last edited" parent="File size" />
            </li>
            {excels.map((excel) => (
              <li key={excel.id}>
                <ItemExcel
                  name={excel.path}
                  updated_at={formatDate(excel.updated_at)}
                  parent={"-"}
                />
              </li>
            ))}
            <hr></hr>
            {images.map((image) => (
              <li key={image.id}>
                <ItemImage
                  name={image.path}
                  updated_at={formatDate(image.updated_at)}
                  parent={"-"}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Modal thêm thư mục */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Folder"
        ariaHideApp={false}
        className={cx('modal')}
      >
        <h2>Add new folder</h2>
        <input
          type="text"
          value={newFolderName}
          onChange={handleFolderNameChange}
          placeholder="Enter folder name"
        />
        <button onClick={handleCreateFolder}><i class="fa-solid fa-folder-plus"></i> Add</button>
        {/* <button onClick={closeModal}>Cancel</button> */}
      </Modal>
    </div>
  );
}

export default Show;