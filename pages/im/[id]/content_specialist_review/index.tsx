import IMHeader from "@/components/IMHeader";
import Loading from "@/components/Loading";
import MainLayout from "@/components/MainLayout";
import ReviewItem from "@/components/ReviewItem";
import ReviewSection from "@/components/ReviewSection";
import { SnackbarContext } from "@/components/SnackbarProvider";
import useActiveContentSpecialistMe from "@/hooks/useActiveContentSpecialistMe";
import useContentSpecialistReviewIM from "@/hooks/useContentSpecialistReviewIM";
import useDepartmentIM from "@/hooks/useDepartmentIM";
import useDepartmentMe from "@/hooks/useDepartmentMe";
import useIM from "@/hooks/useIM";
import useQAMISDepartmentEndorsementByIM from "@/hooks/useQAMISDepartmentEndorsementByIM";
import ReviewQuestions from "@/services/ReviewQuestions";
import ReviewSections from "@/services/ReviewSections";
import axios from "axios";
import { useFormik } from "formik";
import Error from "next/error";
import { useRouter } from "next/router";
import {
  DetailedHTMLProps,
  SelectHTMLAttributes,
  useContext,
  useEffect,
  useState,
} from "react";
import * as Yup from "yup";

export default function AddContentSpecialistReviewPage() {
  const [loading, setLoading] = useState(false);

  axios.interceptors.request.use(
    function (config) {
      setLoading(true);
      return config;
    },
    function (error) {
      console.log({ error });
      setLoading(false);
      return Promise.reject(error);
    }
  );
  axios.interceptors.response.use(
    function (response) {
      setLoading(false);
      return response;
    },
    function (error) {
      console.log({ error });
      setLoading(false);
      return Promise.reject(error);
    }
  );
  const router = useRouter();
  const { addSnackbar } = useContext(SnackbarContext);
  const iMId = router.query.id;
  const iM = useIM({ id: iMId as string });
  const qAMISDepartmentEndorsement = useQAMISDepartmentEndorsementByIM({
    id: iMId as string,
  });
  const contentSpecialistReview = useContentSpecialistReviewIM({
    id: iMId as string,
  });
  const activeContentSpecialist = useActiveContentSpecialistMe();
  const myDepartment = useDepartmentMe();
  const ownerDepartment = useDepartmentIM({ id: iMId as string });
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
      q5_4: "",
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
      q5_4: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
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
      if (!qAMISDepartmentEndorsement || !activeContentSpecialist) {
        return;
      }

      axios
        .post("/api/content_specialist_review", {
          ...values,
          qAMISDepartmentEndorsementId: qAMISDepartmentEndorsement.id,
          activeContentSpecialistId: activeContentSpecialist.id,
        })
        .then(() => {
          router.push(`/im/${iMId}/content_specialist_suggestion`);
        })
        .catch((error) => {
          addSnackbar(
            error?.response?.data?.error?.message ?? "Failed to submit review",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myDepartment, ownerDepartment]);

  useEffect(() => {
    if (activeContentSpecialist === undefined) {
      return;
    }

    if (activeContentSpecialist === null) {
      addSnackbar(
        "Only content specialists are allowed for this action",
        "error"
      );
      router.replace(`/im/${iMId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeContentSpecialist]);

  useEffect(() => {
    if (!contentSpecialistReview) {
      return;
    }

    router.replace(`/im/${iMId}/content_specialist_suggestion`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentSpecialistReview, iMId]);

  if (iM === null) {
    return (
      <MainLayout>
        <Error statusCode={404} title="IM Not Found" />
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

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row h-full overflow-auto md:space-x-4">
        <div className="flex flex-col md:flex-1 bg-palette_white rounded-2xl p-4 space-y-4">
          <IMHeader iM={iM} phase="IMERC Phase" role="Content Specialist" />
          <div className="flex-1 overflow-auto">
            <form onSubmit={formik.handleSubmit} className="">
              <div className="space-y-2 mx-1">
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
                  <ReviewItem
                    question={ReviewQuestions.q5_4}
                    {...formik.getFieldProps("q5_4")}
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
              <div className="flex justify-end p-1 pt-2">
                <button
                  type="submit"
                  disabled={formik.isSubmitting || !formik.isValid || loading}
                  className="bg-palette_blue disabled:bg-opacity-10 text-palette_white border cursor-pointer inline-flex space-x-2 items-center hover:bg-opacity-90 rounded-md text-sm font-semibold px-4 py-2"
                >
                  <span>Next</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="md:flex-1 h-screen-3/4 md:h-auto">
          <iframe
            loading="lazy"
            src={`/api/im_file/im/${iMId}/pdf`}
            className="w-full h-full"
          />
        </div>
      </div>
    </MainLayout>
  );
}

function RateSelector(
  props?: DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >
) {
  return (
    <select {...props}>
      <option value="">Select</option>
      <option value="VM">VM</option>
      <option value="M">M</option>
      <option value="JE">JE</option>
      <option value="NM">NM</option>
      <option value="NAA">NAA</option>
    </select>
  );
}
