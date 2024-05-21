import React, { useState, useEffect } from "react";
import axios from "axios"; 
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import "./UserAnalytics.css";
import { baseURL } from "../../../Server";
import styles from "../AdminAnalytics.module.scss";

export default function UserAnalytics() {
  const [userData, setUserData] = useState([]);
  const token = localStorage.getItem("login");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/user/users`, {headers: { Authorization: `Bearer ${token}`, credentials: true }});
        console.log("Fetched data:", response.data);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const totalUsers = userData.length || 0;
  const totalClaimants = userData.filter(
    (Users) => Users.roleName === "Claimant"
  ).length;
  const totalInsurers = userData.filter(
    (users) => users.roleName === "Agent"
  ).length;

  const pieChartData = [
    { name: "Claimants", value: totalClaimants },
    { name: "Agents", value: totalInsurers },
  ];

  // const COLORS = ['#FFAFD7', '#DDB8F6','#FFEFBD','#C1F7FD','#8D9CF4'];
  const COLORS = [
    "#F2858E",
    "#252859",
    "#F2275D",
    "#252859",
    "#17A697",
    "#F2A341",
  ];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <>
      <h1 className={styles.title}>User Analytics</h1>

      <div className={styles.chartContainer} style={{ width: "50%" }}>
      <div className={styles.secondaryTitle}>Total Users: {totalUsers}</div>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              dataKey="value"
              data={pieChartData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {pieChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}


