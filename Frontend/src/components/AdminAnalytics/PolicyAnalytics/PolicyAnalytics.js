import "./PolicyAnalytics.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  BarChart,
  CartesianGrid,
  Pie,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Label
} from "recharts";
import { baseURL } from "../../../Server";
import styles from "../AdminAnalytics.module.scss";

export default function PolicyAnalytics() {
  const [policyTypesData, setPolicyTypesData] = useState([]);
  const [totalPoliciesSold, setTotalPoliciesSold] = useState(0);
  const [averageInstallment, setAverageInstallment] = useState(0);
  const [averagePremiumAmount, setAveragePremiumAmount] = useState(0);
  const [averageDuration, setAverageDuration] = useState(0);
  const [policyNameFrequency, setPolicyNameFrequency] = useState({});
  const [userListResponse, setUserListResponse] = useState([]);
  const token = localStorage.getItem("login")
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userPolicyListResponse = await axios.get(
          baseURL + "/policy/user-policies", {headers: { Authorization: `Bearer ${token}`, credentials: true }}
        );
        const policyListResponse = await axios.get(baseURL + "/policy", {headers: { Authorization: `Bearer ${token}`, credentials: true }});
        setUserListResponse(userPolicyListResponse.data);

        const { policyTypesCount } = countPolicyTypes(policyListResponse.data);
        setPolicyTypesData(policyTypesCount);

        const totalInstallment = policyListResponse.data.reduce(
          (acc, policy) => acc + policy.installment,
          0
        );
        const totalPremiumAmount = policyListResponse.data.reduce(
          (acc, policy) => acc + policy.premiumAmount,
          0
        );
        const totalDuration = policyListResponse.data.reduce(
          (acc, policy) => acc + policy.duration,
          0
        );
        const totalPolicies = policyListResponse.data.length;
        const averageInstallment = totalInstallment / totalPolicies;
        const averagePremiumAmount = totalPremiumAmount / totalPolicies;
        const averageDuration = totalDuration / totalPolicies;

        setTotalPoliciesSold(userPolicyListResponse.data.length);
        setAverageInstallment(Math.floor(averageInstallment)); // Round to 2 decimal places
        setAveragePremiumAmount(Math.floor(averagePremiumAmount)); // Round to 2 decimal places
        setAverageDuration(Math.floor(averageDuration)); // Round to 2 decimal places
        calculatePolicyNameFrequency(userPolicyListResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  // Function to count the number of policies for each type
  function countPolicyTypes(policyList) {
    const policyTypesCount = {};

    // Initialize policyTypesCount with each type
    policyList.forEach((policy) => {
      const policyType = policy.policyTypeName;
      policyTypesCount[policyType] = (policyTypesCount[policyType] || 0) + 1;
    });

    // Convert policyTypesCount to array of objects
    const result = Object.keys(policyTypesCount).map((policyType) => ({
      name: policyType,
      value: policyTypesCount[policyType],
    }));

    return { policyTypesCount: result };
  }

  // Function to calculate the frequency of each policy name
  function calculatePolicyNameFrequency(userPolicyList) {
    const policyNameFrequency = {};

    // Iterate through the user policy list and count the occurrences of each policy name
    userPolicyList.forEach((policy) => {
      const policyName = policy.policyName;
      policyNameFrequency[policyName] =
        (policyNameFrequency[policyName] || 0) + 1;
    });

    setPolicyNameFrequency(policyNameFrequency);
  }
  console.log(policyNameFrequency);

  const COLORS = ["#F2858E", "#F2275D", "#252859", "#17A697", "#F2A341"];

  return (
    <div>
      <h2 className={styles.title}>Policy Analitics</h2>
      <div className={styles.info}>
        <p>Total number of policies sold: {totalPoliciesSold}</p>
        <p>Average installment amount: ₹{averageInstallment}</p>
        <p>Average premium amount: ₹{averagePremiumAmount}</p>
        <p>Average duration of policy: {averageDuration} days</p>
      </div>

      <div className={styles.chartsContainer}>
        <div className={styles.chart}>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart width={400} height={400}>
              <Pie
                data={policyTypesData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {policyTypesData.map((entry, index) => (
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
        <div className={styles.chart}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={Object.entries(policyNameFrequency).map(
                ([policyName, frequency], index) => ({
                  name: policyName,
                  frequency,
                  fill: COLORS[index % COLORS.length],
                })
              )}
              margin={{ top: 20, right: 30, left: 20, bottom: 100 }} // Increase bottom margin to accommodate labels
              barSize={80} // Adjust the width of the bars
            >
              <XAxis
                dataKey="name"
                interval={0}
                angle={-20}
                textAnchor="end"
                dy={10}
                dx={-5}
              />
              {/* 'interval={0}' displays all labels */}
              <YAxis>
                <Label value="Frequency" position="insideLeft" angle={-90}  offset={-10}/>
              </YAxis>
              <Tooltip />
              <Bar dataKey="frequency" />
            </BarChart>
          </ResponsiveContainer>
          <span style={{ textAlign: "center", display: "block", color: "rgb(167, 167, 167)",fontWeight:"600" }}>Policy's Names</span>

        </div>
      </div>
    </div>
  );
}


