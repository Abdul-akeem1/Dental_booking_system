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
    const [showBillModal, setShowBillModal] = useState(false);
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
            setSelectedAppointment(null); // Deselects the row when clicked again
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

    const openBillModal = () => {
        if (!selectedAppointment) return toast.warn("Please select an appointment from the table first");
        setShowBillModal(!showBillModal);
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

    const handlePayment = async () => {
        try {
            // updates only the payment fields
            await axios.put(`${API_URL}/${selectedAppointment._id}`, {
                paymentStatus: 'paid',
                discount: discount
            });

            toast.success("Payment successful!");
            setShowBillModal(false);
            fetchAppointments(); // Refresh the table so it visually turns green
        } catch (error) {
            toast.error("Failed to process payment");
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
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
        "16:00", "16:30"
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
                                    <td style={styles.td}>{a.paymentStatus === 'paid' ? "paid" : "no show"}</td>
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
                <button style={styles.btn} onClick={openBillModal}>Generate Bill</button>
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

                        {/* removed treatment */}
                        {/* <div style={styles.inputGroup}>
                            <label>Treatment</label>
                            <select style={styles.select} required name="treatment" value={formData.treatment} onChange={handleInputChange}>
                                <option value="">Select Treatment...</option>
                                {treatments.map(t => (
                                    <option key={t._id} value={t._id}>{t.type}</option>
                                ))}
                            </select>
                        </div> */}

                        <div style={styles.inputGroup}>
                            <label>Date</label>
                            {formMode === "add" ? (
                                <input
                                    style={styles.input}
                                    type="date"
                                    min={today}
                                    required
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <input
                                    style={styles.input}
                                    type="date"
                                    min={today}
                                    required
                                    name="date"
                                    value={formData.date?.substring(0, 10)}
                                    onChange={handleInputChange}

                                />
                            )}
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

                        {/* removed attended */}
                        {/* <div style={{ ...styles.inputGroup, flexDirection: "row", alignItems: "center", gap: "10px", gridColumn: "span 2" }}>
                            <label style={{ fontWeight: "bold" }}>Attended</label>
                            <input type="checkbox" name="attended" checked={formData.attended} onChange={handleInputChange} style={{ width: "20px", height: "20px", cursor: "pointer" }} />
                        </div> */}

                    </div>
                    <div style={{ marginTop: "20px" }}>
                        <button style={{ ...styles.btn, marginRight: "10px" }} type="submit">Submit</button>
                        <button style={{ ...styles.btn, backgroundColor: "#6c757d" }} type="button" onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                </form>
            )}

            {showBillModal && selectedAppointment && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>

                        {/* INVOICE HEADER */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
                            {/* Left Side: Logo & Title */}
                            <div>
                                <h2 className="logo-text" style={{ margin: 0, color: "var(--color-primary-dark)" }}>🦷 DentalCare</h2>
                                <p style={{ margin: 0, fontSize: '14px', color: '#666', marginTop: '5px' }}>Official Invoice</p>
                            </div>

                            {/* Right Side: Invoice # & Status Badge */}
                            <div style={{ textAlign: 'right' }}>
                                {/* I took the last 6 characters of the MongoDB appointments ID to make a random Invoice number */}
                                <p style={{ margin: 0, fontWeight: 'bold', color: '#555', marginBottom: '8px' }}>
                                    Invoice #{selectedAppointment._id.substring(18).toUpperCase()}
                                </p>

                                {/*Status Badge (Green if paid, Red if unpaid) */}
                                <span style={{
                                    padding: '5px 12px',
                                    borderRadius: '15px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    backgroundColor: selectedAppointment.paymentStatus === 'paid' ? '#d4edda' : '#f8d7da',
                                    color: selectedAppointment.paymentStatus === 'paid' ? '#155724' : '#721c24'
                                }}>
                                    {selectedAppointment.paymentStatus === 'paid' ? 'PAID' : 'UNPAID'}
                                </span>
                            </div>
                        </div>

                        {/* PATIENT & APPOINTMENT DETAILS */}
                        <div style={{ margin: '20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <p style={{ margin: '5px 0', fontSize: '13px', color: '#666' }}>Bill To:</p>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>
                                    {selectedAppointment.patient?.firstName} {selectedAppointment.patient?.lastName}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: '5px 0', fontSize: '13px', color: '#666' }}>Date of Appointment:</p>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>
                                    {new Date(selectedAppointment.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* TREATMENT & PRICE TABLE */}
                        <div style={{ margin: '20px 0' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>Treatment</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>Dentist</th>
                                        <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#555' }}>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '12px' }}>{selectedAppointment.treatment?.type}</td>
                                        <td style={{ padding: '12px' }}>
                                            {selectedAppointment.dentist?.firstName} {selectedAppointment.dentist?.lastName}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                                            €{(selectedAppointment.treatment?.price || 0).toFixed(2)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>


                        {/*TOTALS & DISCOUNT*/}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', marginTop: '10px' }}>
                            <div style={{ width: '100%' }}>
                                {/* Subtotal */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#555' }}>
                                    <span>Subtotal:</span>
                                    <span>€{(selectedAppointment.treatment?.price || 0).toFixed(2)}</span>
                                </div>

                                {/* Discount Input */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                                    <span style={{ color: '#555' }}>Discount (€):</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={discount}
                                        onChange={(e) => setDiscount(Number(e.target.value))}
                                        style={{ width: '70px', padding: '4px', textAlign: 'right', border: '1px solid #ccc', borderRadius: '4px' }}
                                    />
                                </div>

                                {/* Final Total Due */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', borderTop: '2px solid #333', paddingTop: '10px', marginTop: '5px' }}>
                                    <strong>Total Due:</strong>
                                    <strong>€{Math.max(0, (selectedAppointment.treatment?.price || 0) - discount).toFixed(2)}</strong>
                                </div>
                            </div>
                        </div>

                        {/* BUTTONS */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                            {/*Print Button */}
                            <button style={{ ...styles.btn, backgroundColor: '#17a2b8' }} onClick={() => window.print()}>
                                Print Invoice
                            </button>
                            {/* made it so that it only shows the Mark as Paid button if the appointment is unpaid */}
                            {selectedAppointment.paymentStatus !== 'paid' && (
                                <button style={{ ...styles.btn, backgroundColor: '#28a745' }} onClick={() => handlePayment()}>
                                    Mark as Paid
                                </button>
                            )}
                            {/* The Cancel Button */}
                            <button style={{ ...styles.btn, backgroundColor: "#6c757d" }} onClick={() => setShowBillModal(false)}>cancel</button>
                        </div>


                    </div>
                </div>
            )}

        </div >

    );
};

export default Appointments;
