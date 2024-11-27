import classNames from "classnames/bind";
import style from "./Home.module.scss";

import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "react-modal";

import ItemFolder from "../../components/Item-folder";
import ItemTitle from "../../components/Item-title";
import ItemImage from "../../components/Item-image";
import ItemExcel from "../../components/Item-excel";

const cx = classNames.bind(style);

function Home() {
  const navigate = useNavigate();

  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/folders");
        setFolders(response.data.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchFolders();
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
      });
      setFolders([...folders, response.data.data]);
      setNewFolderName("");
      closeModal();
    } catch (error) {
      setError(error);
    }
  };

  const handleFolderClick = (name) => {
    navigate('/show?faculty=' + name);
  };

  if(loading) {
    return <div>Loading...</div>;
  }

  if(error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={cx("wrapper")}>
      <section className={cx("header")}>
        <input type="text" placeholder="Search" />
        <button onClick={openModal}><i class="fa-solid fa-folder-plus"></i> Add folder</button>
      </section>

      <section className={cx("suggested-folder")}>
        <h4>Folders</h4>
        <ul>
          {folders.map((folder => (
            <li onClick={() => handleFolderClick(folder.name)} key={folder.id}>{folder.name}</li>
          )))}
        </ul>
      </section>

      <section className={cx("recently-file")}>
        <h4>Recently files</h4>
        <ul>
          <li>
            <ItemTitle name="Name" updated_at="Last edited" parent="File size" />
          </li>
          <li>
            <ItemImage name="Khoá 2023" updated_at="7h30pm - Nov 20, 2024" parent="-" />
          </li>
          <li>
            <ItemExcel name="Khoá 2023" updated_at="7h30pm - Nov 20, 2024" parent="-" />
          </li>
          <li>
            <ItemExcel name="Khoá 2023" updated_at="7h30pm - Nov 20, 2024" parent="-" />
          </li>
          <li>
            <ItemImage name="Khoá 2023" updated_at="7h30pm - Nov 20, 2024" parent="-" />
          </li>
          <li>
            <ItemImage name="Khoá 2023" updated_at="7h30pm - Nov 20, 2024" parent="-" />
          </li>
          <li>
            <ItemImage name="Khoá 2023" updated_at="7h30pm - Nov 20, 2024" parent="-" />
          </li>
          <li>
            <ItemImage name="Khoá 2023" updated_at="7h30pm - Nov 20, 2024" parent="-" />
          </li>
          
        </ul>
      </section>

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

export default Home;
