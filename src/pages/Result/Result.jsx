import classNames from "classnames/bind";
import style from "./Result.module.scss";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Modal from "react-modal";
import axios from "axios";
import * as XLSX from "xlsx";

const cx = classNames.bind(style);

function Result() {
  const [value, setValue] = useState("1");
  const [isModalOpen, setIsModalOpen] = useState(false); // State để kiểm soát modal
  const [selectedImage, setSelectedImage] = useState(""); // State để lưu ảnh đã chọn trong modal
  const [scale, setScale] = useState(0.9); // State để lưu tỷ lệ phóng to ảnh
  const imageRef = useRef(null); // Dùng ref để tham chiếu đến ảnh trong modal
  const [excelData, setExcelData] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const location = useLocation();
  const { imageUrls, excelUrl } = location.state || {}; // Lấy mảng imageUrls từ state
  const [colors, setColors] = useState([]); // Thêm state để lưu màu sắc các ô


  useEffect(() => {
    const fetchExcel = async () => {
      try {
        // Tải file Excel từ server
        console.log(excelUrl);
        const response = await axios.get(excelUrl, {
          responseType: "arraybuffer",
        });
  
        // Đọc file Excel từ buffer
        const data = new Uint8Array(response.data);
        const workbook = XLSX.read(data, { type: "array" });
  
        // Giả sử bạn chỉ cần sheet đầu tiên
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Đọc dữ liệu và màu sắc của từng ô
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Lấy màu của từng ô (dựng đối tượng color cho mỗi cell)
        const newColors = [];
        for (let rowIndex = 0; rowIndex < jsonData.length; rowIndex++) {
          const row = jsonData[rowIndex];
          const rowColors = [];
          for (let colIndex = 0; colIndex < row.length; colIndex++) {
            const cell = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: colIndex })]; // Lấy cell bằng tọa độ (row, col)
            const cellColor = cell && cell.s && cell.s.fill ? cell.s.fill.fgColor : null; // Lấy màu nền
            rowColors.push(cellColor ? cellColor.rgb : null); // Nếu có màu thì lấy mã màu hex (RGB)
          }
          newColors.push(rowColors);
        }
  
        // Lưu dữ liệu và màu vào state
        setExcelData(jsonData);
        setColors(newColors); // Cập nhật màu sắc vào state
      } catch (error) {
        setError("Failed to fetch or parse Excel file.");
      }
    };
  
    fetchExcel();
  }, [excelUrl]);
  
  

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
        <TabPanel value="2">
          <div>
          {excelData ? (
  <div className="table-container">
    <table>
      <thead>
        <tr>
          {excelData[0].map((header, index) => (
            <td key={index}>{header}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        {excelData.slice(1).map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td
                key={colIndex}
                style={{
                  backgroundColor: colors[rowIndex]?.[colIndex] || "transparent", // Áp dụng màu nền từ colors
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <p>Loading Excel data...</p>
)}

          </div>
        </TabPanel>
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
          <button onClick={closeModal} className={cx("close-btn")}>
            X
          </button>
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
