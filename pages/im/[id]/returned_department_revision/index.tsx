import IMChairpersonSuggestionItems from "@/components/IMChairpersonSuggestionItems";
import IMCoordinatorSuggestionItems from "@/components/IMCoordinatorSuggestionItems";
import IMPeerSuggestionItems from "@/components/IMPeerSuggestionItems";
import IMReturnedDepartmentRevisionSuggestionItems from "@/components/IMReturnedDepartmentRevisionSuggestionItems";
import MainLayout from "@/components/MainLayout";
import Modal from "@/components/Modal";
import ReturnedDepartmentRevisionItem from "@/components/ReturnedDepartmentRevisionItem";
import useActiveCoordinatorMe from "@/hooks/useActiveCoordinatorMe";
import useDepartmentRevisionIM from "@/hooks/useDepartmentRevisionIM";
import useReturnedDepartmentRevisionMe from "@/hooks/useReturnedDepartmentRevisionMe";
import { useReturnedDepartmentRevisionSuggestionItemsIMParams } from "@/hooks/useReturnedDepartmentRevisionSuggestionItemsIM";
import useReturnedDepartmentRevisionSuggestionItemsOwn from "@/hooks/useReturnedDepartmentRevisionSuggestionItemsOwn";
import useSubmittedReturnedDepartmentRevisionReturnedDepartmentRevision from "@/hooks/useSubmittedReturnedDepartmentRevisionReturnedDepartmentRevision";
import { ReturnedDepartmentRevision } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";

// TODO add view IM while suggesting
export default function ReturnedDepartmentRevisionPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const returnedDepartmentRevision = useReturnedDepartmentRevisionMe({
    id: iMId as string,
  });
  const activeCoordinator = useActiveCoordinatorMe();
  const [state, setState] =
    useState<useReturnedDepartmentRevisionSuggestionItemsIMParams>({
      skip: 0,
      take: 999,
    });
  const departmentRevision = useDepartmentRevisionIM({ id: iMId as string });
  const submittedReturnedDepartmentRevision =
    useSubmittedReturnedDepartmentRevisionReturnedDepartmentRevision({
      id: returnedDepartmentRevision?.id,
    });
  const returnedDepartmentRevisionSuggestionItems =
    useReturnedDepartmentRevisionSuggestionItemsOwn({
      ...state,
      id: returnedDepartmentRevision?.id,
    });

  const handleSubmitSuggestions = () => {
    if (!returnedDepartmentRevision) return;
    axios
      .post(`/api/submitted_returned_department_revision`, {
        returnedDepartmentRevisionId: returnedDepartmentRevision.id,
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
    if (!returnedDepartmentRevision) return;

    setState((prev) => ({
      ...prev,
      id: returnedDepartmentRevision.id,
    }));
  }, [returnedDepartmentRevision]);

  useEffect(() => {
    if (submittedReturnedDepartmentRevision && departmentRevision) {
      router.push(`/im/${iMId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedReturnedDepartmentRevision, departmentRevision, iMId]);

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
          returnedDepartmentRevisionId: string
        ) => {
          return axios
            .post(`/api/returned_department_revision_suggestion_item`, {
              ...values,
              returnedDepartmentRevisionId,
            })
            .then(() => {
              alert("Suggestion added successfully.");
              router.reload();
            });
        };

        if (!returnedDepartmentRevision) {
          if (!activeCoordinator || !departmentRevision) {
            return;
          }
          return axios
            .post<ReturnedDepartmentRevision>(
              `/api/returned_department_revision/`,
              {
                activeCoordinatorId: activeCoordinator.id,
                departmentRevisionId: departmentRevision.id,
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
          return submitSuggestionItem(returnedDepartmentRevision.id);
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
          <Modal onClose={() => setOpenAdd(false)} title='Add Suggestion'>
            <form noValidate onSubmit={formik.handleSubmit}>
              <div className='flex flex-col space-y-1'>
                <textarea
                  placeholder='Suggestion'
                  {...formik.getFieldProps("suggestion")}
                  className='w-full rounded'
                />
                <input
                  type='number'
                  placeholder='Page No.'
                  {...formik.getFieldProps("pageNumber")}
                  className='w-full rounded'
                />
                <textarea
                  placeholder='Remarks'
                  {...formik.getFieldProps("remarks")}
                  className='w-full rounded'
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
                  Returned Department Revision
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
                <caption>SUGGESTIONS</caption>
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
                  {returnedDepartmentRevisionSuggestionItems.returnedDepartmentRevisionSuggestionItems.map(
                    (returnedDepartmentRevisionSuggestionItem) => {
                      return (
                        <ReturnedDepartmentRevisionItem
                          returnedDepartmentRevisionSuggestionItem={
                            returnedDepartmentRevisionSuggestionItem
                          }
                          key={returnedDepartmentRevisionSuggestionItem.id}
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
              <IMReturnedDepartmentRevisionSuggestionItems
                id={iMId as string}
                editable={false}
              />
            </div>
            <button
              className='bg-palette_blue text-palette_white px-1 py-1 rounded'
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
