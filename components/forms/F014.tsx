import Link from "next/link";

interface F014Props {
  iMTitle?: string;
  author?: string;
  iMType?: string;
  questions?: {
    q1_1?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q1_2?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q2_1?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q2_2?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q2_3?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q2_4?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q3_1?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q4_1?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q4_2?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q4_3?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q4_4?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q5_1?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q5_2?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q5_3?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q5_4?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q6_1?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q6_2?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q6_3?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q6_4?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q6_5?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q7_1?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q7_2?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q7_3?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q7_4?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q7_5?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q8_1?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q8_2?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
    q8_3?: {
      contentSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      contentEditor?: "VM" | "JE" | "NAA" | "M" | "NM";
      iDDSpecialist?: "VM" | "JE" | "NAA" | "M" | "NM";
      remarks?: string;
    };
  };
  contentEditorName?: string;
  contentSpecialistName?: string;
  iDDSpecialistName?: string;
}

export default function F014({
  author,
  iMTitle,
  iMType,
  questions,
  contentEditorName,
  contentSpecialistName,
  iDDSpecialistName,
}: F014Props) {
  return (
    <div className="flex flex-col">
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
          <p className="font-bold">Instructional Materials Review Form</p>
          <p>(Implementation Phase)</p>
        </div>
        <br />
        <div
          className="text-sm flex-1"
          style={{ marginLeft: "0.5in", marginRight: "0.5in" }}
        >
          <p className="whitespace-pre">
            Title of IM:{"\t\t"}
            {!iMTitle && (
              <span>
                __________________________________________________________________
              </span>
            )}
            {iMTitle && <span className="underline">{iMTitle}</span>}
          </p>
          <p className="whitespace-pre">
            Author/s:{"\t\t\t"}
            {!author && (
              <span>
                __________________________________________________________________
              </span>
            )}
            {author && <span className="underline">{author}</span>}
          </p>
          <p className="whitespace-pre">
            IM Type:{"\t\t\t"}
            {!iMType && (
              <span>
                __________________________________________________________________
              </span>
            )}
            {iMType && <span className="underline">{iMType}</span>}
          </p>
          <div>
            <p className="italic">
              To the Reviewers: Check the column corresponding to your rating
              for each item. Be guided by the following descriptions.
            </p>
            <div className="grid grid-cols-2 mx-10">
              <p>VM - Very Much</p>
              <p>M - Much</p>
              <p>JE - Just Enough</p>
              <p>NM - Not Much</p>
              <p>NAA - Not at All</p>
            </div>
          </div>
          <table className="table-auto border-collapse border border-black w-full">
            <thead>
              <tr>
                <th className="border border-black px-1">Criteria</th>
                <th className="border border-black px-1">Content Specialist</th>
                <th className="border border-black px-1">Content Editor</th>
                <th className="border border-black px-1">IDD Specialist</th>
                <th className="border border-black px-1">Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-1 italic" colSpan={5}>
                  The Title
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>The title is definite.</li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q1_1?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q1_1?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q1_1?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q1_1?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>
                      The title is relevant to the contents of the instructional
                      material.
                    </li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q1_2?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q1_2?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q1_2?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q1_2?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1 italic" colSpan={5}>
                  The Preface
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>
                      The preface is written by the author/s himself/ herself/
                      themselves.
                    </li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_1?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_1?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_1?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_1?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>It includes reasons for creating the material.</li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_2?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_2?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_2?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_2?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>It states the importance to the users.</li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_3?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_3?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_3?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_3?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>It introduces what the material is about.</li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_4?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_4?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_4?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_4?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1 italic" colSpan={5}>
                  The Introduction in Every Chapter/Unit
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>
                      The introduction in every chapter/unit gives the overview
                      of the coverage.
                    </li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_1?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_1?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_1?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_1?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1 italic" colSpan={5}>
                  The Learning Outcomes
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>
                      The content, activities, and assessment are aligned with
                      the LOs.
                    </li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q4_1?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q4_1?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q4_1?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q4_1?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>
                      The learning outcomes (COs and SLOs) are addressed in the
                      instructional material.
                    </li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q4_2?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q4_2?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q4_2?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q4_2?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>
                      The learning outcomes (COs and SLOs) are addressed in the
                      instructional material.
                    </li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q4_3?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q4_3?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q4_3?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q4_3?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>
                      The learning outcomes are appropriate for the topics
                      covered.
                    </li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q4_4?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q4_4?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q4_4?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q4_4?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1 italic" colSpan={5}>
                  The Discussion/Presentation of the Concepts
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>The concepts are explicitly discussed.</li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q5_1?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q5_1?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q5_1?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q5_1?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>All terms are understandable to the learners.</li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q5_2?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q5_2?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q5_2?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q5_2?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>The presentation facilitates comprehension.</li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q5_3?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q5_3?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q5_3?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q5_3?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>The content is free from gender-bias.</li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q5_4?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q5_4?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q5_4?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q5_4?.remarks}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <footer>
          <div className="text-xs flex justify-between">
            <p>Document Code: CITL-F-014</p>
            <p>Revision No.: 0</p>
            <p>Issue No.: 1</p>
            <p>Issue Date: July 28, 2020</p>
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

        <div
          className="text-sm flex-1"
          style={{ marginLeft: "0.5in", marginRight: "0.5in" }}
        >
          <table className="table-auto border-collapse border border-black w-full">
            <thead>
              <tr>
                <th className="border border-black px-1">Criteria</th>
                <th className="border border-black px-1">Content Specialist</th>
                <th className="border border-black px-1">Content Editor</th>
                <th className="border border-black px-1">IDD Specialist</th>
                <th className="border border-black px-1">Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-1 italic" colSpan={5}>
                  The Examples for the Application of the Concepts
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>
                      Examples are provided to illustrate the concepts
                      discussed.
                    </li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q6_1?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q6_1?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q6_1?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q6_1?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>
                      The examples are consistent with the concepts discussed.
                    </li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q6_2?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q6_2?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q6_2?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q6_2?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>They relate to real-world situations.</li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q6_3?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q6_3?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q6_3?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q6_3?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>
                      They motivate students to participate in the learning
                      process.
                    </li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q6_4?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q6_4?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q6_4?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q6_4?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>They illustrate attainment of learning outcomes.</li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q6_5?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q6_5?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q6_5?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q6_5?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1 italic" colSpan={5}>
                  The Exercises/Activities
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>
                      The exercises/activities are appropriate for demonstrating
                      the learned concepts.
                    </li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_1?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_1?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_1?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_1?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>
                      There are provisions that encourage students to work
                      collaboratively.
                    </li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_2?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_2?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_2?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_2?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>
                      The exercises/activities develop creativity, critical
                      thinking, and problem-solving skills of the students.
                    </li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_2?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_2?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_2?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_2?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>They encourage students to communicate effectively.</li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_3?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_3?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_3?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_3?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>
                      They are prepared within the capability of the students.
                    </li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_4?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_4?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_4?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_4?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1 italic" colSpan={5}>
                  The Rubrics
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>The rubrics are appropriate for the assessment.</li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_1?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_1?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_1?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_1?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>
                      The rubrics describe the criteria through which the
                      learners&apos; outputs are rated.
                    </li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_2?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_2?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_2?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_2?.remarks}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>
                      The rubrics show the levels of achievements of quality of
                      the assessment outputs.
                    </li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_3?.contentSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_3?.contentEditor}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_3?.iDDSpecialist}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_3?.remarks}
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <br />
          <br />
          <div className="grid grid-cols-2">
            <div>
              {!contentSpecialistName && (
                <p className="text-center">
                  ___________________________________
                </p>
              )}
              {contentSpecialistName && (
                <p className="text-center underline">{contentSpecialistName}</p>
              )}
              <p className="text-center">Content Specialist</p>
            </div>
            <div>
              {!contentEditorName && (
                <p className="text-center">
                  ___________________________________
                </p>
              )}
              {contentEditorName && (
                <p className="text-center underline">{contentEditorName}</p>
              )}
              <p className="text-center">Content Editor</p>
            </div>
          </div>
          <br />
          <br />
          <div className="grid grid-cols-2">
            <div>
              {!iDDSpecialistName && (
                <p className="text-center">
                  ___________________________________
                </p>
              )}
              {iDDSpecialistName && (
                <p className="text-center underline">{iDDSpecialistName}</p>
              )}
              <p className="text-center">IDD Specialist</p>
            </div>
          </div>
        </div>

        <footer>
          <div className="text-xs flex justify-between">
            <p>Document Code: CITL-F-014</p>
            <p>Revision No.: 0</p>
            <p>Issue No.: 1</p>
            <p>Issue Date: July 28, 2020</p>
            <p>Page 2 of 2</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
