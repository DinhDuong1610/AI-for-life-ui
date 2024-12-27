import React from "react";
import { useState } from "react";
import ItemFolder from "../../components/Item-folder";
import format from "date-fns/format";
import {
  FaUniversity,
  FaBook,
  FaUsers,
  FaChalkboardTeacher,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";

import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { dataDashboard, valueFormatter } from "../Dashboard/Datachart";

import classNames from "classnames/bind";
import style from "./Dashboard.module.scss";

const cx = classNames.bind(style);

function Dashboard() {
  const [filter, setFilter] = useState("");

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

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return format(date, "h:mm a - MMM dd, yyyy");
  };

  const size = {
    width: 400,
    height: 400,
  };
  
  const data = {
    data: dataDashboard,
    valueFormatter,
  };

  const colors = ["#36A2EB", "#FFCE56", "#FF6384"];

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
          <div className={cx("number")}>5</div>
          <div className={cx("subtitle")}>Total classes</div>
        </div>

        <div className={cx("card")}>
          <FaBook className={cx("card-icon")} />
          <h3>Courses</h3>
          <div className={cx("number")}>4</div>
          <div className={cx("subtitle")}>Total courses</div>
        </div>

        <div className={cx("card")}>
          <FaChalkboardTeacher className={cx("card-icon")} />
          <h3>Sections</h3>
          <div className={cx("number")}>11</div>
          <div className={cx("subtitle")}>Total sections</div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-8">
          <Timeline
            sx={{
              [`& .${timelineOppositeContentClasses.root}`]: {
                flex: 0.2,
                textAlign: "center",
                paddingLeft: 0,
                marginLeft: 0,
                marginBottom: 5,
              },
            }}
          >
            <TimelineItem>
              <TimelineOppositeContent color="textSecondary">
                {formatDate("2024-12-28 22:27:23")}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <ItemFolder
                  name="Đồ án chuyên ngành 3 - Hội đồng 3-SE"
                  updated_at="."
                  parent=""
                />
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineOppositeContent color="textSecondary">
                {formatDate("2024-12-28 20:27:23")}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <ItemFolder
                  name="Tiếng anh chuyên ngành 2 (IT) (1)_GIT"
                  updated_at="."
                  parent=""
                />
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineOppositeContent color="textSecondary">
                {formatDate("2024-12-28 20:20:23")}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <ItemFolder name="Thiết kế web (13)" updated_at="." parent="" />
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineOppositeContent color="textSecondary">
                {formatDate("2024-12-27 12:17:23")}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
              </TimelineSeparator>
              <TimelineContent>
                <ItemFolder
                  name="Đồ án chuyên ngành 3 - Hội đồng 5-SE"
                  updated_at="."
                  parent=""
                />
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </div>

        <div className="col-md-4">
          <PieChart
            series={[
              {
                arcLabel: (item) => `${item.value}%`,
                arcLabelMinAngle: 35,
                arcLabelRadius: "60%",
                ...data,
              },
            ]}
            colors={colors}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fontWeight: "bold",
              },
            }}
            {...size}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
