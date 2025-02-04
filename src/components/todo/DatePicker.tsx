import React, { useState } from "react";
import './datePicker.css'

interface DatePickerProps {
  onDateChange: (date: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateChange }) => {
  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [day, setDay] = useState<string>("");

  const years = ["2025", "2026"];
  const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"));

  // Trigger date change only when a valid full date is selected
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(e.target.value);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(e.target.value);
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDay = e.target.value;
    setDay(selectedDay);

    // Only update the parent if all parts (year, month, day) are selected
    if (year && month && selectedDay) {
      const formattedDate = `${year}-${month}-${selectedDay}`;
      onDateChange(formattedDate); // Trigger the update to the parent
    }
  };

  return (
    <div className="date-picker">
      <select value={year} onChange={handleYearChange}>
        <option value="">Year</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <select value={month} onChange={handleMonthChange}>
        <option value="">Month</option>
        {months.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <select value={day} onChange={handleDayChange}>
        <option value="">Day</option>
        {days.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DatePicker;
