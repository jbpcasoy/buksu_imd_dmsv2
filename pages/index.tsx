import MainLayout from "@/components/MainLayout";
import { IMDepartmentPieChart } from "@/components/dashboard/IMDepartmentPieChart";
import { IMStatusLineChart } from "@/components/dashboard/IMStatusLineChart";
import { IMStatusPieChart } from "@/components/dashboard/IMStatusPieChart";
import { useFormik } from "formik";
import { useState } from "react";
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

  return (
    <MainLayout>
      <h1 className='text-lg'>Dashboard</h1>
      <form noValidate onSubmit={formik.handleSubmit}>
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
        <input type='submit' value='Refresh' className='border rounded' />
      </form>

      <div>
        <IMStatusLineChart filter={state} />
        <div className='flex flex-row justify-center items-center'>
          <div className='w-1/2 xs:w-full'>
            <IMStatusPieChart />
          </div>
          <div className='w-1/2 xs:w-full'>
            <IMDepartmentPieChart />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
