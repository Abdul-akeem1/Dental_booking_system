import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api/dentists";

const Dentists = () => {
    const [dentists, setDentists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDentist, setSelectedDentist] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState("add");
    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        speciality: "",
        DOB: "",
        phone: "",
        email: "",
        password: ""
    });

    const fetchDentists = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            setDentists(response.data.dentists || []);
        } catch (error) {
            toast.error("Failed to load dentists");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDentists();
    }, []);

    const handleSelectRow = (dentist) => {
        if (selectedDentist?._id === dentist._id) {
            setSelectedDentist(null);
            setShowForm(false);
        } else {
            setSelectedDentist(dentist);
            setShowForm(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openAddForm = () => {
        setFormMode("add");
        setFormData({
            firstName: "", lastName: "", speciality: "", DOB: "", phone: "", email: "", password: ""
        });
        setShowForm(true);
        setSelectedDentist(null);
    };

    const openUpdateForm = () => {
        if (!selectedDentist) return toast.warn("Please select a dentist from the table first");
        setFormMode("update");
        setFormData({
            firstName: selectedDentist.firstName || "",
            lastName: selectedDentist.lastName || "",
            speciality: selectedDentist.speciality || "",
            DOB: selectedDentist.DOB ? new Date(selectedDentist.DOB).toISOString().split('T')[0] : "",
            phone: selectedDentist.phone || "",
            email: selectedDentist.email || "",
            password: ""
        });
        setShowForm(true);
    };

    const handleDelete = async () => {
        if (!selectedDentist) return toast.warn("Please select a dentist from the table first");
        if (window.confirm("Are you sure you want to delete this dentist?")) {
            try {
                await axios.delete(`${API_URL}/${selectedDentist._id}`);
                toast.success("Dentist deleted successfully");
                setSelectedDentist(null);
                fetchDentists();
            } catch (error) {
                toast.error("Failed to delete dentist");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formMode === "add") {
                await axios.post(API_URL, formData);
                toast.success("Dentist added successfully");
            } else {
                const updateData = { ...formData };
                if (!updateData.password) delete updateData.password;
                await axios.put(`${API_URL}/${selectedDentist._id}`, updateData);
                toast.success("Dentist updated successfully");
            }
            setShowForm(false);
            fetchDentists();
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to ${formMode} dentist`);
        }
    };

    const filteredDentist = dentists.filter(p => {
        const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
        return fullName.includes(search.toLowerCase());
    })

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
            <h2 style={styles.tableTitle}>Dentists Management</h2>

            {/* Dentist Search Barr */}
            <div style={{ marginBottom: "15px" }}>
                <input 
                    type="text" 
                    placeholder="Search dentist name..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        padding: "8px",
                        width: "650px",
                        border: "1px solid #ccc",
                        borderRadius: "4px"
                    }}
                />
            </div>


            {loading ? <p>Loading dentists...</p> : (
                <div style={{ overflowX: "auto" }}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Speciality</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>DOB</th>
                                <th style={styles.th}>Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDentist.map(d => (
                                <tr
                                    key={d._id}
                                    onClick={() => handleSelectRow(d)}
                                    style={selectedDentist?._id === d._id ? styles.trSelected : styles.tr}
                                >
                                    <td style={styles.td}>{d.firstName} {d.lastName}</td>
                                    <td style={styles.td}>{d.speciality}</td>
                                    <td style={styles.td}>{d.email}</td>
                                    <td style={styles.td}>{d.DOB ? new Date(d.DOB).toLocaleDateString() : "N/A"}</td>
                                    <td style={styles.td}>{d.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div style={styles.btnContainer}>
                <button style={styles.btn} onClick={openAddForm}>Add Dentist</button>
                <button style={styles.btn} onClick={openUpdateForm}>Update Selected</button>
                <button style={{ ...styles.btn, ...styles.btnDelete }} onClick={handleDelete}>Delete Selected</button>
            </div>

            {showForm && (
                <form style={styles.form} onSubmit={handleSubmit}>
                    <h3>{formMode === "add" ? "Add New Dentist" : "Update Dentist"}</h3>
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
                            <label>Speciality</label>
                            <input style={styles.input} required name="speciality" value={formData.speciality} onChange={handleInputChange} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label>DOB</label>
                            <input 
                                style={styles.input} 
                                required
                                max={today}
                                type="date" name="DOB" 
                                value={formData.DOB} 
                                onChange={handleInputChange} 
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label>Phone Number</label>
                            <input style={styles.input} required name="phone" value={formData.phone} onChange={handleInputChange} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label>Email</label>
                            <input style={styles.input} type="email" required name="email" value={formData.email} onChange={handleInputChange} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label>Password</label>
                            <input style={styles.input} type="password" required name="password" value={formData.password} onChange={handleInputChange} />
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

export default Dentists;
