import MainLayout from "@/components/MainLayout";
import useCoordinatorSuggestionItemActionTakenCoordinatorSuggestionItem from "@/hooks/useCoordinatorSuggestionItemActionTakenCoordinatorSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function CoordinatorSuggestionItemEditPage() {
  const router = useRouter();
  const coordinatorSuggestionItemId = router.query.id;
  const coordinatorSuggestionItemActionTaken =
    useCoordinatorSuggestionItemActionTakenCoordinatorSuggestionItem({
      id: coordinatorSuggestionItemId as string,
    });
  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
    }),
    onSubmit: (values) => {
      if (coordinatorSuggestionItemActionTaken) {
        axios
          .put(
            `/api/coordinator_suggestion_item_action_taken/${coordinatorSuggestionItemActionTaken.id}`,
            values
          )
          .then(() => {
            alert("Suggestion updated successfully");
            router.reload();
          });
      } else {
        axios
          .post(`/api/coordinator_suggestion_item_action_taken`, {
            coordinatorSuggestionItemId: coordinatorSuggestionItemId,
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
    if (!coordinatorSuggestionItemActionTaken) return;
    formik.setValues({
      value: coordinatorSuggestionItemActionTaken.value ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinatorSuggestionItemActionTaken]);

  return (
    <MainLayout>
      <div>
        <h2>Coordinator Review</h2>
        <form noValidate onSubmit={formik.handleSubmit}>
          <textarea placeholder='value' {...formik.getFieldProps("value")} />
          <br />
          <input type='submit' value='Submit' className='border rounded' />
        </form>
      </div>
    </MainLayout>
  );
}
