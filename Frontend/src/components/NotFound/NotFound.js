import React from 'react'
import notfound from '../../assets/Images/notfound.png'

const NotFound = () => {
  return (
    <div className='outer-container-not-found'>
        <div className='not-found-image-container'>
        <img src={notfound} />
    </div>
    </div>
  )
}

export default NotFound