import CrudLayout from "@/components/CrudLayout";
import useReturnedIMERCCITLRevisionSuggestionItem from "@/hooks/useReturnedIMERCCITLRevisionSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditReturnedIMERCCITLRevisionSuggestionItemPage() {
  const router = useRouter();
  const returnedIMERCCITLRevisionSuggestionItemId = router.query.id;
  const returnedIMERCCITLRevisionSuggestionItem =
    useReturnedIMERCCITLRevisionSuggestionItem({
      id: returnedIMERCCITLRevisionSuggestionItemId as string,
    });

  const formik = useFormik({
    initialValues: {
      suggestion: "",
      remarks: "",
      pageNumber: 0,
    },
    validationSchema: Yup.object({
      suggestion: Yup.string().required(),
      remarks: Yup.string(),
      pageNumber: Yup.number().min(0).required(),
    }),
    onSubmit: (values) => {
      axios
        .put(
          `/api/returned_imerc_citl_revision_suggestion_item/${returnedIMERCCITLRevisionSuggestionItemId}`,
          values
        )
        .then(() => {
          alert(
            "ReturnedIMERCCITLRevisionSuggestionItem has been updated successfully"
          );
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!returnedIMERCCITLRevisionSuggestionItem) return;
    let subscribe = true;

    formik.setValues({
      pageNumber: returnedIMERCCITLRevisionSuggestionItem.pageNumber,
      suggestion: returnedIMERCCITLRevisionSuggestionItem.suggestion,
      remarks: returnedIMERCCITLRevisionSuggestionItem?.remarks ?? "",
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedIMERCCITLRevisionSuggestionItem]);

  return (
    <CrudLayout>
      <h2>Add ReturnedIMERCCITLRevisionSuggestionItem</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="suggestion"
          {...formik.getFieldProps("suggestion")}
        />
        <input
          type="text"
          placeholder="pageNumber"
          {...formik.getFieldProps("pageNumber")}
        />
        <input
          type="text"
          placeholder="remarks"
          {...formik.getFieldProps("remarks")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
