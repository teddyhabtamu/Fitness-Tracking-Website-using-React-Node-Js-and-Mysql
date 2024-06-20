import React from "react";
import styled from "styled-components";

const Card = styled.div`
  flex: 1;
  min-width: 200px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  display: flex;
  gap: 6px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
`;

const Value = styled.div`
  font-weight: 600;
  font-size: 32px;
  display: flex;
  align-items: end;
  gap: 8px;
  color: ${({ theme }) => theme.text_primary};
`;

const Unit = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
`;

const Span = styled.div`
  font-weight: 500;
  font-size: 16px;
  ${({ positive, theme }) =>
    positive
      ? `
  color: ${theme.green};`
      : `
  color: ${theme.red};`}
`;

const Icon = styled.div`
  height: fit-content;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  ${({ color, bg }) => `
  background: ${bg};
  color: ${color};
  `}
`;

const Desc = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary + 90};
`;

const CountsCard = ({ item, data }) => {
  console.log("CountsCard Data:", data);

  // Function to format numbers with commas for better readability
  const formatNumber = (number) => {
    if (number !== undefined && number !== null) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return ""; // Return empty string or handle default case
  };

  // Determine which key to access based on item.key
  let value = 0;
  switch (item.key) {
    case "totalCaloriesBurnt":
      value = data.dailyStats.reduce(
        (acc, stat) => acc + stat.calories_burned,
        0
      );
      break;
    case "totalWorkouts":
      value = data.workoutStats.length;
      break;
    case "avgCaloriesBurntPerWorkout":
      const totalCalories = data.workoutStats.reduce(
        (acc, stat) => acc + stat.calories_burned,
        0
      );
      const totalWorkouts = data.workoutStats.length;
      value = totalWorkouts > 0 ? Math.round(totalCalories / totalWorkouts) : 0;
      break;
    default:
      value = 0;
      break;
  }

  return (
    <Card>
      <Left>
        <Title>{item.name}</Title>
        <Value>
          {formatNumber(value)}
          <Unit>{item.unit}</Unit>
          <Span positive>(+10%)</Span>
        </Value>
        <Desc>{item.desc}</Desc>
      </Left>
      <Icon color={item.color} bg={item.lightColor}>
        {item.icon}
      </Icon>
    </Card>
  );
};

export default CountsCard;
