import React from "react";
import { useState } from "react";
import { FaUniversity, FaBook, FaUsers, FaChalkboardTeacher } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, Typography, TextField, MenuItem, Select, InputLabel, FormControl, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


import classNames from "classnames/bind";
import style from "./Dashboard.module.scss";

const cx = classNames.bind(style);

function Dashboard() {
  const [filter, setFilter] = useState('');

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
  
  const getWeeks = (data) => {
    let weeks = [];
    for (let i = 0; i < data.length; i += 7) {
      weeks.push(data.slice(i, i + 7));
    }
    return weeks;
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("cards")}>
        <div className={cx("card")}>
          <FaUniversity className={cx("card-icon")} />
          <h3>Faculty</h3>
          <div className={cx("number")}>3</div>
          <div className={cx("subtitle")}>Total faculties</div>
        </div>
  
        <div className={cx("card")}>
          <FaUsers className={cx("card-icon")} />
          <h3>Classes</h3>
          <div className={cx("number")}>15</div>
          <div className={cx("subtitle")}>Total classes</div>
        </div>
  
        <div className={cx("card")}>
          <FaBook className={cx("card-icon")} />
          <h3>Courses</h3>
          <div className={cx("number")}>8</div>
          <div className={cx("subtitle")}>Total courses</div>
        </div>
  
        <div className={cx("card")}>
          <FaChalkboardTeacher className={cx("card-icon")} />
          <h3>Sections</h3>
          <div className={cx("number")}>5</div>
          <div className={cx("subtitle")}>Total sections</div>
        </div>
      </div>
      
    </div>
  );
}

export default Dashboard;
