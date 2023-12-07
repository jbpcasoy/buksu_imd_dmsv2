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
      <div className='flex flex-col h-full'>
        <h2>Dashboard</h2>

        <div className='flex-1 flex flex-col h-full'>
          <form noValidate onSubmit={formik.handleSubmit}>
            <div className='flex flex-col space-y-1'>
              <div className='flex space-x-1'>
                <CollegeSelector {...formik.getFieldProps("collegeId")} />
                <DepartmentSelector
                  {...formik.getFieldProps("departmentId")}
                  collegeId={formik.values.collegeId}
                />
              </div>
              <div className='flex space-x-1 items-end'>
                <StatusSelector {...formik.getFieldProps("status")} />
                <div className='flex space-x-1'>
                  <div>
                    <label htmlFor='start' className='text-sm'>
                      START
                    </label>
                    <input
                      type='datetime-local'
                      id='start'
                      max={formik.values.end}
                      className='rounded py-1'
                      {...formik.getFieldProps("start")}
                    />
                  </div>
                  <div>
                    <label htmlFor='end' className='text-sm'>
                      END
                    </label>
                    <input
                      type='datetime-local'
                      id='end'
                      min={formik.values.start}
                      className='rounded py-1'
                      {...formik.getFieldProps("end")}
                    />
                  </div>
                </div>
              </div>
              <div className='space-x-1'>
                <button
                  type='submit'
                  className='rounded bg-palette_blue text-palette_white px-1 hover:bg-opacity-90'
                >
                  Refresh
                </button>
                <button
                  className='rounded bg-palette_blue text-palette_white px-1 hover:bg-opacity-90'
                  onClick={router.reload}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>

          <div className='flex-1 flex w-full h-full'>
            <div className='flex-1 relative h-full'>
              <IMStatusDepartmentLineChart filter={state} />
            </div>
            <div className='flex flex-col justify-center items-center space-y-2  h-full'>
              <div className='h-1/2 relative'>
                <IMStatusPieChart filter={state} />
              </div>
              <div className='h-1/2 relative'>
                <IMDepartmentPieChart filter={state} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
