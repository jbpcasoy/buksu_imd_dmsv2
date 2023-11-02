import axios from "axios";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import autocolors from "chartjs-plugin-autocolors";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, autocolors);

export function IMStatusPieChart() {
  const [state, setState] = useState<{ [key: string]: number }>();

  const labels = [
    "IMPLEMENTATION_DRAFT",
    "IMPLEMENTATION_DEPARTMENT_REVIEW",
    "IMPLEMENTATION_DEPARTMENT_REVIEWED",
    "IMPLEMENTATION_DEPARTMENT_REVISED",
    "IMPLEMENTATION_DEPARTMENT_COORDINATOR_ENDORSED",
    "IMPLEMENTATION_DEPARTMENT_DEAN_ENDORSED",
    "IMPLEMENTATION_CITL_REVIEWED",
    "IMPLEMENTATION_CITL_REVISED",
    "IMPLEMENTATION_CITL_IDD_COORDINATOR_ENDORSED",
    "IMPLEMENTATION_CITL_DIRECTOR_ENDORSED",
    "IMERC_QAMIS_REVISED",
    "IMERC_QAMIS_DEPARTMENT_ENDORSED",
    "IMERC_CITL_REVIEWED",
    "IMERC_CITL_REVISED",
    "IMERC_CITL_IDD_COORDINATOR_ENDORSED",
    "IMERC_CITL_DIRECTOR_ENDORSED",
  ];

  useEffect(() => {
    let subscribe = true;

    axios.get(`api/im/count/by_status`).then((res) => {
      if (!subscribe) return;
      setState(res.data);
    });

    return () => {
      subscribe = false;
    };
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: "# of IM's",
        data: labels.map((label) => {
          return state?.[label];
        }),
        borderWidth: 1,
      },
    ],
  };

  return (
    <Pie
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "top" as const,
          },
          autocolors: {
            mode: "data",
          },
        },
      }}
      data={data}
    />
  );
}
