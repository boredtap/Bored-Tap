import React from "react";
import Navigation from "../components/Navigation";
import "./ProfileScreen2.css";

const ProfileScreen2 = () => {

  const profileData = [
    { icon: `${process.env.PUBLIC_URL}/wallet-icon.png`, label: "Total Coin", value: "500" },
    { icon: `${process.env.PUBLIC_URL}/tasks-icon.png`, label: "Completed Task", value: "104" },
    { icon: `${process.env.PUBLIC_URL}/wallet-icon.png`, label: "Rank", value: "#29" },
    { icon: `${process.env.PUBLIC_URL}/invite-icon.png`, label: "Invited Friends", value: "6" },
    { icon: `${process.env.PUBLIC_URL}/diamond-icon.png`, label: "UQCkNKQP....3LYgP7-Z", value: <img src={`${process.env.PUBLIC_URL}/copy-icon.png`} alt="copy icon" /> },
  ];

  return (
    <div className="profile-screen2">
      {/* Profile Body */}
      <div className="profile-body">
        {/* Profile Picture */}
        <div className="profile-picture">
          <img src={`${process.env.PUBLIC_URL}/profile-picture.png`} alt="Profile" className="profile-image" />
        </div>
        <div className="profile-username">Ridwan007</div>
        <div className="profile-level">Lvl 1</div>

        {/* Profile Data Cards */}
        <div className="profile-data-cards">
          {profileData.map((item, index) => (
            <div key={index} className="profile-data-card">
              <div className="profile-data-left">
                <div className="profile-icon">
                  <img src={item.icon} alt={item.label} />
                </div>
                <div className="profile-label">{item.label}</div>
              </div>
              <div className="profile-data-right">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="profile-links">
          <a href="#privacy">Privacy Policy & Terms of Use</a>
          <a href="#support">Support</a>
        </div>
      </div>

      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default ProfileScreen2;
