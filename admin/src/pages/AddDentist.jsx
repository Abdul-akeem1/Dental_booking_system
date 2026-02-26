import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api/dentists";

const AddDentist = () => {
  //states for dentist form inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("");
  const [speciality, setSpeciality] = useState("General");

  //check if all required fields are filled
  const allFieldsFilled =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    experience.trim() !== "" &&
    speciality.trim() !== "";

  //reset all fields after success
  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setExperience("");
    setSpeciality("General");
  };

  const handleSubmit = async (e) => {
    //stop page reload on form submit
    e.preventDefault();

    if (!allFieldsFilled) {
      toast.error("please fill in all fields before creating a dentist");
      return;
    }

    //object that backend expects
    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password: password.trim(),
      experience: experience.trim(),
      speciality: speciality.trim(),
    };

    try {
      //send new dentist data to backend api
      const { data } = await axios.post(API_URL, payload);
      console.log(data);
      toast.success("dentist created successfully");
      clearForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "failed to create dentist");
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-client-form">
      <div>
        <h2>Add Dentist</h2>
      </div>
      <div>
        <label htmlFor="den-img">
          <img src={assets.upload_area} alt="" />
        </label>
        <input type="file" id="den-img" />
        <p>
          Upload dentist <br /> picture
        </p>
      </div>

      <div>
        <div>
          <div>
            <p>First Name</p>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div>
            <p>Last Name</p>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div>
            <p>Email</p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <p>Password</p>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <p>Experience</p>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
            >
              <option value="" disabled>Select Experience</option>
              <option value="1 Year">1 Year</option>
              <option value="2 Year">2 Year</option>
              <option value="3 Year">3 Year</option>
              <option value="4 Year">4 Year</option>
              <option value="5 Year">5 Year</option>
              <option value="6 Year">6 Year</option>
              <option value="7 Year">7 Year</option>
              <option value="8 Year">8 Year</option>
              <option value="9 Year">9 Year</option>
              <option value="10 Year">10 Year</option>
            </select>
          </div>

          <div>
            <p>Speciality</p>
            <input
              type="text"
              placeholder="Speciality"
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              required
            />
          </div>

          <div>
            <button type="submit" disabled={!allFieldsFilled}>Create Dentist</button>
          </div>
          
        </div>


      </div>
    </form>
  );
};

export default AddDentist;
