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
import MainLayout from "@/components/MainLayout";
import useIM from "@/hooks/useIM";
import Error from "next/error";
import { useRouter } from "next/router";

export default function AllSuggestionsPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const iM = useIM({ id: iMId as string });

  if (iM === null) {
    return (
      <MainLayout>
        <Error statusCode={404} title="IM Not Found" />
      </MainLayout>
    );
  }
  if (iM === undefined) {
    return (
      <MainLayout>
        <Loading />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-1 bg-palette_white rounded-2xl p-4 h-full flex flex-col">
        <div className="pb-4">
          <div className="border border-palette_orange p-4 rounded-lg inline-flex space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>

            <h2 className="font-bold text-base">All Suggestions</h2>
          </div>
        </div>
        <div className="h-full overflow-auto space-y-2">
          <p className="text-center font-bold">IMPLEMENTATION PHASE</p>
          <p className="text-center font-bold text-sm">DEPARTMENT REVIEW</p>
          <IMPeerSuggestionItems id={iMId as string} editable={false} />
          <IMChairpersonSuggestionItems id={iMId as string} editable={false} />
          <IMCoordinatorSuggestionItems id={iMId as string} editable={false} />
          <IMReturnedDepartmentRevisionSuggestionItems
            id={iMId as string}
            editable={false}
          />
          <p className="text-center font-bold text-sm">CITL REVIEW</p>
          <IMIDDCoordinatorSuggestionItems
            id={iMId as string}
            editable={false}
          />
          <IMReturnedCITLRevisionSuggestionItems
            id={iMId as string}
            editable={false}
          />
          <p className="text-center font-bold">IMERC</p>
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
        </div>
      </div>
    </MainLayout>
  );
}
