import React from "react";
import { assets } from "../assets/assets";

const AddDentist = () => {
  return (
    <form>
      <div>
        <h2>Add Dentist</h2>
      </div>
      <div>
        <lablel htmlFor="">
          <img src={assets.upload_area} alt="" />
        </lablel>
        <input type="file" id="den-img" />
        <p>
          Upload dentist <br /> picture
        </p>
      </div>

      <div>
        <div>
          <div>
            <p>Dentist name</p>
            <input type="text" placeholder="Name" required />
          </div>

          <div>
            <p>Dentist email</p>
            <input type="email" placeholder="Email" required />
          </div>

          <div>
            <p>Dentist password</p>
            <input type="password" placeholder="Password" required />
          </div>

          <div>
            <p>Experience</p>
            <select name="" id="">
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
            <p>Fees</p>
            <input type="fees" placeholder="Your Fees" required />
          </div>
          
        </div>


      </div>
    </form>
  );
};

export default AddDentist;
