import CrudLayout from "@/components/CrudLayout";
import ReviewQuestions from "@/services/ReviewQuestions";
import ReviewSections from "@/services/ReviewSections";
import axios from "axios";
import { useFormik } from "formik";
import { DetailedHTMLProps, SelectHTMLAttributes } from "react";
import * as Yup from "yup";

export default function AddPeerReviewPage() {
  const formik = useFormik({
    initialValues: {
      departmentReviewId: "",
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
      departmentReviewId: Yup.string().required(),
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
        .post("/api/peer_review", values)
        .then(() => {
          alert("PeerReview Added Successfully");
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add PeerReview</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='departmentReviewId'
          {...formik.getFieldProps("departmentReviewId")}
        />
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
