import AdminLayout from "@/components/AdminLayout";
import CollegeSelector from "@/components/CollegeSelector";
import DepartmentSelector from "@/components/DepartmentSelector";
import StatusSelector from "@/components/StatusSelector";
import { IMDepartmentPieChart } from "@/components/dashboard/IMDepartmentPieChart";
import { IMStatusDepartmentLineChart } from "@/components/dashboard/IMStatusDepartmentLineChart";
import { IMStatusPieChart } from "@/components/dashboard/IMStatusPieChart";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import * as Yup from "yup";

export default function AdminDashboard() {
  const router = useRouter();
  const [state, setState] = useState<{
    collegeId: undefined;
    departmentId: undefined;
    status: undefined;
    start: undefined;
    end: undefined;
  }>();

  const formik = useFormik({
    initialValues: {
      collegeId: undefined,
      departmentId: undefined,
      status: undefined,
      start: undefined,
      end: undefined,
    },
    validationSchema: Yup.object({
      collegeId: Yup.string().optional(),
      departmentId: Yup.string().optional(),
      status: Yup.string().optional(),
      start: Yup.date().optional(),
      end: Yup.date().optional(),
    }),
    onSubmit: (values) => {
      setState(values);
    },
  });

  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col w-full h-full space-y-4">
        <form noValidate onSubmit={formik.handleSubmit}>
          <div className="flex flex-row justify-between items-center">
            <div className="bg-palette_white p-4 rounded-lg flex space-x-2 items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 stroke-palette_grey"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              <h1 className=" font-semibold">Dashboard</h1>
            </div>
            <div className="space-x-1 flex">
              <CollegeSelector {...formik.getFieldProps("collegeId")} />
              <DepartmentSelector
                {...formik.getFieldProps("departmentId")}
                collegeId={formik.values.collegeId}
              />
              <input
                type="datetime-local"
                id="start"
                max={formik.values.end}
                {...formik.getFieldProps("start")}
                className="rounded w-full py-1"
              />
              <input
                type="datetime-local"
                id="end"
                min={formik.values.start}
                {...formik.getFieldProps("end")}
                className="rounded w-full py-1"
              />
              <StatusSelector {...formik.getFieldProps("status")} />
            </div>
            <div className="space-x-1">
              {/* <button
                type="submit"
                className="bg-palette_blue text-palette_white px-2 rounded"
              >
                Refresh
              </button> */}

              <button
                type="submit"
                className="bg-palette_white p-4 rounded-lg active:bg-palette_light_grey"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </button>
            </div>
          </div>
        </form>

        <div className="flex-1 flex w-full h-full">
          <div className="w-3/4">
            <div className="relative bg-palette_white rounded-2xl p-4">
              <IMStatusDepartmentLineChart filter={state} />
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center space-y-2">
            <div className="h-60 relative">
              <IMStatusPieChart filter={state} />
            </div>
            <div className="h-60 relative">
              <IMDepartmentPieChart filter={state} />
            </div>
          </div>
        </div>
        {/* <div>
            <div className="flex-1 relative h-full">
              <IMDateDepartmentLineChart filter={state} />
            </div>
          </div> */}
      </div>
    </AdminLayout>
  );
}
