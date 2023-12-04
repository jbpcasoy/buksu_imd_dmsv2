import IMChairpersonSuggestionItems from "@/components/IMChairpersonSuggestionItems";
import IMContentEditorSuggestionItems from "@/components/IMContentEditorSuggestionItems";
import IMContentSpecialistSuggestionItems from "@/components/IMContentSpecialistSuggestionItems";
import IMCoordinatorSuggestionItems from "@/components/IMCoordinatorSuggestionItems";
import IMIDDCoordinatorSuggestionItems from "@/components/IMIDDCoordinatorSuggestionItems";
import IMIDDSpecialistSuggestionItems from "@/components/IMIDDSpecialistSuggestionItems";
import IMPeerSuggestionItems from "@/components/IMPeerSuggestionItems";
import IMQAMISSuggestionItems from "@/components/IMQAMISSuggestionItems";
import IMReturnedDepartmentRevisionSuggestionItems from "@/components/IMReturnedDepartmentRevisionSuggestionItems";
import IMReturnedIMERCCITLRevisionSuggestionItems from "@/components/IMReturnedIMERCCITLRevisionSuggestionItems";
import Loading from "@/components/Loading";
import AdminLayout from "@/components/AdminLayout";
import useIM from "@/hooks/useIM";
import Error from "next/error";
import { useRouter } from "next/router";

export default function AllSuggestionsPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const iM = useIM({ id: iMId as string });

  if (iM === null) {
    return (
      <AdminLayout>
        <Error statusCode={404} title='IM Not Found' />
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
      <div className='space-y-1 px-1'>
        <p className='text-center font-bold'>IMPLEMENTATION PHASE</p>
        <p className='text-center font-bold text-sm'>DEPARTMENT REVIEW</p>
        <IMPeerSuggestionItems id={iMId as string} editable={false} />
        <IMChairpersonSuggestionItems id={iMId as string} editable={false} />
        <IMCoordinatorSuggestionItems id={iMId as string} editable={false} />
        <IMReturnedDepartmentRevisionSuggestionItems
          id={iMId as string}
          editable={false}
        />
        <p className='text-center font-bold text-sm'>CITL REVIEW</p>
        <IMIDDCoordinatorSuggestionItems id={iMId as string} editable={false} />
        <p className='text-center font-bold'>IMERC</p>
        <IMQAMISSuggestionItems id={iMId as string} editable={false} />
        <IMIDDSpecialistSuggestionItems id={iMId as string} editable={false} />
        <IMContentSpecialistSuggestionItems
          id={iMId as string}
          editable={false}
        />
        <IMContentEditorSuggestionItems id={iMId as string} editable={false} />
        <IMReturnedIMERCCITLRevisionSuggestionItems
          id={iMId as string}
          editable={false}
        />
      </div>
    </AdminLayout>
  );
}
