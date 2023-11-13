import MainLayout from "@/components/MainLayout";
import useIDDCoordinatorSuggestionItemActionTakenIDDCoordinatorSuggestionItem from "@/hooks/useIDDCoordinatorSuggestionItemActionTakenIDDCoordinatorSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function IDDCoordinatorSuggestionItemEditPage() {
  const router = useRouter();
  const iDDCoordinatorSuggestionItemId = router.query.id;
  const iDDCoordinatorSuggestionItemActionTaken =
    useIDDCoordinatorSuggestionItemActionTakenIDDCoordinatorSuggestionItem({
      id: iDDCoordinatorSuggestionItemId as string,
    });
  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
    }),
    onSubmit: (values) => {
      if (iDDCoordinatorSuggestionItemActionTaken) {
        axios
          .put(
            `/api/idd_coordinator_suggestion_item_action_taken/${iDDCoordinatorSuggestionItemActionTaken.id}`,
            values
          )
          .then(() => {
            alert("Suggestion updated successfully");
            router.reload();
          });
      } else {
        axios
          .post(`/api/idd_coordinator_suggestion_item_action_taken`, {
            iDDCoordinatorSuggestionItemId: iDDCoordinatorSuggestionItemId,
            value: values.value,
          })
          .then(() => {
            alert("Suggestion updated successfully");
            router.reload();
          });
      }
    },
  });

  useEffect(() => {
    if (!iDDCoordinatorSuggestionItemActionTaken) return;
    formik.setValues({
      value: iDDCoordinatorSuggestionItemActionTaken.value ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iDDCoordinatorSuggestionItemActionTaken]);

  return (
    <MainLayout>
      <div>
        <h2>IDDCoordinator Review</h2>
        <form noValidate onSubmit={formik.handleSubmit}>
          <textarea placeholder='value' {...formik.getFieldProps("value")} />
          <br />
          <input type='submit' value='Submit' className='border rounded' />
        </form>
      </div>
    </MainLayout>
  );
}
