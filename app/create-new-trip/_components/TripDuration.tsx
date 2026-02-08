import React from "react";

export const TripDaysList = Array.from({ length: 30 }, (_, i) => i + 1); // 1 to 30 days

interface TripDurationProps {
  onSelectedOption: (days: string) => void; // string to match your ChatBox
}

const TripDuration: React.FC<TripDurationProps> = ({ onSelectedOption }) => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
      {TripDaysList.map((day) => (
        <div
          key={day}
          className="p-4 border rounded-2xl bg-white hover:border-primary cursor-pointer flex flex-col items-center justify-center"
          onClick={() => onSelectedOption(day.toString())}
        >
          <h2 className="text-lg font-bold">{day}</h2>
          <p className="text-sm text-gray-500">{day === 1 ? "Day" : "Days"}</p>
        </div>
      ))}
    </div>
  );
};

export default TripDuration;
