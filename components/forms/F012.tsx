import { DateTime } from "luxon";
import Link from "next/link";

interface F012Props {
  iMTitle?: string;
  iMType?: "Module" | "Course File" | "Worktext" | "Textbook" | string;
  author?: string;
  usage?: "Summer" | "1st sem only" | "2nd sem only" | "Every sem.";
  havePermission?: boolean;
  programRequire?: boolean;
  programCommit?: boolean;
  programPromote?: boolean;
  college?: string;
  department?: string;
  courseCode?: string;
  courseName?: string;
  semesters?: number;
  applicantName?: string;
  requestDate?: Date;
  coordinatorDate?: Date;
  chairpersonDate?: Date;
  deanDate?: Date;
  coordinatorName?: string;
  chairpersonName?: string;
  deanName?: string;
}

export default function F012({
  iMTitle,
  author,
  usage,
  havePermission,
  programCommit,
  programPromote,
  programRequire,
  iMType,
  college,
  department,
  courseCode,
  courseName,
  semesters,
  applicantName,
  chairpersonDate,
  coordinatorDate,
  deanDate,
  requestDate,
  chairpersonName,
  coordinatorName,
  deanName,
}: F012Props) {
  return (
    <div
      style={{ width: "8.27in", height: "11.69in", padding: "0.5in" }}
      className="shadow-lg flex flex-col font-serif"
    >
      <header className="flex justify-between">
        <div className="flex items-center">
          <img
            src="/images/buksu-logo-min-512x512.png"
            style={{ width: "0.6in", height: "0.6in" }}
          />
          <img
            src="/images/citl-logo.png"
            style={{ width: "0.8in", height: "0.8in", marginLeft: "-0.15in" }}
          />
        </div>
        <div className="text-center text-sm">
          <p className="font-bold">BUKIDNON STATE UNIVERSITY</p>
          <p>Malaybalay City, Bukidnon 8700</p>
          <p>
            Tel (088) 813-5661 to 5663; TeleFax (088) 813-2717,{" "}
            <Link
              href="https://www.buksu.edu.ph"
              className="underline text-palette_light_blue"
            >
              www.buksu.edu.ph
            </Link>
          </p>
          <p className="font-bold">
            OFFICE OF THE VICE PRESIDENT FOR ACADEMIC AFFAIRS
          </p>
          <p className="text-palette_orange">
            Center for Innovative Teaching and Learning
          </p>
        </div>
        <div className="flex items-center justify-center text-center text-xs text-palette_orange">
          <div className="border border-black rounded-lg py-2 px-6 italic">
            <p>Educate</p>
            <p>Innovate</p>
            <p>Lead</p>
          </div>
        </div>
      </header>
      <br />
      <div className="text-center text-sm">
        <p>
          Endorsement of Request for Instructional Material Evaluation and
          Publication
        </p>
        <p>(for IPTTU Endorsement and Publication)</p>
      </div>
      <br />
      <div
        className="text-sm flex-1"
        style={{ marginLeft: "0.5in", marginRight: "0.5in" }}
      >
        <p className="whitespace-pre">
          Title of IM:{"\t"}
          {!iMTitle && (
            <span>
              ____________________________________________________________________________
            </span>
          )}
          {iMTitle && <span className="underline">{iMTitle}</span>}
        </p>
        {!iMTitle && (
          <p className="whitespace-pre">
            {"\t\t\t\t\t"}
            <span>
              ____________________________________________________________________________
            </span>
          </p>
        )}
        <p className="whitespace-pre">
          Author/s:{"\t\t"}
          {!author && (
            <span>
              ____________________________________________________________________________
            </span>
          )}
          {author && <span className="underline">{author}</span>}
        </p>
        <p>
          IM Type: (
          <span className={`${iMType === "Module" ? "underline" : ""}`}>
            Module
          </span>
          ,{" "}
          <span className={`${iMType === "Course File" ? "underline" : ""}`}>
            Course File
          </span>
          ,{" "}
          <span className={`${iMType === "Worktext" ? "underline" : ""}`}>
            Worktext
          </span>
          ,{" "}
          <span className={`${iMType === "Textbook" ? "underline" : ""}`}>
            Textbook
          </span>
          , etc., please specify):{" "}
          {iMType !== "Module" &&
            iMType !== "Course File" &&
            iMType !== "Worktext" &&
            iMType !== "Textbook" &&
            iMType && <span className="underline">{iMType}</span>}
        </p>
        {iMType !== "Module" &&
          iMType !== "Course File" &&
          iMType !== "Worktext" &&
          iMType !== "Textbook" &&
          !iMType && (
            <p className="whitespace-pre">
              {"\t\t\t\t\t"}
              <span>
                ____________________________________________________________________________
              </span>
            </p>
          )}
        <p>
          Department/Program:{" "}
          {!department && <span>______________________________</span>}
          {department && <span className="underline">{department}</span>}{" "}
          College: {!college && <span>______________________________</span>}
          {college && <span className="underline">{college}</span>}
        </p>
        <p>
          Course Code and Course Descriptive Title for which this IM will be
          used:{" "}
        </p>
        <p className="whitespace-pre">
          {"\t\t\t\t\t"}
          {(!courseCode || !courseName) && (
            <span>
              ____________________________________________________________________________
            </span>
          )}
          {courseCode && courseName && (
            <span className="underline">
              {courseCode} {courseName}
            </span>
          )}
        </p>

        <div className="">
          <p>Semester this IM will be used:</p>
          <div className="flex justify-evenly items-center">
            <div className="flex space-x-1">
              <input
                type="checkbox"
                className="rounded-full text-black"
                disabled={true}
                checked={usage === "Summer"}
              />
              <p>Summer</p>
            </div>
            <div className="flex space-x-1">
              <input
                type="checkbox"
                className="rounded-full text-black"
                disabled={true}
                checked={usage === "1st sem only"}
              />
              <p>1st sem only</p>
            </div>
            <div className="flex space-x-1">
              <input
                type="checkbox"
                className="rounded-full text-black"
                disabled={true}
                checked={usage === "2nd sem only"}
              />
              <p>2nd sem only</p>
            </div>
            <div className="flex space-x-1">
              <input
                type="checkbox"
                className="rounded-full text-black"
                disabled={true}
                checked={usage === "Every sem."}
              />
              <p>Every sem.</p>
            </div>
          </div>
        </div>
        <div>
          <p>
            Do you have permission to print any material with prior copyright
            that is included in this IM?
          </p>
          <div className="flex justify-evenly">
            <div className="flex space-x-1">
              <input
                type="checkbox"
                className="rounded-full text-black"
                disabled={true}
                checked={havePermission === true}
              />
              <p>YES</p>
            </div>
            <div className="flex space-x-1">
              <input
                type="checkbox"
                className="rounded-full text-black"
                disabled={true}
                checked={havePermission === false}
              />
              <p>NO</p>
            </div>
          </div>
        </div>
        <p>
          How long do you expect to use this edition?{" "}
          {!semesters && <span>_______</span>}{" "}
          {semesters && <span className="underline">{semesters}</span>}{" "}
          Semester/s (Specify no. of semesters)
        </p>
        <br />
        <p className="italic">Requested by:</p>
        <br />
        <div className="flex justify-between border-b-4 border-black border-double">
          <div>
            {!applicantName && <p>_________________________________</p>}
            {applicantName && <p className="underline">{applicantName}</p>}
            <p>(Printed Name & Signature of Applicant)</p>
          </div>
          <div>
            <p>
              Date: {!requestDate && <span>______________</span>}
              {requestDate && (
                <span className="underline">
                  {DateTime.fromJSDate(requestDate).toFormat("LLLL dd, yyyy")}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="border-b-4 border-black border-double">
          <p className="font-bold">Program Recommendation</p>
          <br />
          <div className="flex space-x-2">
            <p>
              Will the department/program require this IM in the course/s
              indicated?
            </p>

            <div className="flex justify-evenly space-x-2">
              <div className="flex space-x-1">
                <input
                  type="checkbox"
                  className="rounded-full text-black"
                  disabled={true}
                  checked={programRequire === true}
                />
                <p>YES</p>
              </div>
              <div className="flex space-x-1">
                <input
                  type="checkbox"
                  className="rounded-full text-black"
                  disabled={true}
                  checked={programRequire === false}
                />
                <p>NO</p>
              </div>
            </div>
          </div>
          <p>
            Will the department/program commit to using it for the length of
            time indicated by the author/s?
          </p>

          <div className="flex space-x-2 ml-20">
            <div className="flex space-x-1">
              <input
                type="checkbox"
                className="rounded-full text-black"
                disabled={true}
                checked={programCommit === true}
              />
              <p>YES</p>
            </div>
            <div className="flex space-x-1">
              <input
                type="checkbox"
                className="rounded-full text-black"
                disabled={true}
                checked={programCommit === false}
              />
              <p>NO</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <p>
              Will the department/program promote the use of the IM by other
              schools?
            </p>

            <div className="flex justify-evenly space-x-2">
              <div className="flex space-x-1">
                <input
                  type="checkbox"
                  className="rounded-full text-black"
                  disabled={true}
                  checked={programPromote === true}
                />
                <p>YES</p>
              </div>
              <div className="flex space-x-1">
                <input
                  type="checkbox"
                  className="rounded-full text-black"
                  disabled={true}
                  checked={programPromote === false}
                />
                <p>NO</p>
              </div>
            </div>
          </div>
          <br />
          <p className="font-bold">
            I am endorsing the evaluation of this IM for IPTTU endorsement for
            copyright application and publication.
          </p>
          <br />
          <p>Reviewed and Endorsed:</p>
          <br />
          <div className="flex justify-between">
            <div>
              {(!coordinatorName || !coordinatorDate) && (
                <p>________________________________</p>
              )}
              {coordinatorName && coordinatorDate && (
                <p className="underline">
                  {coordinatorName}/
                  {DateTime.fromJSDate(coordinatorDate).toFormat(
                    "LLLL dd, yyyy"
                  )}
                </p>
              )}
              <p>IMD Program Coordinator/Date</p>
            </div>
            <div>
              {(!chairpersonName || !chairpersonDate) && (
                <p>________________________________</p>
              )}
              {chairpersonName && chairpersonDate && (
                <p className="underline">
                  {chairpersonName}/
                  {DateTime.fromJSDate(chairpersonDate).toFormat(
                    "LLLL dd, yyyy"
                  )}
                </p>
              )}
              <p>Program Chair/Date</p>
            </div>
          </div>
        </div>
        <div>
          <p className="font-bold">College Recommendation</p>
          <br />
          <p className="font-bold">
            I am endorsing the evaluation of this IM for IPTTU endorsement for
            copyright application and publication.
          </p>

          <br />
          <div className="flex justify-between">
            <div>
              {!deanName && <p>_________________________________</p>}
              {deanName && <p className="underline">{deanName}</p>}
              <p>Signature Over Printed Name of College Dean</p>
            </div>
            <div>
              <p>
                Date: {!deanDate && <span>______________</span>}
                {deanDate && (
                  <span className="underline">
                    {DateTime.fromJSDate(deanDate).toFormat("LLLL dd, yyyy")}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <div className="text-xs flex justify-between">
          <p>Document Code: CITL-F-012</p>
          <p>Revision No.: 0</p>
          <p>Issue No.: 1</p>
          <p>Issue Date: July 28, 2020</p>
          <p>Page 1 of 1</p>
        </div>
      </footer>
    </div>
  );
}
