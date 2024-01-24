import { DateTime } from "luxon";
import Link from "next/link";

interface F005Props {
  questions?: {
    q1_1?: 1 | 2 | 3 | 4 | 5;
    q1_2?: 1 | 2 | 3 | 4 | 5;
    q1_3?: 1 | 2 | 3 | 4 | 5;
    q2_1?: 1 | 2 | 3 | 4 | 5;
    q2_2?: 1 | 2 | 3 | 4 | 5;
    q2_3?: 1 | 2 | 3 | 4 | 5;
    q2_4?: 1 | 2 | 3 | 4 | 5;
    q2_5?: 1 | 2 | 3 | 4 | 5;
    q2_6?: 1 | 2 | 3 | 4 | 5;
    q2_7?: 1 | 2 | 3 | 4 | 5;
    q3_1?: 1 | 2 | 3 | 4 | 5;
    q3_2?: 1 | 2 | 3 | 4 | 5;
    q3_3?: 1 | 2 | 3 | 4 | 5;
    q3_4?: 1 | 2 | 3 | 4 | 5;
    q3_5?: 1 | 2 | 3 | 4 | 5;
    q3_6?: 1 | 2 | 3 | 4 | 5;
    q3_7?: 1 | 2 | 3 | 4 | 5;
    q4_1?: 1 | 2 | 3 | 4 | 5;
    q4_2?: 1 | 2 | 3 | 4 | 5;
    q4_3?: 1 | 2 | 3 | 4 | 5;
  };
  likeA?: string;
  likeB?: string;
  improveA?: string;
  improveB?: string;
  evaluatorName?: string;
  date?: Date;
}
export default function F005({
  improveA,
  improveB,
  likeA,
  likeB,
  evaluatorName,
  questions,
  date,
}: F005Props) {
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
      <div className="flex-1">
        <br />
        <div className="text-center text-sm">
          <p>Teacher-User Evaluation</p>
          <p className="italic">Evaluation of a Module</p>
        </div>
        <div style={{ paddingLeft: "0.5in", paddingRight: "0.5in" }}>
          <div>
            <p className="text-xs italic ml-6">
              A. Directions: Please put a check in the space of your choice that
              corresponds to your rating of a given feature. Please do not leave
              any item blank.
            </p>
          </div>
          <table className="text-xs table-auto border-collapse border">
            <thead>
              <tr>
                <th className="font-normal border border-black px-1">
                  Features
                  <p className="text-left font-bold italic">The module...</p>
                </th>
                <th className="font-normal border border-black px-1">
                  HA
                  <p>5</p>
                </th>
                <th className="font-normal border border-black px-1">
                  VA
                  <p>4</p>
                </th>
                <th className="font-normal border border-black px-2">
                  A<p>3</p>
                </th>
                <th className="font-normal border border-black px-1">
                  SA
                  <p>2</p>
                </th>
                <th className="font-normal border border-black px-1">
                  NA
                  <p>1</p>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-1">
                  <div className="flex space-x-1">
                    <p>A.</p>
                    <p>CONTENT AND CONTENT ACCURACY</p>
                  </div>
                </td>
                <td className="border border-black px-1 text-center"></td>
                <td className="border border-black px-1 text-center"></td>
                <td className="border border-black px-1 text-center"></td>
                <td className="border border-black px-1 text-center"></td>
                <td className="border border-black px-1 text-center"></td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <div className="flex space-x-1">
                    <p>1.</p>
                    <p>begins with the course and specific learning outcomes</p>
                  </div>
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
                  <div className="flex space-x-1">
                    <p>2.</p>
                    <p>contains topics/concepts that are informative</p>
                  </div>
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
                <td className="border border-black px-1">
                  <div className="flex space-x-1">
                    <p>3.</p>
                    <p>comprehensively presents topics/concepts</p>
                  </div>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q1_3 === 5 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q1_3 === 4 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q1_3 === 3 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q1_3 === 2 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q1_3 === 1 && "✓"}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <div className="flex space-x-1">
                    <p>B.</p>
                    <p>CLARITY</p>
                  </div>
                </td>
                <td className="border border-black px-1 text-center"></td>
                <td className="border border-black px-1 text-center"></td>
                <td className="border border-black px-1 text-center"></td>
                <td className="border border-black px-1 text-center"></td>
                <td className="border border-black px-1 text-center"></td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <div className="flex space-x-1">
                    <p>1.</p>
                    <p>
                      contains illustrations that enhance student’s
                      understanding of the lesson
                    </p>
                  </div>
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
                  <div className="flex space-x-1">
                    <p>2.</p>
                    <p>
                      contains images, figures, graphics, audios, or videos that
                      are clear
                    </p>
                  </div>
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
                  <div className="flex space-x-1">
                    <p>3.</p>
                    <p>gives web links that work</p>
                  </div>
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
                  <div className="flex space-x-1">
                    <p>4.</p>
                    <p>presents ideas in a well-organized and logical format</p>
                  </div>
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
                <td className="border border-black px-1">
                  <div className="flex space-x-1">
                    <p>5.</p>
                    <p>
                      presents ideas in simple, direct language appropriate to
                      the student&apos;s level
                    </p>
                  </div>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_5 === 5 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_5 === 4 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_5 === 3 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_5 === 2 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_5 === 1 && "✓"}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <div className="flex space-x-1">
                    <p>6.</p>
                    <p>
                      contains instructions that are clear and easy to
                      understand.
                    </p>
                  </div>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_6 === 5 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_6 === 4 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_6 === 3 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_6 === 2 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_6 === 1 && "✓"}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <div className="flex space-x-1">
                    <p>7.</p>
                    <p>
                      contains texts suited to the learner&apos;s comprehension
                      level
                    </p>
                  </div>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_7 === 5 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_7 === 4 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_7 === 3 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_7 === 2 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q2_7 === 1 && "✓"}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <div className="flex space-x-1">
                    <p>C.</p>
                    <p>RELEVANCE</p>
                  </div>
                </td>
                <td className="border border-black px-1 text-center"></td>
                <td className="border border-black px-1 text-center"></td>
                <td className="border border-black px-1 text-center"></td>
                <td className="border border-black px-1 text-center"></td>
                <td className="border border-black px-1 text-center"></td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <div className="flex space-x-1">
                    <p>1.</p>
                    <p>has contents relevant to the course</p>
                  </div>
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
                <td className="border border-black px-1">
                  <div className="flex space-x-1">
                    <p>2.</p>
                    <p>develops the student&apos;s critical thinking skills</p>
                  </div>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_2 === 5 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_2 === 4 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_2 === 3 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_2 === 2 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_2 === 1 && "✓"}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <div className="flex space-x-1">
                    <p>3.</p>
                    <p>reflects real-life experiences</p>
                  </div>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_3 === 5 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_3 === 4 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_3 === 3 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_3 === 2 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_3 === 1 && "✓"}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <div className="flex space-x-1">
                    <p>4.</p>
                    <p>contains activities/tasks that are course-appropriate</p>
                  </div>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_4 === 5 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_4 === 4 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_4 === 3 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_4 === 2 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_4 === 1 && "✓"}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <div className="flex space-x-1">
                    <p>5.</p>
                    <p>has varied activities</p>
                  </div>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_5 === 5 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_5 === 4 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_5 === 3 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_5 === 2 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_5 === 1 && "✓"}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <div className="flex space-x-1">
                    <p>6.</p>
                    <p>
                      provides opportunities for students using various
                      modalities
                    </p>
                  </div>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_6 === 5 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_6 === 4 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_6 === 3 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_6 === 2 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_6 === 1 && "✓"}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <div className="flex space-x-1">
                    <p>7.</p>
                    <p>
                      allows students to synthesize or summarize key points or
                      insights after every lesson or unit
                    </p>
                  </div>
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_7 === 5 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_7 === 4 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_7 === 3 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_7 === 2 && "✓"}
                </td>
                <td className="border border-black px-1 text-center">
                  {questions?.q3_7 === 1 && "✓"}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <div className="flex space-x-1">
                    <p>D.</p>
                    <p>APPROPRIATENESS</p>
                  </div>
                </td>
                <td className="border border-black px-1 text-center"></td>
                <td className="border border-black px-1 text-center"></td>
                <td className="border border-black px-1 text-center"></td>
                <td className="border border-black px-1 text-center"></td>
                <td className="border border-black px-1 text-center"></td>
              </tr>
              <tr>
                <td className="border border-black px-1">
                  <div className="flex space-x-1">
                    <p>1.</p>
                    <p>contains materials appropriate to the course</p>
                  </div>
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
                  <div className="flex space-x-1">
                    <p>2.</p>
                    <p>allows the students to perform tasks independently</p>
                  </div>
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
                  <div className="flex space-x-1">
                    <p>3.</p>
                    <p>
                      caters to varied levels of the students&apos; mental
                      ability
                    </p>
                  </div>
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
            </tbody>
          </table>
          <div className="flex text-xs justify-between">
            <p className="italic">5-Highly Adequate (HA)</p>
            <p className="italic">4-Very Adequate (VA)</p>
            <p className="italic">3-Adequate (A)</p>
            <p className="italic">2-Slightly Adequate (SA)</p>
            <p className="italic">1-Not Adequate (NA)</p>
          </div>
          <br />
          <div>
            <p className="text-xs italic ml-6">
              B. Directions: Please provide comments and suggestions for each
              area below:
            </p>
          </div>
          <div className="text-xs space-y-1 ml-6">
            <p>1. Strengths:</p>
            <div className="flex space-x-1">
              <p className="ml-4">a.</p>
              {!improveA && (
                <p>
                  ______________________________________________________________________________
                </p>
              )}
              {improveA && <p className="underline">{improveA}</p>}
            </div>

            <div className="flex space-x-1">
              <p className="ml-4">b.</p>
              {!improveB && (
                <p>
                  ______________________________________________________________________________
                </p>
              )}
              {improveB && <p className="underline">{improveB}</p>}
            </div>

            <p>2. Weaknesses:</p>
            <div className="flex space-x-1">
              <p className="ml-4">a.</p>
              {!likeA && (
                <p>
                  ______________________________________________________________________________
                </p>
              )}
              {likeA && <p className="underline">{likeA}</p>}
            </div>

            <div className="flex space-x-1">
              <p className="ml-4">b.</p>
              {!likeB && (
                <p>
                  ______________________________________________________________________________
                </p>
              )}
              {likeB && <p className="underline">{likeB}</p>}
            </div>
          </div>
          <br />

          <div className="text-xs">
            <div className="flex justify-between">
              <p>
                Name of Evaluator:{" "}
                {evaluatorName && (
                  <span className="underline">{evaluatorName}</span>
                )}
                {!evaluatorName && (
                  <span>_________________________________</span>
                )}
              </p>
              <p>
                Date:{" "}
                {date && (
                  <span className="underline">
                    {DateTime.fromJSDate(date).toFormat("LLLL dd, yyyy ")}
                  </span>
                )}
                {!date && <span>______________________________</span>}
              </p>
            </div>
            <br />
            <div className="flex">
              <p className="">
                Signature of Evaluator: ______________________________
              </p>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <div className="text-xs flex justify-between">
          <p>Document Code: CITL-F-005</p>
          <p>Revision No. 00</p>
          <p>Issue No.: 1</p>
          <p>Issue Date: July 27, 2020</p>
          <p>Page 1 of 1</p>
        </div>
      </footer>
    </div>
  );
}
