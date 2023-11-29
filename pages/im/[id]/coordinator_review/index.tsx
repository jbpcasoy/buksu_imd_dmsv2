import MainLayout from "@/components/MainLayout";
import ReviewItem from "@/components/ReviewItem";
import ReviewSection from "@/components/ReviewSection";
import { SnackbarContext } from "@/components/SnackbarProvider";
import useActiveCoordinatorMe from "@/hooks/useActiveCoordinatorMe";
import useCoordinatorReviewIM from "@/hooks/useCoordinatorReviewIM";
import useDepartmentReviewIM from "@/hooks/useDepartmentReviewIM";
import ReviewQuestions from "@/services/ReviewQuestions";
import ReviewSections from "@/services/ReviewSections";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import * as Yup from "yup";

export default function AddCoordinatorReviewPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const departmentReview = useDepartmentReviewIM({ id: iMId as string });
  const coordinatorReview = useCoordinatorReviewIM({ id: iMId as string });
  const activeFaculty = useActiveCoordinatorMe();
  const { addSnackbar } = useContext(SnackbarContext);
  const formik = useFormik({
    initialValues: {
      q1_1: "",
      q1_2: "",
      q2_1: "",
      q2_2: "",
      q2_3: "",
      q2_4: "",
      q3_1: "",
      q4_1: "",
      q4_2: "",
      q4_3: "",
      q5_1: "",
      q5_2: "",
      q5_3: "",
      q6_1: "",
      q6_2: "",
      q6_3: "",
      q6_4: "",
      q6_5: "",
      q7_1: "",
      q7_2: "",
      q7_3: "",
      q7_4: "",
      q7_5: "",
      q8_1: "",
      q8_2: "",
      q8_3: "",
    },
    validationSchema: Yup.object({
      q1_1: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q1_2: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q2_1: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q2_2: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q2_3: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q2_4: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q3_1: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q4_1: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q4_2: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q4_3: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q5_1: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q5_2: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q5_3: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q6_1: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q6_2: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q6_3: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q6_4: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q6_5: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q7_1: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q7_2: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q7_3: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q7_4: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q7_5: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q8_1: Yup.string()
        .oneOf(["VM", "M", "JE", "NM", "NAA"])
        .optional()
        .transform((originalValue, originalObject) => {
          return originalValue === "" ? undefined : originalValue;
        }),
      q8_2: Yup.string()
        .oneOf(["VM", "M", "JE", "NM", "NAA"])
        .optional()
        .transform((originalValue, originalObject) => {
          return originalValue === "" ? undefined : originalValue;
        }),
      q8_3: Yup.string()
        .oneOf(["VM", "M", "JE", "NM", "NAA"])
        .optional()
        .transform((originalValue, originalObject) => {
          return originalValue === "" ? undefined : originalValue;
        }),
    }),
    onSubmit: (values) => {
      if (!departmentReview || !activeFaculty) {
        return;
      }

      return axios
        .post("/api/coordinator_review", {
          ...values,
          departmentReviewId: departmentReview.id,
          activeCoordinatorId: activeFaculty.id,
        })
        .then(() => {
          router.push(`/im/${iMId}/coordinator_suggestion`);
        })
        .catch((error) => {
          addSnackbar(
            error.response.data?.error?.message ?? "Failed to submit review",
            "error"
          );
        });
    },
  });

  useEffect(() => {
    if (!coordinatorReview) {
      return;
    }

    router.replace(`/im/${iMId}/coordinator_suggestion`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinatorReview, iMId]);

  if (!departmentReview || !activeFaculty) {
    return null;
  }

  return (
    <MainLayout>
      <div className='flex flex-col h-full'>
        <div className='flex-1 overflow-auto'>
          <div className='flex h-full space-x-1'>
            <div className='flex flex-col flex-1'>
              <div className='flex justify-between pb-2'>
                <div>
                  <h2 className='inline text-lg font-bold'>
                    Instructional Material Review{" "}
                    <span className='bg-palette_orange text-palette_white p-1 rounded'>
                      Coordinator
                    </span>
                  </h2>
                  <p className='text-sm'>Implementation Phase</p>
                </div>
              </div>
              <div className='flex-1 overflow-auto'>
                <form onSubmit={formik.handleSubmit} className=''>
                  <div className='space-y-2 mx-1'>
                    <ReviewSection title={ReviewSections.s1}>
                      <ReviewItem
                        question={ReviewQuestions.q1_1}
                        {...formik.getFieldProps("q1_1")}
                      />
                      <ReviewItem
                        question={ReviewQuestions.q1_2}
                        {...formik.getFieldProps("q1_2")}
                      />
                    </ReviewSection>

                    <ReviewSection title={ReviewSections.s2}>
                      <ReviewItem
                        question={ReviewQuestions.q2_1}
                        {...formik.getFieldProps("q2_1")}
                      />
                      <ReviewItem
                        question={ReviewQuestions.q2_2}
                        {...formik.getFieldProps("q2_2")}
                      />
                      <ReviewItem
                        question={ReviewQuestions.q2_3}
                        {...formik.getFieldProps("q2_3")}
                      />
                      <ReviewItem
                        question={ReviewQuestions.q2_4}
                        {...formik.getFieldProps("q2_4")}
                      />
                    </ReviewSection>

                    <ReviewSection title={ReviewSections.s3}>
                      <ReviewItem
                        question={ReviewQuestions.q3_1}
                        {...formik.getFieldProps("q3_1")}
                      />
                    </ReviewSection>

                    <ReviewSection title={ReviewSections.s4}>
                      <ReviewItem
                        question={ReviewQuestions.q4_1}
                        {...formik.getFieldProps("q4_1")}
                      />
                      <ReviewItem
                        question={ReviewQuestions.q4_2}
                        {...formik.getFieldProps("q4_2")}
                      />
                      <ReviewItem
                        question={ReviewQuestions.q4_3}
                        {...formik.getFieldProps("q4_3")}
                      />
                    </ReviewSection>

                    <ReviewSection title={ReviewSections.s5}>
                      <ReviewItem
                        question={ReviewQuestions.q5_1}
                        {...formik.getFieldProps("q5_1")}
                      />
                      <ReviewItem
                        question={ReviewQuestions.q5_2}
                        {...formik.getFieldProps("q5_2")}
                      />
                      <ReviewItem
                        question={ReviewQuestions.q5_3}
                        {...formik.getFieldProps("q5_3")}
                      />
                    </ReviewSection>

                    <ReviewSection title={ReviewSections.s6}>
                      <ReviewItem
                        question={ReviewQuestions.q6_1}
                        {...formik.getFieldProps("q6_1")}
                      />
                      <ReviewItem
                        question={ReviewQuestions.q6_2}
                        {...formik.getFieldProps("q6_2")}
                      />
                      <ReviewItem
                        question={ReviewQuestions.q6_3}
                        {...formik.getFieldProps("q6_3")}
                      />
                      <ReviewItem
                        question={ReviewQuestions.q6_4}
                        {...formik.getFieldProps("q6_4")}
                      />
                      <ReviewItem
                        question={ReviewQuestions.q6_5}
                        {...formik.getFieldProps("q6_5")}
                      />
                    </ReviewSection>

                    <ReviewSection title={ReviewSections.s7}>
                      <ReviewItem
                        question={ReviewQuestions.q7_1}
                        {...formik.getFieldProps("q7_1")}
                      />
                      <ReviewItem
                        question={ReviewQuestions.q7_2}
                        {...formik.getFieldProps("q7_2")}
                      />
                      <ReviewItem
                        question={ReviewQuestions.q7_3}
                        {...formik.getFieldProps("q7_3")}
                      />
                      <ReviewItem
                        question={ReviewQuestions.q7_4}
                        {...formik.getFieldProps("q7_4")}
                      />
                      <ReviewItem
                        question={ReviewQuestions.q7_5}
                        {...formik.getFieldProps("q7_5")}
                      />
                    </ReviewSection>

                    <ReviewSection title={ReviewSections.s8}>
                      <ReviewItem
                        question={ReviewQuestions.q8_1}
                        {...formik.getFieldProps("q8_1")}
                      />
                      <ReviewItem
                        question={ReviewQuestions.q8_2}
                        {...formik.getFieldProps("q8_2")}
                      />
                      <ReviewItem
                        question={ReviewQuestions.q8_3}
                        {...formik.getFieldProps("q8_3")}
                      />
                    </ReviewSection>
                  </div>
                  <div className='flex justify-end p-1'>
                    <button
                      disabled={formik.isSubmitting || !formik.isValid}
                      className='bg-palette_blue disabled:bg-opacity-10 text-palette_white border px-2 py-1 rounded cursor-pointer inline-flex space-x-2 items-center hover:bg-opacity-90'
                    >
                      <span>Next</span>
                      <span>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          height='1em'
                          viewBox='0 0 448 512'
                          className='fill-palette_white'
                        >
                          <path d='M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z' />
                        </svg>
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className='flex-1'>
              <iframe
                src={`/api/im_file/im/${iMId}/pdf`}
                className='w-full h-full rounded'
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
