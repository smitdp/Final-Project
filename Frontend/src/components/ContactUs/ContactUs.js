import React, { useState } from 'react';
import './ContactUs.scss';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import BusinessIcon from '@mui/icons-material/Business';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';

const ContactUs = () => {

  return (
    <div>
      <div className="contact-us">
        <div className='contact'><h2>Contact Us</h2></div>

        <div className="contactcards-container">
       
        <div className="card">
       
          <h3>
          If you have any questions or inquiries, feel free to reach out to us:

          </h3>

        <div style={{color:'white'}} className="contact-info">
         <div className='email'>
            <EmailIcon style={{marginRight:'1rem'}}/> cybsure@cybage.com</div>
          <div className='phone'> <LocalPhoneIcon style={{marginRight:'1rem'}}/>+91 75950-77279 </div>
          <div className='address'> <BusinessIcon style={{marginRight:'1rem'}}/>CybSure, Brigade International Financial Centre, Gujarat International Finance Tec-City, Gandhinagar, Gujarat 382355</div>
        </div>
        </div>
        <div className="card">
        <div className='connect'>
        <h3>Let's connect</h3>
        <div className='socialSites'>
            <a href="https://www.facebook.com" style={{margin:'auto 2rem'}} target="_blank" rel="noopener noreferrer">
                <FacebookIcon  style={{color:'white', fontSize:'3rem'}}/>
            </a>
            <a href="https://www.instagram.com" style={{margin:'auto 2rem'}} target="_blank" rel="noopener noreferrer">
                <InstagramIcon style={{color:'white', fontSize:'3rem'}} />
            </a>
            <a href="https://twitter.com/i/flow/login?lang=en" style={{margin:'auto 2rem'}} target="_blank" rel="noopener noreferrer">
                <XIcon  style={{color:'white', fontSize:'3rem'}}/>
            </a>
        </div>    

      </div>
      </div>
      </div>
       
      </div>
     

    </div>
  );
};

export default ContactUs;
