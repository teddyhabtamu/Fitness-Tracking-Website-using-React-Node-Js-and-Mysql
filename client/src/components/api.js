const BASE_URL = "http://localhost:5000"; // Replace with your actual backend URL

export const addWorkout = async (workoutData, token) => {
  try {
    console.log(token);
    const response = await fetch(`${BASE_URL}/api/workouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(workoutData),
    });
    if (!response.ok) {
      throw new Error("Failed to add workout");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
