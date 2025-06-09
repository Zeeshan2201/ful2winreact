import React from "react";

function NotFound() {
  return (
    <div className="h-screen flex justify-center items-center md:flex-row flex-col" style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you’re looking for does not exist.</p>
    </div>
  );
}

export default NotFound;
