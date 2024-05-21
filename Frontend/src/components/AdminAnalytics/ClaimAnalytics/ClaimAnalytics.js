import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Label,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { baseURL } from "../../../Server";
import styles from "../AdminAnalytics.module.scss";

const getStatusString = (statusCode) => {
  switch (statusCode) {
    case 1:
      return "Pending";
    case 2:
      return "Under Review";
    case 3:
      return "Approved";
    case 4:
      return "Denied";
    case 5:
      return "Processing";
    case 6:
      return "Done";
    case 7:
      return "Closed";
    default:
      return "Unknown";
  }
};

const token = localStorage.getItem("login")

const ClaimsList = ({ claims }) => {
  return (
    <div>
      <h2>Claims</h2>
      <ul>
        {claims.map((claim) => (
          <li key={claim.claimId}>
            {claim.claimId} - {getStatusString(claim.claimStatus)}
          </li>
        ))}
      </ul>
    </div>
  );
};

const ClaimStatusChart = ({ claims }) => {
  const statusCounts = claims.reduce((acc, claim) => {
    const status = getStatusString(claim.claimStatus);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
  }));

  // const COLORS = ['#8D9CF4', '#AAE8A7','#F2AA52','#FF2941 ','#DDB8F6','#D1A38C','#FFAFD7'];
  const COLORS = [
    "#F2858E",
    "#F2275D",
    "#252859",
    "#17A697",
    "#F2A341",
    "#C0091E",
    "#613A2D",
  ];

  return (
    <div className={styles.chartsContainer}>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 10,
              bottom: 5,
            }}
          >
            <XAxis dataKey="status" />
            <YAxis>
                <Label value="Number of Policies" position="insideLeft" angle={-90}  offset={-3}/>
              </YAxis>
            <Tooltip />

            <Bar dataKey="count">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <span style={{ textAlign: "center", display: "block", color: "rgb(167, 167, 167)",fontWeight:"600"}}>Status of Policies</span>

      </div>
    </div>
  );
};

const ClaimsAnalytic = () => {
  const [claims, setClaims] = useState([]);
  const [mostClaimedMonth, setMostClaimedMonth] = useState("");

  useEffect(() => {
    // Fetch data from API
    axios
      .get(`${baseURL}/claim`, {headers: { Authorization: `Bearer ${token}`, credentials: true }})
      .then((response) => {
        setClaims(response.data);
        findMostClaimedMonth(response.data); // Find most claimed month
      })
      .catch((error) => {
        console.error("Error fetching claims:", error);
      });
  }, []);

  const findMostClaimedMonth = (claims) => {
    const monthCounts = {};

    claims.forEach((claim) => {
      const month = claim.incidentDate.split("-")[1]; // Extract month from "YYYY-MM-DD" format
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });

    const mostClaimedMonthIndex = Object.keys(monthCounts).reduce((a, b) =>
      monthCounts[a] > monthCounts[b] ? a : b
    );
    const mostClaimedMonthName = new Date(
      2022,
      mostClaimedMonthIndex - 1,
      1
    ).toLocaleString("default", { month: "long" });
    setMostClaimedMonth(mostClaimedMonthName);
  };

  const totalClaimsPurchased = claims.length; // Total number of claims purchased

  return (
    <div>
      <h1 className={styles.title}>Claim Analytics</h1>
      <div className={styles.info}>
        <h5>Total Claims: </h5>
        <p className="card-text">{totalClaimsPurchased}</p>
      </div>
      <div className={styles.info}>
        <h5>Most Claimed Month</h5>
        <p className="card-text">{mostClaimedMonth}</p>
      </div>

      <ClaimStatusChart claims={claims} />
    </div>
  );
};

export default ClaimsAnalytic;


