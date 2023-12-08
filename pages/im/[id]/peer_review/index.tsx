import Loading from "@/components/Loading";
import MainLayout from "@/components/MainLayout";
import ReviewItem from "@/components/ReviewItem";
import ReviewSection from "@/components/ReviewSection";
import { SnackbarContext } from "@/components/SnackbarProvider";
import useActiveFacultyMe from "@/hooks/useActiveFacultyMe";
import useDepartmentIM from "@/hooks/useDepartmentIM";
import useDepartmentMe from "@/hooks/useDepartmentMe";
import useDepartmentReviewIM from "@/hooks/useDepartmentReviewIM";
import useIM from "@/hooks/useIM";
import usePeerReviewIM from "@/hooks/usePeerReviewIM";
import ReviewQuestions from "@/services/ReviewQuestions";
import ReviewSections from "@/services/ReviewSections";
import axios from "axios";
import { useFormik } from "formik";
import Error from "next/error";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import * as Yup from "yup";

export default function AddPeerReviewPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const iM = useIM({ id: iMId as string });
  const departmentReview = useDepartmentReviewIM({ id: iMId as string });
  const peerReview = usePeerReviewIM({ id: iMId as string });
  const activeFaculty = useActiveFacultyMe();
  const myDepartment = useDepartmentMe();
  const ownerDepartment = useDepartmentIM({ id: iMId as string });
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
        .post("/api/peer_review", {
          ...values,
          departmentReviewId: departmentReview.id,
          activeFacultyId: activeFaculty.id,
        })
        .then(() => {
          router.push(`/im/${iMId}/peer_suggestion`);
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
    if (!myDepartment || !ownerDepartment) {
      return;
    }

    if (myDepartment.id !== ownerDepartment.id) {
      addSnackbar("Cannot review IM from other department", "error");
      router.replace(`/im/${iMId}`);
    }
  }, [myDepartment, ownerDepartment]);

  useEffect(() => {
    if (!iM || !activeFaculty) {
      return;
    }

    if (iM.facultyId === activeFaculty.facultyId) {
      addSnackbar("Cannot review own IM", "error");
      router.replace(`/im/${iMId}`);
    }
  }, [iM, activeFaculty]);

  useEffect(() => {
    if (!peerReview) {
      return;
    }

    router.replace(`/im/${iMId}/peer_suggestion`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerReview, iMId]);

  if (iM === null) {
    return (
      <MainLayout>
        <Error statusCode={404} title='IM Not Found' />
      </MainLayout>
    );
  }
  if (iM === undefined) {
    return (
      <MainLayout>
        <Loading />
      </MainLayout>
    );
  }

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
                      Peer
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
                      type='submit'
                      disabled={formik.isSubmitting || !formik.isValid}
                      className='bg-palette_blue disabled:bg-opacity-10 text-palette_white border px-2 py-1 rounded inline-flex items-center space-x-2 hover:bg-opacity-90'
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
                loading='lazy'
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
