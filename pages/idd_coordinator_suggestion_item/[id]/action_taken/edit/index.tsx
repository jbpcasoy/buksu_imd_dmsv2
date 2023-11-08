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
      actionTaken: "",
    },
    validationSchema: Yup.object({
      actionTaken: Yup.string().required(),
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
      actionTaken: iDDCoordinatorSuggestionItem.actionTaken ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iDDCoordinatorSuggestionItem]);

  return (
    <MainLayout>
      <div>
        <h2>IDDCoordinator Review</h2>
        <form noValidate onSubmit={formik.handleSubmit}>
          <textarea
            placeholder='actionTaken'
            {...formik.getFieldProps("actionTaken")}
          />
          <br />
          <input type='submit' value='Submit' className='border rounded' />
        </form>
      </div>
    </MainLayout>
  );
}
