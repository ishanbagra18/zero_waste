// src/components/LoadingSpinner.jsx
import React from "react";
import { ClipLoader } from "react-spinners";

const LoadingSpinner = ({ loading }) => {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-black">
      <ClipLoader
        color="#36d7b7"
        loading={loading}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default LoadingSpinner;
