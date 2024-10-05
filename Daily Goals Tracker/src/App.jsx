import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GoalForm from './components/GoalForm';
import GoalItem from './components/GoalItem';
import './App.css';

const App = () => {
  const [goals, setGoals] = useState(() => {
    // Load goals from local storage if available
    const savedGoals = localStorage.getItem('goals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });
  
  const [timerAlarms, setTimerAlarms] = useState([]);

  // Add a goal
  const addGoal = ({ text, hours, minutes }) => {
    const timerInMs = (parseInt(hours) * 60 * 60 * 1000) + (parseInt(minutes) * 60 * 1000);
    const newGoal = {
      id: Date.now(),
      text,
      completed: false,
      timer: timerInMs,
      endTime: Date.now() + timerInMs, // Store the end time for alarm checking
      warned: false, // Flag to track if the 1-minute warning was shown
      finished: false, // Flag to track if the time-up alarm was shown
    };
    setGoals((prevGoals) => {
      const updatedGoals = [...prevGoals, newGoal];
      localStorage.setItem('goals', JSON.stringify(updatedGoals)); // Save to local storage
      return updatedGoals;
    });
    setTimerAlarms((prev) => [...prev, newGoal]); // Add the new goal to the alarms list
    toast.success('Goal added successfully!');
  };

  // Toggle goal completion
  const toggleComplete = (id) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => 
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );

    // Remove the goal's timer when it's completed
    setTimerAlarms((prev) => prev.filter((alarm) => alarm.id !== id));

    // Notify the user for early completion
    toast.success("Well done! You completed the goal before the timer ended!");

    // Update local storage after completion
    localStorage.setItem('goals', JSON.stringify(goals));
  };

  // Remove a goal
  const removeGoal = (id) => {
    setGoals((prevGoals) => {
      const updatedGoals = prevGoals.filter((goal) => goal.id !== id);
      localStorage.setItem('goals', JSON.stringify(updatedGoals)); // Save to local storage
      return updatedGoals;
    });
    setTimerAlarms((prev) => prev.filter((alarm) => alarm.id !== id)); // Remove alarm when goal is deleted
    toast.error('Goal removed!');
  };

  // Check alarms every second
  useEffect(() => {
    const checkAlarms = () => {
      const now = Date.now();
      timerAlarms.forEach((alarm) => {
        const goal = goals.find(g => g.id === alarm.id);

        // Skip goals that are completed
        if (goal?.completed) return;

        const timeLeft = alarm.endTime - now;

        // Trigger 1-minute warning only once
        if (timeLeft <= 60000 && timeLeft > 0 && !alarm.warned) {
          toast.info(`Reminder: Goal "${goal?.text}" is due in 1 minute!`);
          alarm.warned = true; // Mark the alarm as warned
        }

        // Trigger final alarm when time is up
        if (timeLeft <= 0 && !alarm.finished) {
          toast.warning(`Time's up for the goal: "${goal?.text}"!`);
          const audio = new Audio('/audio.wav'); // Path to your alarm sound in the public folder
          audio.play().catch(err => console.error("Failed to play audio", err));
          alarm.finished = true; // Mark the alarm as finished
        }
      });
    };

    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
  }, [timerAlarms, goals]);

  return (
    <div className="App">
      <ToastContainer />
      <h1>TaskTracker Alarm</h1>
      <GoalForm addGoal={addGoal} />
      <div className="goal-list">
        {goals.map((goal) => (
          <GoalItem
            key={goal.id}
            goal={goal}
            toggleComplete={toggleComplete}
            removeGoal={removeGoal}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
