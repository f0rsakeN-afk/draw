import React from "react";
import { LogoImage } from "@/utils/ImageExports";
import { Link } from "react-router-dom";

const Logo: React.FC = () => {
  return (
    <Link to="/">
      <img src={LogoImage} alt="logo image" className="h-8 dark:invert" />
    </Link>
  );
};

export default Logo;
