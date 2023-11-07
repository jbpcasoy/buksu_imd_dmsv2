import CollegeSelector from "@/components/CollegeSelector";
import DepartmentSelector from "@/components/DepartmentSelector";
import MainLayout from "@/components/MainLayout";
import StatusSelector from "@/components/StatusSelector";
import { IMDepartmentPieChart } from "@/components/dashboard/IMDepartmentPieChart";
import { IMStatusDepartmentLineChart } from "@/components/dashboard/IMStatusDepartmentLineChart";
import { IMStatusPieChart } from "@/components/dashboard/IMStatusPieChart";
import useActiveCITLDirectorMe from "@/hooks/useActiveCITLDirectorMe";
import useActiveDeanMe from "@/hooks/useActiveDeanMe";
import useActiveFacultyMe from "@/hooks/useActiveFacultyMe";
import useActiveIDDCoordinatorMe from "@/hooks/useActiveIDDCoordinatorMe";
import useDepartmentMe from "@/hooks/useDepartmentMe";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";

export default function Home() {
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

  const department = useDepartmentMe();
  const activeDean = useActiveDeanMe();
  const activeCITLDirector = useActiveCITLDirectorMe();
  const activeIDDCoordinator = useActiveIDDCoordinatorMe();
  const activeFaculty = useActiveFacultyMe();

  useEffect(() => {
    if (!department) return;

    formik.setFieldValue("collegeId", department.collegeId);
    formik.setFieldValue("departmentId", department.id);
  }, [department]);

  useEffect(() => {
    console.log({ state });
  }, [state]);

  return (
    <MainLayout>
      <h1 className='text-lg'>Dashboard</h1>
      {!activeFaculty &&
        !(activeDean || activeCITLDirector || activeIDDCoordinator) && (
          <div>
            <p>
              Welcome, you are not yet assigned as a faculty. Please be patient
              while the admin sets your roles.
            </p>
          </div>
        )}
      {activeFaculty &&
        !(activeDean || activeCITLDirector || activeIDDCoordinator) && (
          <div>
            <p>Welcome Faculty!</p>
          </div>
        )}
      {(activeDean || activeCITLDirector || activeIDDCoordinator) && (
        <div>
          <form noValidate onSubmit={formik.handleSubmit}>
            <CollegeSelector
              {...formik.getFieldProps("collegeId")}
              disabled={!(activeCITLDirector || activeIDDCoordinator)}
            />
            <DepartmentSelector
              {...formik.getFieldProps("departmentId")}
              collegeId={formik.values.collegeId}
              disabled={
                !(activeDean || activeCITLDirector || activeIDDCoordinator)
              }
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
              <button className='border rounded' onClick={router.reload}>
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
        </div>
      )}
    </MainLayout>
  );
}
