import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Filler,
  CategoryScale,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register chart components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Filler,
  CategoryScale
);

const BigOChart = () => {
  // Generate n values for the x-axis
const nValues = Array.from({ length: 100 }, (_, i) => i + 1);

// Scale down the time complexity values to fit the chart
const scaleFactor = 10; // This factor reduces the size of the values
const capValue = 10; // Cap the max value to avoid infinite growth (for O(2^N))

// Compute the corresponding y values for each Big-O complexity
const computeValues = (fn) => {
  const values = [];
  for (let n of nValues) {
    const value = fn(n) / scaleFactor;
    
    if (value >= capValue) {
      // If value exceeds cap, add the cap value and stop
      values.push(capValue);
      break;
    }
    
    values.push(value);
  }
  return values;
};

  // Data for different complexities
  var data = {
    labels: nValues,
    datasets: [
      {
        label: "O(1)",
        data: computeValues(() => 1),
        borderColor: "gray",
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
      },
      {
        label: "O(log N)",
        data: computeValues((n) => Math.log2(n)),
        borderColor: "gray",
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
      },
      {
        label: "O(N)",
        data: computeValues((n) => n),
        borderColor: "gray",
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
      },
      {
        label: "O(N log N)",
        data: computeValues((n) => n * Math.log2(n)),
        borderColor: "gray",
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
      },
      {
        label: "O(N²)",
        data: computeValues((n) => n ** 2),
        borderColor: "gray",
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
      },
      {
        label: "O(2^N)",
        data: computeValues((n) => 2 ** n),
        borderColor: "gray",
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  var isValidComplexity = false;
  if(isValidComplexity) {
    var newComplexityLine = {
      label: "Solution Time complexity", // New Complexity
      data: computeValues((n) => n * Math.log2(Math.log2(n || 1))),
      borderColor: "purple",
      borderWidth: 4,
      fill: false,
      pointRadius: 0,
    };
    data.datasets.push(newComplexityLine);
  }
  else {
    const lineColors = ["gray", "purple", "blue", "green", "orange", "red"];
    for (let dataset = 0; dataset < data.datasets.length; dataset++) {
      data.datasets[dataset].borderColor = lineColors[dataset];
    }
  }
  

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "white",
          font: { size: 12 },
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => `${context.dataset.label}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Input Size (N)",
          color: "white",
        },
        ticks: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Time Complexity",
          color: "white",
        },
        max: capValue, // Set the y-axis maximum to match the cap value
        min: 0, // Ensure the axis starts at 0
        ticks: {
          display: false,
        },
      },
    },
  };

  // data.datasets.map((obj) => console.log(obj.data));

  return (
    <div
      style={{
        width: "600px",
        height: "500px",
        backgroundColor: "#222",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
};

export default BigOChart;

/*
gray purple blue green orange red
*/