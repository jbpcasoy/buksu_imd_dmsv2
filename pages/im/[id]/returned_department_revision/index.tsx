import IMChairpersonSuggestionItems from "@/components/IMChairpersonSuggestionItems";
import IMCoordinatorSuggestionItems from "@/components/IMCoordinatorSuggestionItems";
import IMPeerSuggestionItems from "@/components/IMPeerSuggestionItems";
import IMReturnedDepartmentRevisionSuggestionItems from "@/components/IMReturnedDepartmentRevisionSuggestionItems";
import MainLayout from "@/components/MainLayout";
import ReturnedDepartmentRevisionItem from "@/components/ReturnedDepartmentRevisionItem";
import useActiveCoordinatorMe from "@/hooks/useActiveCoordinatorMe";
import useDepartmentRevisionIM from "@/hooks/useDepartmentRevisionIM";
import useReturnedDepartmentRevisionMe from "@/hooks/useReturnedDepartmentRevisionMe";
import useReturnedDepartmentRevisionSuggestionItemsIM, {
  useReturnedDepartmentRevisionSuggestionItemsIMParams,
} from "@/hooks/useReturnedDepartmentRevisionSuggestionItemsIM";
import useReturnedDepartmentRevisionSuggestionItemsOwn from "@/hooks/useReturnedDepartmentRevisionSuggestionItemsOwn";
import useSubmittedReturnedDepartmentRevisionReturnedDepartmentRevision from "@/hooks/useSubmittedReturnedDepartmentRevisionReturnedDepartmentRevision";
import ReturnedDepartmentRevisionSuggestionItemEditPage from "@/pages/returned_department_revision_suggestion_item/[id]/edit";
import { ReturnedDepartmentRevision } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";

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
      take: 10,
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
  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip:
          nextVal <= returnedDepartmentRevisionSuggestionItems.count
            ? nextVal
            : prev.skip,
      };
    });
  };

  const handlePrev = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };
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

  useEffect(() => {
    if (submittedReturnedDepartmentRevision && departmentRevision) {
      router.push(`/im/${iMId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedReturnedDepartmentRevision, departmentRevision, iMId]);

  return (
    <MainLayout>
      <div>
        <div className='flex justify-between'>
          <h2 className='inline'>Return Department Revision</h2>
          <Link
            href={`/api/im_file/im/${iMId}/pdf`}
            className='underline'
            target='_blank'
          >
            View PDF
          </Link>
        </div>
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
          <table>
            <caption>Suggestions</caption>
            <thead>
              <tr>
                <th>id</th>
                <th>createdAt</th>
                <th>updatedAt</th>
                <th>suggestion</th>
                <th>pageNumber</th>
                <th>actionTaken</th>
                <th>remarks</th>
                <th>returnedDepartmentRevisionId</th>
                <th>actions</th>
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
          <div className='flex justify-end space-x-1'>
            <p>
              {state.skip} - {state.skip + state.take} of{" "}
              {returnedDepartmentRevisionSuggestionItems.count}
            </p>
            <button className='border rounded' onClick={handlePrev}>
              prev
            </button>
            <button className='border rounded' onClick={handleNext}>
              next
            </button>
          </div>
        </div>
        <div>
          <IMCoordinatorSuggestionItems id={iMId as string} editable={false} />
          <IMPeerSuggestionItems id={iMId as string} editable={false} />
          <IMChairpersonSuggestionItems id={iMId as string} editable={false} />
          <IMReturnedDepartmentRevisionSuggestionItems
            id={iMId as string}
            editable={false}
          />
        </div>
        <button className='rounded border' onClick={handleSubmitSuggestions}>
          Submit Review
        </button>
      </div>
    </MainLayout>
  );
}
