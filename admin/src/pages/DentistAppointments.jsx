import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api/appointments";

const DentistAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const dentistId = localStorage.getItem("dentistId");

    const fetchAppointments = async () => {
        try {
            // Using the filter we built in the backend
            const res = await axios.get(`${API_URL}?dentistId=${dentistId}`);
            setAppointments(res.data.appointments || []);
        } catch (error) {
            toast.error("Failed to load appointments");
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const styles = {
        container: { padding: "20px", display: "flex", flexDirection: "column", gap: "20px" },
        tableContainer: { overflowX: "auto", backgroundColor: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
        table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
        th: { padding: "12px", borderBottom: "2px solid #ddd", color: "#333", fontWeight: "600" },
        td: { padding: "12px", borderBottom: "1px solid #ddd", color: "#666" }
    };

    return (
        <div style={styles.container}>
            <div style={styles.tableContainer}>
                <h2 style={{ marginBottom: "15px", color: "#28a745" }}>My Appointments</h2>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Date & Time</th>
                            <th style={styles.th}>Patient Name</th>
                            <th style={styles.th}>Treatment</th>
                            <th style={styles.th}>Attended</th>
                            <th style={styles.th}>Payment Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.length > 0 ? (
                            appointments.map(a => (
                                <tr key={a._id}>
                                    <td style={styles.td}>
                                        {new Date(a.date).toLocaleDateString()} @ {a.time}
                                    </td>
                                    <td style={styles.td}>{a.patient?.firstName} {a.patient?.lastName}</td>
                                    <td style={styles.td}>{a.treatment?.type}</td>
                                    <td style={styles.td}>{a.attended ? "Yes" : "No"}</td>
                                    <td style={styles.td}>{a.paymentStatus === 'paid' ? "Paid" : "Unpaid"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No appointments found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DentistAppointments;
