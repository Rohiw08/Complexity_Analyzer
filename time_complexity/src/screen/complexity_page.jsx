import React from "react";

const SimpleComplexityChart = () => {
  // Generate SVG path for different complexity functions
  const generatePoints = (fn, scale = 1, maxY = 200) => {
    const points = [];
    let prevY = 0;
    
    for (let i = 0; i <= 100; i++) {
      const x = i / 100 * 200;
      const input = (i / 100) * 10 * scale;
      let y = fn(input);
      
      // Prevent sudden spikes by checking against previous value
      if (i > 0 && Math.abs(y - prevY) > 50) {
        y = prevY + (y > prevY ? 50 : -50);
      }
      
      // Ensure y value stays within bounds
      y = Math.max(0, Math.min(y, maxY));
      points.push(`${x},${200 - y}`);
      prevY = y;
    }
    return points.join(' L ');
  };

  const complexityFns = {
    constant: (x) => 20, // O(1)
    logarithmic: (x) => Math.log2(x + 1) * 20, // O(log n)
    linear: (x) => x * 20, // O(n)
    nLogN: (x) => {
        const result = x * Math.log2(x + 1) * 20;
        return Math.min(result, 200);
    },
    quadratic: (x) =>  Math.pow(x, 2) * 20, // O(n²)
  };

  // Legend data with colors
  const legendItems = [
    { name: "O(1)", color: "#4D4D4D" },
    { name: "O(log n)", color: "#4D4D4D" },
    { name: "O(n)", color: "#4D4D4D" },
    { name: "O(n log n)", color: "#4D4D4D" },
    { name: "O(n²)", color: "#4D4D4D" },
  ];

  return (
    <div className="w-full max-w-md rounded-lg bg-gray-900 p-6">
      <div className="mb-4">
        <h2 className="text-xl text-white text-center font-semibold">
          Algorithm Time Complexity
        </h2>
      </div>

      <div className="relative">
        <svg 
          viewBox="0 0 200 200" 
          className="w-full h-full"
          style={{ backgroundColor: '#1a1a1a'}}
        > 
          <path
            d={`M 0,${200 - complexityFns.constant(0)} L ${generatePoints(complexityFns.constant)}`}
            stroke={legendItems[0].color}
            fill="none"
            strokeWidth="1.5"
          />
          <path
            d={`M 0,200 L ${generatePoints(complexityFns.logarithmic)}`}
            stroke={legendItems[1].color}
            fill="none"
            strokeWidth="1.5"
          />
          <path
            d={`M 0,200 L ${generatePoints(complexityFns.linear)}`}
            stroke={legendItems[2].color}
            fill="none"
            strokeWidth="1.5"
          />
          <path
            d={`M 0,200 L ${generatePoints(complexityFns.nLogN)}`}
            stroke={legendItems[3].color}
            fill="none"
            strokeWidth="1.5"
          />
           <path
            d={`M 0,200 L ${generatePoints(complexityFns.quadratic)}`}
            stroke={legendItems[4].color}
            fill="none"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );
};

export default SimpleComplexityChart;

{/* 
exponential: (x) => Math.min(Math.pow(2, x) * 40, 200), // O(2^n)
factorial: (x) => {
    const n = Math.min(x, 5);
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result * 4;
},

{ name: "O(2ⁿ)", color: "#4D4D4D" },
{ name: "O(n!)", color: "#4D4D4D" },

<path
    d={`M 0,200 L ${generatePoints(complexityFns.exponential, 0.5)}`}
    stroke={legendItems[5].color}
    fill="none"
    strokeWidth="1.5"
/>

<path
    d={`M 0,200 L ${generatePoints(complexityFns.factorial, 0.2)}`}
    stroke={legendItems[6].color}
    fill="none"
    strokeWidth="1.5"
/> 

{/* <g stroke="#333" strokeWidth="0.5">
  {[0, 50, 100, 150, 200].map((pos) => (
    <React.Fragment key={pos}>
      <line x1="0" y1={pos} x2="200" y2={pos} />
      <line x1={pos} y1="0" x2={pos} y2="200" />
    </React.Fragment>
  ))}
</g> 

*/}


