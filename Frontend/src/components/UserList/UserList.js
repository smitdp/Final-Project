import './UserList.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { baseURL } from '../../Server';
import {
  Button,
  Container,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import styles from '../AdminAnalytics/AdminAnalytics.module.scss';

export default function UserList() {
  const [userList, setUserList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(false); 
  const [inactiveFilter, setInactiveFilter] = useState(false); 
  const token = localStorage.getItem("login");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(baseURL + '/user/users', {
          headers: { Authorization: `Bearer ${token}`, credentials: true },
        });
        setUserList(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleToggleActive = async (id) => {
    const updatedData = userList.map(item => {
      if (item.id === id && item.roleName === "Agent") {
        const IsActiveStatus = !item.isActive;
        updateUserIsActive(id, IsActiveStatus);
        return {
          ...item,
          isActive: IsActiveStatus
        };
      }
      return item;
    });

    setUserList(updatedData);
  };

  const updateUserIsActive = async (id, isActiveStatus) => {
    try {
      const response = await axios.put(baseURL + '/user/is-active/' + id, {
        'userId': id,
        'isActive': isActiveStatus
      }, {
        headers: { Authorization: `Bearer ${token}`, credentials: true },
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = event => {
    setSearchQuery(event.target.value);
  };


  const filteredAgents = userList.filter(user =>
    user.roleName === "Agent" &&
    `${user.firstName} ${user.lastName} ${user.email} ${user.phoneNumber}`.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (activeFilter ? user.isActive : true) && 
    (inactiveFilter ? !user.isActive : true) && 
    (inactiveFilter &&  activeFilter ? !user.isActive : true)
  );


  const claimants = userList.filter(user => user.roleName === "Claimant");

  return (
    <Container>
      <h2 className={styles.title}>User Manager</h2>
      <input
        placeholder="Search users..."
        value={searchQuery}
        onChange={handleSearch}
        id='searchBox'
        autoFocus
      />
      <div>
        <Typography variant="h5" className='header-title poppins-regular poppins-semibold'>Customers</Typography>
        <div className='cards-container'>
          {claimants.length > 0 ? (
            claimants.map(item => (
              <div key={item.id} className='card'>
                <div className='card-content poppins-regular'>
                  <Typography className="card-name poppins-medium">Name: &nbsp;&nbsp; {item.firstName} {item.lastName}</Typography>
                  <Typography className="card-email">Email: &nbsp;&nbsp;&nbsp;&nbsp; {item.email}</Typography>
                  <Typography className="card-number">Number:&nbsp; {item.phoneNumber}</Typography>
                </div>
              </div>
            ))
          ) : (
            <Typography className="notfound poppins-medium">No Customer Matched</Typography>
          )}
        </div>
      </div>


      <div>
        <Typography variant="h5" className='header-title poppins-semibold'>Agents</Typography>

        <div>
        <FormControlLabel
          control={<Checkbox checked={activeFilter} onChange={() => setActiveFilter(!activeFilter)} />}
          label="Active"
        />
        <FormControlLabel
          control={<Checkbox checked={inactiveFilter} onChange={() => setInactiveFilter(!inactiveFilter)} />}
          label="Inactive"
        />
      </div>
      
        <div className='cards-container'>
          {filteredAgents.length > 0 ? (
            filteredAgents.map(item => (
              <div key={item.id} className='card'>
                <div className='card-content poppins-regular'>
                  <Typography className="card-name poppins-medium">Name:&nbsp;&nbsp;&nbsp;   {item.firstName} {item.lastName}</Typography>
                  <Typography className="card-email">Email: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.email}</Typography>
                  <Typography className="card-number">Number: &nbsp;{item.phoneNumber}</Typography>
                  <Button
                    onClick={() => handleToggleActive(item.id)}
                    variant="contained"
                    color={item.isActive ? "error" : "success"}
                    style={{ marginTop: '10px' }} 
                    className="poppins-semibold"
                  >
                    {item.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <Typography className="notfound poppins-medium">No Agent Matched</Typography>
          )}
        </div>
      </div>

    </Container>
  );
}
