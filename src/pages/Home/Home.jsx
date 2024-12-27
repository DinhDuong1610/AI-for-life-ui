import classNames from "classnames/bind";
import style from "./Home.module.scss";

import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import format from "date-fns/format";
import { useDropzone } from "react-dropzone";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { Skeleton } from "@mui/material";

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
        <ul>
          {folders.map((folder) => (
            <li onClick={() => handleFolderClick(folder.name)} key={folder.id}>
              {folder.name}
            </li>
          ))}
        </ul>
        {
        loading && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'left', alignItems: 'start', height: '100%', width: '100%', gap: 5 }}>
            {/* <Skeleton variant="text" width={1000} height={60} /> */}
            <Skeleton variant="rounded" width={320} height={100}/>
            <Skeleton variant="rounded" width={320} height={100}/>
            <Skeleton variant="rounded" width={320} height={100}/>
          </Box>
        )
      }
      </section>

      <section className={cx("recently-file")}>
        <h4>Recently </h4>
        <ul>
          <li>
            <ItemTitle name="Name" updated_at="Last edited" parent="File size" />
          </li>
          <li>
            <ItemFolder name="Đồ án chuyên ngành 3 - Hội đồng 3-SE" updated_at={formatDate('2024-12-28 22:27:23')} parent="" />
          </li>
          <li>
            <ItemFolder name="Tiếng anh chuyên ngành 2 (IT) (1)_GIT" updated_at={formatDate('2024-12-28 20:27:23')} parent="" />
          </li>
          <li>
            <ItemFolder name="Thiết kế web (13)" updated_at={formatDate('2024-12-28 20:20:23')} parent="" />
          </li>
          <li>
            <ItemFolder name="Đồ án chuyên ngành 3 - Hội đồng 5-SE" updated_at={formatDate('2024-12-27 12:17:23')} parent="" />
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
