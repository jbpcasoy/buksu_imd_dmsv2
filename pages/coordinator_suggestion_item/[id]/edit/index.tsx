import MainLayout from "@/components/MainLayout";
import useCoordinatorSuggestionItem from "@/hooks/useCoordinatorSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function CoordinatorSuggestionItemEditPage() {
  const router = useRouter();
  const coordinatorSuggestionItemId = router.query.id;
  const coordinatorSuggestionItem = useCoordinatorSuggestionItem({
    id: coordinatorSuggestionItemId as string,
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
          `/api/coordinator_suggestion_item/${coordinatorSuggestionItemId}`,
          values
        )
        .then(() => {
          alert("Suggestion updated successfully");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!coordinatorSuggestionItem) return;
    formik.setValues({
      pageNumber: coordinatorSuggestionItem.pageNumber,
      remarks: coordinatorSuggestionItem?.remarks ?? "",
      suggestion: coordinatorSuggestionItem.suggestion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinatorSuggestionItem]);

  return (
    <MainLayout>
      <div>
        <h2>Coordinator Review</h2>
        <form noValidate onSubmit={formik.handleSubmit}>
          <div className="flex flex-col space-y-1">
            <textarea
              placeholder='suggestion'
              {...formik.getFieldProps("suggestion")}
              className='rounded'
            />
            <input
              type='number'
              placeholder='pageNumber'
              {...formik.getFieldProps("pageNumber")}
              className='rounded'
            />
            <textarea
              placeholder='remarks'
              {...formik.getFieldProps("remarks")}
              className='rounded'
            />
            <input type='submit' value='Submit' className='bg-palette_blue text-white rounded' />
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
