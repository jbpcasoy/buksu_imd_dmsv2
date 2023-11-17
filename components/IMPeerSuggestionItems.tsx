import usePeerSuggestionItemActionTakenPeerSuggestionItem from "@/hooks/usePeerSuggestionItemActionTakenPeerSuggestionItem";
import usePeerSuggestionItemsIM from "@/hooks/usePeerSuggestionItemsIM";
import { PeerSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PeerSuggestionItemProps } from "./PeerSuggestionItem";
import * as Yup from "yup";
import Modal from "./Modal";

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
    take: 10,
    id,
  });

  const peerSuggestionItems = usePeerSuggestionItemsIM(state);

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip: nextVal <= peerSuggestionItems.count ? nextVal : prev.skip,
      };
    });
  };

  const handlePrev = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };

  return (
    <div>
      <table className='text-sm w-full'>
        <caption className='text-xs'>Peer Suggestions</caption>
        <thead>
          <tr>
            <th>LAST ACTIVITY</th>
            <th>SUGGESTION</th>
            <th>PAGE NUMBER</th>
            <th>ACTION TAKEN</th>
            <th>REMARKS</th>
            {editable && <th>ACTIONS</th>}
          </tr>
        </thead>
        <tbody>
          {peerSuggestionItems.peerSuggestionItems.map(
            (peerSuggestionItem) => {
              return (
                <Item
                  peerSuggestionItem={peerSuggestionItem}
                  editable={editable}
                  key={peerSuggestionItem.id}
                />
              );
            }
          )}
        </tbody>
      </table>
      <div className='flex justify-end space-x-1 text-sm'>
        <p>
          {state.skip} - {state.skip + state.take} of{" "}
          {peerSuggestionItems.count}
        </p>
        <button className='border rounded' onClick={handlePrev}>
          prev
        </button>
        <button className='border rounded' onClick={handleNext}>
          next
        </button>
      </div>
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
    <tr>
      <td>
        {DateTime.fromJSDate(
          new Date(peerSuggestionItem.updatedAt)
        ).toRelative()}
      </td>
      <td>{peerSuggestionItem.suggestion}</td>
      <td className='text-center'>{peerSuggestionItem.pageNumber}</td>
      <td>{peerSuggestionItemActionTaken?.value}</td>
      <td>{peerSuggestionItem.remarks}</td>
      {editable && (
        <td>
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
            alert("Suggestion updated successfully");
            router.reload();
          });
      } else {
        axios
          .post(`/api/peer_suggestion_item_action_taken`, {
            peerSuggestionItemId: peerSuggestionItem.id,
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
    if (!peerSuggestionItemActionTaken) return;
    formik.setValues({
      value: peerSuggestionItemActionTaken.value ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerSuggestionItemActionTaken]);

  return (
    <div>
      <button
        className='bg-palette_blue text-palette_white rounded px-1 text-sm w-full'
        onClick={() => setOpenEditActionTaken(true)}
      >
        Edit
      </button>
      {openEditActionTaken && (
        <Modal
          title='Peer Review'
          onClose={() => setOpenEditActionTaken(false)}
        >
          <form noValidate onSubmit={formik.handleSubmit}>
            <div className='flex flex-col space-y-1'>
              <textarea
                placeholder='Action Taken'
                {...formik.getFieldProps("value")}
                className="rounded"
              />
              <input
                type='submit'
                value='Submit'
                className='bg-palette_blue text-palette_white rounded py-1'
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
