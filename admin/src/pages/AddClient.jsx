import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios"; //used to send data from frontend to backend
import { toast } from "react-toastify";
import "./AddClient.css";

const API_URL = "http://localhost:5000/api/users";

const AddClient = () => {
  //these states store what user type in each input box
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [town, setTown] = useState("");
  const [county, setCounty] = useState("");
  const [password, setPassword] = useState("");

  //checkif every field has some value(after remove empty spaces)
  //we want the field to be empty and has no spaces (since js counts space as string)
  const allFieldsFilled =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    phone.trim() !== "" &&
    email.trim() !== "" &&
    street.trim() !== "" &&
    town.trim() !== "" &&
    county.trim() !== "" &&
    password.trim() !== "";

  //reset all inputs after succesful submit
  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setStreet("");
    setTown("");
    setCounty("");
    setPassword("");
  };

  //this runs when user clicks the create client button
  const handleSubmit = async (e) => {
    //stop page reload on form submit
    e.preventDefault();

    //extra safety check before sending data to backend
    if (!allFieldsFilled) {
      toast.error("Please fill in all fields before creating a client.");
      return;
    }

    //build the object that backend expects
    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      street: street.trim(),
      town: town.trim(),
      county: county.trim(),
      password: password.trim(),
    };

    try {
      //send new client data to backend api
      const { data } = await axios.post(API_URL, payload);
      console.log(data);
      toast.success("Client created successfully");
      clearForm();
    } catch (error) {
      //show backend message if it exist, if not show default message
      toast.error("Failed to create client");
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
          {/*  .row 1: first name and last name */}
          <div className="container">
            <div className="input">
              <p>First Name</p>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="input">
              <p>Last Name</p>
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* row 2: phone and email */}
          <div className="container">
            <div className="input">
              <p>Phone</p>
              <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="input">
              <p>Email</p>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* row 3: adress fields */}
          <div className="container">
            <div className="address-container">
              <p>Street</p>
              <input
                type="text"
                placeholder="Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />
            </div>

            <div className="address-container">
              <p>Town</p>
              <input
                type="text"
                placeholder="Town"
                value={town}
                onChange={(e) => setTown(e.target.value)}
                required
              />
            </div>

            <div className="address-container">
              <p>County</p>
              <input
                type="text"
                placeholder="County"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                required
              />
            </div>
          </div>

          {/* password field */}
          <div className="input password-input">
            <p>Password</p>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* submit button */}
          <div className="button">
            <button type="submit" disabled={!allFieldsFilled}>
              Create Client
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddClient;