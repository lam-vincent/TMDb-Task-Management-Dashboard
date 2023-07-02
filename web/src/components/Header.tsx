import React from "react";

const Header = () => {
  return (
    <div className="flex justify-center items-center gap-1 font-bold">
      <h1 className="text-2xl font-extrabold bg-yellow-500 p-1.5 pt-1 rounded">
        TMDb
      </h1>
      <span className="text-xs translate-y-1">:</span>
      <span className="text-xs translate-y-1">Task Management Dashboard</span>
    </div>
  );
};

export default Header;
