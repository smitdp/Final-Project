import React from 'react';

const ServerError = () => {
  return (
    <div style={{display:"grid", height:"100dvh", width:"100%", placeContent:"center"}}>
      <h1 style={{color:"red"}}>SERVER IS OFFLINE</h1>
    </div>
  );
};

export default ServerError;