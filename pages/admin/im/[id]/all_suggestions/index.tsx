import AdminLayout from "@/components/AdminLayout";
import IMChairpersonSuggestionItems from "@/components/IMChairpersonSuggestionItems";
import IMContentEditorSuggestionItems from "@/components/IMContentEditorSuggestionItems";
import IMContentSpecialistSuggestionItems from "@/components/IMContentSpecialistSuggestionItems";
import IMCoordinatorSuggestionItems from "@/components/IMCoordinatorSuggestionItems";
import IMIDDCoordinatorSuggestionItems from "@/components/IMIDDCoordinatorSuggestionItems";
import IMIDDSpecialistSuggestionItems from "@/components/IMIDDSpecialistSuggestionItems";
import IMPeerSuggestionItems from "@/components/IMPeerSuggestionItems";
import IMQAMISSuggestionItems from "@/components/IMQAMISSuggestionItems";
import IMReturnedCITLRevisionSuggestionItems from "@/components/IMReturnedCITLRevisionSuggestionItems";
import IMReturnedDepartmentRevisionSuggestionItems from "@/components/IMReturnedDepartmentRevisionSuggestionItems";
import IMReturnedIMERCCITLRevisionSuggestionItems from "@/components/IMReturnedIMERCCITLRevisionSuggestionItems";
import Loading from "@/components/Loading";
import useIM from "@/hooks/useIM";
import Error from "next/error";
import { useRouter } from "next/router";
import { useState } from "react";

export default function AllSuggestionsPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const iM = useIM({ id: iMId as string });
  const [state, setState] = useState<{
    tab: string;
  }>({
    tab: "DEPARTMENT REVIEW",
  });

  if (iM === null) {
    return (
      <AdminLayout>
        <Error statusCode={404} title="IM Not Found" />
      </AdminLayout>
    );
  }
  if (iM === undefined) {
    return (
      <AdminLayout>
        <Loading />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-1 px-1">
        <div className="flex space-x-4 justify-center">
          <p
            className={`text-center font-bold text-sm cursor-pointer  hover:border-b-2 px-2 border-palette_orange ${
              state.tab === "DEPARTMENT REVIEW" ? "border-b" : ""
            }`}
            onClick={() => {
              setState((prev) => ({ ...prev, tab: "DEPARTMENT REVIEW" }));
            }}
          >
            DEPARTMENT REVIEW
          </p>
          <p
            className={`text-center font-bold text-sm cursor-pointer  hover:border-b-2 px-2 border-palette_orange ${
              state.tab === "CITL REVIEW" ? "border-b" : ""
            }`}
            onClick={() => {
              setState((prev) => ({ ...prev, tab: "CITL REVIEW" }));
            }}
          >
            CITL REVIEW
          </p>
          <p
            className={`text-center font-bold text-sm cursor-pointer  hover:border-b-2 px-2 border-palette_orange ${
              state.tab === "IMERC REVIEW" ? "border-b" : ""
            }`}
            onClick={() => {
              setState((prev) => ({ ...prev, tab: "IMERC REVIEW" }));
            }}
          >
            IMERC REVIEW
          </p>
        </div>

        {state.tab === "DEPARTMENT REVIEW" && (
          <>
            <IMPeerSuggestionItems id={iMId as string} editable={false} />
            <IMChairpersonSuggestionItems
              id={iMId as string}
              editable={false}
            />
            <IMCoordinatorSuggestionItems
              id={iMId as string}
              editable={false}
            />
            <IMReturnedDepartmentRevisionSuggestionItems
              id={iMId as string}
              editable={false}
            />
          </>
        )}

        {state.tab === "CITL REVIEW" && (
          <>
            <IMIDDCoordinatorSuggestionItems
              id={iMId as string}
              editable={false}
            />
            <IMReturnedCITLRevisionSuggestionItems
              id={iMId as string}
              editable={false}
            />
          </>
        )}

        {state.tab === "IMERC REVIEW" && (
          <>
            <IMQAMISSuggestionItems id={iMId as string} editable={false} />
            <IMIDDSpecialistSuggestionItems
              id={iMId as string}
              editable={false}
            />
            <IMContentSpecialistSuggestionItems
              id={iMId as string}
              editable={false}
            />
            <IMContentEditorSuggestionItems
              id={iMId as string}
              editable={false}
            />
            <IMReturnedIMERCCITLRevisionSuggestionItems
              id={iMId as string}
              editable={false}
            />
          </>
        )}
      </div>
    </AdminLayout>
  );
}
