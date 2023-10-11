import CrudLayout from "@/components/CrudLayout";
import useCoordinatorSuggestionItem from "@/hooks/useCoordinatorSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditCoordinatorSuggestionItemPage() {
  const router = useRouter();
  const coordinatorSuggestionItemId = router.query.id;
  const coordinatorSuggestionItem = useCoordinatorSuggestionItem({
    id: coordinatorSuggestionItemId as string,
  });

  const formik = useFormik({
    initialValues: {
      suggestion: "",
      actionTaken: "",
      remarks: "",
    },
    validationSchema: Yup.object({
      suggestion: Yup.string().required(),
      actionTaken: Yup.string(),
      remarks: Yup.string(),
    }),
    onSubmit: (values) => {
      axios
        .put(
          `/api/coordinator_suggestion_item/${coordinatorSuggestionItemId}`,
          values
        )
        .then(() => {
          alert("CoordinatorSuggestionItem Updated Successfully");
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  });

  useEffect(() => {
    if (!coordinatorSuggestionItem) return;
    let subscribe = true;

    formik.setValues({
      suggestion: coordinatorSuggestionItem.suggestion,
      actionTaken: coordinatorSuggestionItem?.actionTaken ?? "",
      remarks: coordinatorSuggestionItem?.remarks ?? "",
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinatorSuggestionItem]);

  return (
    <CrudLayout>
      <h2>Add CoordinatorSuggestionItem</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='suggestion'
          {...formik.getFieldProps("suggestion")}
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
