import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api/dentists";

const DentistList = () => {
    //states for dentist list screen
    const [dentists, setDentists] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [loading, setLoading] = useState(false);

    //get all dentists
    const getAllDentists = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            const dentistsFromApi = response.data.dentists;
            if (dentistsFromApi) {
                setDentists(dentistsFromApi);
            } else {
                setDentists([]);
            }
            toast.success("loaded all dentists");
        } catch (error) {
            toast.error(error.response?.data?.message || "failed to load dentists");
        }
        setLoading(false);
    };

    //get one dentist by id
    const getDentistById = async () => {
        if (searchId.trim() === "") {
            toast.error("please enter a dentist id");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/${searchId.trim()}`);
            setDentists([response.data]);
            toast.success("dentist found");
        } catch (error) {
            toast.error(error.response?.data?.message || "failed to find dentist");
        }
        setLoading(false);
    };

    //delete one dentist
    const deleteDentist = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            const newList = dentists.filter((item) => item._id !== id);
            setDentists(newList);
            toast.success("dentist deleted successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "failed to delete dentist");
        }
    };

    return (
        <div className="client-list-page">
            <h2>dentist list</h2>

            <div className="toolbar">
                <button type="button" onClick={getAllDentists}>find all dentists</button>

                <input
                    className="id-input"
                    type="text"
                    placeholder="enter dentist id"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                />

                <button type="button" onClick={getDentistById}>find by id</button>
            </div>

            {loading && <p>loading</p>}

            {!loading && dentists.length === 0 && <p>no dentists to show</p>}

            {!loading && dentists.length > 0 && (
                <div className="cards-grid">
                    {dentists.map((dentist) => (
                        <div key={dentist._id} className="client-card">
                            <p><strong>id:</strong> {dentist._id}</p>
                            <p><strong>name:</strong> {dentist.firstName} {dentist.lastName}</p>
                            <p><strong>email:</strong> {dentist.email}</p>
                            <p><strong>experience:</strong> {dentist.experience || "-"}</p>
                            <p><strong>speciality:</strong> {dentist.speciality || "-"}</p>

                            <div className="row-actions">
                                <button type="button" onClick={() => deleteDentist(dentist._id)}>delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DentistList;
