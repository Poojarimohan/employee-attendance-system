import React from "react";

function AttendanceCalendar({ data }) {
  if (!data || data.length === 0) {
    return <p>No attendance records found.</p>;
  }

  const grouped = data.reduce((acc, day) => {
    acc[day.date] = day.status;
    return acc;
  }, {});

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const squares = [];

  for (let i = 0; i < firstDay; i++) {
    squares.push({ empty: true });
  }

  for (let day = 1; day <= totalDays; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    const status = grouped[dateStr] || "absent";

    squares.push({ day, status });
  }

  const getColor = (status) => {
    switch (status) {
      case "present":
        return "green";
      case "late":
        return "orange";
      case "half-day":
        return "purple";
      case "absent":
      default:
        return "red";
    }
  };

  return (
    <div>
      <h3>
        {today.toLocaleString("default", { month: "long" })} {year}
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 45px)", gap: "5px" }}>
        {squares.map((sq, index) =>
          sq.empty ? (
            <div key={index}></div>
          ) : (
            <div
              key={index}
              style={{
                padding: "8px",
                textAlign: "center",
                background: getColor(sq.status),
                color: "white",
                borderRadius: "4px",
              }}
            >
              {sq.day}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default AttendanceCalendar;
