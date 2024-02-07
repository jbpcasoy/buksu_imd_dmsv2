import numberToOrdinal from "@/services/numberToOrinal";
import Link from "next/link";

interface F001Props {
  title?: string;
  authors?: string;
  courseCode?: string;
  semester?: 1 | 2;
  syStart?: number;
  syEnd?: number;
  iMType?: string;
  department?: string;
  college?: string;
  endorseFor?: "Printing" | "e-Distribution" | "Printing & e-Distribution";
  coordinatorName?: string;
  iDDCoordinatorName?: string;
}

export default function F001({
  title,
  authors,
  courseCode,
  semester,
  syStart,
  syEnd,
  college,
  coordinatorName,
  department,
  endorseFor,
  iDDCoordinatorName,
  iMType,
}: F001Props) {
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
      <div className="flex-1">
        <br />
        <div className="text-center text-sm font-bold">
          <p>Endorsement of the Instructional Material</p>
          <p>(Implementation Phase)</p>
        </div>
        <br />
        <div style={{ paddingLeft: "0.5in", paddingRight: "0.5in" }}>
          <div className="whitespace-pre">
            <p>
              Title:{"\t\t\t\t"}
              {!title && (
                <span className="">
                  _________________________________________________________
                </span>
              )}
              {title && <span className="underline">{title}</span>}
            </p>
            <p>
              Author/s:{"\t\t\t"}
              {!authors && (
                <span className="">
                  _________________________________________________________
                </span>
              )}
              {authors && <span className="underline">{authors}</span>}
            </p>
            <p>
              Course Code:{"\t"}
              {!courseCode && <span className="">___________________</span>}
              {courseCode && <span className="underline">{courseCode}</span>}
              {"\t\t"}
              Sem./SY:{"\t"}
              {(!semester || !syStart || !syEnd) && (
                <span className="">___________________________</span>
              )}
              {semester && syStart && syEnd && (
                <span className="underline">
                  {numberToOrdinal(semester)} Sem / S.Y. {syStart}-{syEnd}
                </span>
              )}
            </p>
            <p>
              IM Type:{"\t\t\t"}
              {!iMType && (
                <span className="">
                  _________________________________________________________
                </span>
              )}
              {iMType && <span className="underline">{iMType}</span>}
            </p>
            <p>
              Program/Department:{"\t"}
              {!department && <span className="">___________________</span>}
              {department && <span className="underline">{department}</span>}
              {"\t\t"}
              College:{"\t"}
              {!college && <span>_____________________</span>}
              {college && <span className="underline">{college}</span>}
            </p>
            <br />
            <br />
          </div>
          <div>
            <p className="indent-8">
              This instructional material, having undergone review from the
              Program IM Committee, is endorsed for:
            </p>
            <br />
            <div className="flex justify-evenly">
              <div className="flex space-x-1 items-center">
                <input
                  disabled={true}
                  checked={endorseFor === "Printing"}
                  type="checkbox"
                  className="w-10 h-8 rounded border-green-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-offset-0 focus:ring-green-200 focus:ring-opacity-50"
                />{" "}
                <p>Printing</p>
              </div>
              <div className="flex space-x-1 items-center">
                <input
                  disabled={true}
                  checked={endorseFor === "e-Distribution"}
                  type="checkbox"
                  className="w-10 h-8 rounded border-green-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-offset-0 focus:ring-green-200 focus:ring-opacity-50"
                />{" "}
                <p>e-Distribution</p>
              </div>
              <div className="flex space-x-1 items-center">
                <input
                  type="checkbox"
                  disabled={true}
                  checked={endorseFor === "Printing & e-Distribution"}
                  className="w-10 h-8 rounded border-green-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-offset-0 focus:ring-green-200 focus:ring-opacity-50"
                />{" "}
                <p>Printing & e-Distribution</p>
              </div>
            </div>
          </div>
          <br />
          <br />
          <br />
          <div className="text-center">
            {!coordinatorName && <p className="">____________________________</p>}
            {coordinatorName && <p className="underline">{coordinatorName}</p>}
            <p>IMD Coordinator</p>
          </div>
          <br />
          <br />
          <div className="text-center">
            {!iDDCoordinatorName && <p className="">____________________________</p>}
            {iDDCoordinatorName && <p className="underline">{iDDCoordinatorName}</p>}
            <p>IDD Coordinator</p>
          </div>
        </div>
      </div>
      <footer>
        <div className="text-xs flex justify-between">
          <p>Document Code: CITL-F-001</p>
          <p>Revision No.: 1s</p>
          <p>Issue No.: 1</p>
          <p>Issue Date: April 18, 2022</p>
          <p>Page 1 of 1</p>
        </div>
      </footer>
    </div>
  );
}
