 import { FaLightbulb } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Add this import
import './Services.css';

const Services = () => {
  const navigate = useNavigate(); // Initialize navigation

  const handlePostIdeasClick = () => {
    navigate('/ideas'); // Programmatic navigation
  };

  return (
    <section className="services-section" id="services">
      <div className="services-container">
        <div className="service-card">
          <div className="icon-wrapper">
            <FaLightbulb className="service-icon" />
          </div>
          <h3>Share Your Innovative Ideas To The People</h3>
          <p>Post your ideas and get valuable input from others.</p>
          <button 
            onClick={handlePostIdeasClick} 
            className="cta-button"
          >
            Post Your Ideas
          </button>
        </div>
        {/* Other service cards... */}
      </div>
    </section>
  );
};

export default Services;