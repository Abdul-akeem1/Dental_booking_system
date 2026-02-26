import React from "react";
import { assets } from "../assets/assets";
import { useState } from "react";
import axios from "axios";
import "./AddClient.css";

const AddClient = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [street, setStreet] = useState("");
    const [town, setTown] = useState("");
    const [county, setCounty] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            firstName,
            lastName,
            phone, 
            email,
            street,
            town,
            county,
            password,
        };

        try {
            const { data } = await axios.post("http://localhost:5000/api/users", payload);
            // clear form after success
            setFirstName("");
            setLastName("");
            setPhone("");
            setEmail("");
            setStreet("");
            setTown("");
            setCounty("");
            setPassword("");
            console.log(data); 
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-client-form">
          <div className="form-header">
            <h2>Add Client</h2>
          </div>
          <div className="upload-section">
            <label htmlFor="den-img">
              <img src={assets.upload_area} alt="" />
            </label>
            <input type="file" id="den-img" />
            <p>
              Upload Client <br /> picture
            </p>
          </div>
    
          <div className="form-content">
            <div>
                <div className="container">
                    <div className="input">
                        <p>First Name</p>
                        <input 
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)} 
                        />
                    </div>

                    <div className="input">
                        <p>Last Name</p>
                        <input 
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)} 
                        />
                    </div>
                </div>
              

              <div className="container">
                <div className="input">
                    <p>Phone</p>
                    <input 
                        type="text"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)} 
                    />
                </div>
                
                <div className="input">
                    <p>Email</p>
                    <input 
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
              </div>

              

                <div className="container">
                    <div className="address-container">
                        <p>Street</p>
                        <input 
                            type="text"
                            placeholder="Street"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)} 
                        />
                    </div>
                    
                    <div className="address-container">
                        <p>Town</p>
                        <input 
                            type="text"
                            placeholder="Town"
                            value={town}
                            onChange={(e) => setTown(e.target.value)} 
                        />
                    </div>

                    <div className="address-container">
                        <p>County</p>
                        <input 
                            type="text"
                            placeholder="County"
                            value={county}
                            onChange={(e) => setCounty(e.target.value)} 
                        />
                    </div>
                </div>
              

              <div className="input password-input">
                <p>Password</p>
                <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                />
              </div>

              <div className="button">
                <button type="submit">Create Client</button>
              </div>

            </div>
          </div>
        </form>
      );
}

export default AddClient;