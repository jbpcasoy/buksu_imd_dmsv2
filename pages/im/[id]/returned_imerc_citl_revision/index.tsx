import IMChairpersonSuggestionItems from "@/components/IMChairpersonSuggestionItems";
import IMCoordinatorSuggestionItems from "@/components/IMCoordinatorSuggestionItems";
import IMPeerSuggestionItems from "@/components/IMPeerSuggestionItems";
import IMReturnedIMERCCITLRevisionSuggestionItems from "@/components/IMReturnedIMERCCITLRevisionSuggestionItems";
import MainLayout from "@/components/MainLayout";
import Modal from "@/components/Modal";
import ReturnedIMERCCITLRevisionItem from "@/components/ReturnedIMERCCITLRevisionItem";
import useActiveIDDCoordinatorMe from "@/hooks/useActiveIDDCoordinatorMe";
import useIMERCCITLRevisionIM from "@/hooks/useIMERCCITLRevisionIM";
import useReturnedIMERCCITLRevisionMe from "@/hooks/useReturnedIMERCCITLRevisionMe";
import { useReturnedIMERCCITLRevisionSuggestionItemsIMParams } from "@/hooks/useReturnedIMERCCITLRevisionSuggestionItemsIM";
import useReturnedIMERCCITLRevisionSuggestionItemsOwn from "@/hooks/useReturnedIMERCCITLRevisionSuggestionItemsOwn";
import useSubmittedReturnedIMERCCITLRevisionReturnedIMERCCITLRevision from "@/hooks/useSubmittedReturnedIMERCCITLRevisionReturnedIMERCCITLRevision";
import { ReturnedIMERCCITLRevision } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";

export default function ReturnedIMERCCITLRevisionPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const returnedIMERCCITLRevision = useReturnedIMERCCITLRevisionMe({
    id: iMId as string,
  });
  const activeIDDCoordinator = useActiveIDDCoordinatorMe();
  const [state, setState] =
    useState<useReturnedIMERCCITLRevisionSuggestionItemsIMParams>({
      skip: 0,
      take: 999,
    });
  const iMERCCITLRevision = useIMERCCITLRevisionIM({ id: iMId as string });
  const submittedReturnedIMERCCITLRevision =
    useSubmittedReturnedIMERCCITLRevisionReturnedIMERCCITLRevision({
      id: returnedIMERCCITLRevision?.id,
    });
  const returnedIMERCCITLRevisionSuggestionItems =
    useReturnedIMERCCITLRevisionSuggestionItemsOwn({
      ...state,
      id: returnedIMERCCITLRevision?.id,
    });

  const handleSubmitSuggestions = () => {
    if (!returnedIMERCCITLRevision) return;
    axios
      .post(`/api/submitted_returned_imerc_citl_revision`, {
        returnedIMERCCITLRevisionId: returnedIMERCCITLRevision.id,
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
    if (!returnedIMERCCITLRevision) return;

    setState((prev) => ({
      ...prev,
      id: returnedIMERCCITLRevision.id,
    }));
  }, [returnedIMERCCITLRevision]);

  useEffect(() => {
    if (submittedReturnedIMERCCITLRevision && iMERCCITLRevision) {
      router.push(`/im/${iMId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedReturnedIMERCCITLRevision, iMERCCITLRevision, iMId]);

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
          returnedIMERCCITLRevisionId: string
        ) => {
          return axios
            .post(`/api/returned_imerc_citl_revision_suggestion_item`, {
              ...values,
              returnedIMERCCITLRevisionId,
            })
            .then(() => {
              alert("Suggestion added successfully.");
              router.reload();
            });
        };

        if (!returnedIMERCCITLRevision) {
          if (!activeIDDCoordinator || !iMERCCITLRevision) {
            return;
          }
          return axios
            .post<ReturnedIMERCCITLRevision>(
              `/api/returned_imerc_citl_revision/`,
              {
                activeIDDCoordinatorId: activeIDDCoordinator.id,
                iMERCCITLRevisionId: iMERCCITLRevision.id,
              }
            )
            .then((res) => {
              const createdCoordinatorSuggestion = res.data;

              return submitSuggestionItem(createdCoordinatorSuggestion.id);
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          return submitSuggestionItem(returnedIMERCCITLRevision.id);
        }
      },
    });

    return (
      <>
        <button
          className='bg-palette_blue text-palette_white px-2 py-1 rounded'
          onClick={() => setOpenAdd(true)}
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
                  className='bg-palette_blue text-palette_white py-1 rounded'
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
                  Returned IMERC CITL Revision
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
              <table className='w-full text-sm'>
                <caption>Suggestions</caption>
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
                  {returnedIMERCCITLRevisionSuggestionItems.returnedIMERCCITLRevisionSuggestionItems.map(
                    (returnedIMERCCITLRevisionSuggestionItem) => {
                      return (
                        <ReturnedIMERCCITLRevisionItem
                          returnedIMERCCITLRevisionSuggestionItem={
                            returnedIMERCCITLRevisionSuggestionItem
                          }
                          key={returnedIMERCCITLRevisionSuggestionItem.id}
                        />
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
            <div className='space-y-1'>
              <IMCoordinatorSuggestionItems
                id={iMId as string}
                editable={false}
              />
              <IMPeerSuggestionItems id={iMId as string} editable={false} />
              <IMChairpersonSuggestionItems
                id={iMId as string}
                editable={false}
              />
              <IMReturnedIMERCCITLRevisionSuggestionItems
                id={iMId as string}
                editable={false}
              />
            </div>
            <button
              className='bg-palette_blue text-palette_white px-2 py-1 rounded'
              onClick={handleSubmitSuggestions}
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
