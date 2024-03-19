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
      <div className="bg-palette_white h-full w-full p-4 rounded-2xl">
        <div className="border-palette_orange border p-2 rounded-lg font-bold text-palette_blue inline-flex space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="w-6 h-6 stroke-palette_grey"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
            />
          </svg>

          <span className="text-base">VERSIONS</span>
        </div>
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
      </div>
    </MainLayout>
  );
}
