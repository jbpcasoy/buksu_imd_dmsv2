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
      setState({
        ...values,
        start: values.start == "" ? undefined : values.start,
        end: values.end == "" ? undefined : values.end,
      });
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

  if (
    !(
      activeCoordinator ||
      activeChairperson ||
      activeIDDCoordinator ||
      activeCITLDirector ||
      activeDean
    )
  ) {
    router.replace("/department/my_ims");
  }

  return (
    <MainLayout>
      {(activeDean ||
        activeCITLDirector ||
        activeIDDCoordinator ||
        activeCoordinator ||
        activeChairperson) && (
        <div className="space-y-4">
          <div className="flex items-center">
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
            <form noValidate onSubmit={formik.handleSubmit} className="flex-1">
              <div className="flex items-center justify-between">
                <div className="space-x-4 flex-1 flex items-center justify-center">
                  <CollegeSelector
                    {...formik.getFieldProps("collegeId")}
                    disabled={!(activeCITLDirector || activeIDDCoordinator)}
                  />
                  <DepartmentSelector
                    {...formik.getFieldProps("departmentId")}
                    collegeId={formik.values.collegeId}
                    disabled={
                      !(
                        activeDean ||
                        activeCITLDirector ||
                        activeIDDCoordinator
                      )
                    }
                  />
                  <div className="flex flex-row space-x-2">
                    <div className="text-sm">
                      {/* <label htmlFor="start">FROM </label> */}
                      {/* <br /> */}
                      <input
                        type="date"
                        id="start"
                        max={formik.values.end}
                        {...formik.getFieldProps("start")}
                        className="rounded w-full p-3"
                      />
                    </div>
                    <div className="text-sm">
                      {/* <label htmlFor="end">TO </label> */}
                      {/* <br /> */}
                      <input
                        type="date"
                        id="end"
                        min={formik.values.start}
                        {...formik.getFieldProps("end")}
                        className="rounded w-full p-3"
                      />
                    </div>
                  </div>
                  <div>
                    <StatusSelector {...formik.getFieldProps("status")} />
                  </div>
                </div>

                <div className="space-x-1">
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
          </div>
          <div className="flex-1 flex h-full">
            <div className="flex-1 relative h-full  space-y-4 w-3/4">
              <div className="flex-1 relative bg-palette_white rounded-3xl p-4">
                <IMStatusDepartmentLineChart filter={state} />
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2 w-1/4">
              <div className="h-60 relative">
                <IMStatusPieChart filter={state} />
              </div>
              <div className="h-60 relative">
                <IMDepartmentPieChart filter={state} />
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
