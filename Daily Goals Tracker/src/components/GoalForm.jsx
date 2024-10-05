import React, { useState } from 'react';
import './GoalForm.css';  // Ensure you import the CSS file

const GoalForm = ({ addGoal }) => {
  const [text, setText] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text && (hours || minutes)) {
      addGoal({ text, hours, minutes });
      setText('');
      setHours('');
      setMinutes('');
    } else {
      alert('Please fill in the goal and set a time');
    }
  };

  return (
    <form className="goal-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your goal"
        required
      />
      <input
        type="number"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
        placeholder="Hours"
        min="0"
        required
      />
      <input
        type="number"
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
        placeholder="Minutes"
        min="0"
        required
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default GoalForm;
