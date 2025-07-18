import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto  flex flex-col items-center justify-center min-h-dvh text-center md:space-y-3">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-xl text-gray-600">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Button onClick={() => navigate("/")} className="mt-4">
        Go Back Home
      </Button>
    </div>
  );
};

export default PageNotFound;
