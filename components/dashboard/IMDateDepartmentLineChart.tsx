import useCollege from "@/hooks/useCollege";
import useDepartments from "@/hooks/useDepartments";
import iMStatusNormalizer from "@/services/iMStatusNormalizer";
import axios from "axios";
import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import autocolors from "chartjs-plugin-autocolors";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

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

interface IMDateDepartmentLineChartProps {
  filter?: {
    status?: string;
    departmentId?: string;
    collegeId?: string;
    start?: string;
    end?: string;
  };
}

export function IMDateDepartmentLineChart({
  filter,
}: IMDateDepartmentLineChartProps) {
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
    filter,
  });
  const college = useCollege({ id: filter?.collegeId ?? "" });
  const [state, setState] = useState<{
    [label: string]: { [department: string]: number };
  }>();

  useEffect(() => {
    let subscribe = true;

    axios
      .get(`/api/im/count/status_by_date/draft`, {
        params: {
          filter: {
            status: filter?.status,
            collegeId: filter?.collegeId,
            departmentId: filter?.departmentId,
            start: filter?.start ? new Date(filter.start) : undefined,
            end: filter?.end ? new Date(filter.end) : undefined,
          },
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

  useEffect(() => {
    console.log({ state });
  }, [state]);

  useEffect(() => {
    console.log({ filter });
  }, [filter]);

  const data: ChartData<"line", (number | undefined)[], string> = {
    labels: labels.map((label) => iMStatusNormalizer(label)),
    datasets: departments.map((department) => {
      return {
        label: department.name,
        fill: true,
        data: labels.map((label) => {
          return state?.[department.name]?.[label];
        }),
        tension: 0.4,
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
            text: `IM statuses from ${college?.name ?? "all"} departments`,
          },
        },
      }}
      data={data}
    />
  );
}
