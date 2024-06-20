import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import CountsCard from "../components/cards/CountsCard";
import WeeklyStatCard from "../components/cards/WeeklyStatCard";
import CategoryChart from "../components/cards/CategoryChart";
import AddWorkout from "../components/AddWorkout";
import WorkoutCard from "../components/cards/WorkoutCard";
import dayjs from "dayjs";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Title = styled.div`
  padding: 0px 16px;
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const FlexWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  gap: 22px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 100px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Dashboard = () => {
  const [data, setData] = useState({
    dailyStats: [],
    weeklyStats: [],
    workoutStats: [],
    workouts: [],
  });

  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");

  // Fetch token from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      console.log("Token retrieved from localStorage:", storedToken);
      setToken(storedToken);
    } else {
      setError("Token is missing");
    }
  }, []);

  // Fetch dashboard data and today's workouts on token change
useEffect(() => {
  if (token) {
    fetchDashboardData();
  }
}, [token, todaysWorkouts]);

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const [dashboardResponse, todaysWorkoutsResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get("http://localhost:5000/api/todays-workouts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      console.log("Dashboard Data:", dashboardResponse.data);
      console.log("Today's Workouts Data:", todaysWorkoutsResponse.data);

      setData({
        dailyStats: dashboardResponse.data.dailyStats || [],
        weeklyStats: dashboardResponse.data.weeklyStats || [],
        workoutStats: dashboardResponse.data.workoutStats || [],
        workouts: dashboardResponse.data.workouts || [],
      });

      // Flatten the workouts array
      const allWorkouts = [].concat(...dashboardResponse.data.workouts);

      // Filter today's workouts based on current date
      const today = dayjs().format("YYYY-MM-DD");
      const filteredTodaysWorkouts = allWorkouts.filter(
        (workout) => dayjs(workout.date).format("YYYY-MM-DD") === today
      );

      // Filter out invalid workout entries
      const validTodaysWorkouts = filteredTodaysWorkouts.filter(
        (workout) =>
          workout.workout_id && workout.category && workout.workout_name
      );

      console.log("Filtered Today's Workouts:", validTodaysWorkouts);

      setTodaysWorkouts(validTodaysWorkouts);
      setError(null); // Reset error state if data fetch succeeds
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message); // Set error state with the error message
    }
  };

  // Function to handle adding a workout
  const handleAddWorkout = async (newWorkout) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/workouts",
        newWorkout,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Workout added successfully!");

      // Update today's workouts with the new workout
      const addedWorkout = response.data;
      const today = dayjs().format("YYYY-MM-DD");

      if (dayjs(addedWorkout.date).format("YYYY-MM-DD") === today) {
        // Update state immediately with the new workout
        setTodaysWorkouts((prevWorkouts) => [...prevWorkouts, addedWorkout]);
      }
    } catch (error) {
      console.error("Error adding workout:", error);
      alert("Failed to add workout");
    }
  };

  // Render error if there's an issue
  if (error) {
    return <div>Error: {error}</div>;
  }

  const countsCardItems = [
    {
      name: "Total Calories Burnt",
      key: "totalCaloriesBurnt",
      unit: "calories",
      desc: "Total calories burned overall",
      color: "#FFFFFF",
      lightColor: "#2D78D1",
      icon: "💪",
    },
    {
      name: "Total Workouts",
      key: "totalWorkouts",
      unit: "workouts",
      desc: "Total number of workouts completed",
      color: "#FFFFFF",
      lightColor: "#FFB300",
      icon: "🏋️",
    },
    {
      name: "Avg Calories Burnt Per Workout",
      key: "avgCaloriesBurntPerWorkout",
      unit: "calories",
      desc: "Average calories burned per workout",
      color: "#FFFFFF",
      lightColor: "#E91E63",
      icon: "🔥",
    },
  ];

  return (
    <Container>
      <Wrapper>
        <Title>Dashboard</Title>
        <FlexWrap>
          {countsCardItems.map((item) => (
            <CountsCard key={item.key} item={item} data={data} />
          ))}
        </FlexWrap>

        <FlexWrap>
          {data && Object.keys(data).length > 0 && (
            <>
              <WeeklyStatCard data={data} />
              <CategoryChart data={data} />
              <AddWorkout token={token} onAddWorkout={handleAddWorkout} />
            </>
          )}
        </FlexWrap>

        <Section>
          <Title>Today's Workouts</Title>
          <CardWrapper>
            {todaysWorkouts.length > 0 ? (
              todaysWorkouts.map((workout) => (
                <WorkoutCard key={workout.workout_id} workout={workout} />
              ))
            ) : (
              <div>No workouts found for today.</div>
            )}
          </CardWrapper>
        </Section>
      </Wrapper>
    </Container>
  );
};

export default Dashboard;
