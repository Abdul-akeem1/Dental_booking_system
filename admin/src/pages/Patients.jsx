import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api/users";

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState("add"); // "add" or "update"

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        DOB: "",
        phone: "",
        email: "",
        street: "",
        town: "",
        county: "",
        country: "",
        Eircode: ""
    });

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            setPatients(response.data.users || []);
        } catch (error) {
            toast.error("Failed to load patients");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleSelectRow = (patient) => {
        if (selectedPatient?._id === patient._id) {
            setSelectedPatient(null);
            setShowForm(false);
        } else {
            setSelectedPatient(patient);
            setShowForm(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openAddForm = () => {
        setFormMode("add");
        setFormData({
            firstName: "", lastName: "", DOB: "", phone: "", email: "",
            street: "", town: "", county: "", country: "", Eircode: ""
        });
        setShowForm(true);
        setSelectedPatient(null);
    };

    const openUpdateForm = () => {
        if (!selectedPatient) {
            return toast.warn("Please select a patient from the table first");
        }
        setFormMode("update");
        setFormData({
            firstName: selectedPatient.firstName || "",
            lastName: selectedPatient.lastName || "",
            DOB: selectedPatient.DOB ? new Date(selectedPatient.DOB).toISOString().split('T')[0] : "",
            phone: selectedPatient.phone || "",
            email: selectedPatient.email || "",
            street: selectedPatient.street || "",
            town: selectedPatient.town || "",
            county: selectedPatient.county || "",
            country: selectedPatient.country || "",
            Eircode: selectedPatient.Eircode || ""
        });
        setShowForm(true);
    };

    const handleDelete = async () => {
        if (!selectedPatient) {
            return toast.warn("Please select a patient from the table first");
        }
        if (window.confirm("Are you sure you want to delete this patient?")) {
            try {
                await axios.delete(`${API_URL}/${selectedPatient._id}`);
                toast.success("Patient deleted successfully");
                setSelectedPatient(null);
                fetchPatients();
            } catch (error) {
                toast.error("Failed to delete patient");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formMode === "add") {
                await axios.post(API_URL, formData);
                toast.success("Patient added successfully");
            } else {
                const updateData = { ...formData };
                await axios.put(`${API_URL}/${selectedPatient._id}`, updateData);
                toast.success("Patient updated successfully");
            }
            setShowForm(false);
            fetchPatients();
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to ${formMode} patient`);
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
        input: { padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <div style={styles.container}>
            <h2 style={styles.tableTitle}>Patients Management</h2>

            {loading ? <p>Loading patients...</p> : (
                <div style={{ overflowX: "auto" }}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Phone</th>
                                <th style={styles.th}>DOB</th>
                                <th style={styles.th}>Street</th>
                                <th style={styles.th}>Town</th>
                                <th style={styles.th}>County</th>
                                <th style={styles.th}>Country</th>
                                <th style={styles.th}>Eircode</th>
                                <th style={styles.th}>Amount Owed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map(p => (
                                <tr
                                    key={p._id}
                                    onClick={() => handleSelectRow(p)}
                                    style={selectedPatient?._id === p._id ? styles.trSelected : styles.tr}
                                >
                                    <td style={styles.td}>{p.firstName} {p.lastName}</td>
                                    <td style={styles.td}>{p.email}</td>
                                    <td style={styles.td}>{p.phone}</td>
                                    <td style={styles.td}>{p.DOB ? new Date(p.DOB).toLocaleDateString() : 'N/A'}</td>
                                    <td style={styles.td}>{p.street}</td>
                                    <td style={styles.td}>{p.town}</td>
                                    <td style={styles.td}>{p.county}</td>
                                    <td style={styles.td}>{p.country}</td>
                                    <td style={styles.td}>{p.Eircode}</td>
                                    <td style={styles.td}>€{(p.amountOwed || 0).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div style={styles.btnContainer}>
                <button style={styles.btn} onClick={openAddForm}>Add Patient</button>
                <button style={styles.btn} onClick={openUpdateForm}>Update Selected</button>
                <button style={{ ...styles.btn, ...styles.btnDelete }} onClick={handleDelete}>Delete Selected</button>
            </div>

            {showForm && (
                <form style={styles.form} onSubmit={handleSubmit}>
                    <h3>{formMode === "add" ? "Add New Patient" : "Update Patient"}</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                        <div style={styles.inputGroup}>
                            <label>First Name</label>
                            <input style={styles.input} required name="firstName" value={formData.firstName} onChange={handleInputChange} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label>Last Name</label>
                            <input style={styles.input} required name="lastName" value={formData.lastName} onChange={handleInputChange} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label>DOB</label>

                            <input style={styles.input} required type="date" name="DOB" value={formData.DOB} onChange={handleInputChange} />

                            <input 
                                style={styles.input} 
                                type="date" 
                                max={today}
                                name="DOB" 
                                value={formData.DOB} 
                                onChange={handleInputChange} />

                        </div>
                        <div style={styles.inputGroup}>
                            <label>Phone No</label>
                            <input style={styles.input} required name="phone" value={formData.phone} onChange={handleInputChange} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label>Email</label>
                            <input style={styles.input} required type="email" name="email" value={formData.email} onChange={handleInputChange} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label>Street</label>
                            <input style={styles.input} required name="street" value={formData.street} onChange={handleInputChange} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label>Town</label>
                            <input style={styles.input} required name="town" value={formData.town} onChange={handleInputChange} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label>County</label>
                            <input style={styles.input} required name="county" value={formData.county} onChange={handleInputChange} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label>Country</label>
                            <input style={styles.input} required name="country" value={formData.country} onChange={handleInputChange} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label>Eircode</label>
                            <input style={styles.input} required name="Eircode" value={formData.Eircode} onChange={handleInputChange} />
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

export default Patients;
