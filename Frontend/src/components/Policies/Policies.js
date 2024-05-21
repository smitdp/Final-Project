import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baseURL } from "../../Server";
import axios from "axios";
import styles from "./Policies.module.scss";
import PoliciesHeroSection from "../PoliciesHeroSection/PoliciesHeroSection";
import health1 from "../../assets/Images/Policies/health1.png"
import health2 from "../../assets/Images/Policies/health2.png"
import life1 from "../../assets/Images/Policies/life1.png"
import life2 from "../../assets/Images/Policies/life2.png"
import auto1 from "../../assets/Images/Policies/auto1.png"
import auto2 from "../../assets/Images/Policies/auto2.png"
import home1 from "../../assets/Images/Policies/home1.png"
import home2 from "../../assets/Images/Policies/home2.png"
import travel1 from "../../assets/Images/Policies/travel1.png"
import travel2 from "../../assets/Images/Policies/travel2.png"


const Policies = () => {
  const [policies, setPolicies] = useState([]);
  const [policyTypes, setPolicyTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const token = localStorage.getItem("login");

  const policyImages = [
    health1,
    health2,
    life1,
    life2,
    auto1,
    auto2,
    home1,
    home2,
    travel1,
    travel2
  ];

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axios.get(`${baseURL}/policy`, {
          headers: { Authorization: `Bearer ${token}`, credentials: true },
        });
        const policiesWithImages = response.data.map((policy, index) => ({
          ...policy,
          image: policyImages[index % policyImages.length],
        }));
        setPolicies(policiesWithImages);
        const types = Array.from(
          new Set(policiesWithImages.map((policy) => policy.policyTypeName))
        );
        setPolicyTypes(types);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchPolicies();
  }, []);

  const handleTypeChange = (type) => {
    const updatedTypes = [...selectedTypes];
    const index = updatedTypes.indexOf(type);
    if (index !== -1) {
      updatedTypes.splice(index, 1);
    } else {
      updatedTypes.push(type);
    }
    setSelectedTypes(updatedTypes);
  };

  const handleClearFilter = () => {
    setSelectedTypes([]);
  };

  const filteredPolicies =
    selectedTypes.length === 0
      ? policies
      : policies.filter((policy) =>
          selectedTypes.includes(policy.policyTypeName)
        );

  return (
    <div>
      <PoliciesHeroSection />
      <div className={styles["filter-container"]}>
        <div className={styles["filter-container-inner"]}>
          <h4>Filter by policy type</h4>
          <div className={styles["checkboxes-container"]}>
            {policyTypes.map((type) => (
              <div className={styles["checkbox-container"]} key={type}>
                <div className="checkbox-wrapper">
                  <input
                    id={`_checkbox-${type}`}
                    type="checkbox"
                    value={type}
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeChange(type)}
                    className="checkbox-input"
                  />
                  <label
                    htmlFor={`_checkbox-${type}`}
                    className="checkbox-label"
                  >
                    <div className="tick_mark"></div>
                  </label>
                </div>
                {type}
              </div>
            ))}
            <button onClick={handleClearFilter}>Clear Filter</button>
          </div>
        </div>
      </div>

      <ul className={styles["policy-cards-container"]}>
        {filteredPolicies.map((policy, index) => (
          <li key={policy.id} className={styles["policy-card"]}>
            <div className={styles["img-container"]}>
              <img src={policy.image} alt={`Policy: ${policy.policyName}`} />
            </div>

            <div className={styles["details-container"]}>
              <div className={styles["details"]}>
                <h3>{policy.policyName}</h3>
                <p>{`${policy.policyTypeName} insurance`}</p>
              </div>
              <Link to={"/policy"} state={{ policy: policy }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Policies;
