import React from "react";

const IncomingBlocks: React.FC<{ blocks: any[] }> = ({ blocks }) => {
  return (
    <div className="flex flex-col items-start justify-start flex-1 py-8">
      <h1 className="text-lg font-medium font-slate-900">Incoming Blocks</h1>
      <p className="text-normal font-regular text-slate-700">Here are the latest blocks that have been mined.</p>
      <div className="flex flex-col space-y-4 mt-4 w-full">
        {blocks.map(block => (
          <div key={block.id} className="bg-slate-50 p-4 w-full border border-slate-200 rounded-md">
            <div className="flex flex-col justify-between">
              <h2 className="text-2xl font-bold">{block.title}</h2>
              <h2 className="text-2xl font-bold">{block.title}</h2>
            </div>
            <div className="flex flex-col justify-between"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncomingBlocks;
