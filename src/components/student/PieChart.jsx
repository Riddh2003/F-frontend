import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ finalScore }) => {  // Receive finalScore as a prop

  // Define your data and options
  const data = {
    datasets: [
      {
        label: 'Score Percentage',
        data: [finalScore, 100 - finalScore], // to show the score as part of a full circle
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(201, 203, 207)', // color for remaining percentage
        ],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`,
        },
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default PieChart;
