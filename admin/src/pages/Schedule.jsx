import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api/appointments";

const Schedule = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    // Dropdown data options
    const [dentists, setDentists] = useState([]);
    const [date, setDate] = useState("");
    const [selectedDentist, setSelectedDentist] = useState("");


    const fetchData = async () => {
        setLoading(true);
        try {
            const [apptsRes, dentistsRes] = await Promise.all([
                axios.get(API_URL),
                axios.get("http://localhost:5000/api/dentists"),
            ]);
            setAppointments(apptsRes.data.appointments || []);
            setDentists(dentistsRes.data.dentists || []);
        } catch (error) {
            toast.error("Failed to load generic data");
        }
        setLoading(false);
    };


    useEffect(() => {
        fetchData();
    }, []);


    const fetchAppointments = async () => {
        try {
            const res = await axios.get(API_URL);
            setAppointments(res.data.appointments || []);
        } catch (error) {
            toast.error("Failed to refresh appointments");
        }
    };

    const handleSelectRow = (appt) => {
        setSelectedAppointment(appt);
    };

    // filter dentists by date
    const handleFilterByDate = () => {
        if (!date) return fetchAppointments();
        const filtered = appointments.filter(a => a.date && a.date.startsWith(date));
        setAppointments(filtered);
    };

    // filter dentists by id
    const handleFilterByDentist = () => {
        if (!selectedDentist) return fetchAppointments();
        const filtered = appointments.filter(a => a.dentist?._id === selectedDentist);
        setAppointments(filtered);
    };


    const styles = {
        mycontainer: { display: "flex", padding: "20px", gap: "20px" },
        container: { padding: "20px" },
        tableTitle: { marginBottom: "15px", color: "#333" },
        table: { width: "100%", borderCollapse: "collapse", marginBottom: "20px" },
        th: { backgroundColor: "#f4f4f4", padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" },
        td: { padding: "10px", borderBottom: "1px solid #ddd" },
        trSelected: { backgroundColor: "#e2f0ff", cursor: "pointer" },
        tr: { cursor: "pointer" },
        btnContainer: { display: "flex", gap: "10px", marginBottom: "20px" },
        btn: { padding: "8px 16px", border: "none", borderRadius: "4px", backgroundColor: "#007bff", color: "white", cursor: "pointer" },
        form: { border: "1px solid #ddd", padding: "20px", borderRadius: "5px", backgroundColor: "#f9f9f9" },
        inputGroup: { display: "flex", flexDirection: "column", marginBottom: "10px" },
        input: { padding: "8px", border: "1px solid #ccc", borderRadius: "4px" },
        select: { padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.tableTitle}>Dentists Schedule</h2>

            {loading ? <p>Loading data...</p> : (
                <div style={{ overflowX: "auto" }}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Dentist</th>
                                <th style={styles.th}>Patient</th>
                                <th style={styles.th}>Treatment</th>
                                <th style={styles.th}>Date</th>
                                <th style={styles.th}>Time</th>
                                <th style={styles.th}>Attended</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(a => (
                                <tr
                                    key={a._id}
                                    onClick={() => handleSelectRow(a)}
                                    style={selectedAppointment?._id === a._id ? styles.trSelected : styles.tr}
                                >
                                    <td style={styles.td}>{a.dentist?.firstName} {a.dentist?.lastName}</td>
                                    <td style={styles.td}>{a.patient?.firstName} {a.patient?.lastName}</td>
                                    <td style={styles.td}>{a.treatment?.type}</td>
                                    <td style={styles.td}>{a.date ? new Date(a.date).toLocaleDateString() : 'N/A'}</td>
                                    <td style={styles.td}>{a.time}</td> 
                                    <td style={styles.td}>{a.attended ? "Yes" : "No"}</td> 
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="mycontainer" style={{ ...styles.mycontainer, alignItems: "center", flexWrap: "wrap", padding: "0" }}>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ fontSize: "14px", fontWeight: "bold", color: "#555", margin: 0 }}>Select Date :</label>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <input type="date" style={styles.input} required name="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        <button style={styles.btn} onClick={handleFilterByDate}>Filter by Date</button>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ fontSize: "14px", fontWeight: "bold", color: "#555", margin: 0 }}>Select Dentist :</label>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <select style={styles.select} required name="dentist" value={selectedDentist} onChange={(e) => setSelectedDentist(e.target.value)}>
                            <option value="">Select Dentist...</option>
                            {dentists.map(d => (
                                <option key={d._id} value={d._id}>{d.firstName} {d.lastName}</option>
                            ))}
                        </select>
                        <button style={styles.btn} onClick={handleFilterByDentist}>Filter by Dentist</button>
                    </div>
                </div>

                <div style={{ display: "flex" }}>
                    <button style={{ ...styles.btn, backgroundColor: "#6c757d" }} onClick={fetchAppointments}>Clear Filters</button>
                </div>

            </div>

        </div>
    );
};

export default Schedule;
