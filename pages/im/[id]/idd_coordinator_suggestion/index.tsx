import IDDCoordinatorSuggestionItem from "@/components/IDDCoordinatorSuggestionItem";
import IMChairpersonSuggestionItems from "@/components/IMChairpersonSuggestionItems";
import IMCoordinatorSuggestionItems from "@/components/IMCoordinatorSuggestionItems";
import IMPeerSuggestionItems from "@/components/IMPeerSuggestionItems";
import MainLayout from "@/components/MainLayout";
import Modal from "@/components/Modal";
import useActiveIDDCoordinatorMe from "@/hooks/useActiveIDDCoordinatorMe";
import useCITLRevisionIM from "@/hooks/useCITLRevisionIM";
import useDeanEndorsementIM from "@/hooks/useDeanEndorsementIM";
import useIDDCoordinatorSuggestionItemsOwn, {
  useIDDCoordinatorSuggestionItemsOwnParams,
} from "@/hooks/useIDDCoordinatorSuggestionItemsOwn";
import useIDDCoordinatorSuggestionMe from "@/hooks/useIDDCoordinatorSuggestionMe";
import useSubmittedIDDCoordinatorSuggestionIM from "@/hooks/useSubmittedIDDCoordinatorSuggestionIM";
import { IDDCoordinatorSuggestion } from "@prisma/client";
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
  const submittedIDDCoordinatorSuggestion =
    useSubmittedIDDCoordinatorSuggestionIM({
      id: iMId as string,
    });
  const deanEndorsement = useDeanEndorsementIM({ id: iMId as string });
  const cITLRevision = useCITLRevisionIM({ id: iMId as string });
  const [state, setState] = useState<useIDDCoordinatorSuggestionItemsOwnParams>(
    {
      skip: 0,
      take: 999,
    }
  );
  const iDDCoordinatorSuggestionItems =
    useIDDCoordinatorSuggestionItemsOwn(state);
  const activeIDDCoordinator = useActiveIDDCoordinatorMe();
  const handleSubmitReview = () => {
    if (!iDDCoordinatorSuggestion) return;
    axios
      .post(`/api/submitted_idd_coordinator_suggestion`, {
        iDDCoordinatorSuggestionId: iDDCoordinatorSuggestion.id,
      })
      .then(() => {
        alert("Review Submitted Successfully");
        router.push(`/im/${iMId}`);
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

  useEffect(() => {
    if (submittedIDDCoordinatorSuggestion && cITLRevision) {
      router.push(`/im/${iMId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedIDDCoordinatorSuggestion, cITLRevision, iMId]);

  const AddSuggestionItem = () => {
    const [openAdd, setOpenAdd] = useState(false);

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
        const submitSuggestionItem = async (
          iDDCoordinatorSuggestionId: string
        ) => {
          return axios
            .post(`/api/idd_coordinator_suggestion_item`, {
              ...values,
              iDDCoordinatorSuggestionId,
            })
            .then(() => {
              alert("Suggestion added successfully.");
              router.reload();
            });
        };

        if (!iDDCoordinatorSuggestion) {
          if (!activeIDDCoordinator || !deanEndorsement) {
            return;
          }
          return axios
            .post<IDDCoordinatorSuggestion>(
              `/api/idd_coordinator_suggestion/`,
              {
                activeIDDCoordinatorId: activeIDDCoordinator.id,
                deanEndorsementId: deanEndorsement.id,
              }
            )
            .then((res) => {
              const createdIDDCoordinatorSuggestion = res.data;

              return submitSuggestionItem(createdIDDCoordinatorSuggestion.id);
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          return submitSuggestionItem(iDDCoordinatorSuggestion.id);
        }
      },
    });

    return (
      <>
        <button
          onClick={() => setOpenAdd(true)}
          className='rounded bg-palette_blue text-palette_white px-2 py-1'
        >
          Add
        </button>
        {openAdd && (
          <Modal title='Add Suggestion' onClose={() => setOpenAdd(false)}>
            <form noValidate onSubmit={formik.handleSubmit}>
              <div className='flex flex-col space-y-1'>
                <textarea
                  placeholder='Suggestion'
                  {...formik.getFieldProps("suggestion")}
                  className='rounded'
                />
                <input
                  type='number'
                  placeholder='Page No.'
                  {...formik.getFieldProps("pageNumber")}
                  className='rounded'
                />
                <textarea
                  placeholder='Remarks'
                  {...formik.getFieldProps("remarks")}
                  className='rounded'
                />
                <input
                  type='submit'
                  value='Submit'
                  className='bg-palette_blue text-palette_white rounded px-2 py-1'
                />
              </div>
            </form>
          </Modal>
        )}
      </>
    );
  };
  return (
    <MainLayout>
      <div className='flex space-x-1 h-full overflow-auto'>
        <div className='space-y-1 flex-1 flex flex-col h-full overflow-auto'>
          <div className='flex justify-between'>
            <div>
              <h2 className='inline text-lg font-bold'>
                Instructional Material Review{" "}
                <span className='bg-palette_orange text-palette_white p-1 rounded'>
                  IDD Coordinator
                </span>
              </h2>
              <p className='text-sm'>Implementation Phase</p>
            </div>
            <div>
              <AddSuggestionItem />
            </div>
          </div>

          <div className='flex-1 h-full overflow-auto space-y-1'>
            <div>
              <table className='text-sm w-full'>
                <caption>IDD Coordinator Suggestions</caption>
                <thead>
                  <tr>
                    <th>SUGGESTION</th>
                    <th>PAGE NUMBER</th>
                    <th>ACTION TAKEN</th>
                    <th>REMARKS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {iDDCoordinatorSuggestionItems.iDDCoordinatorSuggestionItems.map(
                    (iDDCoordinatorSuggestionItem) => {
                      return (
                        <IDDCoordinatorSuggestionItem
                          iDDCoordinatorSuggestionItem={
                            iDDCoordinatorSuggestionItem
                          }
                          key={iDDCoordinatorSuggestionItem.id}
                        />
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
            <div className='space-y-1'>
              <IMPeerSuggestionItems id={iMId as string} editable={false} />
              <IMChairpersonSuggestionItems
                id={iMId as string}
                editable={false}
              />
              <IMCoordinatorSuggestionItems
                id={iMId as string}
                editable={false}
              />
            </div>
            <button
              className='rounded bg-palette_blue text-palette_white px-2 py-1'
              onClick={handleSubmitReview}
            >
              Submit Review
            </button>
          </div>
        </div>
        <div className='flex-1'>
          <iframe
            src={`/api/im_file/im/${iMId}/pdf`}
            className='w-full h-full rounded'
          />
        </div>
      </div>
    </MainLayout>
  );
}
