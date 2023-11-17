import CollegeSelector from "@/components/CollegeSelector";
import DepartmentSelector from "@/components/DepartmentSelector";
import MainLayout from "@/components/MainLayout";
import StatusSelector from "@/components/StatusSelector";
import { IMDepartmentPieChart } from "@/components/dashboard/IMDepartmentPieChart";
import { IMStatusDepartmentLineChart } from "@/components/dashboard/IMStatusDepartmentLineChart";
import { IMStatusPieChart } from "@/components/dashboard/IMStatusPieChart";
import useActiveCITLDirectorMe from "@/hooks/useActiveCITLDirectorMe";
import useActiveChairpersonMe from "@/hooks/useActiveChairpersonMe";
import useActiveCoordinatorMe from "@/hooks/useActiveCoordinatorMe";
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
  const activeChairperson = useActiveChairpersonMe();
  const activeCoordinator = useActiveCoordinatorMe();

  useEffect(() => {
    if (!department) return;

    formik.setFieldValue("collegeId", department.collegeId);
    formik.setFieldValue("departmentId", department.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department]);

  useEffect(() => {
    console.log({ state });
  }, [state]);

  if (
    activeDean === undefined ||
    activeCITLDirector === undefined ||
    activeIDDCoordinator === undefined ||
    activeFaculty === undefined ||
    activeChairperson === undefined ||
    activeCoordinator === undefined
  )
    return null;

  return (
    <MainLayout>
      <div className='flex flex-col h-full'>
        <h1 className='text-lg'>Dashboard</h1>
        {!activeFaculty &&
          !(activeDean || activeCITLDirector || activeIDDCoordinator) && (
            <div>
              <p>
                Welcome, you are not yet assigned as a faculty. Please be
                patient while the admin sets your roles.
              </p>
            </div>
          )}
        {(activeDean ||
          activeCITLDirector ||
          activeIDDCoordinator ||
          activeCoordinator ||
          activeChairperson) && (
          <div className='flex-1 flex flex-col h-full'>
            <form noValidate onSubmit={formik.handleSubmit}>
              <div className='space-y-1 flex flex-col w-2/3'>
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
                <div className='flex space-x-1'>
                  <div className='text-sm'>
                    <label htmlFor='start'>START </label>
                    <br />
                    <input
                      type='datetime-local'
                      id='start'
                      max={formik.values.end}
                      {...formik.getFieldProps("start")}
                      className='rounded w-full py-1'
                    />
                  </div>
                  <div className='text-sm'>
                    <label htmlFor='end'>END </label>
                    <br />
                    <input
                      type='datetime-local'
                      id='end'
                      min={formik.values.start}
                      {...formik.getFieldProps("end")}
                      className='rounded w-full py-1'
                    />
                  </div>
                </div>
                <div className='space-x-1'>
                  <input
                    type='submit'
                    value='Refresh'
                    className='bg-palette_blue text-palette_white px-2 rounded'
                  />
                  <button
                    className='bg-palette_blue text-palette_white px-2 rounded'
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
        )}
        {activeFaculty &&
          !(
            activeDean ||
            activeCITLDirector ||
            activeIDDCoordinator ||
            activeCoordinator ||
            activeChairperson
          ) && (
            <div>
              <p>Welcome Faculty!</p>
            </div>
          )}
      </div>
    </MainLayout>
  );
}
