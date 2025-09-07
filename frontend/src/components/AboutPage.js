 // src/pages/AboutPage.js
import React from 'react';
import SvgParallaxScroll from '../components/SvgParallaxScroll';
import AboutPageDetails from '../components/AboutPageDetails'; // <-- Import the NEW component
 

const AboutPage = () => {
    return (
        <div className="about-page">
            <SvgParallaxScroll />
            <AboutPageDetails /> {/* <-- Use the NEW component here */}
        </div>
    );
};

export default AboutPage;