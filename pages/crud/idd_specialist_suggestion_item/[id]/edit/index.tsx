import CrudLayout from "@/components/CrudLayout";
import useIDDSpecialistSuggestionItem from "@/hooks/useIDDSpecialistSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditIDDSpecialistSuggestionItemPage() {
  const router = useRouter();
  const iDDSpecialistSuggestionItemId = router.query.id;
  const iDDSpecialistSuggestionItem = useIDDSpecialistSuggestionItem({
    id: iDDSpecialistSuggestionItemId as string,
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
          `/api/idd_specialist_suggestion_item/${iDDSpecialistSuggestionItemId}`,
          values
        )
        .then(() => {
          alert("IDDSpecialistSuggestionItem has been updated successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!iDDSpecialistSuggestionItem) return;
    let subscribe = true;

    formik.setValues({
      pageNumber: iDDSpecialistSuggestionItem.pageNumber,
      suggestion: iDDSpecialistSuggestionItem.suggestion,
      remarks: iDDSpecialistSuggestionItem?.remarks ?? "",
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iDDSpecialistSuggestionItem]);

  return (
    <CrudLayout>
      <h2>Add IDDSpecialistSuggestionItem</h2>

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
