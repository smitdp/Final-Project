import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { baseURL } from '../../Server';
import {
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import Swal from "sweetalert2";
import styles from '../AdminAnalytics/AdminAnalytics.module.scss';

export function AddDocument({ onAdd }) {
  const token = localStorage.getItem("login");
  const [newDocumentType, setNewDocumentType] = useState("");
  const [policyList, setPolicyList] = useState([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState("");

  const fetchPolicyList = async () => {
    try {
      const response = await axios.get(baseURL + '/policy', {
        headers: { Authorization: `Bearer ${token}`, credentials: true }
      });
      console.log(response.data);
      setPolicyList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async () => {
    if (newDocumentType === "" || selectedPolicyId === "") {
      const swal = await Swal.fire({
        position: "center",
        icon: "warning",
        title: `Fill all fields`,
        showConfirmButton: true,
        confirmButtonColor: 'rgb(112, 111, 239)',
      });
      return;
    }
    onAdd({
      DocumentType: newDocumentType,
      PolicyId: parseInt(selectedPolicyId)
    });
    setNewDocumentType("");
    setSelectedPolicyId("");
  };

  useEffect(() => {
    fetchPolicyList();
  }, []);

  return (
    <>
    <h2 className={styles.title}>Document Manager</h2>
   
    <Card variant="outlined" sx={{ marginBottom: 2 }}>
      
      <CardContent>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel style={{backgroundColor:'white'}} id="policy-select-label">Select Policy</InputLabel>
          <Select
            labelId="policy-select-label"
            id="policy-select"
            value={selectedPolicyId}
            onChange={(e) => setSelectedPolicyId(e.target.value)}
          >
            <MenuItem disabled value="">
              <em>Select Policy</em>
            </MenuItem>
            {policyList.map(item => (
              <MenuItem key={item.id} value={item.id}>{item.policyName}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          id="document-type"
          label="Document Type"
          value={newDocumentType}
          onChange={(e) => setNewDocumentType(e.target.value)}
          variant="outlined"
          sx={{ marginBottom: 2 }}
        />

        <Button variant="contained" onClick={handleAdd}>Add Document</Button>
      </CardContent>
    </Card>
    </>
  );
};

export default function DocumentList() {
  const [docList, setDocList] = useState([]);
  const [docListError, setDocListError] = useState('');
  const token = localStorage.getItem("login");
  
  const fetchDocumentList = async () => {
    try {
      const response = await axios.get(baseURL + '/policy/policy-documents', {
        headers: { Authorization: `Bearer ${token}`, credentials: true }
      });
      console.log(response.data);
      setDocList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDocumentList();
  }, []);

  const handleAddDocument = async ({ DocumentType, PolicyId }) => {
    const newDocumentItem = {
      documentType: DocumentType,
      policyId: PolicyId
    };

    try {
      const response = await axios.post(baseURL + '/policy/add-document', newDocumentItem, {
        headers: { Authorization: `Bearer ${token}`, credentials: true },
      });
      const swal = await Swal.fire({
        position: "center",
        icon: "success",
        title: response.data,
        showConfirmButton: true,
        confirmButtonColor: 'rgb(112, 111, 239)',
      });
      
      // Fetch updated document list
      await fetchDocumentList();
    } catch (error) {
      console.error(error);
    }
    
    // Update document list
    setDocList([...docList, newDocumentItem]);
  };

  return (
    <>
      <AddDocument onAdd={handleAddDocument} />
      <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
        {docList.map((item, index) => (
          <Card key={index} variant="outlined" sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>{item.documentType} | <i>{item.policyName}</i></Typography>
            </CardContent>
          </Card>
        ))}
      </Paper>
    </>
  );
}
