import CrudLayout from "@/components/CrudLayout";
import useIDDCoordinatorSuggestionItemActionTaken from "@/hooks/useIDDCoordinatorSuggestionItemActionTaken";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditIDDCoordinatorSuggestionItemActionTakenPage() {
  const router = useRouter();
  const iDDCoordinatorSuggestionItemActionTakenId = router.query.id;
  const iDDCoordinatorSuggestionItemActionTaken = useIDDCoordinatorSuggestionItemActionTaken({
    id: iDDCoordinatorSuggestionItemActionTakenId as string,
  });

  const formik = useFormik({
    initialValues: {
      value: "",
      iDDCoordinatorSuggestionItemId: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
      iDDCoordinatorSuggestionItemId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .put(
          `/api/idd_coordinator_suggestion_item_action_taken/${iDDCoordinatorSuggestionItemActionTakenId}`,
          values
        )
        .then(() => {
          alert("IDDCoordinatorSuggestionItemActionTaken updated successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!iDDCoordinatorSuggestionItemActionTaken) return;
    let subscribe = true;

    formik.setValues({
      value: iDDCoordinatorSuggestionItemActionTaken.value,
      iDDCoordinatorSuggestionItemId: iDDCoordinatorSuggestionItemActionTaken.iDDCoordinatorSuggestionItemId,
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iDDCoordinatorSuggestionItemActionTaken]);

  return (
    <CrudLayout>
      <h2>Edit IDDCoordinatorSuggestionItemActionTaken</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='iDDCoordinatorSuggestionItemId'
          {...formik.getFieldProps("iDDCoordinatorSuggestionItemId")}
        />
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
