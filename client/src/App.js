import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, styled } from "styled-components";
import { lightTheme } from "./utils/Themes";
import Authentication from "./pages/Authentication";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Tutorials from "./pages/Tutorials";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import Home from "./pages/Home";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  overflow-x: hidden;
  overflow-y: hidden;
  transition: all 0.2s ease;
`;

function App() {
  const [user, setUser] = useState(null); // null means no user is logged in

  const handleLogin = (userData) => {
    setUser(userData); // Set user data after successful login
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <Router>
        <Container>
          {user ? (
            <Container>
              <Navbar currentUser={user} onLogout={handleLogout} />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/workouts" element={<Workouts />} />
                <Route path="/tutorials" element={<Tutorials />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Container>
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/signin"
                element={
                  <Authentication onLogin={handleLogin} formType="signin" />
                }
              />
              <Route
                path="/signup"
                element={
                  <Authentication onLogin={handleLogin} formType="signup" />
                }
              />
              <Route path="*" element={<Navigate to="/" />} />{" "}
              {/* Default route */}
            </Routes>
          )}
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
