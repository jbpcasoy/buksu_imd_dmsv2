import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddChairpersonSuggestionItemPage() {
  const formik = useFormik({
    initialValues: {
      pageNumber: 0,
      chairpersonSuggestionId: "",
      suggestion: "",
      actionTaken: "",
      remarks: "",
    },
    validationSchema: Yup.object({
      pageNumber: Yup.number().min(0).required(),
      chairpersonSuggestionId: Yup.string().required(),
      suggestion: Yup.string().required(),
      actionTaken: Yup.string(),
      remarks: Yup.string(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/chairperson_suggestion_item", values)
        .then(() => {
          alert("ChairpersonSuggestionItem Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add ChairpersonSuggestionItem</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='chairpersonSuggestionId'
          {...formik.getFieldProps("chairpersonSuggestionId")}
        />
        <input
          type='text'
          placeholder='suggestion'
          {...formik.getFieldProps("suggestion")}
        />
        <input
          type='text'
          placeholder='pageNumber'
          {...formik.getFieldProps("pageNumber")}
        />
        <input
          type='text'
          placeholder='actionTaken'
          {...formik.getFieldProps("actionTaken")}
        />
        <input
          type='text'
          placeholder='remarks'
          {...formik.getFieldProps("remarks")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
