import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddReturnedIMERCCITLRevisionSuggestionItemPage() {
  const formik = useFormik({
    initialValues: {
      pageNumber: 0,
      returnedIMERCCITLRevisionId: "",
      suggestion: "",
      actionTaken: "",
      remarks: "",
    },
    validationSchema: Yup.object({
      pageNumber: Yup.number().min(0).required(),
      returnedIMERCCITLRevisionId: Yup.string().required(),
      suggestion: Yup.string().required(),
      actionTaken: Yup.string(),
      remarks: Yup.string(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/returned_imerc_citl_revision_suggestion_item", values)
        .then(() => {
          alert("ReturnedIMERCCITLRevisionSuggestionItem Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add ReturnedIMERCCITLRevisionSuggestionItem</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='returnedIMERCCITLRevisionId'
          {...formik.getFieldProps("returnedIMERCCITLRevisionId")}
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
