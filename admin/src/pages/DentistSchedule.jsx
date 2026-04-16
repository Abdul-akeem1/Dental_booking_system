import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Clock, User, Activity } from 'lucide-react';

const API_URL = "http://localhost:5000/api/appointments";

const DentistSchedule = () => {
    const [groupedAppointments, setGroupedAppointments] = useState({});
    const [loading, setLoading] = useState(true);
    const dentistId = localStorage.getItem("dentistId");

    const fetchSchedule = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}?dentistId=${dentistId}`);
            const data = res.data.appointments || [];

            // Sort appointments chronologically
            data.sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                if (dateA !== dateB) return dateA - dateB;
                return a.time.localeCompare(b.time); // e.g. "09:00" vs "14:30"
            });

            // Group by date string
            const grouped = {};
            data.forEach(appt => {
                const dateObj = new Date(appt.date);
                // "Monday, April 14, 2026"
                const formalDate = dateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                if (!grouped[formalDate]) {
                    grouped[formalDate] = [];
                }
                grouped[formalDate].push(appt);
            });

            setGroupedAppointments(grouped);
        } catch (error) {
            toast.error("Failed to load schedule");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    const styles = {
        container: { padding: '30px', maxWidth: '800px', margin: '0 auto' },
        header: { color: "#28a745", marginBottom: '20px', fontSize: '2rem', borderBottom: '2px solid #e9ecef', paddingBottom: '10px' },
        dateHeader: { backgroundColor: '#f8f9fa', padding: '10px 15px', borderRadius: '5px', color: '#495057', fontSize: '1.2rem', marginTop: '30px', borderLeft: '4px solid #28a745' },
        card: { backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', padding: '20px', marginTop: '15px', display: 'flex', border: '1px solid #eee', transition: 'transform 0.2s ease' },
        timeArea: { minWidth: '100px', borderRight: '2px solid #e9ecef', paddingRight: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' },
        timeText: { fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' },
        detailsArea: { paddingLeft: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },
        infoRow: { display: 'flex', alignItems: 'center', gap: '8px', color: '#555', fontSize: '1rem' },
        badge: { padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' },
        attendedBadge: { backgroundColor: '#d4edda', color: '#155724' },
        pendingBadge: { backgroundColor: '#fff3cd', color: '#856404' }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>My Weekly Schedule</h2>
            
            {loading ? (
                <p style={{ color: '#666', fontSize: '1.2rem' }}>Loading timeline...</p>
            ) : Object.keys(groupedAppointments).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginTop: '20px' }}>
                    <h3 style={{ color: '#6c757d' }}>Your schedule is completely clear!</h3>
                    <p style={{ color: '#adb5bd' }}>No upcoming appointments booked.</p>
                </div>
            ) : (
                Object.keys(groupedAppointments).map(dateKey => (
                    <div key={dateKey}>
                        <h3 style={styles.dateHeader}>{dateKey}</h3>
                        
                        {groupedAppointments[dateKey].map(appt => (
                            <div key={appt._id} style={styles.card}>
                                <div style={styles.timeArea}>
                                    <Clock size={20} color="#6c757d" style={{ marginBottom: '5px' }} />
                                    <span style={styles.timeText}>{appt.time}</span>
                                </div>
                                <div style={styles.detailsArea}>
                                    <div style={styles.infoRow}>
                                        <User size={18} color="#007bff" />
                                        <span style={{ fontWeight: '600', color: '#333', fontSize: '1.1rem' }}>
                                            {appt.patient?.firstName} {appt.patient?.lastName}
                                        </span>
                                    </div>
                                    <div style={styles.infoRow}>
                                        <Activity size={18} color="#dc3545" />
                                        <span>{appt.treatment?.type}</span>
                                    </div>
                                    <div style={{ marginTop: '5px' }}>
                                        <span style={{ ...styles.badge, ...(appt.attended ? styles.attendedBadge : styles.pendingBadge) }}>
                                            {appt.attended ? "✓ Attended" : "Pending Arrival"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
};

export default DentistSchedule;
