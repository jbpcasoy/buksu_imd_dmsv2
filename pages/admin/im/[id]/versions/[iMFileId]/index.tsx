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
      <AdminLayout>
        <Loading />
      </AdminLayout>
    );
  }

  if (iMFile === null) {
    return (
      <AdminLayout>
        <Error statusCode={404} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {iMFile && (
        <div className="h-full flex flex-row overflow-auto space-x-4">
          <div className="flex-1 overflow-auto flex flex-col bg-palette_white p-4 rounded-2xl space-y-4">
            <div>
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
                    <p className="font-bold">Draft</p>
                    <p className="text-palette_grey text-center">
                      NO REVIEWS YET
                    </p>
                  </div>
                )}
              {iMFile?.departmentReviewedId && (
                <div className="space-y-1">
                  <p className="font-bold">Department Revision</p>
                  <IMPeerSuggestionItems id={iMId as string} editable={false} />
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
                  <p className="font-bold">Returned Department Revision</p>
                  <IMReturnedDepartmentRevisionSuggestionItems
                    id={iMId as string}
                    editable={false}
                  />
                </div>
              )}
              {iMFile?.submittedIDDCoordinatorSuggestionId && (
                <div className="space-y-1">
                  <p className="font-bold">CITL Revision</p>
                  <IMIDDCoordinatorSuggestionItems
                    id={iMId as string}
                    editable={false}
                  />
                </div>
              )}
              {iMFile?.submittedReturnedCITLRevisionId && (
                <div className="space-y-1">
                  <p className="font-bold">Returned CITL Revision</p>
                  <IMReturnedCITLRevisionSuggestionItems
                    id={iMId as string}
                    editable={false}
                  />
                </div>
              )}
              {iMFile?.submittedQAMISSuggestionId && (
                <div className="space-y-1">
                  <p className="font-bold">QAMIS Revision</p>
                  <IMQAMISSuggestionItems
                    id={iMId as string}
                    editable={false}
                  />
                </div>
              )}
              {iMFile?.iMERCCITLReviewedId && (
                <div className="space-y-1">
                  <p className="font-bold">IMERC CITL Revision</p>
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
                  <p className="font-bold">Returned IMERC CITL Revision</p>
                  <IMReturnedIMERCCITLRevisionSuggestionItems
                    id={iMId as string}
                    editable={false}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <iframe
              loading="lazy"
              src={`/api/im_file/${iMFile.id}/pdf`}
              title={iMFile.filename}
              className="w-full h-full rounded-2xl"
            />
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
