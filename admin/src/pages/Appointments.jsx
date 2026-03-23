import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api/appointments";

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState("add");

    // Dropdown data options
    const [patients, setPatients] = useState([]);
    const [dentists, setDentists] = useState([]);
    const [treatments, setTreatments] = useState([]);
    const [showBillModel, setShowBillModel] = useState(false);
    const [discount, setDiscount] = useState(0);

    const [formData, setFormData] = useState({
        patient: "",
        dentist: "",
        treatment: "",
        date: "",
        time: "",
        attended: false
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [apptsRes, patientsRes, dentistsRes, treatmentsRes] = await Promise.all([
                axios.get(API_URL),
                axios.get("http://localhost:5000/api/users"),
                axios.get("http://localhost:5000/api/dentists"),
                axios.get("http://localhost:5000/api/treatments")
            ]);
            setAppointments(apptsRes.data.appointments || []);
            setPatients(patientsRes.data.users || []);
            setDentists(dentistsRes.data.dentists || []);
            setTreatments(treatmentsRes.data.treatments || []);
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
        if (selectedAppointment?._id === appt._id) {
            setSelectedAppointment(null);
            setShowForm(false);
        } else {
            setSelectedAppointment(appt);
            setShowForm(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const openAddForm = () => {
        setFormMode("add");
        setFormData({ patient: "", dentist: "", treatment: "", date: "", time: "", attended: false });
        setShowForm(true);
        setSelectedAppointment(null);
    };

    const openUpdateForm = () => {
        if (!selectedAppointment) return toast.warn("Please select an appointment from the table first");
        setFormMode("update");
        setFormData({
            patient: selectedAppointment.patient?._id || "",
            dentist: selectedAppointment.dentist?._id || "",
            treatment: selectedAppointment.treatment?._id || "",
            date: selectedAppointment.date || "",
            time: selectedAppointment.time || "",
            attended: selectedAppointment.attended || false
        });
        setShowForm(true);
    };

    const openBillModel = () => {
        if (!selectedAppointment) return toast.warn("Please select an appointment from the table first");
        setShowBillModel(true);
    }

    const handleDelete = async () => {
        if (!selectedAppointment) return toast.warn("Please select an appointment from the table first");
        if (window.confirm("Are you sure you want to delete this appointment?")) {
            try {
                await axios.delete(`${API_URL}/${selectedAppointment._id}`);
                toast.success("Appointment deleted successfully");
                setSelectedAppointment(null);
                fetchAppointments();
            } catch (error) {
                toast.error("Failed to delete appointment");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formMode === "add") {
                await axios.post(API_URL, formData);
                toast.success("Appointment added successfully");
            } else {
                await axios.put(`${API_URL}/${selectedAppointment._id}`, formData);
                toast.success("Appointment updated successfully");
            }
            setShowForm(false);
            fetchAppointments();
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to ${formMode} appointment`);
        }
    };

    const styles = {
        container: { padding: "20px" },
        tableTitle: { marginBottom: "15px", color: "#333" },
        table: { width: "100%", borderCollapse: "collapse", marginBottom: "20px" },
        th: { backgroundColor: "#f4f4f4", padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" },
        td: { padding: "10px", borderBottom: "1px solid #ddd" },
        trSelected: { backgroundColor: "#e2f0ff", cursor: "pointer" },
        tr: { cursor: "pointer" },
        btnContainer: { display: "flex", gap: "10px", marginBottom: "20px" },
        btn: { padding: "8px 16px", border: "none", borderRadius: "4px", backgroundColor: "#007bff", color: "white", cursor: "pointer" },
        btnDelete: { backgroundColor: "#dc3545" },
        form: { border: "1px solid #ddd", padding: "20px", borderRadius: "5px", backgroundColor: "#f9f9f9" },
        inputGroup: { display: "flex", flexDirection: "column", marginBottom: "10px" },
        input: { padding: "8px", border: "1px solid #ccc", borderRadius: "4px" },
        select: { padding: "8px", border: "1px solid #ccc", borderRadius: "4px" },

        //This is the bill modal styles
        modalOverlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark semi-transparent background
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000 // Ensures it sits on top of everything
        },
        modalContent: {
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "500px",
            maxWidth: "90%",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }
    };

    const timeSlots = [
            "09:00","09:30","10:00","10:30","11:00","11:30",
            "12:00","12:30","14:00","14:30","15:00","15:30",
            "16:00","16:30"
    ];

    const today = new Date().toISOString().split("T")[0]; //for min in html (so it disables days before today)

    return (
        <div style={styles.container}>
            <h2 style={styles.tableTitle}>Appointments Management</h2>

            {loading ? <p>Loading data...</p> : (
                <div style={{ overflowX: "auto" }}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Date</th>
                                <th style={styles.th}>Time</th>
                                <th style={styles.th}>Patient</th>
                                <th style={styles.th}>Dentist</th>
                                <th style={styles.th}>Treatment</th>
                                <th style={styles.th}>Payment Status</th>
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
                                    <td style={styles.td}>{a.date ? new Date(a.date).toLocaleDateString() : 'N/A'}</td>
                                    <td style={styles.td}>{a.time}</td>
                                    <td style={styles.td}>{a.patient?.firstName} {a.patient?.lastName}</td>
                                    <td style={styles.td}>{a.dentist?.firstName} {a.dentist?.lastName}</td>
                                    <td style={styles.td}>{a.treatment?.type}</td>
                                    <td style={styles.td}>{a.paymentStatus ? "paid" : "unpaid"}</td>
                                    <td style={styles.td}>{a.attended ? "Yes" : "No"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div style={styles.btnContainer}>
                <button style={styles.btn} onClick={openAddForm}>Add Appointment</button>
                <button style={styles.btn} onClick={openUpdateForm}>Update Selected</button>
                <button style={styles.btn} onliclick={openBillModel}>Genereate Bill</button>
                <button style={{ ...styles.btn, ...styles.btnDelete }} onClick={handleDelete}>Delete Selected</button>
            </div>

            {showForm && (
                <form style={styles.form} onSubmit={handleSubmit}>
                    <h3>{formMode === "add" ? "Add New Appointment" : "Update Appointment"}</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>

                        <div style={styles.inputGroup}>
                            <label>Patient</label>
                            <select style={styles.select} required name="patient" value={formData.patient} onChange={handleInputChange}>
                                <option value="">Select Patient...</option>
                                {patients.map(p => (
                                    <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>
                                ))}
                            </select>
                        </div>

                        <div style={styles.inputGroup}>
                            <label>Dentist</label>
                            <select style={styles.select} required name="dentist" value={formData.dentist} onChange={handleInputChange}>
                                <option value="">Select Dentist...</option>
                                {dentists.map(d => (
                                    <option key={d._id} value={d._id}>{d.firstName} {d.lastName}</option>
                                ))}
                            </select>
                        </div>

                        <div style={styles.inputGroup}>
                            <label>Treatment</label>
                            <select style={styles.select} required name="treatment" value={formData.treatment} onChange={handleInputChange}>
                                <option value="">Select Treatment...</option>
                                {treatments.map(t => (
                                    <option key={t._id} value={t._id}>{t.type}</option>
                                ))}
                            </select>
                        </div>

                        <div style={styles.inputGroup}>
                            <label>Date</label>
                            <input 
                                style={styles.input} 
                                type="date" 
                                min={today}
                                required 
                                name="date" 
                                value={formData.date} 
                                onChange={handleInputChange} 
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label>Time</label>
                            {/* <input style={styles.input} type="time" required name="time" value={formData.time} onChange={handleInputChange} /> */}
                            <select
                                name="time"
                                value={formData.time}
                                onChange={handleInputChange}
                                required
                                >
                                <option value="">Select Time</option>
                                {timeSlots.map(slot => (
                                    <option key={slot} value={slot}>{slot}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ ...styles.inputGroup, flexDirection: "row", alignItems: "center", gap: "10px", gridColumn: "span 2" }}>
                            <label style={{ fontWeight: "bold" }}>Attended</label>
                            <input type="checkbox" name="attended" checked={formData.attended} onChange={handleInputChange} style={{ width: "20px", height: "20px", cursor: "pointer" }} />
                        </div>

                    </div>
                    <div style={{ marginTop: "20px" }}>
                        <button style={{ ...styles.btn, marginRight: "10px" }} type="submit">Submit</button>
                        <button style={{ ...styles.btn, backgroundColor: "#6c757d" }} type="button" onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                </form>
            )}

            
        </div>
    );
};

export default Appointments;
