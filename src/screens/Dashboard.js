import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import "./Dashboard.css";

/**
 * Dashboard component displaying the main UI with tapping interaction and navigation links.
 * Reacts to daily booster states from BoostScreen via localStorage and events.
 */
const Dashboard = () => {
  const navigate = useNavigate();

  // Static mock data for UI display
  const telegramData = {
    username: "User",
    image_url: `${process.env.PUBLIC_URL}/profile-picture.png`,
  };
  const profile = { level: 1, level_name: "Beginner" };
  const currentStreak = 0;

  // State for game mechanics
  const [totalTaps, setTotalTaps] = useState(0);
  const [tapEffects, setTapEffects] = useState([]);
  const [electricBoost, setElectricBoost] = useState(1000);
  const [maxElectricBoost] = useState(1000); // Static for now
  const [tapValue] = useState(1); // Static for now
  const [dailyBoosters, setDailyBoosters] = useState(() => {
    const saved = localStorage.getItem("dailyBoosters");
    return saved
      ? JSON.parse(saved)
      : {
          tapperBoost: { usesLeft: 3, isActive: false, endTime: null },
          fullEnergy: { usesLeft: 3, isActive: false },
        };
  });
  const [isTapping, setIsTapping] = useState(false);

  // Sync with localStorage and listen for Full Energy event
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("dailyBoosters");
      if (saved) setDailyBoosters(JSON.parse(saved));
    };

    const handleFullEnergyClaimed = () => {
      setElectricBoost(maxElectricBoost);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("fullEnergyClaimed", handleFullEnergyClaimed);

    // Initial sync
    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("fullEnergyClaimed", handleFullEnergyClaimed);
    };
  }, [maxElectricBoost]);

  /**
   * Handles tap events, increments total taps, reduces electric boost, and shows tap effects.
   * @param {Object} event - The tap or click event object.
   */
  const handleTap = (event) => {
    event.preventDefault();

    if (electricBoost <= 0) return;

    setIsTapping(true);

    const multiplier = dailyBoosters.tapperBoost.isActive ? 2 : 1;
    const tapIncrease = tapValue * multiplier;

    setTotalTaps((prev) => prev + tapIncrease);
    setElectricBoost((prev) => Math.max(prev - 1, 0));

    const tapIcon = event.currentTarget.getBoundingClientRect();
    const tapX = (event.touches ? event.touches[0].clientX : event.clientX) - tapIcon.left;
    const tapY = (event.touches ? event.touches[0].clientY : event.clientY) - tapIcon.top;

    const newTapEffect = { id: Date.now(), x: tapX, y: tapY, count: tapIncrease };
    setTapEffects((prevEffects) => [...prevEffects, newTapEffect]);

    setTimeout(() => {
      setTapEffects((prev) => prev.filter((e) => e.id !== newTapEffect.id));
    }, 1000);
  };

  /**
   * Handles tap end to stop tapping state for recharge.
   */
  const handleTapEnd = () => {
    setIsTapping(false);
  };

  // Electric boost recharge (default 3 seconds)
  useEffect(() => {
    if (isTapping || electricBoost >= maxElectricBoost) return;

    const rechargeInterval = setInterval(() => {
      setElectricBoost((prev) => Math.min(prev + 1, maxElectricBoost));
    }, 3000);

    return () => clearInterval(rechargeInterval);
  }, [isTapping, electricBoost, maxElectricBoost]);

  return (
    <div className="dashboard-container">
      {/* Profile and Streak Section */}
      <div className="profile1-streak-section">
        <div className="profile1-section" onClick={() => navigate("/profile-screen")}>
          <img src={telegramData.image_url} alt="Profile" className="profile1-picture" />
          <div className="profile1-info">
            <span className="profile1-username">{telegramData.username}</span>
            <span className="profile1-level">Lv. {profile.level}. {profile.level_name}</span>
          </div>
        </div>
        <div className="streak-section" onClick={() => navigate("/daily-streak-screen")}>
          <img src={`${process.env.PUBLIC_URL}/streak.png`} alt="Streak Icon" className="streak-icon" />
          <div className="streak-info">
            <span className="streak-text">Current Streak</span>
            <span className="streak-days">Day {currentStreak}</span>
          </div>
        </div>
      </div>

      {/* Navigation Frames */}
      <div className="frames-section">
        {[
          { name: "Rewards", icon: "reward.png", path: "/reward-screen" },
          { name: "Challenge", icon: "challenge.png", path: "/challenge-screen" },
          { name: "Clan", icon: "clan.png", path: "/clan-screen" },
          { name: "Leaderboard", icon: "leaderboard.png", path: "/leaderboard-screen" },
        ].map((frame, index) => (
          <div className="frame" key={index} onClick={() => navigate(frame.path)}>
            <img src={`${process.env.PUBLIC_URL}/${frame.icon}`} alt={`${frame.name} Icon`} className="frame-icon" />
            <span>{frame.name}</span>
          </div>
        ))}
      </div>

      {/* Total Taps Section */}
      <div className="total-taps-section">
        <p className="total-taps-text">Your Total Taps:</p>
        <div className="total-taps-count">
          <img className="tap-logo-small" src={`${process.env.PUBLIC_URL}/logo.png`} alt="Small Icon" />
          <span>{totalTaps.toLocaleString()}</span>
        </div>
        <div
          className="big-tap-icon"
          onTouchStart={handleTap}
          onTouchEnd={handleTapEnd}
          onMouseDown={handleTap}
          onMouseUp={handleTapEnd}
        >
          <img className="tap-logo-big" src={`${process.env.PUBLIC_URL}/logo.png`} alt="Big Tap Icon" />
          {tapEffects.map((effect) => (
            <div
              key={effect.id}
              className="tap-effect"
              style={{ top: `${effect.y}px`, left: `${effect.x}px` }}
            >
              +{effect.count}
            </div>
          ))}
        </div>
      </div>

      {/* Electric Boost Section */}
      <div className="electric-boost-section">
        <div className="electric-value">
          <img src={`${process.env.PUBLIC_URL}/electric-icon.png`} alt="Electric Icon" className="electric-icon" />
          <span>{Math.floor(electricBoost)}/{maxElectricBoost}</span>
        </div>
        <button className="boost-btn" onClick={() => navigate("/boost-screen")}>
          <img src={`${process.env.PUBLIC_URL}/boostx2.png`} alt="Boost Icon" className="boost-icon" />
          Boost
        </button>
      </div>

      <Navigation />
    </div>
  );
};

export default Dashboard;