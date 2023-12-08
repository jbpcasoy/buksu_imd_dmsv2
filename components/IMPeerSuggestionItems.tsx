import usePeerSuggestionItemActionTakenPeerSuggestionItem from "@/hooks/usePeerSuggestionItemActionTakenPeerSuggestionItem";
import usePeerSuggestionItemsIM from "@/hooks/usePeerSuggestionItemsIM";
import { PeerSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";
import { SnackbarContext } from "./SnackbarProvider";

export interface IMPeerSuggestionItemsProps {
  id: string;
  editable?: boolean;
}

export default function IMPeerSuggestionItems({
  id,
  editable = true,
}: IMPeerSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 999,
    id,
  });
  const peerSuggestionItems = usePeerSuggestionItemsIM(state);

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  return (
    <div className='border border-palette_orange rounded'>
      <table className='text-sm w-full p-1'>
        <caption className='bg-palette_grey bg-opacity-10 p-2'>
          <p className='text-left font-bold'>PEER SUGGESTIONS</p>
        </caption>
        <thead className='bg-palette_grey bg-opacity-10 text-palette_grey'>
          <tr>
            <th className='font-normal pl-2'>SUGGESTION</th>
            <th className='font-normal'>PAGE NUMBER</th>
            <th className='font-normal'>ACTION TAKEN</th>
            <th className={`font-normal ${editable ? "" : "pr-2"}`}>REMARKS</th>
            {editable && <th className='font-normal pr-2'>ACTIONS</th>}
          </tr>
        </thead>
        <tbody className='text-palette_grey'>
          {peerSuggestionItems.peerSuggestionItems.map((peerSuggestionItem) => {
            return (
              <Item
                peerSuggestionItem={peerSuggestionItem}
                editable={editable}
                key={peerSuggestionItem.id}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Item({
  peerSuggestionItem,
  editable,
}: {
  peerSuggestionItem: PeerSuggestionItem;
  editable: boolean;
}) {
  const peerSuggestionItemActionTaken =
    usePeerSuggestionItemActionTakenPeerSuggestionItem({
      id: peerSuggestionItem.id,
    });

  return (
    <tr className='border-t border-b last:border-b-0'>
      <td className={`pl-2 ${editable ? "w-1/4" : "w-3/10"}`}>
        {peerSuggestionItem.suggestion}
      </td>
      <td className={`text-center ${editable ? "w-1/8" : "w-1/10"}`}>
        {peerSuggestionItem.pageNumber}
      </td>
      <td className={`${editable ? "w-1/4" : "w-3/10"}`}>
        {peerSuggestionItemActionTaken?.value}
      </td>
      <td className={`${editable ? "w-1/4" : "w-3/10 pr-2"}`}>
        {peerSuggestionItem.remarks}
      </td>
      {editable && (
        <td className='w-1/8 pr-2'>
          <EditSuggestionItemActionTaken
            peerSuggestionItem={peerSuggestionItem}
          />
        </td>
      )}
    </tr>
  );
}

interface EditSuggestionItemActionTakenProps {
  peerSuggestionItem: PeerSuggestionItem;
}
function EditSuggestionItemActionTaken({
  peerSuggestionItem,
}: EditSuggestionItemActionTakenProps) {
  const router = useRouter();
  const { addSnackbar } = useContext(SnackbarContext);
  const [openEditActionTaken, setOpenEditActionTaken] = useState(false);
  const peerSuggestionItemActionTaken =
    usePeerSuggestionItemActionTakenPeerSuggestionItem({
      id: peerSuggestionItem.id,
    });
  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
    }),
    onSubmit: (values) => {
      if (peerSuggestionItemActionTaken) {
        axios
          .put(
            `/api/peer_suggestion_item_action_taken/${peerSuggestionItemActionTaken.id}`,
            values
          )
          .then(() => {
            addSnackbar("Suggestion has been updated successfully");
          })
          .catch(() => {
            addSnackbar("Failed to update suggestion", "error");
          })
          .finally(() => {
            router.reload();
          });
      } else {
        axios
          .post(`/api/peer_suggestion_item_action_taken`, {
            peerSuggestionItemId: peerSuggestionItem.id,
            value: values.value,
          })
          .then(() => {
            addSnackbar("Suggestion has been updated successfully");
          })
          .catch(() => {
            addSnackbar("Failed to update suggestion", "error");
          })
          .finally(() => {
            router.reload();
          });
      }
    },
  });

  useEffect(() => {
    if (!peerSuggestionItemActionTaken) return;
    formik.setValues({
      value: peerSuggestionItemActionTaken.value ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerSuggestionItemActionTaken]);

  return (
    <div>
      <button
        className='bg-palette_blue text-palette_white px-1 rounded text-sm w-full py-1 inline-flex justify-center hover:bg-opacity-90'
        onClick={() => setOpenEditActionTaken(true)}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          height='1em'
          viewBox='0 0 512 512'
          className='fill-palette_white'
        >
          <path d='M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z' />
        </svg>
      </button>
      {openEditActionTaken && (
        <Modal
          title='Edit Action Taken'
          onClose={() => setOpenEditActionTaken(false)}
        >
          <form noValidate onSubmit={formik.handleSubmit}>
            <div className='flex flex-col space-y-1'>
              <textarea
                placeholder='Action Taken'
                {...formik.getFieldProps("value")}
                className='rounded'
              />
              <button
                type='submit'
                className='bg-palette_blue text-palette_white rounded px-2 py-1 flex items-center space-x-2 justify-center hover:bg-opacity-90'
              >
                <span>Submit</span>
                <span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    height='1em'
                    viewBox='0 0 448 512'
                    className='fill-palette_white'
                  >
                    <path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z' />
                  </svg>
                </span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
