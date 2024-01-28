import Link from "next/link";

interface Review {
  suggestion: string;
  actionTaken: string;
  pageNumber?: number;
  remarks?: string;
}

interface F003Props {
  programReview?: Review[];
  coordinatorName?: string;
  cITLReview?: Review[];
  iDDCoordinatorName?: string;
  cITLDirectorName?: string;
  vPAAName?: string;
}

export default function F003({
  cITLDirectorName,
  cITLReview: cITLReviews,
  coordinatorName,
  iDDCoordinatorName,
  programReview: programReviews,
  vPAAName,
}: F003Props) {
  return (
    <div
      style={{ width: "8.27in", height: "11.69in", padding: "0.5in" }}
      className="shadow-lg flex flex-col font-serif"
    >
      <header className="flex justify-between">
        <div className="absolute items-center">
          <img
            src="/images/buksu-logo-min-512x512.png"
            style={{ width: "0.8in", height: "0.8in" }}
          />
        </div>
        <div className="flex-1">
          <div className="text-center text-sm">
            <p className="font-bold">BUKIDNON STATE UNIVERSITY</p>
            <p>Malaybalay City, Bukidnon 8700</p>
            <p>Tel (088) 813-5661 to 5663; TeleFax (088) 813-2717,</p>
            <Link
              href="https://www.buksu.edu.ph"
              className="underline text-palette_light_blue"
            >
              www.buksu.edu.ph
            </Link>
          </div>
        </div>
      </header>
      <hr className="border-black" />
      <div className="flex-1 text-sm">
        <br />
        <p className="text-center">Suggestions and Action Taken</p>
        <br />
        <div className="text-sm ">
          <p className="font-bold">Part A. Program Review</p>
        </div>
        <table className="table-auto border-collapsed border border-black w-full text-sm">
          <thead>
            <tr>
              <th className="border border-black font-normal">Suggestions</th>
              <th className="border border-black font-normal">Action Taken</th>
              <th className="border border-black font-normal">Page Number</th>
              <th className="border border-black font-normal">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {!programReviews && (
              <>
                <tr>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                </tr>
                <tr>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                </tr>
                <tr>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                </tr>
                <tr>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                </tr>
                <tr>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                </tr>
              </>
            )}
            {programReviews?.map((programReview) => {
              return (
                <tr>
                  <td className="border border-black px-1">
                    {programReview.suggestion}
                  </td>
                  <td className="border border-black px-1">
                    {programReview.actionTaken}
                  </td>
                  <td className="border border-black px-1">
                    {programReview.pageNumber}
                  </td>
                  <td className="border border-black px-1">
                    {programReview.remarks}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="italic ml-20">Add Rows as necessary.</p>
        <br />
        <br />
        <div className="flex ml-10 space-x-1">
          <p>Reviewed by:</p>
          <div>
            {!coordinatorName && <p>_____________________________</p>}
            {coordinatorName && <p className="underline">{coordinatorName}</p>}
            <p>Program IM Coordinator</p>
          </div>
        </div>
        <br />
        <div className="text-sm ">
          <p className="font-bold">Part B. CITL Review</p>
        </div>
        <table className="table-auto border-collapsed border border-black w-full text-sm">
          <thead>
            <tr>
              <th className="border border-black font-normal">Suggestions</th>
              <th className="border border-black font-normal">Action Taken</th>
              <th className="border border-black font-normal">Page Number</th>
              <th className="border border-black font-normal">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {!cITLReviews && (
              <>
                <tr>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                </tr>
                <tr>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                </tr>
                <tr>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                </tr>
                <tr>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                </tr>
                <tr>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                  <td className="border border-black p-4"></td>
                </tr>
              </>
            )}
            {cITLReviews?.map((cITLReview) => {
              return (
                <tr>
                  <td className="border border-black px-1">
                    {cITLReview.suggestion}
                  </td>
                  <td className="border border-black px-1">
                    {cITLReview.actionTaken}
                  </td>
                  <td className="border border-black px-1">
                    {cITLReview.pageNumber}
                  </td>
                  <td className="border border-black px-1">
                    {cITLReview.remarks}
                  </td>
                </tr>
              );
            })}

          </tbody>
        </table>
        <p className="italic ml-20">Add Rows as necessary.</p>
        <br />
        <br />
        <div className="flex ml-10 space-x-1">
          <p>Reviewed by:</p>
          <div className="flex flex-col space-y-10">
            <div>
              {!iDDCoordinatorName && <p>_____________________________</p>}
              {iDDCoordinatorName && <p className="underline">{iDDCoordinatorName}</p>}
              <p>IDD Coordinator</p>
            </div>
            <div>
              {!cITLDirectorName && <p>_____________________________</p>}
              {cITLDirectorName && <p className="underline">{cITLDirectorName}</p>}
              <p>CITL Director</p>
            </div>
            <div>
              {!vPAAName && <p>_____________________________</p>}
              {vPAAName && <p className="underline">{vPAAName}</p>}
              <p>VPAA</p>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <div className="text-xs flex justify-between">
          <p>Document Code: CITL-F-003</p>
          <p>Revision No. 00</p>
          <p>Issue no. 1</p>
          <p>Issue Date: December 7, 2020</p>
          <p>Page 1 of 1</p>
        </div>
      </footer>
    </div>
  );
}
