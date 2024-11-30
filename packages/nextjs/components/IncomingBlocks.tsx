import React from "react";

const IncomingBlocks: React.FC = () => {
  const blocks = [
    { id: 1, title: "Block 1", description: "This is the first block" },
    { id: 2, title: "Block 2", description: "This is the second block" },
    { id: 3, title: "Block 3", description: "This is the third block" },
    { id: 4, title: "Block 4", description: "This is the fourth block" },
    { id: 5, title: "Block 5", description: "This is the fifth block" },
    // Add more blocks as needed
  ];

  return (
    <div className="flex flex-col items-start justify-start flex-1 py-8">
      <h1 className="text-lg font-medium font-slate-900">Incoming Blocks</h1>
      <p className="text-normal font-regular text-slate-700">Here are the latest blocks that have been mined.</p>
      <div className="flex flex-col space-y-4 mt-4 w-full">
        {blocks.map(block => (
          <div key={block.id} className="card bg-gray-200 rounded-md p-4 w-full">
            <h2 className="text-2xl font-bold">{block.title}</h2>
            <p className="text-normal font-regular text-slate-700">{block.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncomingBlocks;
