import React from 'react';
import GoalItem from './GoalItem';

const GoalList = ({ goals, toggleComplete, removeGoal }) => {
  return (
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
  );
};

export default GoalList;
