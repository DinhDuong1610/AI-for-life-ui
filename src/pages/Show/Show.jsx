import classNames from "classnames/bind";
import style from "./Show.module.scss";

import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { format, set } from 'date-fns';
import { useDropzone } from 'react-dropzone';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { Skeleton } from "@mui/material";

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
  }, [current]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

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

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); 

  const openUploadModal = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);

  const onDrop = (acceptedFiles) => {
    setSelectedFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*', // Chỉ chấp nhận file ảnh
    multiple: true // Cho phép tải lên nhiều file ảnh cùng lúc
  });

  const [uploadProgress, setUploadProgress] = useState(0);

  // Hàm gửi ảnh lên server
  // const handleUploadImages = async () => {
  //   const formData = new FormData();

  //   // Thêm tất cả các file vào formData
  //   selectedFiles.forEach(file => {
  //     formData.append('image[]', file);
  //     formData.append('name[]', file.name);
  //   });

  //     // Thêm folder_id vào formData
  //   if (folderCurrent && folderCurrent.id) {
  //     formData.append("folder_id", folderCurrent.id);
  //   } else {
  //     alert("Folder ID is required.");
  //     return;
  //   }

  //   try {
  //     const response = await axios.post('http://127.0.0.1:8000/api/image/store', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //       onUploadProgress: (progressEvent) => {
  //         const percentCompleted = Math.round((progressEvent.loaded * 200) / progressEvent.total);
  //         setUploadProgress(percentCompleted);
  //       },
  //     });
      
  //     // Kiểm tra phản hồi từ API và đóng modal
  //     if (response.data) {
  //       closeUploadModal(); // Đóng modal sau khi upload thành công
  //       setUploadProgress(0);
  //       handleResult();
  //     } else {
  //       setAlertMessage("Upload failed!");
  //       setAlertSeverity("error");
  //       closeUploadModal();
  //     }
  //     setSelectedFiles([]);
  //   } catch (error) {
  //     setAlertMessage("Upload failed!");
  //     setAlertSeverity("error");
  //   }
  // };

  const handleUploadImages = async () => {
    // Kiểm tra xem folderCurrent có hợp lệ không
    if (!folderCurrent || !folderCurrent.id) {
      alert("Folder ID is required.");
      return;
    }
  
    try {
      // Duyệt qua từng file trong selectedFiles và gửi từng file lên API
      for (const file of selectedFiles) {
        const formData = new FormData();
  
        // Thêm file và tên file vào formData
        formData.append('image', file);
        formData.append('name', file.name);
  
        // Thêm folder_id vào formData
        formData.append("folder_id", folderCurrent.id);
        formData.append("size", file.size);
  
        // Gửi yêu cầu API cho từng file
        const response = await axios.post('http://127.0.0.1:8000/api/image/store', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          },
        });
  
        // Kiểm tra phản hồi từ API sau mỗi lần upload
        if (response.data) {
          // Nếu upload thành công, có thể làm gì đó với dữ liệu
          console.log(`File ${file.name} uploaded successfully`);
        } else {
          // Nếu upload thất bại
          setAlertMessage(`Upload failed for file: ${file.name}`);
          setAlertSeverity("error");
          break; // Dừng vòng lặp nếu một file upload thất bại
        }
      }
  
      // Đóng modal và reset trạng thái sau khi hoàn thành tất cả
      closeUploadModal();
      setUploadProgress(100);
      handleResult();
  
      // Xóa danh sách file đã chọn
      setSelectedFiles([]);
  
    } catch (error) {
      // Xử lý lỗi nếu có
      setAlertMessage("Upload failed!");
      setAlertSeverity("error");
    }
  };

  let excelUrl = '';
  
  // Hàm tải file từ API và tạo đối tượng File
  const downloadAndCreateFile = async (url_download, excel_name) => {
    try {
      // Gọi API để lấy file dưới dạng blob (binary data)
      const response = await axios.get(url_download, {
        responseType: 'blob' // Đảm bảo phản hồi là blob
      });

      // Tạo đối tượng File từ Blob nhận được
      const excel = new File([response.data], excel_name, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      console.log(excel);
      // Lưu file vào state (hoặc bạn có thể xử lý trực tiếp ở đây)
      setExcelData(excel);
      // console.log(excelData);

      // Gọi hàm upload file lên API
      processExcelFile(excel);

    } catch (error) {
      console.error('Lỗi khi tải file:', error);
    }
  };

  // Hàm gửi file lên API
  const processExcelFile = async (excel) => {
    if (!excel) {
      console.error("Excel file data is missing!");
      return;
    }
    console.log(excel);
    try {
      // Tạo đối tượng FormData để gửi file
      const formData = new FormData();
      formData.append('excel', excel); // Đưa file vào formData
      formData.append('folder_id', folderCurrent.id);
      formData.append('name', excel.name);
      formData.append('size', excel.size);

      console.log( 'formData: ',formData);

      // Gửi file lên API (cập nhật URL API theo yêu cầu)
      const response = await axios.post('http://127.0.0.1:8000/api/excel/store', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // excelUrl = 'http://localhost:8000/storage/' + response.data.excel.path;

      // Xử lý phản hồi từ API
      console.log('Dữ liệu đã được gửi thành công:', response.data);
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu lên API:', error);
    }
  };

  const fetchExcel = async (url, name) => {
    try {
      const fileUrl = "http://127.0.0.1:8000/storage/" + url;
      
      // Tạo thẻ <a> và kích hoạt download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = name; // Lấy tên file từ đường dẫn
      document.body.appendChild(link);
      link.click(); // Kích hoạt download
      document.body.removeChild(link);
    } catch (error) {
      setError(error);
    }
  };

  const [detectionProgress, setDetectionProgress] = useState(false);
  const [excelData, setExcelData] = useState(null);

  const handleResult = async () => {
    const formData = new FormData();

    // Thêm tất cả các file vào formData
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    console.log(formData);

    try {
      setDetectionProgress(true);

      const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          
          setDetectionProgress(true);
        },
      });
      
      console.log(response);

      if (response.data && response.data.annotated_images) {
        // console.log(response.data.download_url);
        // console.log(response.data.title_results[0][1].ocr_text);
        // console.log(response.data.title_results[0][0].ocr_text);
        // console.log(response.data.title_results[0][2].ocr_text);
        
        const title_khoa = response.data.title_results[0][0].ocr_text;
        const title_lop = response.data.title_results[0][1].ocr_text;
        const title_nam = response.data.title_results[0][2].ocr_text;
        
        const excel_name = title_lop + ' - ' + title_nam + ' - ' + title_khoa + '.xlsx';
        
        downloadAndCreateFile('http://127.0.0.1:5000' + response.data.download_url, excel_name);
        // Lưu các URL của annotated images vào một mảng
        const imageUrls = response.data.annotated_images.map(image => image.url);
        excelUrl = 'http://127.0.0.1:5000/' + response.data.download_url;
        setDetectionProgress(false);

        console.log('excelUrl: ', excelUrl);
        // Chuyển hướng đến trang '/result' và truyền mảng imageUrls qua state
        navigate('/result', { state: { imageUrls, excelUrl } });
      } else {
        alert('Result failed!');
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert('Error resulting');
    }
  };

  if(error) {
    return <div>Error: {error.message}</div>;
  }

  return ( 
    <div className={cx('wrapper')}>
      <div className={cx("detection-progress")}>
        {detectionProgress && (
          <LinearProgress color="success"/>
        )}
      </div>

      <div className={cx("upload-progress")}>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <LinearProgress variant="determinate" value={uploadProgress} />
          )}
      </div>

      <section className={cx("header")}>
        <input type="text" placeholder="Search" />
        {!params.section && <button onClick={openModal}><i class="fa-solid fa-folder-plus"></i> Add folder</button>}
        {params.section && (
          <button onClick={openUploadModal}><i className="fa-solid fa-upload"></i> Enter score</button>
        )}
      </section>

      <div className={cx("breadcrumb")}>
        <Breadcrumb
          items={[
            params.faculty && { title: params.faculty, href: `?faculty=${params.faculty}` },
            params.year && { title: params.year, href: `?faculty=${params.faculty}&year=${params.year}` },
            params.clas && { title: params.clas, href: `?faculty=${params.faculty}&year=${params.year}&class=${params.clas}` },
            params.course && { title: params.course, href: `?faculty=${params.faculty}&year=${params.year}&class=${params.clas}&course=${params.course}` },
            params.section && { title: params.section, href: `?faculty=${params.faculty}&year=${params.year}&class=${params.clas}&course=${params.course}&section=${params.section}` },
            // folderCurrent && { title: folderCurrent.name, href: '#' }, 
          ].filter(Boolean)}
        />
      </div>

      {
        loading && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'left', alignItems: 'start', height: '100%', width: '100%', gap: 5 }}>
            <Skeleton variant="text" width={1000} height={60} />
            <Skeleton variant="rounded" width={300} height={300}/>
            <Skeleton variant="rounded" width={300} height={300}/>
            <Skeleton variant="rounded" width={300} height={300}/>
          </Box>
        )
      }

      {folders.length > 0 && (
        <section className={cx("folders")}>
          <h4>Folders</h4>
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
              <li key={excel.id} onClick={() => fetchExcel(excel.path, excel.name)}>
                <ItemExcel
                  name={excel.name}
                  updated_at={formatDate(excel.updated_at)}
                  parent={excel.size/1000 + " MB"}
                />
                {console.log('http://localhost:8000/storage/' + excel.path)}
              </li>
            ))}
            {/* <li>
                <ItemExcel
                  name={"Thiết kế web (13) - HK2, 2023-2024 - Khoa KHMT"}
                  updated_at={formatDate('2024-11-28 00:22:39')}
                  parent={"15.7 MB"}
                />
              </li> */}
            <hr></hr>
            <div className={cx("images")}>
              {images.map((image) => (
                <li key={image.id}>
                  {/* <ItemImage
                    name={image.path}
                    updated_at={formatDate(image.updated_at)}
                    parent={"-"}
                  /> */}
                  <img alt=">_<" src={`http://127.0.0.1:8000/storage/${image.path}`}></img>
                  <span className={cx("tooltip")}>{image.name}</span>
                </li>
              ))}
            </div>
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


       {/* Modal thêm ảnh (Enter score) */}
       <Modal
        isOpen={isUploadModalOpen}
        onRequestClose={closeUploadModal}
        contentLabel="Upload Images"
        ariaHideApp={false}
        className={cx('modal')}
      >

        <h2>Upload Images for Score</h2>

        {/* Dropzone để tải lên ảnh */}
        <div {...getRootProps()} className={cx('dropzone')}>
          <input {...getInputProps()} />
          <p className="mb-0">Drag & drop images here</p>
          <div className="text-center"><span>or</span> <b className="text-primary" style={{cursor: 'pointer'}}>Choose Images</b></div>
        </div>

        <div className={cx('file-list')}>
          {selectedFiles.length > 0 && (
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        <button onClick={handleUploadImages} className={cx('upload-button', 'mt-3')}>
          Upload
        </button>
      </Modal>
    </div>
  );
}

export default Show;