import CrudLayout from "@/components/CrudLayout";
import useIDDCoordinatorSuggestionItem from "@/hooks/useIDDCoordinatorSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditIDDCoordinatorSuggestionItemPage() {
  const router = useRouter();
  const iDDCoordinatorSuggestionItemId = router.query.id;
  const iDDCoordinatorSuggestionItem = useIDDCoordinatorSuggestionItem({
    id: iDDCoordinatorSuggestionItemId as string,
  });

  const formik = useFormik({
    initialValues: {
      suggestion: "",
      actionTaken: "",
      remarks: "",
      pageNumber: 0,
    },
    validationSchema: Yup.object({
      suggestion: Yup.string().required(),
      actionTaken: Yup.string(),
      remarks: Yup.string(),
      pageNumber: Yup.number().min(0).required()
    }),
    onSubmit: (values) => {
      axios
        .put(
          `/api/idd_coordinator_suggestion_item/${iDDCoordinatorSuggestionItemId}`,
          values
        )
        .then(() => {
          alert("IDDCoordinatorSuggestionItem has been updated successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!iDDCoordinatorSuggestionItem) return;
    let subscribe = true;

    formik.setValues({
      pageNumber: iDDCoordinatorSuggestionItem.pageNumber,
      suggestion: iDDCoordinatorSuggestionItem.suggestion,
      actionTaken: iDDCoordinatorSuggestionItem?.actionTaken ?? "",
      remarks: iDDCoordinatorSuggestionItem?.remarks ?? "",
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iDDCoordinatorSuggestionItem]);

  return (
    <CrudLayout>
      <h2>Add IDDCoordinatorSuggestionItem</h2>

      <form onSubmit={formik.handleSubmit}>
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
