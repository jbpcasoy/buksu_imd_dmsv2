import useDepartments from "@/hooks/useDepartments";
import iMStatusNormalizer from "@/services/iMStatusNormalizer";
import axios from "axios";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import autocolors from "chartjs-plugin-autocolors";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, autocolors);

export function IMDepartmentPieChart({
  filter,
}: {
  filter?: {
    status?: string;
    departmentId?: string;
    collegeId?: string;
    start?: string;
    end?: string;
  };
}) {
  const [state, setState] = useState<{ [key: string]: number }>();
  const { departments } = useDepartments({
    skip: 0,
    take: 100,
    filter,
  });

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

    axios
      .get(`api/im/count/by_department`, {
        params: {
          filter,
        },
      })
      .then((res) => {
        if (!subscribe) return;
        setState(res.data);
      });

    return () => {
      subscribe = false;
    };
  }, [filter]);

  if (departments?.length < 1) return null;

  const data = {
    labels: departments?.map((department) => department.name),
    datasets: [
      {
        label: `${
          filter?.status ? iMStatusNormalizer(filter.status) : ""
        } IM's`,
        data: departments.map((department) => {
          return state?.[department.name];
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
          title: {
            display: true,
            text: "By Department",
          },
          legend: {
            display: false,
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
