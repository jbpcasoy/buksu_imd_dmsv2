import { DateTime } from "luxon";
import Link from "next/link";

interface F001Props {
  author?: string;
  iMTitle?: string;
  iMType?: "Module" | "Course File" | "Worktext" | "Textbook" | string;
  courseCode?: string;
  courseName?: string;
  usage?: "Summer" | "1st sem only" | "2nd sem only" | "Every sem.";
  haveStudentEvaluation?: boolean;
  applicantName?: string;
  coordinatorName?: string;
  chairpersonName?: string;
  deanName?: string;
  receiveDate?: Date;
  hasHardCopy?: boolean;
  hasSoftCopy?: boolean;
  iDDCoordinatorName?: string;
}

export default function F011({
  applicantName,
  author,
  chairpersonName,
  coordinatorName,
  courseCode,
  courseName,
  deanName,
  hasHardCopy,
  hasSoftCopy,
  haveStudentEvaluation,
  iDDCoordinatorName,
  iMTitle,
  iMType,
  receiveDate,
  usage,
}: F001Props) {
  return (
    <div
      style={{ width: "8.27in", height: "11.69in", padding: "0.5in" }}
      className="shadow-lg flex flex-col font-serif"
    >
      <header className="flex justify-between">
        <div className="flex items-center">
          <img
            alt="buksu logo"
            src="/images/buksu-logo-min-512x512.png"
            style={{ width: "0.6in", height: "0.6in" }}
          />
          <img
            alt="citl logo"
            src="/images/citl-logo.png"
            style={{
              width: "0.8in",
              height: "0.8in",
              marginLeft: "-0.15in",
            }}
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
        <p>Endorsement of the Instructional Material</p>
        <p>(Implementation Phase)</p>
      </div>
      <br />
      <div className="text-sm flex-1">
        <p>The Director CITL</p>
        <p>Bukidnon State University</p>
        <br />
        <p>Sir/Madam:</p>
        <br />
        <p className="indent-8">
          I/We would like to request for the review of my/our instructional
          material herein named, duly reviewed and endorsed by the
          department/program and college with which the author/s is /are
          affiliated. The data pertaining to aforementioned work follow:
        </p>
        <br />
        <p>
          1. Name of Author/Applicant:{" "}
          {!applicantName && (
            <span>
              ____________________________________________________________
            </span>
          )}
          {applicantName && <span className="underline">{applicantName}</span>}
        </p>
        <p>
          2. Title of IM:{" "}
          {!iMTitle && (
            <span>
              ____________________________________________________________
            </span>
          )}
          {iMTitle && <span className="underline">{iMTitle}</span>}
        </p>
        <p>
          3. IM Type: (
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
            !iMType && <span>______________________________</span>}
          {iMType !== "Module" &&
            iMType !== "Course File" &&
            iMType !== "Worktext" &&
            iMType !== "Textbook" &&
            iMType && <span className="underline">{iMType}</span>}
        </p>
        <p>
          4. Course Code and Course Descriptive Title for which this IM will be
          used:{" "}
          {(!courseCode || !courseName) && (
            <span>
              ___________________________________________________________________________________________
            </span>
          )}
          {
            <span className="underline">
              {courseCode} {courseName}
            </span>
          }
        </p>
        <div>
          <p>5. Semester this IM will be used:</p>
          <div className="flex justify-evenly">
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
            6. Do you agree to have a Student Evaluation Form included in the
            IM?
          </p>
          <div className="flex justify-evenly">
            <div className="flex space-x-1">
              <input
                type="checkbox"
                className="rounded-full text-black"
                disabled={true}
                checked={haveStudentEvaluation === true}
              />
              <p>YES</p>
            </div>
            <div className="flex space-x-1">
              <input
                type="checkbox"
                className="rounded-full text-black"
                disabled={true}
                checked={haveStudentEvaluation === false}
              />
              <p>NO</p>
            </div>
          </div>
        </div>
        <p className="ml-4">
          I agree to accomplish revisions suggested by the panel of reviewers.{" "}
        </p>
        <br />
        <div className="ml-96">
          <p className="">Very Respectfully,</p>
          <br />
          <p className="">
            {!applicantName && <span>______________________________</span>}
            {applicantName && (
              <span className="underline">{applicantName}</span>
            )}
          </p>
          <p className="">(Printed Name & Signature of Applicant)</p>
        </div>
        <p>Reviewed and Endorsed:</p>
        <br />
        <div className="flex justify-evenly">
          <div>
            <p className="text-center">
              {!coordinatorName && <span>______________________________</span>}{" "}
              {coordinatorName && (
                <span className="underline">{coordinatorName}</span>
              )}
            </p>
            <p className="text-center">IMD Program Coordinator</p>
          </div>
          <div>
            <p className="text-center">
              {!chairpersonName && <span>______________________________</span>}
              {chairpersonName && (
                <span className="underline">{chairpersonName}</span>
              )}
            </p>
            <p className="text-center">Program Chair</p>
          </div>
        </div>

        <br />
        <div>
          <p className="text-center">
            {!deanName && <span>______________________________</span>}
            {deanName && <span className="underline">{deanName}</span>}
          </p>
          <p className="text-center">College Dean</p>
        </div>
        <br />
        <hr className="border border-black" />
        <br />
        <p>
          Application received on{" "}
          {!receiveDate && <span>____________________________________</span>}{" "}
          {receiveDate && (
            <span className="underline">
              {DateTime.fromJSDate(receiveDate).toFormat("LLLL dd, yyyy ")}
            </span>
          )}{" "}
          with 1 Hard copy {hasHardCopy === undefined && <span>________</span>}
          {hasHardCopy === true && <span className="underline">✓</span>}
          {hasHardCopy === false && <span className="underline">✗</span>} & Soft
          Copy
          {hasHardCopy === undefined && <span>________</span>}
          {hasSoftCopy === true && <span className="underline">✓</span>}
          {hasSoftCopy === false && <span className="underline">✗</span>}
        </p>
        <br />
        <br />
        <div className="flex justify-end mx-2">
          <div>
            <p className="text-center">
              {!iDDCoordinatorName && (
                <span>______________________________</span>
              )}
              {iDDCoordinatorName && (
                <span className="underline">{iDDCoordinatorName}</span>
              )}
            </p>
            <p className="text-center">Signature of IDD Coordinator</p>
          </div>
        </div>
      </div>

      <footer>
        <div className="text-xs flex justify-between">
          <p>Document Code: CITL-F-011</p>
          <p>Revision No.: 0</p>
          <p>Issue No.: 1</p>
          <p>Issue Date: July 28, 2020</p>
          <p>Page 1 of 1</p>
        </div>
      </footer>
    </div>
  );
}
