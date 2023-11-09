import IMChairpersonSuggestionItems from "@/components/IMChairpersonSuggestionItems";
import IMContentEditorSuggestionItems from "@/components/IMContentEditorSuggestionItems";
import IMContentSpecialistSuggestionItems from "@/components/IMContentSpecialistSuggestionItems";
import IMCoordinatorSuggestionItems from "@/components/IMCoordinatorSuggestionItems";
import IMIDDCoordinatorSuggestionItems from "@/components/IMIDDCoordinatorSuggestionItems";
import IMIDDSpecialistSuggestionItems from "@/components/IMIDDSpecialistSuggestionItems";
import IMPeerSuggestionItems from "@/components/IMPeerSuggestionItems";
import IMQAMISSuggestionItems from "@/components/IMQAMISSuggestionItems";
import IMReturnedDepartmentRevisionSuggestionItems from "@/components/IMReturnedDepartmentRevisionSuggestionItems";
import MainLayout from "@/components/MainLayout";
import Link from "next/link";
import { useRouter } from "next/router";

export default function AllSuggestionsPage() {
  const router = useRouter();
  const iMId = router.query.id;

  return (
    <MainLayout>
      <div className='flex justify-end'>
        <Link
          href={`/api/im_file/im/${iMId}/pdf`}
          className='underline'
          target='_blank'
        >
          View PDF
        </Link>
      </div>
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
      <p className='text-center font-bold text-sm'>QAMIS SUGGESTIONS</p>
      <IMQAMISSuggestionItems id={iMId as string} editable={false} />
      <p className='text-center font-bold text-sm'>CITL REVIEW</p>
      <IMIDDSpecialistSuggestionItems id={iMId as string} editable={false} />
      <IMContentSpecialistSuggestionItems
        id={iMId as string}
        editable={false}
      />
      <IMContentEditorSuggestionItems id={iMId as string} editable={false} />
    </MainLayout>
  );
}
