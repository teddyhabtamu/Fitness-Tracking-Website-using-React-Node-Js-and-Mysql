import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";
import { addWorkout } from "./api"; // Import your API utility function

const Card = styled.div`
  flex: 1;
  min-width: 280px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  display: flex;
  flex-direction: column;
  gap: 6px;
  @media (max-width: 600px) {
    padding: 16px;
  }
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const AddWorkout = ({ token }) => {
  const [workout, setWorkout] = useState({
    category: "",
    workout_name: "",
    sets: "",
    reps: "",
    weight: "",
    duration: "",
    date: "", // Ensure date field is included
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkout((prevWorkout) => ({
      ...prevWorkout,
      [name]: value,
    }));
  };

  const handleAddWorkoutClick = async () => {
    try {
      await addWorkout(workout, token); // Pass token to addWorkout function
      setWorkout({
        category: "",
        workout_name: "",
        sets: "",
        reps: "",
        weight: "",
        duration: "",
        date: "", // Clear date field after successful addition
      });
      alert("Workout added successfully!");
    } catch (error) {
      console.error("Error adding workout:", error);
      alert("Failed to add workout");
    }
  };

  return (
    <Card>
      <Title>Add New Workout</Title>
      <TextInput
        label="Category"
        value={workout.category}
        name="category"
        handleChange={handleChange}
      />
      <TextInput
        label="Workout Name"
        value={workout.workout_name}
        name="workout_name"
        handleChange={handleChange}
      />
      <TextInput
        label="Sets"
        value={workout.sets}
        name="sets"
        handleChange={handleChange}
      />
      <TextInput
        label="Reps"
        value={workout.reps}
        name="reps"
        handleChange={handleChange}
      />
      <TextInput
        label="Weight"
        value={workout.weight}
        name="weight"
        handleChange={handleChange}
      />
      <TextInput
        label="Duration"
        value={workout.duration}
        name="duration"
        handleChange={handleChange}
      />
      <TextInput
        label="Date"
        type="date"
        value={workout.date}
        name="date"
        handleChange={handleChange}
      />
      <Button text="Add Workout" small onClick={handleAddWorkoutClick} />
    </Card>
  );
};

export default AddWorkout;
