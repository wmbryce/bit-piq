import React from "react";

const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`animate-pulse bg-slate-200 ${className}`}>
      <div className="h-full w-full bg-slate-300"></div>
    </div>
  );
};

export default Skeleton;
