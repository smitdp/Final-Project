import React, { useState, useEffect } from 'react';
import styles from './ClaimStatus.module.scss';

const ClaimStatus = (props) => {
  const [statuses, setStatuses] = useState([]);


  useEffect(() => {
    setStatuses([
      { id: 1, status: 'Pending', name: "Pending", color: "red" },
      { id: 2, status: 'Under Review', name: "Under Review" },
      props.currentStatus === 4 ? { id: 4, status: 'Denied', name: "Denied" } : { id: 3, status: 'Approved', name: "Approved" },
      { id: 5, status: 'Processing', name: "Processing" },
      { id: 6, status: 'Done', name: "Done" },
      { id: 7, status: 'Closed', name: "Closed" }
    ]);
  }, []);

  const getStatusColor = (status, currentIndex) => {
    const approvedStatusIndex = statuses.findIndex(item => item.id === props.currentStatus);

    if (currentIndex <= approvedStatusIndex) {
      return {
        color: "white",
        backgroundColor: 'rgba(112,111,239,1)'
      };
    }

    else {
      return {
        color: 'black',
        backgroundColor: 'lightGrey'
      };
    }
  };

  const handleClose = () => {
    props.setStatusIsOpen(false);
  }

  return (
    <>
      {props.statusIsOpen && <div className={styles.track}>
        <div className={styles['steps-container']}>
          {statuses.map((status, index) => (
            <React.Fragment key={index}>
              <div className={styles.step} style={getStatusColor(status.status, index)}>
                <span className={styles['status-name']}>{status.name}</span>
                <div className={`${styles.arrow} ${index === statuses.length - 1 ? styles.hideArrow : ''}`} style={getStatusColor(status.status, index+1)}></div>
              </div>
            </React.Fragment>
          ))}
          <button onClick={handleClose} style={{ padding: "1rem", border: "none", background: "grey", color: "white", borderRadius: "1rem", cursor: "pointer" }}>
            Go back
          </button>
        </div>
      </div>}
    </>
  );
};

export default ClaimStatus;
