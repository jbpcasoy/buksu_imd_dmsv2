import IDDCoordinatorSuggestionItem from "@/components/IDDCoordinatorSuggestionItem";
import MainLayout from "@/components/MainLayout";
import useActiveCITLDirectorMe from "@/hooks/useActiveCITLDirectorMe";
import useDeanEndorsementIM from "@/hooks/useDeanEndorsementIM";
import useIDDCoordinatorSuggestionItemsOwn, {
  useIDDCoordinatorSuggestionItemsOwnParams,
} from "@/hooks/useIDDCoordinatorSuggestionItemsOwn";
import useIDDCoordinatorSuggestionMe from "@/hooks/useIDDCoordinatorSuggestionMe";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";

export default function IDDCoordinatorSuggestionPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const iDDCoordinatorSuggestion = useIDDCoordinatorSuggestionMe({
    id: iMId as string,
  });
  const deanEndorsement = useDeanEndorsementIM({id: iMId as string});
  const [state, setState] = useState<useIDDCoordinatorSuggestionItemsOwnParams>(
    {
      skip: 0,
      take: 10,
    }
  );
  const iDDCoordinatorSuggestionItems =
    useIDDCoordinatorSuggestionItemsOwn(state);
  const activeIDDCoordinator = useActiveCITLDirectorMe();
  const handleSubmitReview = () => {
    if (!iDDCoordinatorSuggestion) return;
    axios
      .post(`/api/submitted_idd_coordinator_suggestion`, {
        iDDCoordinatorSuggestionId: iDDCoordinatorSuggestion.id,
      })
      .then(() => {
        alert("Review Submitted Successfully");
      })
      .catch((error: any) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  useEffect(() => {
    if (!iDDCoordinatorSuggestion) return;

    setState((prev) => ({
      ...prev,
      id: iDDCoordinatorSuggestion.id,
    }));
  }, [iDDCoordinatorSuggestion]);

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
      if (!iDDCoordinatorSuggestion) {
        return;
      }

      axios
        .post(`/api/idd_coordinator_suggestion_item`, {
          ...values,
          iDDCoordinatorSuggestionId: iDDCoordinatorSuggestion.id,
        })
        .then(() => {
          alert("Suggestion added successfully.");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!iDDCoordinatorSuggestion && activeIDDCoordinator && deanEndorsement) {
      axios
        .post(`/api/idd_coordinator_suggestion/`, {
          activeIDDCoordinatorId: activeIDDCoordinator.id,
          deanEndorsementId: deanEndorsement.id
        })
        .then((res) => {
          router.reload();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [iDDCoordinatorSuggestion, activeIDDCoordinator, deanEndorsement]);

  return (
    <MainLayout>
      <div>
        <h2>IDDCoordinator Review</h2>
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
        <div>
          <h3>Suggestions</h3>
          {iDDCoordinatorSuggestionItems.iDDCoordinatorSuggestionItems.map(
            (iDDCoordinatorSuggestionItem) => {
              return (
                <IDDCoordinatorSuggestionItem
                  iDDCoordinatorSuggestionItem={iDDCoordinatorSuggestionItem}
                  key={iDDCoordinatorSuggestionItem.id}
                />
              );
            }
          )}
        </div>
        <button className='rounded border' onClick={handleSubmitReview}>
          Submit Review
        </button>
      </div>
    </MainLayout>
  );
}
