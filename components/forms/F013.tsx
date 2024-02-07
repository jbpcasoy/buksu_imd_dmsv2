import Link from "next/link";

interface F013Props {
  iMTitle?: string;
  author?: string;
  iMType?: string;
  questions?: {
    q1_1?: 1 | 2 | 3 | 4 | 5;
    q1_2?: 1 | 2 | 3 | 4 | 5;
    q2_1?: 1 | 2 | 3 | 4 | 5;
    q2_2?: 1 | 2 | 3 | 4 | 5;
    q2_3?: 1 | 2 | 3 | 4 | 5;
    q2_4?: 1 | 2 | 3 | 4 | 5;
    q3_1?: 1 | 2 | 3 | 4 | 5;
    q4_1?: 1 | 2 | 3 | 4 | 5;
    q4_2?: 1 | 2 | 3 | 4 | 5;
    q4_3?: 1 | 2 | 3 | 4 | 5;
    q5_1?: 1 | 2 | 3 | 4 | 5;
    q5_2?: 1 | 2 | 3 | 4 | 5;
    q5_3?: 1 | 2 | 3 | 4 | 5;
    q6_1?: 1 | 2 | 3 | 4 | 5;
    q6_2?: 1 | 2 | 3 | 4 | 5;
    q6_3?: 1 | 2 | 3 | 4 | 5;
    q6_4?: 1 | 2 | 3 | 4 | 5;
    q6_5?: 1 | 2 | 3 | 4 | 5;
    q7_1?: 1 | 2 | 3 | 4 | 5;
    q7_2?: 1 | 2 | 3 | 4 | 5;
    q7_3?: 1 | 2 | 3 | 4 | 5;
    q7_4?: 1 | 2 | 3 | 4 | 5;
    q7_5?: 1 | 2 | 3 | 4 | 5;
    q8_1?: 1 | 2 | 3 | 4 | 5;
    q8_2?: 1 | 2 | 3 | 4 | 5;
    q8_3?: 1 | 2 | 3 | 4 | 5;
  };
  coordinatorName?: string;
  peerName?: string;
  chairpersonName?: string;
}

export default function F013({
  iMTitle,
  author,
  iMType,
  questions,
  chairpersonName,
  coordinatorName,
  peerName,
}: F013Props) {
  return (
    <div className="flex flex-col">
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
          <br />
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
            <table className="table-auto border-collapse border border-black">
              <thead>
                <tr>
                  <th className="border border-black px-1">Criteria</th>
                  <th className="border border-black px-2">VM</th>
                  <th className="border border-black px-3">M</th>
                  <th className="border border-black px-2">JE</th>
                  <th className="border border-black px-2">NM</th>
                  <th className="border border-black px-1">NAA</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-1 italic">The Title</td>
                  <td className="border border-black px-1 text-center"></td>
                  <td className="border border-black px-1 text-center"></td>
                  <td className="border border-black px-1 text-center"></td>
                  <td className="border border-black px-1 text-center"></td>
                  <td className="border border-black px-1 text-center"></td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <ul className="list-disc list-outside ml-8">
                      <li>The title is definite.</li>
                    </ul>
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q1_1 === 5 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q1_1 === 4 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q1_1 === 3 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q1_1 === 2 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q1_1 === 1 && "✓"}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <ul className="list-disc list-outside ml-8">
                      <li>
                        The title is relevant to the contents of the
                        instructional material.
                      </li>
                    </ul>
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q1_2 === 5 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q1_2 === 4 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q1_2 === 3 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q1_2 === 2 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q1_2 === 1 && "✓"}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-1 italic">
                    The Preface
                  </td>
                  <td className="border border-black px-1 text-center"></td>
                  <td className="border border-black px-1 text-center"></td>
                  <td className="border border-black px-1 text-center"></td>
                  <td className="border border-black px-1 text-center"></td>
                  <td className="border border-black px-1 text-center"></td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <ul className="list-disc list-outside ml-8">
                      <li>
                        The preface is written by the author/s
                        himself/herself/themselves.
                      </li>
                    </ul>
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q2_1 === 5 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q2_1 === 4 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q2_1 === 3 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q2_1 === 2 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q2_1 === 1 && "✓"}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <ul className="list-disc list-outside ml-8">
                      <li>It includes reasons for creating the material.</li>
                    </ul>
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q2_2 === 5 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q2_2 === 4 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q2_2 === 3 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q2_2 === 2 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q2_2 === 1 && "✓"}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <ul className="list-disc list-outside ml-8">
                      <li>It states the importance to the users.</li>
                    </ul>
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q2_3 === 5 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q2_3 === 4 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q2_3 === 3 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q2_3 === 2 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q2_3 === 1 && "✓"}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <ul className="list-disc list-outside ml-8">
                      <li>It introduces what the material is about.</li>
                    </ul>
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q2_4 === 5 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q2_4 === 4 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q2_4 === 3 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q2_4 === 2 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q2_4 === 1 && "✓"}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-1 italic">
                    The Introduction in Every Chapter/Unit
                  </td>
                  <td className="border border-black px-1 text-center"></td>
                  <td className="border border-black px-1 text-center"></td>
                  <td className="border border-black px-1 text-center"></td>
                  <td className="border border-black px-1 text-center"></td>
                  <td className="border border-black px-1 text-center"></td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <ul className="list-disc list-outside ml-8">
                      <li>
                        The introduction in every chapter/unit gives the
                        overview of the coverage.
                      </li>
                    </ul>
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q3_1 === 5 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q3_1 === 4 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q3_1 === 3 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q3_1 === 2 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q3_1 === 1 && "✓"}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-1 italic">
                    The Learning Outcomes
                  </td>
                  <td className="border border-black px-1 text-center"></td>
                  <td className="border border-black px-1 text-center"></td>
                  <td className="border border-black px-1 text-center"></td>
                  <td className="border border-black px-1 text-center"></td>
                  <td className="border border-black px-1 text-center"></td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <ul className="list-disc list-outside ml-8">
                      <li>
                        The content, activities, and assessment and aligned with
                        the LOs.
                      </li>
                    </ul>
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q4_1 === 5 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q4_1 === 4 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q4_1 === 3 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q4_1 === 2 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q4_1 === 1 && "✓"}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <ul className="list-disc list-outside ml-8">
                      <li>
                        The learning outcomes (COs and SLOs) are addressed in
                        the instructional material.
                      </li>
                    </ul>
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q4_2 === 5 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q4_2 === 4 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q4_2 === 3 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q4_2 === 2 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q4_2 === 1 && "✓"}
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
                    {questions?.q4_3 === 5 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q4_3 === 4 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q4_3 === 3 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q4_3 === 2 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q4_3 === 1 && "✓"}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-1 italic">
                    The Discussion/Presentation of the Concepts
                  </td>
                  <td className="border border-black px-1 text-center"></td>
                  <td className="border border-black px-1 text-center"></td>
                  <td className="border border-black px-1 text-center"></td>
                  <td className="border border-black px-1 text-center"></td>
                  <td className="border border-black px-1 text-center"></td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <ul className="list-disc list-outside ml-8">
                      <li>The concepts are explicitly discussed.</li>
                    </ul>
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q5_1 === 5 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q5_1 === 4 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q5_1 === 3 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q5_1 === 2 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q5_1 === 1 && "✓"}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <ul className="list-disc list-outside ml-8">
                      <li>All terms are understandable to the learners.</li>
                    </ul>
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q5_2 === 5 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q5_2 === 4 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q5_2 === 3 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q5_2 === 2 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q5_2 === 1 && "✓"}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <ul className="list-disc list-outside ml-8">
                      <li>The content is free from gender-bias.</li>
                    </ul>
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q5_3 === 5 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q5_3 === 4 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q5_3 === 3 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q5_3 === 2 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q5_3 === 1 && "✓"}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-1 italic">
                    The Examples for the Application of the Concepts
                  </td>
                  <td className="border border-black px-1 text-center"></td>
                  <td className="border border-black px-1 text-center"></td>
                  <td className="border border-black px-1 text-center"></td>
                  <td className="border border-black px-1 text-center"></td>
                  <td className="border border-black px-1 text-center"></td>
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
                    {questions?.q6_1 === 5 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q6_1 === 4 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q6_1 === 3 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q6_1 === 2 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q6_1 === 1 && "✓"}
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
                    {questions?.q6_2 === 5 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q6_2 === 4 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q6_2 === 3 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q6_2 === 2 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q6_2 === 1 && "✓"}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <ul className="list-disc list-outside ml-8">
                      <li>They relate to real-world situations.</li>
                    </ul>
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q6_3 === 5 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q6_3 === 4 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q6_3 === 3 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q6_3 === 2 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q6_3 === 1 && "✓"}
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
                    {questions?.q6_4 === 5 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q6_4 === 4 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q6_4 === 3 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q6_4 === 2 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q6_4 === 1 && "✓"}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <ul className="list-disc list-outside ml-8">
                      <li>They illustrate attainment of learning outcomes.</li>
                    </ul>
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q6_5 === 5 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q6_5 === 4 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q6_5 === 3 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q6_5 === 2 && "✓"}
                  </td>
                  <td className="border border-black px-1 text-center">
                    {questions?.q6_5 === 1 && "✓"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <footer>
          <div className="text-xs flex justify-between">
            <p>Document Code: CITL-F-013</p>
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
              src="/images/buksu-logo-min-512x512.png"
              style={{ width: "0.6in", height: "0.6in" }}
            />
            <img
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
                <th className="border border-black px-2">VM</th>
                <th className="border border-black px-3">M</th>
                <th className="border border-black px-2">JE</th>
                <th className="border border-black px-2">NM</th>
                <th className="border border-black px-1">NAA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-1 italic">
                  The Exercises/Activities
                </td>
                <td className="border border-black px-1 text-center"></td>
                <td className="border border-black px-1 text-center"></td>
                <td className="border border-black px-1 text-center"></td>
                <td className="border border-black px-1 text-center"></td>
                <td className="border border-black px-1 text-center"></td>
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
                  {questions?.q7_1 === 5 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_1 === 4 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_1 === 3 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_1 === 2 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_1 === 1 && "✓"}
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
                  {questions?.q7_2 === 5 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_2 === 4 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_2 === 3 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_2 === 2 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_2 === 1 && "✓"}
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
                  {questions?.q7_3 === 5 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_3 === 4 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_3 === 3 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_3 === 2 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_3 === 1 && "✓"}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>They encourage students to communicate effectively.</li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_4 === 5 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_4 === 4 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_4 === 3 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_4 === 2 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_4 === 1 && "✓"}
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
                  {questions?.q7_5 === 5 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_5 === 4 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_5 === 3 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_5 === 2 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q7_5 === 1 && "✓"}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1 italic">
                  The Rubrics (if applicable)
                </td>
                <td className="border border-black px-1 text-center"></td>
                <td className="border border-black px-1 text-center"></td>
                <td className="border border-black px-1 text-center"></td>
                <td className="border border-black px-1 text-center"></td>
                <td className="border border-black px-1 text-center"></td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <ul className="list-disc list-outside ml-8">
                    <li>The rubrics are appropriate for the assessment.</li>
                  </ul>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_1 === 5 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_1 === 4 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_1 === 3 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_1 === 2 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_1 === 1 && "✓"}
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
                  {questions?.q8_2 === 5 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_2 === 4 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_2 === 3 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_2 === 2 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_2 === 1 && "✓"}
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
                  {questions?.q8_3 === 5 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_3 === 4 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_3 === 3 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_3 === 2 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q8_3 === 1 && "✓"}
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <p>Reviewed by:</p>
          <br />
          <br />
          <div className="flex justify-evenly">
            <div>
              {!coordinatorName && <p className="text-center">___________________________________</p>}
              {coordinatorName && <p className="text-center underline">{coordinatorName}</p>}
              <p className="text-center">IMD Program Coordinator</p>
            </div>
            <div>
              {!peerName && <p className="text-center">___________________________________</p>}
              {peerName && <p className="text-center underline">{peerName}</p>}
              <p className="text-center">Senior Faculty</p>
            </div>
          </div>
          <br />
          <br />
          <div>
              {!chairpersonName && <p className="text-center">___________________________________</p>}
              {chairpersonName && <p className="text-center underline">{chairpersonName}</p>}
            <p className="text-center">Program Chair</p>
          </div>
        </div>
        <footer>
          <div className="text-xs flex justify-between">
            <p>Document Code: CITL-F-013</p>
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
