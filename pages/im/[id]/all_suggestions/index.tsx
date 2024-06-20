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
import { Dispatch, SetStateAction, useState } from "react";

export default function AllSuggestionsPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const iM = useIM({ id: iMId as string });
  const [state, setState] = useState({ tab: 1 });

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
      <div className="space-y-1 bg-palette_white rounded-2xl p-4 h-full flex flex-col overflow-auto">
        <div className="pb-4 overflow-auto">
          <div className="border border-palette_orange p-2 rounded-lg inline-flex space-x-2">
            <svg
              width="16"
              height="20"
              viewBox="0 0 18 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-palette_grey"
            >
              <path
                d="M16.5 13.25V10.625C16.5 9.72989 16.1444 8.87145 15.5115 8.23851C14.8786 7.60558 14.0201 7.25 13.125 7.25H11.625C11.3266 7.25 11.0405 7.13147 10.8295 6.9205C10.6185 6.70952 10.5 6.42337 10.5 6.125V4.625C10.5 3.72989 10.1444 2.87145 9.51149 2.23851C8.87855 1.60558 8.02011 1.25 7.125 1.25H5.25M5.25 14H12.75M5.25 17H9M7.5 1.25H2.625C2.004 1.25 1.5 1.754 1.5 2.375V19.625C1.5 20.246 2.004 20.75 2.625 20.75H15.375C15.996 20.75 16.5 20.246 16.5 19.625V10.25C16.5 7.86305 15.5518 5.57387 13.864 3.88604C12.1761 2.19821 9.88695 1.25 7.5 1.25Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h2 className="inline whitespace-nowrap font-semibold text-sm">All Suggestions</h2>
          </div>

          <Tab state={state} setState={setState} />
        </div>
        <div className="h-full overflow-auto space-y-2">
          {state.tab === 1 && <IMPeerSuggestionItems id={iMId as string} editable={false} />}
          {state.tab === 2 && <IMChairpersonSuggestionItems id={iMId as string} editable={false} />}
          {state.tab === 3 && <IMCoordinatorSuggestionItems id={iMId as string} editable={false} />}
          {state.tab === 4 && <IMReturnedDepartmentRevisionSuggestionItems
            id={iMId as string}
            editable={false}
          />}
          {state.tab === 5 && <IMIDDCoordinatorSuggestionItems
            id={iMId as string}
            editable={false}
          />}
          {state.tab === 6 && <IMReturnedCITLRevisionSuggestionItems
            id={iMId as string}
            editable={false}
          />}
          {state.tab === 7 && <IMQAMISSuggestionItems id={iMId as string} editable={false} />}
          {state.tab === 8 && <IMIDDSpecialistSuggestionItems
            id={iMId as string}
            editable={false}
          />}
          {state.tab === 9 && <IMContentSpecialistSuggestionItems
            id={iMId as string}
            editable={false}
          />}
          {state.tab === 10 && <IMContentEditorSuggestionItems
            id={iMId as string}
            editable={false}
          />}
          {state.tab === 11 && <IMReturnedIMERCCITLRevisionSuggestionItems
            id={iMId as string}
            editable={false}
          />}
        </div>
      </div>
    </MainLayout>
  );
}


function Tab({ state, setState }: {
  state: { tab: number; }, setState: Dispatch<SetStateAction<{
    tab: number;
  }>>
}) {
  const Tab = ({ label, value }: { label: string, value: number }) => {
    return <p className={`border-b-2 hover:border-palette_grey cursor-pointer px-4 text-xs font-medium ${value === state.tab ? "border-palette_blue text-palette_blue" : "border-transparent text-palette_grey"}`} onClick={() => { setState(prev => ({ ...prev, tab: value })) }}>{label}</p>
  }

  return (
    <div className="flex p-2 overflow-auto">
      <div className="inline-flex justify-center space-x-4 border-b">
        <Tab value={1} label="Peer" />
        <Tab value={2} label="Chairperson" />
        <Tab value={3} label="Coordinator" />
        <Tab value={4} label="Returned (Department)" />
        <Tab value={5} label="IDD Coordinator" />
        <Tab value={6} label="Returned (CITL)" />
        <Tab value={7} label="QAMIS" />
        <Tab value={8} label="IDD Specialist" />
        <Tab value={9} label="Content Specialist" />
        <Tab value={10} label="Content Editor" />
        <Tab value={11} label="Returned (IMERC)" />
      </div>
    </div>
  )
}