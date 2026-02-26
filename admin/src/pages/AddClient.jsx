import React from "react";
import { assets } from "../assets/assets";

const AddClient = () => {
    return (
        <form>
          <div>
            <h2>Add Client</h2>
          </div>
          <div>
            <lablel htmlFor="">
              <img src={assets.upload_area} alt="" />
            </lablel>
            <input type="file" id="den-img" />
            <p>
              Upload Client <br /> picture
            </p>
          </div>
    
          <div>
            <div>
              <div>
                <p>Client Name</p>
                <input type="text" placeholder="Name" required />
              </div>

              <div>
                <p>Phone</p>
                <input type="number" placeholder="Phone" required />
              </div>

              <div>
                <p>Email</p>
                <input type="text" placeholder="Email" required />
              </div>

              <div>
                <p>Street</p>
                <input type="text" placeholder="Street" required />
              </div>
              
              <div>
                <p>Town</p>
                <input type="text" placeholder="Town" required />
              </div>

              <div>
                <p>County</p>
                <input type="text" placeholder="County" required />
              </div>

              <div>
                <p>Password</p>
                <input type="password" placeholder="Password" required />
              </div>
              
            </div>
    
    
          </div>
        </form>
      );
}