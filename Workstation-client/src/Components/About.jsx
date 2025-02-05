import React from 'react';
import './About.css';
import about1Image from '../assets/about1.jpg'
import about2Image from '../assets/about2.jpg'
import about3Image from '../assets/about3.jpg'
import Navigation from './Navigation';

function About() {
  return (
    <>
    <Navigation/>
    <div className="about-workstation">
      <section className="main-section">
        <div className="content">
          <h1>About WorkStation</h1>
          <p>
            WorkStation is the #1 job site in the world¹ and a global job matching and hiring platform. More people get hired on WorkStation than any other site because we put job seekers first, giving them access to search for jobs, post resumes, research companies, and more. With AI-powered technology, WorkStation is transforming job matching and hiring. Every day, we connect millions of people to new opportunities.
          </p>
          <p className="note">
            Please note that WorkStation and its affiliates are directly or indirectly owned by a publicly traded Japanese parent company, <a href="#">Recruit Holdings Co., Ltd.</a>
          </p>
        </div>
        <div className="image">
          <img src={about1Image} alt="Person using WorkStation on phone" />
        </div>
      </section>

      <section className="stats-section">
        <div className="stat">
          <h2>350M+</h2>
          <p>Unique monthly visitors²</p>
        </div>
        <div className="stat">
          <h2>3.5M+</h2>
          <p>Employers use WorkStation to hire</p>
        </div>
        <div className="stat">
          <h2>60+</h2>
          <p>Countries</p>
        </div>
      </section>

      <section className="people-section">
        <div className="image">
          <img src={about2Image} alt="WorkStation employees" />
        </div>
        <div className="content">
          <h2>Our people</h2>
          <p>
            At WorkStation, our mission is to help people get jobs. We have ~11,500 global employees passionately pursuing this purpose and improving the recruitment journey through real stories and data. We foster a collaborative workplace that strives to create the best experience for job seekers.
          </p>
        </div>
      </section>

      <section className="leadership-section">
        <div className="content">
          <h2>Our Leadership</h2>
          <p>
            WorkStation's leadership team is diverse, dedicated, and committed to empowering our employees to fulfill our mission. By fostering strong partnerships and collaboration, they serve and support job seekers, employers, society, and our employees.
          </p>
        </div>
        <div className="image">
          <img src={about3Image} alt="WorkStation leadership" />
        </div>
      </section>
    </div>
    </>
  );
}

export default About;
