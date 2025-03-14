import './ReviewClaims.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { baseURL } from '../../Server';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Checkbox
} from '@mui/material';
import styles from '../AdminAnalytics/AdminAnalytics.module.scss';


const token = localStorage.getItem("login");
const ButtonComponent = ({ claimId, status, handleButtonPress }) => {
  function handleClick(newStatus) {
    handleButtonPress(claimId, newStatus);
  }

  switch (status) {
    case 1:
      return <Button onClick={() => handleClick(2)}>View</Button>;
    case 2:
      return (
        <>
          <Button onClick={() => handleClick(3)}>Accept</Button>
          <Button onClick={() => handleClick(4)}>Deny</Button>
        </>
      );
    case 3:
      return <Button onClick={() => handleClick(5)}>Processing</Button>;
    case 4:
      return (
        <>
          <Button onClick={() => handleClick(1)}>Pending</Button>
          <Button onClick={() => handleClick(7)}>Close</Button>
        </>
      );
    case 5:
      return <Button onClick={() => handleClick(6)}>Done</Button>;
    case 6:
      return <Button onClick={() => handleClick(7)}>Close</Button>;
    case 7:
      return <strong>Closed</strong>;
    default:
      return <p>Not possible</p>;
  }
};

export default function ReviewClaims() {
  const [claimList, setClaimList] = useState([]);
  const [claimListError, setClaimListError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [openPopupId, setOpenPopupId] = useState(null);
  const [showStatus, setShowStatus] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(baseURL + '/claim');
        const response = await axios.get(baseURL + '/claim', {
          headers: { Authorization: `Bearer ${token}`, credentials: true },
        });
        console.log(response.data);
        setClaimList(response.data);
      } catch (error) {
        setClaimListError(error);
      }
    };

    fetchData();
  }, []);

  function statusCodeToName(code) {
    switch (code) {
      case 1:
        return 'Pending';
      case 2:
        return 'Under Review';
      case 3:
        return 'Approved';
      case 4:
        return 'Denied';
      case 5:
        return 'Processing';
      case 6:
        return 'Done';
      case 7:
        return 'Closed';
      default:
        return 'None';
    }
  }

  function handleButtonPress(claimId, newStatus) {
    console.log('ClaimId: ' + claimId + ' NewStatus: ' + newStatus);
    const updateClaim = async (claimId, newStatus) => {
      try {
        const response = await axios.put(`${baseURL}/claim/claims/${claimId}`, {
          claimId: claimId,
          status: newStatus
        }, {
          headers: { Authorization: `Bearer ${token}`, credentials: true },
        });
        console.log(response.data);

        const updatedData = claimList.map(item => {
          if (item.claimId === claimId) {
            return { ...item, claimStatus: newStatus };
          }
          return item;
        });
        setClaimList(updatedData);
      } catch (error) {
        console.error(error);
      }
    };

    updateClaim(claimId, newStatus);
  }

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handlePopupOpen = claimId => {
    setOpenPopupId(claimId);

    const claimToUpdate = claimList.find(claim => claim.claimId === claimId);
    if (claimToUpdate && claimToUpdate.claimStatus === 1) {
      handleButtonPress(claimId, 2);
    }
  };

  const handlePopupClose = () => {
    setOpenPopupId(null);
  };

  const handleStatusChange = (status, checked) => {
    setShowStatus(prevState => ({
      ...prevState,
      [status]: checked
    }));
  };

  const handleClearFilter = () => {
    setShowStatus({
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false
    });
    setSearchTerm('');
    document.getElementById("searchBox").value = "";
  };

  const sortedClaims = () => {
    const sortableClaims = [...claimList];
    if (sortConfig.key !== null) {
      sortableClaims.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableClaims;
  };

  const filteredClaims = sortedClaims().filter(
    item =>
      (Object.values(showStatus).some(status => status) && showStatus[item.claimStatus]) ||
      (Object.values(showStatus).every(status => !status))
  ).filter(
    item =>
    (item.userFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.policyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.policyTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      statusCodeToName(item.status).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <h2 className={styles.title}>Claims Manager</h2>
      <input
        placeholder="Search..."
        onChange={handleSearchChange}
        id='searchBox'
        autoFocus
      />
      <Button id="ClearFilterBtn" onClick={handleClearFilter}>Clear Filter</Button>
      <div style={{ display: "flex", gap: "2rem", }}>
        {Object.keys(showStatus).map(status => (
          <div key={status}>
            <Checkbox
              checked={showStatus[status]}
              onChange={event => handleStatusChange(Number(status), event.target.checked)}
              inputProps={{ 'aria-label': `Show ${statusCodeToName(Number(status))} Claims` }}
            />
            <label>{statusCodeToName(Number(status))}</label>
          </div>
        ))}
      </div>
      <Table style={{ backgroundColor: 'white', borderRadius: '15px' }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortConfig.key === 'userFirstName'}
                direction={sortConfig.key === 'userFirstName' ? sortConfig.direction : 'asc'}
                onClick={() => handleSort('userFirstName')}
              >
                User's Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortConfig.key === 'policyName'}
                direction={sortConfig.key === 'policyName' ? sortConfig.direction : 'asc'}
                onClick={() => handleSort('policyName')}
              >
                Policy Name
              </TableSortLabel>
            </TableCell>
            <TableCell>Policy Type</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortConfig.key === 'claimStatus'}
                direction={sortConfig.key === 'claimStatus' ? sortConfig.direction : 'asc'}
                onClick={() => handleSort('claimStatus')}
              >
                Current Status
              </TableSortLabel>
            </TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredClaims.map(item => (
            <TableRow key={item.claimId}>
              <TableCell>{`${item.userFirstName} ${item.userLastName}`}</TableCell>
              <TableCell>{item.policyName}</TableCell>
              <TableCell>{item.policyTypeName}</TableCell>
              <TableCell>
                <Button onClick={() => handlePopupOpen(item.claimId)}>View</Button>
                <Dialog
                  open={openPopupId === item.claimId}
                  onClose={handlePopupClose}
                  fullWidth
                  maxWidth="sm"
                >
                  <DialogTitle>{`${item.userFirstName} ${item.userLastName}'s Claim Details`}</DialogTitle>
                  <DialogContent>
                    <Typography gutterBottom>Incident Date: {item.incidentDate}</Typography>
                    <Typography gutterBottom>Incident Location: {item.incidentLocation}</Typography>
                    <Typography gutterBottom>Address: {item.address}</Typography>
                    <Typography gutterBottom>Description: {item.description}</Typography>
                    <Typography gutterBottom>Documents: {item.documentNames.map((docitem, i) => (<><a href={item.documents[i]}>{docitem}</a>&nbsp;</>))}
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <ButtonComponent
                      claimId={item.claimId}
                      handleButtonPress={handleButtonPress}
                      status={item.claimStatus}
                    />
                    <Button onClick={handlePopupClose}>Back</Button>
                  </DialogActions>
                </Dialog>
              </TableCell>
              <TableCell>{statusCodeToName(item.claimStatus)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}