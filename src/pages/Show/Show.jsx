import classNames from "classnames/bind";
import style from "./Show.module.scss";

import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { format, set } from "date-fns";
import { useDropzone } from "react-dropzone";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { Skeleton, Table } from "@mui/material";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Modal from "react-modal";
import { Breadcrumb } from "antd";

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
    faculty: queryParams.get("faculty"),
    year: queryParams.get("year"),
    clas: queryParams.get("class"),
    course: queryParams.get("course"),
    section: queryParams.get("section"),
  };

  const order = ["faculty", "year", "clas", "course", "section"];

  let current = "";
  let next = "";

  for (let i = order.length - 1; i >= 0; i--) {
    if (params[order[i]]) {
      current = order[i];
      next = order[i + 1] || "";
      if (next == "clas") next = "class";
      break;
    }
  }

  const [folders, setFolders] = useState([]);
  const [excels, setExcels] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [folderCurrent, setFolderCurrent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [images_detection, setImagesDetection] = useState([]);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [detectionProgress, setDetectionProgress] = useState(false);

  let url = "?";
  if (params.faculty) url += `faculty=${params.faculty}`;
  if (params.year) url += `&year=${params.year}`;
  if (params.clas) url += `&class=${params.clas}`;
  if (params.course) url += `&course=${params.course}`;
  if (params.section) url += `&section=${params.section}`;

  // console.log(url);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/show" + url
        );
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
        const response = await axios.post(
          "http://127.0.0.1:8000/api/folder/current",
          requestData
        );
        if (response.data.folder) {
          setFolderCurrent(response.data.folder);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchFolderParent();

  }, [current]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

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
          parent_id: folderCurrent.id,
        }
      );
      setFolders([...folders, response.data.data]);
      setNewFolderName("");
      closeModal();
    } catch (error) {
      setError(error);
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return format(date, "h:mm a - MMM dd, yyyy");
  };

  const handleFolderClick = (name) => {
    navigate("/show" + url + "&" + next + "=" + name);
    console.log("/show" + url + "&" + next + "=" + name);
  };

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const openUploadModal = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);

  const onDrop = (acceptedFiles) => {
    setSelectedFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*", // Chỉ chấp nhận file ảnh
    multiple: true, // Cho phép tải lên nhiều file ảnh cùng lúc
  });

  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (folderCurrent && folderCurrent.id) {
      const fetchStudents = async (folderId) => {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/students?folder_id=${folderId}`
          );
          setStudents(response.data.data);
          console.log(response.data.data);
        } catch (err) {
          setError("Lỗi khi tải danh sách sinh viên!");
        } finally {
          setLoading(false);
        }
      };

      fetchStudents(folderCurrent.id);
    }
  }, [folderCurrent]);

  const data_score = [];

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select images to upload.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file); // Gửi mỗi file dưới tên "files[]"
    });

    setDetectionProgress(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Cấu hình header cho FormData
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent); // Cập nhật tiến trình upload
            setDetectionProgress(true);
          },
        }
      );

      const res = response.data.data;
      console.log(res); // Xử lý kết quả trả về

      const imageDetections = [];

      res.forEach((item) => {
        const image_detection = "http://127.0.0.1:5000" + item.image;
        console.log(image_detection);
        imageDetections.push(image_detection);

        const students = item.list; // Access the list of students
        students.forEach((student) => {
          let msv = student[0]?.text; // First element is the student code
          let score = student[1]?.text; // Second element is the total score
          let acc = student[1]?.is_match; // Get is_match from the second item

          if (msv) {
            msv = msv
              .replace(/O/g, "0")
              .replace(/S/g, "5")
              .replace(/1T/g, "IT");
            msv = msv.slice(0, 2) + 'IT' + msv.slice(4);
          }
          if (score) {
            score = score.replace(/O/g, "0").replace(/S/g, "5");
          }

          if (msv) {
            data_score.push({
              msv,
              score,
              acc,
            });
          }
        });
      });

      setImagesDetection(imageDetections);

      console.log(data_score);

      data_score.forEach(({ msv, score, acc }) => {
        const input = document.getElementById(msv); // Lấy ô nhập liệu bằng msv làm ID
        if (input) {
          input.value = score; // Cập nhật giá trị của ô nhập liệu thành score
          handleScoreChange(msv, score);
          if (!acc) {
            input.style.backgroundColor = "yellow"; // Đổi màu nền nếu acc là false
          } else {
            input.style.backgroundColor = "white"; // Khôi phục màu nền nếu acc là true
          }
        }
      });

      setDetectionProgress(false);
      setUploadProgress(0); // Reset tiến trình upload sau khi hoàn tất
      setSelectedFiles([]); // Reset files đã chọn
      closeUploadModal();

      // Bạn có thể xử lý kết quả trả về ở đây, ví dụ: lưu ảnh vào state hoặc hiển thị
    } catch (error) {
      setError("Failed to upload images.");
      setUploadProgress(0);
      setDetectionProgress(false);
    }
  };

  const handleScoreChange = (msv, newScore) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.msv === msv ? { ...student, score: newScore } : student
      )
    );
  };

  const handleSave = async () => {
    const studentsData = students.map((student) => ({
      msv: student.msv,
      score: student.score,
    }));

    console.log(studentsData);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/student/updateMultiple",
        {
          students: studentsData,
        }
      );

      if (response.data.message) {
        // setAlertMessage(response.data.message);
        // setAlertSeverity("success");
        resetInputBackgrounds();
        toast.success(response.data.message);
      }
    } catch (error) {
      // setAlertMessage("Failed to update scores.");
      // setAlertSeverity("error");
      toast.error("Failed to update scores.");
    }
  };

  const resetInputBackgrounds = () => {
    const inputs = document.querySelectorAll("table input[type='text']");
    inputs.forEach(input => {
        input.style.backgroundColor = "#E2E2E2"; // Thiết lập màu nền
    });
  };

  const openResultModal = () => setIsResultModalOpen(true);
  const closeResultModal = () => setIsResultModalOpen(false);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={cx("wrapper")}>
      {alertMessage && (
        <Alert severity={alertSeverity} onClose={() => setAlertMessage("")}>
          {alertMessage}
        </Alert>
      )}

      <div className={cx("detection-progress")}>
        {detectionProgress && <LinearProgress color="success" />}
      </div>

      <div className={cx("upload-progress")}>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <LinearProgress variant="determinate" value={uploadProgress} />
        )}
      </div>

      <section className={cx("header")}>
        {params.section && (
          <>
            <button onClick={openUploadModal}>
              <i className="fa-solid fa-upload"></i> Enter score
            </button>
          </>
        )}

        <input type="text" placeholder="Search" />

        {!params.section && (
          <button onClick={openModal}>
            <i class="fa-solid fa-folder-plus"></i> Add folder
          </button>
        )}

        {params.section && (
          <button onClick={handleSave}>
            <i class="fa-solid fa-floppy-disk"></i> Save
          </button>
        )}

        {images_detection.length > 0 && (
          <button onClick={openResultModal} className={cx("result-button")}>
            <i class="fa-solid fa-square-poll-horizontal"></i>
          </button>
        )}
      </section>

      <div className={cx("breadcrumb")}>
        <Breadcrumb
          items={[
            params.faculty && {
              title: params.faculty,
              href: `?faculty=${params.faculty}`,
            },
            params.year && {
              title: params.year,
              href: `?faculty=${params.faculty}&year=${params.year}`,
            },
            params.clas && {
              title: params.clas,
              href: `?faculty=${params.faculty}&year=${params.year}&class=${params.clas}`,
            },
            params.course && {
              title: params.course,
              href: `?faculty=${params.faculty}&year=${params.year}&class=${params.clas}&course=${params.course}`,
            },
            params.section && {
              title: params.section,
              href: `?faculty=${params.faculty}&year=${params.year}&class=${params.clas}&course=${params.course}&section=${params.section}`,
            },
            // folderCurrent && { title: folderCurrent.name, href: '#' },
          ].filter(Boolean)}
        />
      </div>

      {/* {loading && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "left",
            alignItems: "start",
            height: "100%",
            width: "100%",
            gap: 5,
          }}
        >
          <Skeleton variant="text" width={1000} height={60} />
          <Skeleton variant="rounded" width={300} height={300} />
          <Skeleton variant="rounded" width={300} height={300} />
          <Skeleton variant="rounded" width={300} height={300} />
        </Box>
      )} */}

      {folders.length > 0 && (
        <section className={cx("folders")}>
          <h4>Folders</h4>
          <ul>
            <li>
              <ItemTitle
                name="Name"
                updated_at="Last edited"
                parent="File size"
              />
            </li>
            {folders.map((folder) => (
              <li
                key={folder.id}
                onClick={() => handleFolderClick(folder.name)}
              >
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

      <div>
        {students.length > 0 ? (
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Mã sinh viên</th>
                <th>Họ</th>
                <th>Tên</th>
                <th>Ngày sinh</th>
                <th>Email</th>
                <th>Lớp</th>
                <th>Điểm</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.msv}>
                  <td>{index + 1}</td>
                  <td>{student.msv}</td>
                  <td>{student.last_name}</td>
                  <td>{student.first_name}</td>
                  <td>{student.birth}</td>
                  <td>{student.email}</td>
                  <td>{student.sc_class}</td>
                  {/* <td id={student.msv} className="fw-bold">{student.score}</td> */}
                  <td className="text-center" style={{ width: "100px" }}>
                    <input
                      type="text"
                      value={student.score}
                      id={student.msv}
                      className="fw-bold w-100 text-center"
                      style={{ backgroundColor: "#E2E2E2" }}
                      onChange={(e) =>
                        handleScoreChange(student.msv, e.target.value)
                      }
                    />
                  </td>
                  <td>{student.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p></p>
        )}
      </div>

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

      {/* Modal thêm ảnh (Enter score) */}
      <Modal
        isOpen={isUploadModalOpen}
        onRequestClose={closeUploadModal}
        contentLabel="Upload Images"
        ariaHideApp={false}
        className={cx("modal")}
      >
        <h2>Upload Images for Score</h2>

        {/* Dropzone để tải lên ảnh */}
        <div {...getRootProps()} className={cx("dropzone")}>
          <input {...getInputProps()} />
          <p className="mb-0">Drag & drop images here</p>
          <div className="text-center">
            <span>or</span>{" "}
            <b className="text-primary" style={{ cursor: "pointer" }}>
              Choose Images
            </b>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div>
            <h3>Selected Images:</h3>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Nút upload */}
        <button
          className={cx("upload-button", "mt-3")}
          onClick={handleUpload} // Gọi hàm handleUpload khi nhấn nút
        >
          Upload
        </button>
      </Modal>

      {/* Modal hiển thị danh sách ảnh */}
      <Modal
        isOpen={isResultModalOpen}
        onRequestClose={closeResultModal}
        contentLabel="Image Results"
        ariaHideApp={false}
        style={{ width: "1200px" }}
        className={cx("modal")}
      >
        <h2>Image Detection Results</h2>
        <div style={{ maxHeight: "800px", overflowY: "auto", width: "1200px" }}>
          {images_detection.length > 0 ? (
            <ul>
              {images_detection.map((image, index) => (
                <li key={index}>
                  <img
                    src={image}
                    alt={`Result ${index}`}
                    style={{
                      width: "100%",
                      maxHeight: "800px",
                      objectFit: "contain",
                    }}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>No images detected.</p>
          )}
        </div>
      </Modal>

      <ToastContainer 
            position="top-center" // Vị trí hiển thị toast
            autoClose={3000} // Thời gian tự động biến mất (5000ms)
            hideProgressBar={false} // Hiện thanh tiến trình
            newestOnTop={false} // Hiện các toast mới nhất ở dưới
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
    </div>
  );
}

export default Show;
