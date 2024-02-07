import Link from "next/link";

interface Review {
  suggestion: string;
  suggestionPage: string;
  actionTaken: string;
  actionTakenPage: string;
  remarks?: string;
}

interface F015Props {
  iMTitle?: string;
  author?: string;
  program?: string;
  qAMISReviews?: Review[];
  iMERCReviews?: Review[];
  coordinatorName?: string;
  iDDCoordinatorName?: string;
}

export default function F015({
  iMTitle,
  author,
  program,
  qAMISReviews,
  iMERCReviews,
  coordinatorName,
  iDDCoordinatorName,
}: F015Props) {
  return (
    <div className="flex flex-col">
      <div
        style={{ width: "8.27in", height: "11.69in", padding: "0.5in" }}
        className="shadow-lg flex flex-col font-serif"
      >
        <header className="flex justify-between">
          <div className="flex items-center">
            <img alt="buksu logo"
              src="/images/buksu-logo-min-512x512.png"
              style={{ width: "0.6in", height: "0.6in" }}
            />
            <img alt="citl logo"
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
          <p className="">
            Suggestions and Actions Taken on IM Evaluation from IMERC
          </p>
          <p>(for IPTTU Endorsement)</p>
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
                __________________________________________________________________
              </span>
            )}
            {iMTitle && <span className="underline">{iMTitle}</span>}
          </p>
          <p className="whitespace-pre">
            Program:{"\t\t"}
            {!program && <span>______________________________</span>}
            {program && <span className="underline">{program}</span>}
            {"\t\t"}Author:
            {!author && <span>______________________________</span>}
            {author && <span className="underline">{author}</span>}
          </p>
          <br />
          <p>A. QAMIS (Student and Teacher-Users)</p>
          <table className="table-auto border-collapsed border border-black w-full text-sm">
            <thead>
              <tr>
                <th></th>
                <th className="border border-black font-normal">Suggestions</th>
                <th className="border border-black font-normal">
                  IM Part & Page No.
                </th>
                <th className="border border-black font-normal">
                  Action Taken
                </th>
                <th className="border border-black font-normal">
                  IM Part & Page No.
                </th>
                <th className="border border-black font-normal">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {!qAMISReviews && (
                <>
                  <tr>
                    <td className="border border-black text-center">1</td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black text-center">2</td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black text-center">3</td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black text-center">4</td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black text-center">5</td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black text-center">6</td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black text-center">7</td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black text-center">8</td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black text-center">9</td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black text-center">10</td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                  </tr>
                </>
              )}
              {qAMISReviews?.map((qAMISReview, index) => {
                return (
                  <tr key={index}>
                    <td className="border border-black px-1 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-black px-1">
                      {qAMISReview.suggestion}
                    </td>
                    <td className="border border-black px-1">
                      {qAMISReview.suggestionPage}
                    </td>
                    <td className="border border-black px-1">
                      {qAMISReview.actionTaken}
                    </td>
                    <td className="border border-black px-1">
                      {qAMISReview.actionTakenPage}
                    </td>
                    <td className="border border-black px-1">
                      {qAMISReview.remarks}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="italic">*Add rows as necessary</p>
        </div>
        <footer>
          <div className="text-xs flex justify-between">
            <p>Document Code: CITL-F-015</p>
            <p>Revision No.: 00</p>
            <p>Issue no.: 1</p>
            <p>Issue Date: July 28, 2022</p>
            <p>Page 1 of 2</p>
          </div>
        </footer>
      </div>
      <div
        style={{ width: "8.27in", height: "11.69in", padding: "0.5in" }}
        className="shadow-lg flex flex-col font-serif"
      >
        <header className="flex justify-between">
          <div className="flex items-center">
            <img alt="buksu logo"
              src="/images/buksu-logo-min-512x512.png"
              style={{ width: "0.6in", height: "0.6in" }}
            />
            <img alt="citl logo"
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

        <div
          className="text-sm flex-1 flex flex-col"
          style={{ marginLeft: "0.5in", marginRight: "0.5in" }}
        >
          <p>B. IMERC</p>
          <table className="table-auto border-collapsed border border-black w-full text-sm">
            <thead>
              <tr>
                <th></th>
                <th className="border border-black font-normal">Suggestions</th>
                <th className="border border-black font-normal">
                  IM Part & Page No.
                </th>
                <th className="border border-black font-normal">
                  Action Taken
                </th>
                <th className="border border-black font-normal">
                  IM Part & Page No.
                </th>
                <th className="border border-black font-normal">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {!iMERCReviews && (
                <>
                  <tr>
                    <td className="border border-black text-center">1</td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black text-center">2</td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black text-center">3</td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black text-center">4</td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black text-center">5</td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black text-center">6</td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black text-center">7</td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black text-center">8</td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black text-center">9</td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black text-center">10</td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                    <td className="border border-black p-2">
                      <br />
                    </td>
                  </tr>
                </>
              )}
              {iMERCReviews?.map((iMERCReview, index) => {
                return (
                  <tr key={index}>
                    <td className="border border-black px-1 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-black px-1">
                      {iMERCReview.suggestion}
                    </td>
                    <td className="border border-black px-1">
                      {iMERCReview.suggestionPage}
                    </td>
                    <td className="border border-black px-1">
                      {iMERCReview.actionTaken}
                    </td>
                    <td className="border border-black px-1">
                      {iMERCReview.actionTakenPage}
                    </td>
                    <td className="border border-black px-1">
                      {iMERCReview.remarks}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="italic">*Add rows as necessary</p>
          <br />
          <br />
          <div className="flex space-x-1">
            <p>Prepared by:</p>
            <div>
              {!author && <p>___________________________________________</p>}
              {author && <p className="underline">{author}</p>}
              <p>Author&apos;s Signature Over Printed Name</p>
            </div>
          </div>
          <br />
          <br />
          <div className="flex space-x-1">
            <p>Reviewed by:</p>
            <div>
              {!coordinatorName && <p>___________________________________________</p>}
              {coordinatorName && <p className="underline">{coordinatorName}</p>}
              <p>IMD Program Coordinator</p>
            </div>
          </div>
          <br />
          <br />
          <div className="flex space-x-1">
            <p>Noted by:</p>
            <div>
              {!iDDCoordinatorName && <p>___________________________________________</p>}
              {<p className="underline">{iDDCoordinatorName}</p>}
              <p>IDD Coordinator</p>
            </div>
          </div>
        </div>
        <footer>
          <div className="text-xs flex justify-between">
            <p>Document Code: CITL-F-015</p>
            <p>Revision No.: 00</p>
            <p>Issue no.: 1</p>
            <p>Issue Date: July 28, 2022</p>
            <p>Page 2 of 2</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
