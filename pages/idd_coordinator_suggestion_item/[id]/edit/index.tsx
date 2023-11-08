import MainLayout from "@/components/MainLayout";
import useIDDCoordinatorSuggestionItem from "@/hooks/useIDDCoordinatorSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function IDDCoordinatorSuggestionItemEditPage() {
  const router = useRouter();
  const iDDCoordinatorSuggestionItemId = router.query.id;
  const iDDCoordinatorSuggestionItem = useIDDCoordinatorSuggestionItem({
    id: iDDCoordinatorSuggestionItemId as string,
  });
  const formik = useFormik({
    initialValues: {
      suggestion: "",
      pageNumber: 0,
      remarks: "",
    },
    validationSchema: Yup.object({
      suggestion: Yup.string().required(),
      pageNumber: Yup.number().min(0).required(),
      remarks: Yup.string(),
    }),
    onSubmit: (values) => {
      axios
        .put(
          `/api/idd_coordinator_suggestion_item/${iDDCoordinatorSuggestionItemId}`,
          values
        )
        .then(() => {
          alert("Suggestion updated successfully");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!iDDCoordinatorSuggestionItem) return;
    formik.setValues({
      pageNumber: iDDCoordinatorSuggestionItem.pageNumber,
      remarks: iDDCoordinatorSuggestionItem?.remarks ?? "",
      suggestion: iDDCoordinatorSuggestionItem.suggestion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iDDCoordinatorSuggestionItem]);

  return (
    <MainLayout>
      <div>
        <h2>Coordinator Review</h2>
        <form noValidate onSubmit={formik.handleSubmit}>
          <textarea
            placeholder='suggestion'
            {...formik.getFieldProps("suggestion")}
          />
          <br />
          <input
            type='number'
            placeholder='pageNumber'
            {...formik.getFieldProps("pageNumber")}
          />
          <br />
          <textarea
            placeholder='remarks'
            {...formik.getFieldProps("remarks")}
          />
          <br />
          <input type='submit' value='Submit' className='border rounded' />
        </form>
      </div>
    </MainLayout>
  );
}
