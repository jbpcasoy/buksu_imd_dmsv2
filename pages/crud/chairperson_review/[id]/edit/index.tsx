import CrudLayout from "@/components/CrudLayout";
import useChairpersonReview from "@/hooks/useChairpersonReview";
import ReviewQuestions from "@/services/ReviewQuestions";
import ReviewSections from "@/services/ReviewSections";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { DetailedHTMLProps, SelectHTMLAttributes, useEffect } from "react";
import * as Yup from "yup";

export default function EditChairpersonReviewPage() {
  const router = useRouter();
  const chairpersonReviewId = router.query.id;
  const chairpersonReview = useChairpersonReview({ id: chairpersonReviewId as string });

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
      q8_1: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q8_2: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
      q8_3: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
    }),
    onSubmit: (values) => {
      axios
        .put(`/api/chairperson_review/${chairpersonReviewId}`, values)
        .then(() => {
          alert("ChairpersonReview Updated Successfully");
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  });

  useEffect(() => {
    if (!chairpersonReview) return;

    formik.setValues({
      q1_1: chairpersonReview.q1_1 as string,
      q1_2: chairpersonReview.q1_2 as string,
      q2_1: chairpersonReview.q2_1 as string,
      q2_2: chairpersonReview.q2_2 as string,
      q2_3: chairpersonReview.q2_3 as string,
      q2_4: chairpersonReview.q2_4 as string,
      q3_1: chairpersonReview.q3_1 as string,
      q4_1: chairpersonReview.q4_1 as string,
      q4_2: chairpersonReview.q4_2 as string,
      q4_3: chairpersonReview.q4_3 as string,
      q5_1: chairpersonReview.q5_1 as string,
      q5_2: chairpersonReview.q5_2 as string,
      q5_3: chairpersonReview.q5_3 as string,
      q6_1: chairpersonReview.q6_1 as string,
      q6_2: chairpersonReview.q6_2 as string,
      q6_3: chairpersonReview.q6_3 as string,
      q6_4: chairpersonReview.q6_4 as string,
      q6_5: chairpersonReview.q6_5 as string,
      q7_1: chairpersonReview.q7_1 as string,
      q7_2: chairpersonReview.q7_2 as string,
      q7_3: chairpersonReview.q7_3 as string,
      q7_4: chairpersonReview.q7_4 as string,
      q7_5: chairpersonReview.q7_5 as string,
      q8_1: chairpersonReview.q8_1 as string,
      q8_2: chairpersonReview.q8_2 as string,
      q8_3: chairpersonReview.q8_3 as string,
    });
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chairpersonReview]);

  return (
    <CrudLayout>
      <h2>Add ChairpersonReview</h2>

      <form onSubmit={formik.handleSubmit}>
        <div>
          <p className='font-bold'>{ReviewSections.s1}</p>
          <p>{ReviewQuestions.q1_1}</p>
          <RateSelector {...formik.getFieldProps("q1_1")} />
          <p>{ReviewQuestions.q1_2}</p>
          <RateSelector {...formik.getFieldProps("q1_2")} />

          <p className='font-bold'>{ReviewSections.s2}</p>
          <p>{ReviewQuestions.q2_1}</p>
          <RateSelector {...formik.getFieldProps("q2_1")} />
          <p>{ReviewQuestions.q2_2}</p>
          <RateSelector {...formik.getFieldProps("q2_2")} />
          <p>{ReviewQuestions.q2_3}</p>
          <RateSelector {...formik.getFieldProps("q2_3")} />
          <p>{ReviewQuestions.q2_4}</p>
          <RateSelector {...formik.getFieldProps("q2_4")} />

          <p className='font-bold'>{ReviewSections.s3}</p>
          <p>{ReviewQuestions.q3_1}</p>
          <RateSelector {...formik.getFieldProps("q3_1")} />

          <p className='font-bold'>{ReviewSections.s4}</p>
          <p>{ReviewQuestions.q4_1}</p>
          <RateSelector {...formik.getFieldProps("q4_1")} />
          <p>{ReviewQuestions.q4_2}</p>
          <RateSelector {...formik.getFieldProps("q4_2")} />
          <p>{ReviewQuestions.q4_3}</p>
          <RateSelector {...formik.getFieldProps("q4_3")} />

          <p className='font-bold'>{ReviewSections.s5}</p>
          <p>{ReviewQuestions.q5_1}</p>
          <RateSelector {...formik.getFieldProps("q5_1")} />
          <p>{ReviewQuestions.q5_2}</p>
          <RateSelector {...formik.getFieldProps("q5_2")} />
          <p>{ReviewQuestions.q5_3}</p>
          <RateSelector {...formik.getFieldProps("q5_3")} />

          <p className='font-bold'>{ReviewSections.s6}</p>
          <p>{ReviewQuestions.q6_1}</p>
          <RateSelector {...formik.getFieldProps("q6_1")} />
          <p>{ReviewQuestions.q6_2}</p>
          <RateSelector {...formik.getFieldProps("q6_2")} />
          <p>{ReviewQuestions.q6_3}</p>
          <RateSelector {...formik.getFieldProps("q6_3")} />
          <p>{ReviewQuestions.q6_4}</p>
          <RateSelector {...formik.getFieldProps("q6_4")} />
          <p>{ReviewQuestions.q6_5}</p>
          <RateSelector {...formik.getFieldProps("q6_5")} />

          <p className='font-bold'>{ReviewSections.s7}</p>
          <p>{ReviewQuestions.q7_1}</p>
          <RateSelector {...formik.getFieldProps("q7_1")} />
          <p>{ReviewQuestions.q7_2}</p>
          <RateSelector {...formik.getFieldProps("q7_2")} />
          <p>{ReviewQuestions.q7_3}</p>
          <RateSelector {...formik.getFieldProps("q7_3")} />
          <p>{ReviewQuestions.q7_4}</p>
          <RateSelector {...formik.getFieldProps("q7_4")} />
          <p>{ReviewQuestions.q7_5}</p>
          <RateSelector {...formik.getFieldProps("q7_5")} />

          <p className='font-bold'>{ReviewSections.s8}</p>
          <p>{ReviewQuestions.q8_1}</p>
          <RateSelector {...formik.getFieldProps("q8_1")} />
          <p>{ReviewQuestions.q8_2}</p>
          <RateSelector {...formik.getFieldProps("q8_2")} />
          <p>{ReviewQuestions.q8_3}</p>
          <RateSelector {...formik.getFieldProps("q8_3")} />
        </div>
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
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
      <option value=''>Select</option>
      <option value='VM'>VM</option>
      <option value='M'>M</option>
      <option value='JE'>JE</option>
      <option value='NM'>NM</option>
      <option value='NAA'>NAA</option>
    </select>
  );
}
