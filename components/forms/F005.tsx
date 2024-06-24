// Simple example to add text to a document

import { F005Props } from "@/types/forms";
import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  Footer,
  Header,
  HorizontalPositionRelativeFrom,
  ImageRun,
  LevelFormat,
  LineRuleType,
  Packer,
  PageNumber,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  UnderlineType,
  VerticalAlign,
  VerticalPositionRelativeFrom,
  WidthType,
  convertInchesToTwip,
} from "docx";
import saveAs from "file-saver";
import { useEffect, useState } from "react";
import { FormButton } from "./FormButton";

export default function F005({ iMTitle }: F005Props) {
  const [buksuLogo, setBuksuLogo] = useState<ArrayBuffer>();

  useEffect(() => {
    fetch("/images/buksu-logo-min-512x512.png")
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        // `buffer` now contains the image data as a buffer
        console.log("Image converted to buffer:", buffer);
        setBuksuLogo(buffer);
      });
  }, []);

  function download() {
    if (!buksuLogo) {
      return;
    }

    const footer = new Footer({
      children: [
        new Table({
          alignment: AlignmentType.CENTER,
          width: {
            size: "100%",
            type: WidthType.PERCENTAGE,
          },
          borders: {
            top: {
              style: BorderStyle.NIL,
            },
            bottom: {
              style: BorderStyle.NIL,
            },
            left: {
              style: BorderStyle.NIL,
            },
            right: {
              style: BorderStyle.NIL,
            },
            insideVertical: {
              style: BorderStyle.NIL,
            },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  verticalAlign: VerticalAlign.CENTER,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          children: ["Document Code: CITL-F-005"],
                          size: "8pt",
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  verticalAlign: VerticalAlign.CENTER,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          children: ["Revision No. 00"],
                          size: "8pt",
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  verticalAlign: VerticalAlign.CENTER,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          children: ["Issue no. 1"],
                          size: "8pt",
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  verticalAlign: VerticalAlign.CENTER,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          children: ["Issue Date: July 27, 2020"],
                          size: "8pt",
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  verticalAlign: VerticalAlign.CENTER,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          children: [
                            "Page ",
                            PageNumber.CURRENT,
                            " of ",
                            PageNumber.TOTAL_PAGES,
                          ],
                        }),
                      ],
                      style: "footer",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });

    const header = new Header({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "BUKIDNON STATE UNIVERSITY",
              bold: true,
              size: "12pt",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "Malaybalay City, Bukidnon 8700",
              size: "12pt",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "Tel (088) 813-5661 to 5663; TeleFax (088) 813-2717,",
              size: "12pt",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new ExternalHyperlink({
              children: [
                new TextRun({
                  text: "https://www.buksu.edu.ph",
                  style: "Hyperlink",
                  size: "12pt",
                }),
              ],
              link: "https://www.buksu.edu.ph",
            }),
          ],
        }),
        new Paragraph({
          run: {
            size: "5pt",
          },
          children: [
            new ImageRun({
              data: buksuLogo,
              transformation: {
                width: 70,
                height: 70,
              },
              floating: {
                zIndex: 10,
                horizontalPosition: {
                  relative: HorizontalPositionRelativeFrom.LEFT_MARGIN,
                  offset: 500000,
                },
                verticalPosition: {
                  relative: VerticalPositionRelativeFrom.TOP_MARGIN,
                  offset: 400000,
                },
              },
            }),
          ],
        }),
      ],
    });

    const questionTitles = [
      "CONTENT AND CONTENT ACCURACY",
      "CLARITY",
      "RELEVANCE",
      "APPROPRIATENESS",
    ];

    const questions = [
      [
        "begins with the course and specific learning outcomes",
        "contains topics/concepts that are informative",
        "comprehensively presents topics/concepts",
      ],
      [
        "contains illustrations that enhance student's understanding of the lesson",
        "contains images, figures, graphics, audios, or videos that are clear",
        "gives web links that work",
        "presents ideas in a well-organized and logical format",
        "presents ideas in simple, direct language appropriate to the student's level",
        "contains instructions that are clear and easy to understand",
        "contains texts suited to the learner's comprehension level",
      ],
      [
        "has contents relevant to the course",
        "develops the student's critical thinking skills",
        "reflects real-life experiences.",
        "contains activities/tasks that are course-appropriate",
        "has varied activities",
        "provides opportunities for students using various modalities",
        "allows students to synthesize or summarize key points or insights after every lesson or unit",
      ],
      [
        "contains materials appropriate to the course",
        "allows the students to perform tasks independently.",
        "caters to varied levels of the students' mental ability.",
      ],
    ];
    const questionRows = [];
    for (let i = 0; i < questionTitles.length; i++) {
      const questionTitle = questionTitles[i];
      questionRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  numbering: {
                    reference: "table-numerical-bullet-points",
                    level: 0,
                  },
                  children: [
                    new TextRun({
                      text: questionTitle,
                      italics: true,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [],
            }),
            new TableCell({
              children: [],
            }),
            new TableCell({
              children: [],
            }),
            new TableCell({
              children: [],
            }),
            new TableCell({
              children: [],
            }),
          ],
        })
      );

      const sectionQuestions = questions[i];
      for (let j = 0; j < sectionQuestions.length; j++) {
        const question = sectionQuestions[j];
        questionRows.push(
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    numbering: {
                      reference: "table-numerical-bullet-points",
                      level: 1,
                    },
                    children: [
                      new TextRun({
                        text: question,
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                children: [],
              }),
              new TableCell({
                children: [],
              }),
              new TableCell({
                children: [],
              }),
              new TableCell({
                children: [],
              }),
              new TableCell({
                children: [],
              }),
            ],
          })
        );
      }
    }

    const doc = new Document({
      numbering: {
        config: [
          {
            reference: "alphabetical-bullet-points",
            levels: [
              {
                level: 0,
                format: LevelFormat.UPPER_LETTER,
                alignment: AlignmentType.LEFT,
                text: "%1. ",
                style: {
                  run: {
                    italics: true,
                  },
                  paragraph: {
                    indent: {
                      left: "0.50in",
                      hanging: "0.25in",
                    },
                  },
                },
              },
            ],
          },
          {
            reference: "table-numerical-bullet-points",
            levels: [
              {
                level: 0,
                format: LevelFormat.UPPER_LETTER,
                alignment: AlignmentType.LEFT,
                text: "%1. ",
                style: {
                  run: {
                    italics: true,
                  },
                  paragraph: {
                    indent: {
                      left: "0.20in",
                      hanging: "0.20in",
                    },
                  },
                },
              },
              {
                level: 1,
                format: LevelFormat.DECIMAL,
                alignment: AlignmentType.LEFT,
                text: "%2. ",
                style: {
                  paragraph: {
                    indent: {
                      left: "0.20in",
                      hanging: "0.20in",
                    },
                  },
                },
              },
            ],
          },
          {
            reference: "numerical-bullet-points",
            levels: [
              {
                level: 0,
                format: LevelFormat.DECIMAL,
                alignment: AlignmentType.LEFT,
                text: "%1. ",
                style: {
                  paragraph: {
                    indent: {
                      left: "0.50in",
                      hanging: "0.25in",
                    },
                  },
                },
              },
              {
                level: 1,
                format: LevelFormat.LOWER_LETTER,
                alignment: AlignmentType.LEFT,
                text: "%2. ",
                style: {
                  paragraph: {
                    indent: {
                      left: "0.75in",
                      hanging: "0.25in",
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      styles: {
        paragraphStyles: [
          {
            id: "footer",
            name: "Footer",
            basedOn: "Normal",
            next: "Normal",
            run: {
              size: "8pt",
            },
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                bottom: "0.5in",
                left: "1in",
                right: "1in",
                top: "0.5in",
              },
            },
          },
          headers: {
            default: header,
          },
          footers: {
            default: footer,
          },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Teacher-User Evaluation",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: {
                before: 200,
                lineRule: LineRuleType.EXACT,
              },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Evaluation of a Module",
                  italics: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 400,
                lineRule: LineRuleType.EXACT,
              },
            }),
            new Paragraph({
              numbering: {
                reference: "alphabetical-bullet-points",
                level: 0,
              },
              children: [
                new TextRun({
                  text: `Directions: Please put a check in the space of your choice that corresponds to your rating of a given feature.`,
                  italics: true,
                }),
              ],
            }),
            new Paragraph({
              indent: {
                left: "1in",
              },
              spacing: {
                after: 100,
                lineRule: LineRuleType.EXACT,
              },
              children: [
                new TextRun({
                  text: "Please do not leave any item blank.",
                  italics: true,
                }),
              ],
            }),
            new Table({
              alignment: AlignmentType.CENTER,
              width: {
                size: convertInchesToTwip(6.2),
                type: WidthType.DXA,
              },
              columnWidths: [
                convertInchesToTwip(3.8),
                convertInchesToTwip(0.5),
                convertInchesToTwip(0.5),
                convertInchesToTwip(0.5),
                convertInchesToTwip(0.5),
                convertInchesToTwip(0.5),
              ],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          text: "Features",
                          alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "The module…",
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          text: "HA",
                          alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                          text: "5",
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          text: "VA",
                          alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                          text: "4",
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          text: "A",
                          alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                          text: "3",
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "SA",
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                          text: "2",
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "NA",
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                          text: "1",
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                    }),
                  ],
                }),
                ...questionRows,
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "5-Highly Adequate (HA)\t4-Very Adequate (VA)\t3-Adequate (A)\t2-Slightly Adequate (SA)\t1-Not Adequate (NA)",
                  italics: true,
                  size: "8pt",
                }),
              ],
            }),
            new Paragraph({
              numbering: {
                reference: "alphabetical-bullet-points",
                level: 0,
              },
              spacing: {
                after: 100,
                before: 100,
                lineRule: LineRuleType.EXACT,
              },
              children: [
                new TextRun({
                  text: `Directions: Please provide any comment or suggestion regarding the module by completing the
                    statements below:`,
                  italics: true,
                }),
              ],
            }),
            new Paragraph({
              spacing: {
                after: 100,
                before: 100,
                lineRule: LineRuleType.EXACT,
              },
              indent: {
                left: "0.75in",
              },
              numbering: {
                reference: "numerical-bullet-points",
                level: 0,
              },
              children: [
                new TextRun({
                  text: `Strengths:`,
                }),
              ],
            }),
            new Paragraph({
              spacing: {
                after: 100,
                before: 100,
                lineRule: LineRuleType.EXACT,
              },
              indent: {
                left: "1in",
              },
              numbering: {
                reference: "numerical-bullet-points",
                level: 1,
              },
              children: [
                new TextRun({
                  text: `                                                                                                                                              `,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
            }),
            new Paragraph({
              spacing: {
                after: 100,
                before: 100,
                lineRule: LineRuleType.EXACT,
              },
              indent: {
                left: "1in",
              },
              numbering: {
                reference: "numerical-bullet-points",
                level: 1,
              },
              children: [
                new TextRun({
                  text: `                                                                                                                                              `,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
            }),
            new Paragraph({
              spacing: {
                after: 100,
                before: 100,
                lineRule: LineRuleType.EXACT,
              },
              indent: {
                left: "0.75in",
              },
              numbering: {
                reference: "numerical-bullet-points",
                level: 0,
              },
              children: [
                new TextRun({
                  text: `Weaknesses:`,
                }),
              ],
            }),
            new Paragraph({
              spacing: {
                after: 100,
                before: 100,
                lineRule: LineRuleType.EXACT,
              },
              indent: {
                left: "1in",
              },
              numbering: {
                reference: "numerical-bullet-points",
                level: 1,
              },
              children: [
                new TextRun({
                  text: `                                                                                                                                              `,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
            }),
            new Paragraph({
              spacing: {
                after: 100,
                before: 100,
                lineRule: LineRuleType.EXACT,
              },
              indent: {
                left: "1in",
              },
              numbering: {
                reference: "numerical-bullet-points",
                level: 1,
              },
              children: [
                new TextRun({
                  text: `                                                                                                                                              `,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
            }),

            new Paragraph({
              spacing: {
                after: 100,
                before: 400,
                lineRule: LineRuleType.EXACT,
              },
              children: [
                new TextRun({
                  text: "Name of Evaluator: ",
                }),
                new TextRun({
                  text: `                                                                                              `,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
                new TextRun({
                  text: " Date: ",
                }),
                new TextRun({
                  text: `                                    `,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Signature of Evaluator: ",
                }),
                new TextRun({
                  text: `                                                                                        `,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      // saveAs from FileSaver will download the file
      saveAs(blob, `${iMTitle}_F005.docx`);
    });
  }

  return (
    <div>
      <FormButton label="F005" secondaryLabel="Teacher-User Evaluation" onClick={download} />
    </div>
  );
}
