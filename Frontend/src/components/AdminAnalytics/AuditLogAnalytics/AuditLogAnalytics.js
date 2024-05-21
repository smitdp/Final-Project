import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, Cell, Label } from 'recharts';
import { baseURL } from '../../../Server';
import axios from 'axios';
import styles from '../AdminAnalytics.module.scss'

const tableContainerStyle = {
  width: '80vw',
  margin: 'auto',
  marginTop: 20,
};

const rowsPerPage = 10;

export default function AuditLogAnalytics() {
  const [auditLogData, setAuditLogData] = useState([]);
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const token = localStorage.getItem("login");
  const COLORS = [
    "#F2858E",
    "#F2275D",
    "#252859",
    "#17A697",
    "#F2A341",
    "#C0091E",
    "#613A2D",
  ];


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(baseURL + '/user/auditlogs', {
          headers: { Authorization: `Bearer ${token}`, credentials: true },
        }
        );
        setAuditLogData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrderBy(property);
    setOrder(isAsc ? 'desc' : 'asc');
  };

  const handleCategoryChange = (category) => {
    if (filteredCategories.includes(category)) {
      setFilteredCategories(filteredCategories.filter((cat) => cat !== category));
    } else {
      setFilteredCategories([...filteredCategories, category]);
    }
  };

  const filteredData = auditLogData.filter((row) => {
    if (filteredCategories.length === 0) return true;
    return filteredCategories.includes(row.category);
  });

  const sortedData = filteredData.sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    } else {
      return a[orderBy] < b[orderBy] ? 1 : -1;
    }
  });

  const pageCount = Math.ceil(sortedData.length / rowsPerPage);

  const handleNextPage = () => {
    setPage(Math.min(page + 1, pageCount - 1));
  };

  const handlePrevPage = () => {
    setPage(Math.max(page - 1, 0));
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPageData = sortedData.slice(startIndex, endIndex);

  const actionDistribution = {};
  auditLogData.forEach((log) => {
    if (actionDistribution[log.action]) {
      actionDistribution[log.action]++;
    } else {
      actionDistribution[log.action] = 1;
    }
  });
  const actionDistributionData = Object.keys(actionDistribution).map((action) => ({
    action,
    count: actionDistribution[action],
  }));



  return (
    <>


      <div>
      <h2 className={styles.title}>Audit Log</h2>
        <div className={styles.chart} >

          <BarChart
            width={800}
            height={500}
            data={actionDistributionData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="action" />
            <YAxis>
              <Label value="Frequency -->" position="insideLeft" angle={-90} offset={-3} />
            </YAxis>
            <Tooltip />

            <Bar dataKey="count">
              {actionDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </div>
      </div>

      <div className={styles.filterContainer}>
        <FormControlLabel
          control={<Checkbox checked={filteredCategories.includes('Auth')} onChange={() => handleCategoryChange('Auth')} />}
          label="Auth"
        />
        <FormControlLabel
          control={<Checkbox checked={filteredCategories.includes('Policy')} onChange={() => handleCategoryChange('Policy')} />}
          label="Policy"
        />
        <FormControlLabel
          control={<Checkbox checked={filteredCategories.includes('Claim')} onChange={() => handleCategoryChange('Claim')} />}
          label="Claim"
        />
      </div>
      <TableContainer component={Paper} >
        <Table aria-label="audit log table">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'userId'}
                  direction={orderBy === 'userId' ? order : 'asc'}
                  onClick={() => handleSort('userId')}
                >
                  User ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'userName'}
                  direction={orderBy === 'userName' ? order : 'asc'}
                  onClick={() => handleSort('userName')}
                >
                  User Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'timestamp'}
                  direction={orderBy === 'timestamp' ? order : 'asc'}
                  onClick={() => handleSort('timestamp')}
                >
                  Timestamp
                </TableSortLabel>
              </TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'isSuccess'}
                  direction={orderBy === 'isSuccess' ? order : 'asc'}
                  onClick={() => handleSort('isSuccess')}
                >
                  Success
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.userId}</TableCell>
                <TableCell>{row.userName}</TableCell>
                <TableCell>{row.timestamp}</TableCell>
                <TableCell>{row.action}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.details}</TableCell>
                <TableCell>{row.isSuccess ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <Button onClick={handlePrevPage} disabled={page === 0}>Previous</Button>
        <span>{`Page ${page + 1} of ${pageCount}`}</span>
        <Button onClick={handleNextPage} disabled={page === pageCount - 1}>Next</Button>
      </div>
    </>
  );
}
