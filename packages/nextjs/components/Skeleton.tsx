import React from "react";

const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-full w-full bg-slate-400 rounded-md"></div>
    </div>
  );
};

export default Skeleton;
