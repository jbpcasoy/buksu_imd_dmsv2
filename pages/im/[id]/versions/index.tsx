import MainLayout from "@/components/MainLayout";
import useIMFilesIM from "@/hooks/useIMFilesIM";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";

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
        <div className="border-palette_orange border p-2 rounded-lg text-palette_blue inline-flex space-x-2 font-medium text-sm justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="w-5 h-5 stroke-palette_grey"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              strokeWidth={1.5}
              d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
            />
          </svg>

          <span className="">Versions</span>
        </div>
        {iMId && (
          <div className="mt-2">
            {iMFiles.map((iMFile, index) => {
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
                <VersionSegment label={step} secondaryLabel={DateTime.fromJSDate(
                  new Date(iMFile?.createdAt ?? "")
                ).toFormat("D | t")} key={iMFile.id} end={index === iMFiles.length - 1} link={`/im/${iMId}/versions/${iMFile.id}`} />
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

interface VersionSegmentProps {
  label: string;
  end?: boolean;
  children?: ReactNode;
  secondaryLabel?: string;
  link: string;
}
function VersionSegment({
  label,
  end = false,
  children,
  secondaryLabel,
  link,
}: VersionSegmentProps) {
  return (
    <Link className="cursor-pointer" href={link}>
      <div
        className={`${end ? "" : "border-l border-l-palette_light_grey"} ${children || end ? "" : "pb-5"
          } flex space-x-4 ml-4 hover:opacity-50`}
      >
        <div className="-ml-4 bg-palette_white rounded-full w-8 h-8 flex items-center justify-center">
          <span className="flex justify-center items-center space-x-4 stroke-palette_grey bg-palette_light_grey w-7 h-7 rounded-full">
            <svg
              viewBox="0 0 18 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
            >
              <path
                d="M16.5 13.25V10.625C16.5 9.72989 16.1444 8.87145 15.5115 8.23851C14.8786 7.60558 14.0201 7.25 13.125 7.25H11.625C11.3266 7.25 11.0405 7.13147 10.8295 6.9205C10.6185 6.70952 10.5 6.42337 10.5 6.125V4.625C10.5 3.72989 10.1444 2.87145 9.51149 2.23851C8.87855 1.60558 8.02011 1.25 7.125 1.25H5.25M5.25 14H12.75M5.25 17H9M7.5 1.25H2.625C2.004 1.25 1.5 1.754 1.5 2.375V19.625C1.5 20.246 2.004 20.75 2.625 20.75H15.375C15.996 20.75 16.5 20.246 16.5 19.625V10.25C16.5 7.86305 15.5518 5.57387 13.864 3.88604C12.1761 2.19821 9.88695 1.25 7.5 1.25Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        <div className="flex flex-col">
          <span className="pt-1 text-sm font-medium">{label}</span>
          {secondaryLabel && <span className="text-xs text-palette_grey">{secondaryLabel}</span>}
          <div>{children}</div>
        </div>
      </div>
    </Link >
  );
}