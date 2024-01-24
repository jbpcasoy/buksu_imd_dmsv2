import F004 from "@/components/forms/F004";
import Link from "next/link";

export default function F004Page() {
  return (
    <div className="flex items-center justify-center font-serif">
      {/* <div
        style={{ width: "8.27in", height: "11.69in", padding: "0.5in" }}
        className="shadow-lg flex flex-col"
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
            <p>Student Opinionnaire</p>
            <p className="italic">Evaluation of a Module</p>
          </div>
          <div style={{ paddingLeft: "0.5in", paddingRight: "0.5in" }}>
            <div>
              <p className="text-xs italic ml-6">
                A. Directions: Please put a check in the space of your choice
                that corresponds to your rating of a given feature. Please do
                not leave any item blank.
              </p>
            </div>
            <table className="text-sm table-auto border-collapse border">
              <thead>
                <tr>
                  <th className="font-normal border border-black px-1">
                    Features
                  </th>
                  <th className="font-normal border border-black px-1">Yes</th>
                  <th className="font-normal border border-black px-1">
                    Somewhat
                  </th>
                  <th className="font-normal border border-black px-1">No</th>
                  <th className="font-normal border border-black px-1">
                    Not Applicable
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-1">
                    <div className="flex space-x-1">
                      <p>1.</p>
                      <p>
                        The module contains the expected outcomes for the entire
                        course.
                      </p>
                    </div>
                  </td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <div className="flex space-x-1">
                      <p>2.</p>
                      <p>The module&apos;s topics/concepts are informative.</p>
                    </div>
                  </td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <div className="flex space-x-1">
                      <p>3.</p>
                      <p>The presented topics/concepts are sufficient.</p>
                    </div>
                  </td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <div className="flex space-x-1">
                      <p>4.</p>
                      <p>
                        The module contains illustrations that enhance my
                        understanding of the lesson.
                      </p>
                    </div>
                  </td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <div className="flex space-x-1">
                      <p>5.</p>
                      <p>
                        The presentation of the module&apos;s parts or sections
                        are easy to follow.
                      </p>
                    </div>
                  </td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <div className="flex space-x-1">
                      <p>6.</p>
                      <p>
                        The module&apos;s images, figures, graphics, audios, or
                        videos (as may be applicable) are clear.
                      </p>
                    </div>
                  </td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <div className="flex space-x-1">
                      <p>7.</p>
                      <p>
                        The module&apos;s hyperlinks (as may be applicable) are
                        functional.
                      </p>
                    </div>
                  </td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <div className="flex space-x-1">
                      <p>8.</p>
                      <p>
                        The ideas are presented using a language that is easy to
                        understand.
                      </p>
                    </div>
                  </td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <div className="flex space-x-1">
                      <p>9.</p>
                      <p>The instructions are clear.</p>
                    </div>
                  </td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <div className="flex space-x-1">
                      <p>10.</p>
                      <p>
                        The module&apos;s contents are relevant to the course.
                      </p>
                    </div>
                  </td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <div className="flex space-x-1">
                      <p>11.</p>
                      <p>
                        The module leads me to develop critical thinking skills.
                      </p>
                    </div>
                  </td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <div className="flex space-x-1">
                      <p>12.</p>
                      <p>The activities reflect real-life experiences.</p>
                    </div>
                  </td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <div className="flex space-x-1">
                      <p>13.</p>
                      <p>
                        The module contains activities/tasks that are
                        appropriate to the course.
                      </p>
                    </div>
                  </td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <div className="flex space-x-1">
                      <p>14.</p>
                      <p>
                        The sequencing of activities in every lesson/unit
                        encourages me to perform them since they start from easy
                        to difficult ones.
                      </p>
                    </div>
                  </td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <div className="flex space-x-1">
                      <p>15.</p>
                      <p>The activities are varied.</p>
                    </div>
                  </td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <div className="flex space-x-1">
                      <p>16.</p>
                      <p>The module allows for flexible learning.</p>
                    </div>
                  </td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <div className="flex space-x-1">
                      <p>17.</p>
                      <p>
                        The module allows me to synthesize or summarize my
                        learnings in every lesson/unit.
                      </p>
                    </div>
                  </td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                </tr>
                <tr>
                  <td className="border border-black px-1">
                    <div className="flex space-x-1">
                      <p>18.</p>
                      <p>The module allows me to do independent learning.</p>
                    </div>
                  </td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                  <td className="border border-black px-1"></td>
                </tr>
              </tbody>
            </table>
            <div>
              <p className="text-xs italic ml-6">
                B. Directions: Please provide any comment or suggestion
                regarding the module by completing the statements below:
              </p>
            </div>
            <div className="text-sm space-y-1 ml-6">
              <p>1. What I like in the module is/are:</p>
              <div className="flex">
                <p className="ml-4">a.</p>
                <input
                  type="text"
                  className="block w-full px-0.5 border-0 border-b border-black focus:ring-0 focus:border-black py-0"
                />
              </div>

              <div className="flex">
                <p className="ml-4">b.</p>
                <input
                  type="text"
                  className="block w-full px-0.5 border-0 border-b border-black focus:ring-0 focus:border-black py-0"
                />
              </div>

              <p>2. What I think can still be improved in the module is/are:</p>
              <div className="flex">
                <p className="ml-4">a.</p>
                <input
                  type="text"
                  className="block w-full px-0.5 border-0 border-b border-black focus:ring-0 focus:border-black py-0"
                />
              </div>

              <div className="flex">
                <p className="ml-4">b.</p>
                <input
                  type="text"
                  className="block w-full px-0.5 border-0 border-b border-black focus:ring-0 focus:border-black py-0"
                />
              </div>
            </div>
            <br />

            <div className="text-sm">
              <div className="flex justify-between">
                <p>
                  Name of Evaluator:{" "}
                  <span className="underline">John Bryan Pit M. Acaso</span>
                </p>
                <p>
                  Date: <span className="underline">January 23, 2024</span>
                </p>
              </div>
              <div className="flex">
                <p className="">
                  Signature of Evaluator: ______________________
                </p>
              </div>
            </div>
          </div>
        </div>
        <footer>
          <div className="text-xs flex justify-between">
            <p>Document Code: CITL-F-004</p>
            <p>Revision No. 00</p>
            <p>Issue No.: 1</p>
            <p>Issue Date: July 27, 2020</p>
            <p>Page 1 of 1</p>
          </div>
        </footer>
      </div> */}
      <F004 questions={{
        q1: 1,
        q2: 2,
        q3: 3,
        q4: 4,
        q5: 1,
        q6: 2,
        q7: 3,
        q8: 4,
        q9: 1,
        q10: 2,
        q11: 3,
        q12: 4,
        q13: 1,
        q14: 2,
        q15: 3,
        q16: 4,
        q17: 1,
        q18: 2,
      }}
      />
    </div>
  );
}
