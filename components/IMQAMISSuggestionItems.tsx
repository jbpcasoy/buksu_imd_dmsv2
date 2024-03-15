import useCITLDirectorEndorsement from "@/hooks/useCITLDirectorEndorsement";
import useCITLRevision from "@/hooks/useCITLRevision";
import useFaculty from "@/hooks/useFaculty";
import useIDDCoordinatorEndorsement from "@/hooks/useIDDCoordinatorEndorsement";
import useIM from "@/hooks/useIM";
import useIMFile from "@/hooks/useIMFile";
import useQAMISSuggestion from "@/hooks/useQAMISSuggestion";
import useQAMISSuggestionItemsIM from "@/hooks/useQAMISSuggestionItemsIM";
import useSubmittedQAMISSuggestionIM from "@/hooks/useSubmittedQAMISSuggestionIM";
import useUser from "@/hooks/useUser";
import { QAMISSuggestionItem, SubmittedQAMISSuggestion } from "@prisma/client";
import { DateTime } from "luxon";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface IMQAMISSuggestionItemsProps {
  id: string;
  editable?: boolean;
}

export default function IMQAMISSuggestionItems({
  id,
  editable = true,
}: IMQAMISSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: Number(process.env.NEXT_PUBLIC_MAX_QUERY_TAKE),
    id,
  });

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  const { data: session } = useSession();
  const qAMISSuggestionItems = useQAMISSuggestionItemsIM(state);
  const submittedQAMISSuggestion = useSubmittedQAMISSuggestionIM({
    id,
  });

  return (
    <div className="border border-palette_orange rounded text-sm">
      <div className="p-2 bg-palette_grey bg-opacity-10">
        <p className="text-left font-bold">QAMIS SUGGESTIONS</p>
        {submittedQAMISSuggestion && session?.user?.isAdmin && (
          <UserInformation
            submittedQAMISSuggestion={submittedQAMISSuggestion}
          />
        )}
      </div>
      <hr />
      {qAMISSuggestionItems.qAMISSuggestionItems.map((qAMISSuggestionItem) => {
        return (
          <Item
            qAMISSuggestionItem={qAMISSuggestionItem}
            key={qAMISSuggestionItem.id}
            editable={editable}
          />
        );
      })}
    </div>
  );
}

interface UserInformationProps {
  submittedQAMISSuggestion: SubmittedQAMISSuggestion;
}

function UserInformation({ submittedQAMISSuggestion }: UserInformationProps) {
  const qAMISSuggestion = useQAMISSuggestion({
    id: submittedQAMISSuggestion?.qAMISSuggestionId,
  });
  const cITLDirectorEndorsement = useCITLDirectorEndorsement({
    id: qAMISSuggestion?.cITLDirectorEndorsementId,
  });
  const iDDCoordinatorEndorsement = useIDDCoordinatorEndorsement({
    id: cITLDirectorEndorsement?.iDDCoordinatorEndorsementId,
  });
  const cITLRevision = useCITLRevision({
    id: iDDCoordinatorEndorsement?.cITLRevisionId,
  });
  const iMFile = useIMFile({
    id: cITLRevision?.iMFileId,
  });
  const iM = useIM({
    id: iMFile?.iMId,
  });
  const faculty = useFaculty({
    id: iM?.facultyId,
  });
  const user = useUser({
    id: faculty?.userId,
  });

  return (
    <div className="flex flex-row items-center space-x-2">
      <img
        src={user?.image ?? ""}
        alt="User profile picture"
        className="h-8 w-8 rounded-full object-cover"
      />
      <div className="flex flex-col justify-between">
        <p>{user?.name}</p>
        <p className="text-xs">
          {DateTime.fromJSDate(
            new Date(submittedQAMISSuggestion?.updatedAt ?? "")
          ).toFormat("D | t")}
        </p>
      </div>
    </div>
  );
}

function Item({
  qAMISSuggestionItem,
  editable,
}: {
  qAMISSuggestionItem: QAMISSuggestionItem;
  editable: boolean;
}) {
  return (
    <div className="px-1 py-2">
      <div className="grid grid-cols-5">
        <p className="px-5 py-1 border-r border-palette_grey col-span-2 sm:col-span-1">
          Page No.
        </p>
        <p className="px-5 flex-1 col-span-2 sm:col-span-4">
          {qAMISSuggestionItem.pageNumber}
        </p>
        <p className="px-5 py-1 border-r border-palette_grey col-span-2 sm:col-span-1">
          Suggestion
        </p>
        <p className="px-5 flex-1 col-span-2 sm:col-span-4 whitespace-pre-wrap">
          {qAMISSuggestionItem.suggestion}
        </p>
        <p className="px-5 py-1 border-r border-palette_grey col-span-2 sm:col-span-1">
          Remarks
        </p>
        <p className="px-5 flex-1 col-span-2 sm:col-span-4 whitespace-pre-wrap">
          {qAMISSuggestionItem.remarks}
        </p>
        <p className="px-5 py-1 border-r border-palette_grey col-span-2 sm:col-span-1">
          Action Taken
        </p>
        <p className="px-5 flex-1 col-span-2 sm:col-span-4 whitespace-pre-wrap">
          {qAMISSuggestionItem?.actionTaken}
        </p>
      </div>
    </div>
  );
}
