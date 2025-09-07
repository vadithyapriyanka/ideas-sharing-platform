 // src/components/AboutPageDetails.js
import React from 'react';
import './AboutPageDetails.css';

// Data for the individual core team members
const coreTeamMembersData = [
  {
    id: 'shivaram',
    name: 'SHIVARAM',
    role: 'Founder',
    // === ACTION: Add actual image path for Shivaram ===
    photo: '/images/team/Shivaram.jpg', // Example path
    icon: '/images/team-member-icon.svg' // Small icon next to "Team Member" label (optional)
  },
  {
    id: 'swetha',
    name: 'MEGHANA',
    role: 'Developer',
    // === ACTION: Add actual image path for Swetha ===
    photo: '/images/team/swetha.jpg', // Example path
    icon: '/images/team-member-icon.svg'
  },
  {
    id: 'jagadish',
    name: 'JAGADISH',
    role: 'Developer',
    // === ACTION: Add actual image path for Jagadish ===
    photo: '/images/team/jagadish.jpg', // Example path
    icon: '/images/team-member-icon.svg'
  },
];

const teamGraduationImageUrl = '/images/student_spark_team_graduating.jpg';

const AboutPageDetails = () => {
    return (
        <div className="about-details-container" id="about-details-content">
            {/* ... Intro, Vision/Mission, Why Join sections remain the same ... */}
            <section className="intro-text-detailed">
                <p>
                    Student Spark is a student-led platform that connects innovative minds with real-world problems. It provides a space for students to post and explore practical problems, build solutions as a team, and gain mentorship from NITW professors and industry experts. We believe in creating meaningful change through youth-driven ideas.
                </p>
            </section>

            <section className="vision-mission-section">
                <div className="card vision-card">
                    <h3><span role="img" aria-label="star">🌟</span> Vision</h3>
                    <p>To become India's largest student-powered innovation network, where problems are turned into purpose by young minds.</p>
                </div>
                <div className="card mission-card">
                    <h3><span role="img" aria-label="target">🎯</span> Mission</h3>
                    <ul>
                        <li>To empower students to solve real-world problems.</li>
                        <li>To create a collaborative space of creativity, technology, and mentorship.</li>
                        <li>To connect students with experts, faculty, and industry for high-impact projects.</li>
                    </ul>
                </div>
            </section>

            <section className="why-join-section">
                <h2>Why Join Student Spark?</h2>
                <div className="why-join-content-wrapper">
                    <div className="why-join-image-container">
                        <img src="/images/why-join-student-spark.jpg" alt="Students collaborating" />
                    </div>
                    <div className="benefits-grid-container">
                        <div className="benefits-grid">
                            <div className="benefit-item">
                                <h4><span role="img" aria-label="people">👥</span> Team Collaboration</h4>
                                <p>Work with diverse, talented students across departments at NITW</p>
                            </div>
                            <div className="benefit-item">
                                <h4><span role="img" aria-label="mentor">👨‍🏫</span> Expert Mentorship</h4>
                                <p>Receive guidance from professors and industry professionals</p>
                            </div>
                            <div className="benefit-item">
                                <h4><span role="img" aria-label="connect">🔗</span> Real-World Impact</h4>
                                <p>Solve practical problems that make a difference</p>
                            </div>
                            <div className="benefit-item">
                                <h4><span role="img" aria-label="skills">🛠️</span> Skill Development</h4>
                                <p>Build technical and soft skills valuable for your career</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* YOUR EXISTING "Our Team" Section (with graduation photo, etc.) */}
            <section className="our-team-section" id="our-team-overview">
                <h2>Our Team</h2>
                <p className="team-intro-para">
                    We are backed by a passionate student team from NIT Warangal, working collaboratively to drive innovation across disciplines. Our team is guided by mentorship from professors and subject experts who support us with technical knowledge, research insight, and academic depth.
                </p>
                <div className="team-highlights">
                    <div className="highlight-item">
                        <p><span role="img" aria-label="student-hat">🎓</span> <strong>Student-Led Initiative</strong></p>
                        <p>Created by students, for students</p>
                    </div>
                    <div className="highlight-item">
                        <p><span role="img" aria-label="teacher">👨‍🏫</span> <strong>Faculty Mentorship</strong></p>
                        <p>Supported by experienced professors</p>
                    </div>
                    <div className="highlight-item">
                        <p><span role="img" aria-label="briefcase">💼</span> <strong>Industry Connections</strong></p>
                        <p>Building bridges to the professional world</p>
                    </div>
                </div>
                <div className="team-image-container">
                    <img src={teamGraduationImageUrl} alt="" />
                </div>
            </section>
            {/* END OF YOUR EXISTING "Our Team" Section */}


            {/* REVISED "Core Team Members" Section - Horizontal Layout */}
            <section className="core-team-horizontal-section" id="core-team-members">
                {/* You might want a sub-heading here like "Meet Our Leaders" or "Core Members" */}
                {/* Or just let the cards speak for themselves if the "Our Team" above is sufficient */}
                 <h2 className="core-team-title">Meet the Core Team</h2> {/* Optional Title */}

                <div className="core-team-horizontal-grid">
                    {coreTeamMembersData.map(member => (
                        <div key={member.id} className="core-team-horizontal-card">
                            <div className="core-team-member-photo-container">
                                <img src={member.photo} alt={member.name} className="core-team-member-photo"/>
                            </div>
                            <div className="core-team-member-details">
                                {/* The "Team Member" label from image is optional here, can be implied by section */}
                                {/* <div className="core-team-member-label">
                                    <img src={member.icon} alt="" className="core-member-label-icon"/>
                                    <span>Team Member</span>
                                </div> */}
                                <h3 className="core-team-member-name">{member.name}</h3>
                                <p className="core-team-member-role">{member.role}</p>
                                {/* Optional: Add a short bio or social links here */}
                                {/* <p className="core-team-member-bio">Short bio...</p> */}
                                {/* <div className="core-team-social-links"> <a href="#">LinkedIn</a> </div> */}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="core-team-join-cta">
                    <p>Be a Part of Student Spark</p>
                </div>
            </section>
            {/* END OF REVISED "Core Team Members" Section */}


            {/* ... Connect With Us and Footer sections remain the same ... */}
            <section className="connect-with-us-section">
                <h2>Connect With Us</h2>
                <div className="connect-columns">
                    <div className="get-in-touch">
                        <h3>Get In Touch</h3>
                        <p>Have questions or want to know more about Student Spark? We'd love to hear from you!</p>
                        <ul>
                            <li><span role="img" aria-label="email">📧</span> studentspark.team@gmail.com</li>
                            <li><span role="img" aria-label="linkedin">🔗</span> LinkedIn</li>
                            <li><span role="img" aria-label="whatsapp">💬</span> WhatsApp Community</li>
                        </ul>
                    </div>
                    <div className="quick-links">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><span role="img" aria-label="submit">📤</span> Submit a Problem</li>
                            <li><span role="img" aria-label="info">ℹ️</span> About Us</li>
                            <li><span role="img" aria-label="founder">💡</span> Our Founder</li>
                            <li><span role="img" aria-label="team">🤝</span> Team</li>
                        </ul>
                    </div>
                </div>
            </section>

            <footer className="about-details-footer">
                <p>© {new Date().getFullYear()} Student Spark. All rights reserved.</p>
            </footer> 
        </div>
    );
};

export default AboutPageDetails;