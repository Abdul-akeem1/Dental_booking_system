import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { dentists } from '../assets/assets';
import { servicesData } from '../components/home/Services';
import { useNavigate, useParams } from 'react-router-dom';
import './Dentists.css';

const Dentists = () => {
  const { speciality } = useParams();
  const [filterDentist, setFilterDentist] = useState([]);
  const navigate = useNavigate();

  const applyFilter = () => {
    if (speciality) {
      setFilterDentist(dentists.filter(den => den.speciality === speciality));
    } else {
      setFilterDentist(dentists);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [dentists, speciality]);

  return (
    <div>
      <Navbar />
      <div className="container" style={{ marginTop: '100px', marginBottom: '50px' }}>

        <p style={{ color: '#555', marginBottom: '20px' }}>Browse through the dentists specialist.</p>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

          {/* Left Sidebar Filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '200px' }}>
            {servicesData.map((item, index) => (
              <div
                key={index}
                onClick={() => speciality === item.title ? navigate('/dentists') : navigate(`/dentists/${item.title}`)}
                className={`filter-item ${speciality === item.title ? 'active' : ''}`}
              >
                {item.title}
              </div>
            ))}
          </div>

          {/* Right Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', width: '100%' }}>
            {filterDentist.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(`/appointment/${item._id}`)}
                style={{
                  border: '1px solid #C9D8FF',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <img src={item.image} alt={item.name} style={{ width: '100%', backgroundColor: '#EAEFFF' }} />
                <div style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#0FBF00', marginBottom: '5px' }}>
                    <span style={{ width: '6px', height: '6px', backgroundColor: '#0FBF00', borderRadius: '50%' }}></span>
                    Available
                  </div>
                  <p style={{ fontWeight: '500', fontSize: '18px', color: '#262626', margin: '5px 0' }}>{item.name}</p>
                  <p style={{ fontSize: '12px', color: '#5C5C5C' }}>{item.speciality}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dentists;
