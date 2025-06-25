import React from "react";

const RoleInfoHeader = ({
  role,
  topicsForFocus,
  experience,
  questions,
  description,
  lastUpdated,
}) => {
  return (
  <div className="bg-white relative">
    <div className="continer mx-auto px-10 md:px-5">
      <div className="h-[200px] flex flex-col justify-center relative z-10">
        <div className="flex items-start">
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-medium">{role}</h2>
                <p className="text-sm text-medium text-gray-900 mt-1">{topicsForFocus}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <div className="text-[10px] font-semibold text-white bg-black px-3 py-1 rounded-xs">
            Experience: {experience} {experience === 1 ? "year" : "years"}
          </div>
          <div className="text-[10px] font-semibold text-white bg-black px-3 py-1 rounded-xs">{questions} Q&A</div>
          <div className="text-[10px] font-semibold text-white bg-black px-3 py-1 rounded-xs">Last Updated: {lastUpdated}</div>
        </div>
      </div>
      <div className="w-[40vw] md:w-[30vw] h-[200px] flex items-center justify-between bg-white/70 overflow-hidden absolute top-0 right-0">
        <div className="w-16 h-16 bg-lime-500 blur-[65px] animate-blob1" />
        <div className="w-16 h-16 bg-teal-500 blur-[65px] animate-blob2"/>
        <div className="w-16 h-16 bg-cyan-500 blur-[65px] animate-blob3"/>
        <div className="w-16 h-16 bg-fuchsia-500 blur-[65px] animate-blob1"/>
      </div>
    </div>
  </div>
  )
};

export default RoleInfoHeader;
