import QAMISSuggestionItem from "@/components/QAMISSuggestionItem";
import MainLayout from "@/components/MainLayout";
import useActiveFacultyMe from "@/hooks/useActiveFacultyMe";
import useCITLDirectorEndorsementIM from "@/hooks/useCITLDirectorEndorsementIM";
import useQAMISSuggestionItemsOwn, { useQAMISSuggestionItemsOwnParams } from "@/hooks/useQAMISSuggestionItemsOwn";
import useIM from "@/hooks/useIM";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import useQAMISSuggestionMe from "@/hooks/useQAMISSuggestionMe";

export default function QAMISSuggestionPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const activeFaculty = useActiveFacultyMe();
  const iM = useIM({ id: iMId as string });
  const qAMISSuggestion = useQAMISSuggestionMe({
    id: iMId as string,
  });

  const cITLDirectorEndorsement = useCITLDirectorEndorsementIM({
    id: iMId as string,
  });
  const [state, setState] = useState<useQAMISSuggestionItemsOwnParams>({
    skip: 0,
    take: 10,
  });
  const qAMISSuggestionItems = useQAMISSuggestionItemsOwn(state);

  const handleSubmitSuggestion = () => {
    if (!qAMISSuggestion) return;
    axios
      .post(`/api/submitted_qamis_suggestion`, {
        qAMISSuggestionId: qAMISSuggestion.id,
      })
      .then(() => {
        alert("Review Submitted Successfully");
      })
      .catch((error: any) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  useEffect(() => {
    if (!qAMISSuggestion) return;

    setState((prev) => ({
      ...prev,
      id: qAMISSuggestion.id,
    }));
  }, [qAMISSuggestion]);

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
      if (!qAMISSuggestion) {
        return;
      }

      axios
        .post(`/api/qamis_suggestion_item`, {
          ...values,
          qAMISSuggestionId: qAMISSuggestion.id,
        })
        .then(() => {
          alert("Suggestion added successfully.");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (
      !qAMISSuggestion &&
      activeFaculty &&
      iM &&
      activeFaculty.facultyId === iM.facultyId &&
      cITLDirectorEndorsement
    ) {
      axios
        .post(`/api/qamis_suggestion/`, {
          cITLDirectorEndorsementId: cITLDirectorEndorsement.id,
        })
        .then((res) => {
          router.reload();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [qAMISSuggestion, activeFaculty, iM, cITLDirectorEndorsement]);

  return (
    <MainLayout>
      <div>
        <h2>QAMIS Suggestion</h2>
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
          {qAMISSuggestionItems.qAMISSuggestionItems.map(
            (qAMISSuggestionItem) => {
              return (
                <QAMISSuggestionItem
                  qAMISSuggestionItem={qAMISSuggestionItem}
                  key={qAMISSuggestionItem.id}
                />
              );
            }
          )}
        </div>
        <button className='rounded border' onClick={handleSubmitSuggestion}>
          Submit Review
        </button>
      </div>
    </MainLayout>
  );
}
