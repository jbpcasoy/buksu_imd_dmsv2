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
import useIMFile from "@/hooks/useIMFile";
import { DateTime } from "luxon";
import Error from "next/error";
import { useRouter } from "next/router";

export default function VersionsPage() {
  const router = useRouter();
  const iMFileId = router.query.iMFileId as string;
  const iMId = router.query.id as string;
  const iMFile = useIMFile({
    id: iMFileId,
  });

  if (iMFile === undefined) {
    return (
      <MainLayout>
        <Loading />
      </MainLayout>
    );
  }

  if (iMFile === null) {
    return (
      <MainLayout>
        <Error statusCode={404} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="h-full flex flex-col overflow-auto">
        <div className="h-full flex flex-row md:space-x-4 overflow-auto">
          {iMFile && (
            <div className="flex-1 overflow-auto flex flex-col bg-palette_white p-4 rounded-2xl space-y-4">
              <div className="">
                {!iMFile?.departmentReviewedId &&
                  !iMFile?.submittedReturnedDepartmentRevisionId &&
                  !iMFile?.submittedIDDCoordinatorSuggestionId &&
                  !iMFile?.submittedReturnedCITLRevisionId &&
                  !iMFile?.submittedQAMISSuggestionId &&
                  !iMFile?.iMERCCITLReviewedId &&
                  !iMFile?.submittedReturnedIMERCCITLRevisionId && (
                    <p className="font-bold">Draft</p>
                  )
                }
                {iMFile?.departmentReviewedId && (
                  <p className="font-bold">Department Revision</p>
                )}
                {iMFile?.submittedReturnedDepartmentRevisionId && (
                  <p className="font-bold">Returned Department Revision</p>
                )}
                {iMFile?.submittedIDDCoordinatorSuggestionId && (
                  <p className="font-bold">CITL Revision</p>
                )}
                {iMFile?.submittedReturnedCITLRevisionId && (
                  <p className="font-bold">Returned CITL Revision</p>
                )}
                {iMFile?.submittedQAMISSuggestionId && (
                  <p className="font-bold">QAMIS Revision</p>
                )}
                {iMFile?.iMERCCITLReviewedId && (
                  <p className="font-bold">IMERC CITL Revision</p>
                )}
                {iMFile?.submittedReturnedIMERCCITLRevisionId && (
                  <p className="font-bold">Returned IMERC CITL Revision</p>
                )}
                <p className="text-palette_grey">{iMFile?.filename}</p>
                <p className="text-palette_grey text-xs">
                  {DateTime.fromJSDate(
                    new Date(iMFile?.createdAt ?? "")
                  ).toFormat("D | t")}
                </p>
              </div>
              <div className="flex-1 overflow-auto">
                {!iMFile?.departmentReviewedId &&
                  !iMFile?.submittedReturnedDepartmentRevisionId &&
                  !iMFile?.submittedIDDCoordinatorSuggestionId &&
                  !iMFile?.submittedReturnedCITLRevisionId &&
                  !iMFile?.submittedQAMISSuggestionId &&
                  !iMFile?.iMERCCITLReviewedId &&
                  !iMFile?.submittedReturnedIMERCCITLRevisionId && (
                    <div className="space-y-1">
                      <p className="text-palette_grey text-center">
                        NO REVIEWS YET
                      </p>
                    </div>
                  )}
                {iMFile?.departmentReviewedId && (
                  <div className="space-y-1">
                    <IMPeerSuggestionItems
                      id={iMId as string}
                      editable={false}
                    />
                    <IMChairpersonSuggestionItems
                      id={iMId as string}
                      editable={false}
                    />
                    <IMCoordinatorSuggestionItems
                      id={iMId as string}
                      editable={false}
                    />
                  </div>
                )}
                {iMFile?.submittedReturnedDepartmentRevisionId && (
                  <div className="space-y-1">
                    <IMReturnedDepartmentRevisionSuggestionItems
                      id={iMId as string}
                      editable={false}
                    />
                  </div>
                )}
                {iMFile?.submittedIDDCoordinatorSuggestionId && (
                  <div className="space-y-1">
                    <IMIDDCoordinatorSuggestionItems
                      id={iMId as string}
                      editable={false}
                    />
                  </div>
                )}
                {iMFile?.submittedReturnedCITLRevisionId && (
                  <div className="space-y-1">
                    <IMReturnedCITLRevisionSuggestionItems
                      id={iMId as string}
                      editable={false}
                    />
                  </div>
                )}
                {iMFile?.submittedQAMISSuggestionId && (
                  <div className="space-y-1">
                    <IMQAMISSuggestionItems
                      id={iMId as string}
                      editable={false}
                    />
                  </div>
                )}
                {iMFile?.iMERCCITLReviewedId && (
                  <div className="space-y-1">
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
                  </div>
                )}
                {iMFile?.submittedReturnedIMERCCITLRevisionId && (
                  <div className="space-y-1">
                    <IMReturnedIMERCCITLRevisionSuggestionItems
                      id={iMId as string}
                      editable={false}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          {iMFile && (
            <div className="flex-1 overflow-auto">
              <iframe
                loading="lazy"
                src={`/api/im_file/${iMFile.id}/pdf`}
                title={iMFile.filename}
                className="w-full h-full"
              />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
