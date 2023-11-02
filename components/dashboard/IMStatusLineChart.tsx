import axios from "axios";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import autocolors from "chartjs-plugin-autocolors";
import useDepartments from "@/hooks/useDepartments";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  autocolors
);

export interface IMStatusLineChartProps {
  filter?: {
    status?: string;
    departmentId?: string;
    collegeId?: string;
    start?: string;
    end?: string;
  };
}

export function IMStatusLineChart({ filter }: IMStatusLineChartProps) {
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
  const { departments } = useDepartments({
    skip: 0,
    take: 100,
  });
  const [state, setState] = useState<{
    [label: string]: { [department: string]: number };
  }>();

  useEffect(() => {
    let subscribe = true;

    for (let department of departments) {
      labels.forEach((label) => {
        axios
          .get(`/api/im/count`, {
            params: {
              filter: {
                start: filter?.start ? new Date(filter.start) : undefined,
                end: filter?.end ? new Date(filter.end) : undefined,
                departmentId: department.id,
                status: label,
              },
            },
          })
          .then((res) => {
            if (!subscribe) return;
            setState((prev) => ({
              ...prev,
              [department.name]: {
                ...prev?.[department.name],
                [label]: res.data.count,
              },
            }));
          });
      });
    }

    return () => {
      subscribe = false;
    };
  }, [departments, filter]);

  useEffect(() => {
    console.log({ state });
  }, [state]);

  useEffect(() => {
    console.log({ filter });
  }, [filter]);

  const data = {
    labels,
    datasets: departments.map((department) => {
      return {
        label: department.name,
        data: labels.map((label) => {
          return state?.[department.name]?.[label];
        }),
      };
    }),
  };
  return (
    <Line
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "top" as const,
          },
          title: {
            display: true,
            text: "IM statuses from all departments",
          },
        },
      }}
      data={data}
    />
  );
}
