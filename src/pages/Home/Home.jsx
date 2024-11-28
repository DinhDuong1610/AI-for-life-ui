import classNames from "classnames/bind";
import style from "./Home.module.scss";

import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import format from "date-fns/format";

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
    if (!newFolderName) {
      alert("Tên thư mục không thể trống");
      return;
    }
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/folder/store",
        {
          name: newFolderName,
        }
      );
      setFolders([...folders, response.data.data]);
      setNewFolderName("");
      closeModal();
    } catch (error) {
      setError(error);
    }
  };

  const handleFolderClick = (name) => {
    navigate("/show?faculty=" + name);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return format(date, 'h:mm a - MMM dd, yyyy');
  };

  return (
    <div className={cx("wrapper")}>
      <section className={cx("header")}>
        <input type="text" placeholder="Search" />
        <button onClick={openModal}>
          <i class="fa-solid fa-folder-plus"></i> Add folder
        </button>
      </section>

      <section className={cx("suggested-folder")}>
        <h4>Folders</h4>
        <ul>
          {folders.map((folder) => (
            <li onClick={() => handleFolderClick(folder.name)} key={folder.id}>
              {folder.name}
            </li>
          ))}
        </ul>
      </section>

      <section className={cx("recently-file")}>
        <h4>Recently files</h4>
        <ul>
          <li>
            <ItemTitle
              name="Name"
              updated_at="Last edited"
              parent="File size"
            />
          </li>
          <li>
            <ItemExcel
              name="Thiết kế web (12) - HK2, 2023-2024 - Khoa KHMT"
              updated_at={formatDate("2024-11-28 14:22:39")}
              parent="21.3 MB"
            />
          </li>
          <li>
            <ItemImage
              name="java9_01.jpg"
              updated_at={formatDate("2024-11-27 14:01:39")}
              parent="15.5 MB"
            />
          </li>
          <li>
            <ItemExcel
              name="Lập trình java (6) - HK1, 2023-2024 - Khoa KHMT"
              updated_at={formatDate("2024-11-26 11:02:39")}
              parent="26.5 MB"
            />
          </li>
          <li>
            <ItemImage
              name="anh2.jpg"
              updated_at={formatDate("2024-11-23 10:01:39")}
              parent="11.5 MB"
            />
          </li>
        </ul>
      </section>

      {/* Modal thêm thư mục */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Folder"
        ariaHideApp={false}
        className={cx("modal")}
      >
        <h2>Add new folder</h2>
        <input
          type="text"
          value={newFolderName}
          onChange={handleFolderNameChange}
          placeholder="Enter folder name"
        />
        <button onClick={handleCreateFolder}>
          <i class="fa-solid fa-folder-plus"></i> Add
        </button>
        {/* <button onClick={closeModal}>Cancel</button> */}
      </Modal>
    </div>
  );
}

export default Home;
