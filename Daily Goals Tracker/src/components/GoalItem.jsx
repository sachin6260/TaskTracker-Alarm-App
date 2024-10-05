import React, { useState, useEffect } from 'react';
import './GoalItem.css';  // Ensure you import the CSS file

const GoalItem = ({ goal, toggleComplete, removeGoal }) => {
  const [timeLeft, setTimeLeft] = useState(goal.timer);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeRemaining = goal.endTime - now;

      if (timeRemaining <= 0) {
        clearInterval(interval);
        setTimeLeft(0); // Timer ends
      } else {
        setTimeLeft(timeRemaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [goal]);

  const formatTimeLeft = () => {
    const totalSeconds = Math.floor(timeLeft / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className={`goal-item ${goal.completed ? 'completed' : ''}`}>
      <h3>{goal.text}</h3>
      <p>Time Left: {timeLeft > 0 ? formatTimeLeft() : 'Time is up!'}</p>
      <button className="toggle-complete" onClick={() => toggleComplete(goal.id)}>
        {goal.completed ? 'Completed' : 'Mark as Complete'}
      </button>
      <button className="remove-btn" onClick={() => removeGoal(goal.id)}>Remove</button>
    </div>
  );
};

export default GoalItem;
