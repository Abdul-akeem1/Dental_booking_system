import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api/appointments";

const DentistAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [treatments, setTreatments] = useState([]);
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

    const fetchTreatments = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/treatments");
            setTreatments(res.data.treatments || []);
        } catch (error) {
            toast.error("Failed to load treatments");
        }
    };

    const toggleAttended = async (id, currentStatus) => {
        try {
            // Send a partial update to toggle the attended boolean so this will be updated in the database
            await axios.put(`${API_URL}/${id}`, { attended: !currentStatus });
            toast.success(`Appointment marked as ${!currentStatus ? 'attended' : 'unattended'}`);
            fetchAppointments(); // Refresh the table after success
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const updateTreatment = async (id, treatmentId) => {
        try {
            await axios.put(`${API_URL}/${id}`, { treatment: treatmentId });
            toast.success("Treatment updated successfully");
            fetchAppointments(); // Refresh table
        } catch (error) {
            toast.error("Failed to update treatment");
        }
    };

    useEffect(() => {
        fetchAppointments();
        fetchTreatments();
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
                            {/* <th style={styles.th}>Payment Status</th> */}
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
                                    <td style={styles.td}>
                                        <select
                                            value={a.treatment?._id || ""}
                                            onChange={(e) => updateTreatment(a._id, e.target.value)}
                                            style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
                                        >
                                            <option value="">Select Treatment...</option>
                                            {treatments.map((t) => (
                                                <option key={t._id} value={t._id}>
                                                    {t.type}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td style={styles.td}>
                                        <button 
                                            onClick={() => toggleAttended(a._id, a.attended)}
                                            style={{
                                                padding: "6px 12px", 
                                                border: "none", 
                                                borderRadius: "4px", 
                                                backgroundColor: a.attended ? "#28a745" : "#6c757d", 
                                                color: "white", 
                                                cursor: "pointer",
                                                fontWeight: "bold",
                                                fontSize: "12px"
                                            }}>
                                            {a.attended ? "✓ Attended" : "Mark Attended"}
                                        </button>
                                    </td>
                                    {/* <td style={styles.td}>{a.paymentStatus === 'paid' ? "Paid" : "Unpaid"}</td> */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>No appointments found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DentistAppointments;
