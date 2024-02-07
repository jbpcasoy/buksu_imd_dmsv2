import CrudLayout from "@/components/CrudLayout";
import useCoordinatorSuggestionItemActionTaken from "@/hooks/useCoordinatorSuggestionItemActionTaken";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditCoordinatorSuggestionItemActionTakenPage() {
  const router = useRouter();
  const coordinatorSuggestionItemActionTakenId = router.query.id;
  const coordinatorSuggestionItemActionTaken =
    useCoordinatorSuggestionItemActionTaken({
      id: coordinatorSuggestionItemActionTakenId as string,
    });

  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .put(
          `/api/coordinator_suggestion_item_action_taken/${coordinatorSuggestionItemActionTakenId}`,
          values
        )
        .then(() => {
          alert("CoordinatorSuggestionItemActionTaken has been updated successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!coordinatorSuggestionItemActionTaken) return;
    let subscribe = true;

    formik.setValues({
      value: coordinatorSuggestionItemActionTaken.value,
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinatorSuggestionItemActionTaken]);

  return (
    <CrudLayout>
      <h2>Edit CoordinatorSuggestionItemActionTaken</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='value'
          {...formik.getFieldProps("value")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
