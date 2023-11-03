import CollegeSelector from "@/components/CollegeSelector";
import DepartmentSelector from "@/components/DepartmentSelector";
import MainLayout from "@/components/MainLayout";
import StatusSelector from "@/components/StatusSelector";
import { IMDepartmentPieChart } from "@/components/dashboard/IMDepartmentPieChart";
import { IMStatusDepartmentLineChart } from "@/components/dashboard/IMStatusDepartmentLineChart";
import { IMStatusLineChart } from "@/components/dashboard/IMStatusLineChart";
import { IMStatusPieChart } from "@/components/dashboard/IMStatusPieChart";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

export default function Home() {
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

  useEffect(() => {
    console.log({ state });
  }, [state]);

  return (
    <MainLayout>
      <h1 className='text-lg'>Dashboard</h1>
      <form noValidate onSubmit={formik.handleSubmit}>
        <CollegeSelector {...formik.getFieldProps("collegeId")} />
        <DepartmentSelector
          {...formik.getFieldProps("departmentId")}
          collegeId={formik.values.collegeId}
        />
        <StatusSelector {...formik.getFieldProps("status")} />
        <label htmlFor='start'>start: </label>
        <input
          type='datetime-local'
          id='start'
          max={formik.values.end}
          {...formik.getFieldProps("start")}
        />
        <br />
        <label htmlFor='end'>end: </label>
        <input
          type='datetime-local'
          id='end'
          min={formik.values.start}
          {...formik.getFieldProps("end")}
        />
        <br />
        <div>
          <input type='submit' value='Refresh' className='border rounded' />
          <button className='border rounded' onClick={formik.handleReset}>
            Reset
          </button>
        </div>
      </form>

      <div>
        <IMStatusDepartmentLineChart filter={state} />
        <div className='flex flex-row justify-center items-center space-y-2'>
          <div className='w-1/2 xs:w-full'>
            <IMStatusPieChart filter={state} />
          </div>
          <div className='w-1/2 xs:w-full'>
            <IMDepartmentPieChart filter={state} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
