import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = "http://localhost:5000/api/appointments";

const DentistSchedule = () => {
    const [allAppointments, setAllAppointments] = useState([]);
    const [displayedAppointments, setDisplayedAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const dentistId = localStorage.getItem("dentistId");
    
    const [filterDate, setFilterDate] = useState("");

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

            setAllAppointments(data);
            setDisplayedAppointments(data);
        } catch (error) {
            toast.error("Failed to load schedule");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    const handleApplyFilter = () => {
        if (!filterDate) {
            setDisplayedAppointments(allAppointments);
            return;
        }
        const filtered = allAppointments.filter(appt => {
            if (!appt.date) return false;
            return appt.date.substring(0, 10) === filterDate;
        });
        setDisplayedAppointments(filtered);
    };

    const handleClearFilter = () => {
        setFilterDate("");
        setDisplayedAppointments(allAppointments);
    };

    const styles = {
        container: { padding: "20px" },
        tableTitle: { marginBottom: "15px", color: "#333" },
        table: { width: "100%", borderCollapse: "collapse", marginBottom: "20px" },
        th: { backgroundColor: "#f4f4f4", padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd", position: "sticky", top: 0, zIndex: 1 },
        td: { padding: "10px", borderBottom: "1px solid #ddd" },
        btnContainer: { display: "flex", gap: "10px", marginBottom: "20px" },
        btn: { padding: "8px 16px", border: "none", borderRadius: "4px", backgroundColor: "#007bff", color: "white", cursor: "pointer" },
        input: { padding: "8px", border: "1px solid #ccc", borderRadius: "4px" },
        filterArea: { display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px", flexWrap: "wrap", marginTop: "20px" }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.tableTitle}>My Schedule</h2>
            
            

            {loading ? (
                <p>Loading schedule...</p>
            ) : (
                <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: "500px", border: "1px solid #ddd", borderRadius: "5px" }}>
                    <table style={{ ...styles.table, marginBottom: 0 }}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Patient</th>
                                <th style={styles.th}>Treatment</th>
                                <th style={styles.th}>Date</th>
                                <th style={styles.th}>Time</th>
                                <th style={styles.th}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedAppointments.length > 0 ? (
                                displayedAppointments.map(appt => (
                                    <tr key={appt._id} style={{ transition: 'background-color 0.2s', borderBottom: '1px solid #eee' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8f9fa'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <td style={styles.td}>{appt.patient?.firstName} {appt.patient?.lastName}</td>
                                        <td style={styles.td}>{appt.treatment?.type}</td>
                                        <td style={styles.td}>{appt.date ? new Date(appt.date).toLocaleDateString() : 'N/A'}</td>
                                        <td style={styles.td}>{appt.time}</td>
                                        <td style={styles.td}>
                                            <span style={{
                                                padding: '4px 8px', 
                                                borderRadius: '12px', 
                                                fontSize: '12px', 
                                                fontWeight: 'bold', 
                                                display: 'inline-block',
                                                backgroundColor: appt.attended ? '#d4edda' : '#fff3cd',
                                                color: appt.attended ? '#155724' : '#856404'
                                            }}>
                                                {appt.attended ? "✓ Attended" : "Pending Arrival"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#666', padding: '30px' }}>
                                        No appointments found for this selection.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
                <div style={styles.filterArea}>
                <label style={{ fontSize: "14px", fontWeight: "bold", color: "#555" }}>Select Date:</label>
                <input 
                    type="date" 
                    value={filterDate} 
                    onChange={(e) => setFilterDate(e.target.value)} 
                    style={styles.input}
                />
                <button style={styles.btn} onClick={handleApplyFilter}>Apply Filter</button>
                <button style={{ ...styles.btn, backgroundColor: "#6c757d" }} onClick={handleClearFilter}>Clear Filters</button>
            </div>
        </div>
    );
};

export default DentistSchedule;
