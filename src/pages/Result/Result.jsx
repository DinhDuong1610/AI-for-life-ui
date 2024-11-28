import classNames from "classnames/bind";
import style from "./Result.module.scss";

import * as React from "react";
import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Modal from "react-modal";

const cx = classNames.bind(style);

function Result() {
  const [value, setValue] = useState("1");
  const [isModalOpen, setIsModalOpen] = useState(false); // State để kiểm soát modal
  const [selectedImage, setSelectedImage] = useState(""); // State để lưu ảnh đã chọn trong modal
  const [scale, setScale] = useState(0.9); // State để lưu tỷ lệ phóng to ảnh
  const imageRef = useRef(null); // Dùng ref để tham chiếu đến ảnh trong modal

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const location = useLocation();
  const { imageUrls } = location.state || {}; // Lấy mảng imageUrls từ state

  // Mở modal và set ảnh đã chọn
  const openModal = (url) => {
    setSelectedImage(url);
    setIsModalOpen(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Xử lý sự kiện cuộn chuột để phóng to/thu nhỏ ảnh
  const handleWheel = (event) => {
    event.preventDefault();

    if (event.deltaY < 0) {
      // Cuộn chuột lên (zoom in)
      setScale((prevScale) => Math.min(prevScale + 0.1, 3)); // Giới hạn phóng to tối đa 3x
    } else {
      // Cuộn chuột xuống (zoom out)
      setScale((prevScale) => Math.max(prevScale - 0.1, 1)); // Giới hạn thu nhỏ tối thiểu 1x
    }
  };

  return (
    <div className={cx("wrapper")}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Table detection" value="1" />
            <Tab label="Result" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <div className={cx("image-container")}>
            {imageUrls && imageUrls.length > 0 ? (
              imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={`http://127.0.0.1:5000/${url}`}
                  alt={`Annotated Image ${index}`}
                  onClick={() => openModal(url)} 
                />
              ))
            ) : (
              <p>No annotated images available.</p>
            )}
          </div>
        </TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
      </TabContext>

      {/* Modal hiển thị ảnh */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        ariaHideApp={false}
        className={cx("modal")} // Thêm class tùy chỉnh nếu cần
        overlayClassName={cx("overlay")} // Overlay tùy chỉnh nếu cần
      >
        <div className={cx("modal-content")}>
          <button onClick={closeModal} className={cx("close-btn")}>X</button>
          <img
            src={`http://127.0.0.1:5000/${selectedImage}`}
            alt="Full Screen"
            className={cx("full-screen-image")} // Class để chỉnh style cho ảnh to
            ref={imageRef}
            style={{
              transform: `scale(${scale})`, // Dùng state scale để thay đổi kích thước ảnh
              transition: "transform 0.3s ease", // Thêm hiệu ứng chuyển động khi phóng to
            }}
          />
        </div>
      </Modal>
    </div>
  );
}

export default Result;
