// import React from "react";
// import { Navigate } from "react-router-dom";

// const PrivateRoute = ({ children }) => {
//   const user = localStorage.getItem("user");
//   return user ? children : <Navigate to="/login" />;
// };

// export default PrivateRoute;
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const PrivateRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null); // null = loading, true = valid, false = invalid

  useEffect(() => {
    const checkAuth = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !token) {
        setIsValid(false);
        return;
      }

      try {
        const response = await axios.post(
          "https://ful2win-backend.onrender.com/api/auth/verify-token",
          { userId: user._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.valid) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        setIsValid(false);
      }
    };

    checkAuth();
  }, []);

  if (isValid === null) {
    return <div>Loading...</div>; // Or a spinner
  }

  return isValid ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
