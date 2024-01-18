import MainLayout from "@/components/MainLayout";
import useIMFilesIM from "@/hooks/useIMFilesIM";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function VersionsPage() {
  const router = useRouter();
  const iMId = router.query.id as string;
  const [state, setState] = useState({
    skip: 0,
    take: Number(process.env.NEXT_PUBLIC_MAX_QUERY_TAKE),
  });

  useEffect(() => {
    setState((prev) => ({ ...prev, filter: { iMId } }));
  }, [iMId]);

  const { iMFiles } = useIMFilesIM(state);
  return (
    <MainLayout>
      <span className="border-palette_orange border-b-2 px-1 font-bold text-palette_blue">
        VERSIONS
      </span>
      {iMId && (
        <div className="mt-2">
          {iMFiles.map((iMFile) => {
            let step = "UNKNOWN";
            if (
              !iMFile?.departmentReviewedId &&
              !iMFile?.submittedReturnedDepartmentRevisionId &&
              !iMFile?.submittedIDDCoordinatorSuggestionId &&
              !iMFile?.submittedReturnedCITLRevisionId &&
              !iMFile?.submittedQAMISSuggestionId &&
              !iMFile?.iMERCCITLReviewedId &&
              !iMFile?.submittedReturnedIMERCCITLRevisionId
            ) {
              step = "Draft";
            } else if (iMFile?.departmentReviewedId) {
              step = "Department Revision";
            } else if (iMFile?.submittedReturnedDepartmentRevisionId) {
              step = "Returned Department Revision";
            } else if (iMFile?.submittedIDDCoordinatorSuggestionId) {
              step = "CITL Revision";
            } else if (iMFile?.submittedReturnedCITLRevisionId) {
              step = "Returned CITL Revision";
            } else if (iMFile?.submittedQAMISSuggestionId) {
              step = "QAMIS Revision";
            } else if (iMFile?.iMERCCITLReviewedId) {
              step = "IMERC CITL Revision";
            } else if (iMFile?.submittedReturnedIMERCCITLRevisionId) {
              step = "Returned IMERC CITL Revision";
            }

            return (
              <div
                key={iMFile.id}
                className="space-x-2 flex flex-row items-end"
              >
                {/* <p>
                  {DateTime.fromJSDate(
                    new Date(iMFile?.createdAt ?? "")
                  ).toFormat("D | t")}
                </p> */}
                <Link
                  href={`/im/${iMId}/versions/${iMFile.id}`}
                  className="underline"
                >
                  {DateTime.fromJSDate(
                    new Date(iMFile?.createdAt ?? "")
                  ).toFormat("D | t")}{" "}
                  {step}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
}
