import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import brain from './brain.png';

const Logo = () => {
	return (
		<div className='m4 mt0'>
			<Tilt tiltReverse= 'true' tiltMaxAngleX = '55' tiltAxis ='x' glareEnable = 'true' glareMaxOpacity = '0.01' sclae='1.5' >
      			<div className = "Tilt" style={{ height: '150px', width: '150px', border: '2px', shadow: "2px 2px", padding:'3px' }}>
        			<h1><img style= {{height:'100px', width: '100px', paddingTop: '5px'}} alt='Brain Logo' src={brain}/></h1>
      			</div>
    		</Tilt>
		</div>
	);
}

export default Logo;
