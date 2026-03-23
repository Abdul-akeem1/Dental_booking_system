import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api/treatments";

const Treatments = () => {
    const [treatments, setTreatments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTreatment, setSelectedTreatment] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState("add");

    const [formData, setFormData] = useState({
        type: "",
        price: "",
        lengthMins: ""
    });

    const fetchTreatments = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            setTreatments(response.data.treatments || []);
        } catch (error) {
            toast.error("Failed to load treatments");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTreatments();
    }, []);

    const handleSelectRow = (treatment) => {
        if (selectedTreatment?._id === treatment._id) {
            setSelectedTreatment(null);
            setShowForm(false);
        } else {
            setSelectedTreatment(treatment);
            setShowForm(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openAddForm = () => {
        setFormMode("add");
        setFormData({ type: "", price: "", lengthMins: "" });
        setShowForm(true);
        setSelectedTreatment(null);
    };

    const openUpdateForm = () => {
        if (!selectedTreatment) return toast.warn("Please select a treatment from the table first");
        setFormMode("update");
        setFormData({
            type: selectedTreatment.type || "",
            price: selectedTreatment.price || "",
            lengthMins: selectedTreatment.lengthMins || ""
        });
        setShowForm(true);
    };

    const handleDelete = async () => {
        if (!selectedTreatment) return toast.warn("Please select a treatment from the table first");
        if (window.confirm("Are you sure you want to delete this treatment?")) {
            try {
                await axios.delete(`${API_URL}/${selectedTreatment._id}`);
                toast.success("Treatment deleted successfully");
                setSelectedTreatment(null);
                fetchTreatments();
            } catch (error) {
                toast.error("Failed to delete treatment");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert price and lengthMins to numbers 
            const payload = {
                ...formData,
                price: Number(formData.price),
                lengthMins: Number(formData.lengthMins)
            };

            //validations
            //prevent negative values
            if (payload.price < 0) {
                return toast.error("Price cannot be negative");
            }

            if (payload.lengthMins < 0) {
                return toast.error("Length cannot be negative");
            }

            //validate length should not be less than 30 mins, or not more than 240 mins (4hrs)
            if (payload.lengthMins < 30) {
                return toast.error("Treatment duration must be atleast 30 mins.")
            }

            if (payload.lengthMins > 240) {
                return toast.error("Treatment duration too long.")
            }


            if (formMode === "add") {
                await axios.post(API_URL, payload);
                toast.success("Treatment added successfully");
            } else {
                await axios.put(`${API_URL}/${selectedTreatment._id}`, payload);
                toast.success("Treatment updated successfully");
            }
            setShowForm(false);
            fetchTreatments();
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to ${formMode} treatment`);
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

    return (
        <div style={styles.container}>
            <h2 style={styles.tableTitle}>Treatments Management</h2>

            {loading ? <p>Loading treatments...</p> : (
                <div style={{ overflowX: "auto" }}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Type</th>
                                <th style={styles.th}>Price (€)</th>
                                <th style={styles.th}>Duration (mins)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {treatments.map(t => (
                                <tr
                                    key={t._id}
                                    onClick={() => handleSelectRow(t)}
                                    style={selectedTreatment?._id === t._id ? styles.trSelected : styles.tr}
                                >
                                    <td style={styles.td}>{t.type}</td>
                                    <td style={styles.td}>€{t.price}</td>
                                    <td style={styles.td}>{t.lengthMins}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div style={styles.btnContainer}>
                <button style={styles.btn} onClick={openAddForm}>Add Treatment</button>
                <button style={styles.btn} onClick={openUpdateForm}>Update Selected</button>
                <button style={{ ...styles.btn, ...styles.btnDelete }} onClick={handleDelete}>Delete Selected</button>
            </div>

            {showForm && (
                <form style={styles.form} onSubmit={handleSubmit}>
                    <h3>{formMode === "add" ? "Add New Treatment" : "Update Treatment"}</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                        <div style={styles.inputGroup}>
                            <label>Type</label>
                            <input style={styles.input} required name="type" value={formData.type} onChange={handleInputChange} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label>Price (€)</label>
                            <input 
                                style={styles.input} 
                                type="number"                                 
                                required 
                                name="price" 
                                value={formData.price} 
                                onChange={handleInputChange} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label>Length (Mins)</label>
                            <input 
                                style={styles.input} 
                                type="number" 
                                required 
                                name="lengthMins" 
                                value={formData.lengthMins} 
                                onChange={handleInputChange} />
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

export default Treatments;
