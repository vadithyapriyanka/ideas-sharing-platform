 // src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom'; // For internal links
import Services from './Services';
// Import icons from react-icons (example)
import { FaLightbulb, FaThLarge, FaWhatsapp, FaLinkedin, FaEnvelope } from 'react-icons/fa';
  // Make sure you have this file for styling

const HomePage = () => {
    const handlePostIdeas = () => {
        console.log("Navigate to post ideas page or open modal");
        // history.push('/post-idea'); // Example navigation
    };

    // Data for the "Get Involved" section
    const involvementActions = [
        {
            id: 'submit',
            icon: <FaLightbulb size={28} color="#E74C3C" />,
            title: 'Submit a Problem',
            description: 'Share real-world challenges for student teams to solve (private)',
            buttonText: 'Get Started',
            link: 'https://docs.google.com/forms/d/e/1FAIpQLSdls123bjNLKtb60EwGdrtAeMMZbW_KfmM5yqp4Oj-TzJzJ6Q/viewform?pli=1',
            highlight: true,
        },
        {
            id: 'view',
            icon: <FaThLarge size={28} color="#3498DB" />,
            title: 'View Problems',
            description: 'Explore the current problem statements',
            buttonText: 'Explore',
            link: 'https://docs.google.com/spreadsheets/d/1phwXO07AZswXq8fJeqWBz2mKllftXj-5x62VfQdXI8I/edit?usp=sharing',
        },
        {
            id: 'whatsapp',
            icon: <FaWhatsapp size={32} color="#25D366" />,
            title: 'Join WhatsApp',
            description: 'Connect with our community of innovators',
            buttonText: 'Join Community',
            link: 'https://chat.whatsapp.com/Bd5q574G8FeGIhVyFj3FTS',
            external: true,
        },
        {
            id: 'linkedin',
            icon: <FaLinkedin size={30} color="#0077B5" />,
            title: 'Follow on LinkedIn',
            description: 'Stay updated with our latest initiatives',
            buttonText: 'Connect',
            link: 'https://www.linkedin.com/company/studentspark/',
            external: true,
        },
        {
            id: 'email',
            icon: <FaEnvelope size={28} color="#5D6D7E" />,
            title: 'Email Us',
            description: 'Reach out for questions or partnerships',
            buttonText: 'Contact',
            link: 'mailto:studentspark.team@gmail.com',
            external: true,
        },
    ];

    return (
        <div className="homepage-container">
            <section id="home" className="welcome">
                <h1>Welcome to Student Spark</h1>
                <p>Time to shine on different ideas...</p>
            </section>

            <Services />

             

            <section id="get-involved" className="get-involved-section">
                <h2>Get Involved</h2>
                <div className="involvement-cards-container">
                    {involvementActions.map((action) => (
                        <div key={action.id} className={`involvement-card ${action.highlight ? 'highlighted-card' : ''}`}>
                            <div className="involvement-icon-wrapper">
                                {action.icon}
                            </div>
                            <h3>{action.title}</h3>
                            <p>{action.description}</p>
                            {action.external ? (
                                <a href={action.link} target="_blank" rel="noopener noreferrer" className="involvement-button">
                                    {action.buttonText}
                                </a> // Corrected: Parenthesis was here: A (
                            ) : (
                                <Link to={action.link} className="involvement-button">
                                    {action.buttonText}
                                </Link> // Corrected: Parenthesis was here
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;