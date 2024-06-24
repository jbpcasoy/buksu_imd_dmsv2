// Simple example to add text to a document

import { F013Props } from "@/types/forms";
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
} from "docx";
import saveAs from "file-saver";
import { useEffect, useState } from "react";
import { FormButton } from "./FormButton";

export default function F013({
  chairpersonName,
  coordinatorName,
  iMTitle,
  iMType,
  authorNames,
  ratings,
  seniorFacultyName,
}: F013Props) {
  const [buksuLogo, setBuksuLogo] = useState<ArrayBuffer>();
  const [citlLogo, setCitlLogo] = useState<ArrayBuffer>();
  const [educateInnovateLead, setEducateInnovateLead] = useState<ArrayBuffer>();
  const [ovalCheckbox, setOvalCheckbox] = useState<ArrayBuffer>();

  useEffect(() => {
    fetch("/images/buksu-logo-min-512x512.png")
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        // `buffer` now contains the image data as a buffer
        console.log("Image converted to buffer:", buffer);
        setBuksuLogo(buffer);
      });
  }, []);

  useEffect(() => {
    fetch("/images/citl-logo-gapless.png")
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        // `buffer` now contains the image data as a buffer
        console.log("Image converted to buffer:", buffer);
        setCitlLogo(buffer);
      });
  }, []);

  useEffect(() => {
    fetch("/images/educate-innovate-lead.png")
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        // `buffer` now contains the image data as a buffer
        console.log("Image converted to buffer:", buffer);
        setEducateInnovateLead(buffer);
      });
  }, []);

  useEffect(() => {
    fetch("/images/oval-checkbox.png")
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        // `buffer` now contains the image data as a buffer
        console.log("Image converted to buffer:", buffer);
        setOvalCheckbox(buffer);
      });
  }, []);

  function download() {
    if (!buksuLogo || !citlLogo || !educateInnovateLead || !ovalCheckbox) {
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
                          children: ["Document Code: CITL-F-013"],
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
                          children: ["Revision No.: 0"],
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
                          children: ["Issue no.: 1"],
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
                          children: ["Issue Date: July 28, 2022"],
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
            }),
          ],
          style: "bodyFont",
        }),
        new Paragraph({
          text: "Malaybalay City, Bukidnon 8700",
          alignment: AlignmentType.CENTER,
          style: "bodyFont",
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "Tel (088) 813-5661 to 5663; TeleFax (088) 813-2717, ",
            }),
          ],
          style: "bodyFont",
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new ExternalHyperlink({
              children: [
                new TextRun({
                  text: "https://www.buksu.edu.ph",
                  style: "Hyperlink",
                }),
              ],
              link: "https://www.buksu.edu.ph",
            }),
          ],
          style: "bodyFont",
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "OFFICE OF THE VICE PRESIDENT FOR ACADEMIC AFFAIRS",
              bold: true,
              color: "#272f41",
            }),
          ],
          style: "bodyFont",
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "Center for Innovative Teaching and Learning",
              color: "F2C050",
            }),
          ],
          style: "bodyFont",
        }),
        new Paragraph({
          run: {
            size: "5pt",
          },
          children: [
            new ImageRun({
              data: buksuLogo,
              transformation: {
                width: 63,
                height: 63,
              },
              floating: {
                zIndex: 10,
                horizontalPosition: {
                  relative: HorizontalPositionRelativeFrom.LEFT_MARGIN,
                  offset: 500000,
                },
                verticalPosition: {
                  relative: VerticalPositionRelativeFrom.TOP_MARGIN,
                  offset: 300000,
                },
              },
            }),
            new ImageRun({
              data: citlLogo,
              transformation: {
                width: 63,
                height: 63,
              },
              floating: {
                zIndex: 10,
                horizontalPosition: {
                  relative: HorizontalPositionRelativeFrom.LEFT_MARGIN,
                  offset: 1100000,
                },
                verticalPosition: {
                  relative: VerticalPositionRelativeFrom.TOP_MARGIN,
                  offset: 300000,
                },
              },
            }),
            new ImageRun({
              data: educateInnovateLead,
              transformation: {
                width: 95,
                height: 69,
              },
              floating: {
                zIndex: 10,
                horizontalPosition: {
                  relative: HorizontalPositionRelativeFrom.RIGHT_MARGIN,
                  offset: -900000,
                },
                verticalPosition: {
                  relative: VerticalPositionRelativeFrom.TOP_MARGIN,
                  // offset: 600000,
                  offset: 300000,
                },
              },
            }),
          ],
        }),
      ],
    });

    const titles1 = [
      "The Title",
      "The Preface",
      "The Introduction in Every Chapter/Unit",
      "The Learning Outcomes",
      "The Discussion/Presentation of the Concepts",
      "The Examples for the Application of the Concepts",
    ];

    const questions1 = [
      [
        "The title is definite.",
        "The title is relevant to the contents of the instructional material.",
      ],
      [
        "The preface is written by the author/s himself/herself/themselves.",
        "It includes reasons for creating the material.",
        "It states the importance to the users.",
        "It introduces what the material is about.",
      ],
      [
        "The introduction in every chapter/unit gives the overview of the coverage.",
      ],
      [
        "The content, activities, and assessment and aligned with the LOs.",
        "The learning outcomes (COs and SLOs) are addressed in the instructional material.",
        "The learning outcomes are appropriate for the topics covered.",
      ],
      [
        "The concepts are explicitly discussed.",
        "All terms are understandable to the learners.",
        "The content is free from gender-bias.",
      ],
      [
        "Examples are provided to illustrate the concepts discussed.",
        "The examples are consistent with the concepts discussed.",
        "They relate to real-world situations.",
        "They motivate students to participate in the learning process.",
        "They illustrate attainment of learning outcomes.",
      ],
    ];

    const questionRows1 = [];
    for (let i = 0; i < titles1.length; i++) {
      const title = titles1[i];
      const sectionQuestions = questions1[i];

      questionRows1.push(
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: title,
                      italics: true,
                    }),
                  ],
                  style: "tableFont",
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

      for (let j = 0; j < sectionQuestions.length; j++) {
        const question = sectionQuestions[j];
        const rating = ratings[i][j];

        questionRows1.push(
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    text: question,
                    bullet: {
                      level: 0,
                    },
                    style: "tableFont",
                    alignment: AlignmentType.JUSTIFIED,
                  }),
                  new Paragraph(""),
                ],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children:
                  rating === "VM"
                    ? [
                      new Paragraph({
                        text: "✓",
                        alignment: AlignmentType.CENTER,
                        style: "tableFont",
                      }),
                    ]
                    : [],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children:
                  rating === "M"
                    ? [
                      new Paragraph({
                        text: "✓",
                        alignment: AlignmentType.CENTER,
                        style: "tableFont",
                      }),
                    ]
                    : [],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children:
                  rating === "JE"
                    ? [
                      new Paragraph({
                        text: "✓",
                        alignment: AlignmentType.CENTER,
                        style: "tableFont",
                      }),
                    ]
                    : [],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children:
                  rating === "NM"
                    ? [
                      new Paragraph({
                        text: "✓",
                        alignment: AlignmentType.CENTER,
                        style: "tableFont",
                      }),
                    ]
                    : [],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children:
                  rating === "NAA"
                    ? [
                      new Paragraph({
                        text: "✓",
                        alignment: AlignmentType.CENTER,
                        style: "tableFont",
                      }),
                    ]
                    : [],
              }),
            ],
          })
        );
      }
    }

    const titles2 = ["The Exercises/Activities", "The Rubrics (if applicable)"];

    const questions2 = [
      [
        "The exercises/activities are appropriate for demonstrating the learned concepts.",
        "There are provisions that encourage students to work collaboratively.",
        "The exercises/activities develop creativity, critical thinking, and problem-solving skills of the students.",
        "They encourage students to communicate effectively.",
        "They are prepared within the capability of the students.",
      ],
      [
        "The rubrics are appropriate for the assessment.",
        "The rubrics describe the criteria through which the learners' outputs are rated.",
        "The rubrics show the levels of achievements of quality of the assessment outputs.",
      ],
    ];

    const questionRows2 = [];
    for (let i = 0; i < titles2.length; i++) {
      const title = titles2[i];
      const sectionQuestions = questions2[i];

      questionRows2.push(
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: title,
                  style: "tableFont",
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

      for (let j = 0; j < sectionQuestions.length; j++) {
        const question = sectionQuestions[j];
        const rating = ratings[i + 6][j];

        questionRows2.push(
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    text: question,
                    bullet: {
                      level: 0,
                    },
                    style: "tableFont",
                    alignment: AlignmentType.JUSTIFIED,
                  }),
                  new Paragraph(""),
                ],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children:
                  rating === "VM"
                    ? [
                      new Paragraph({
                        text: "✓",
                        alignment: AlignmentType.CENTER,
                        style: "tableFont",
                      }),
                    ]
                    : [],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children:
                  rating === "M"
                    ? [
                      new Paragraph({
                        text: "✓",
                        alignment: AlignmentType.CENTER,
                        style: "tableFont",
                      }),
                    ]
                    : [],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children:
                  rating === "JE"
                    ? [
                      new Paragraph({
                        text: "✓",
                        alignment: AlignmentType.CENTER,
                        style: "tableFont",
                      }),
                    ]
                    : [],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children:
                  rating === "NM"
                    ? [
                      new Paragraph({
                        text: "✓",
                        alignment: AlignmentType.CENTER,
                        style: "tableFont",
                      }),
                    ]
                    : [],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children:
                  rating === "NAA"
                    ? [
                      new Paragraph({
                        text: "✓",
                        alignment: AlignmentType.CENTER,
                        style: "tableFont",
                      }),
                    ]
                    : [],
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
                      left: "1in",
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
          {
            id: "body",
            name: "Body",
            basedOn: "bodyFont",
            next: "Normal",
            paragraph: {
              indent: {
                start: "0.5in",
                end: "0.5in",
              },
            },
          },
          {
            id: "bodyFont",
            name: "BodyFont",
            basedOn: "Normal",
            next: "Normal",
            run: {
              size: "11pt",
              font: "Book Antiqua",
            },
          },
          {
            id: "tableFont",
            name: "TableFont",
            basedOn: "Normal",
            next: "Normal",
            run: {
              size: "10pt",
              font: "Book Antiqua",
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
                left: "0.5in",
                right: "0.5in",
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
                  text: "Instructional Materials Review Form",
                  bold: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: {
                before: 200,
                lineRule: LineRuleType.EXACT,
              },
              style: "body",
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "(Implementation Phase)",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 100,
                lineRule: LineRuleType.EXACT,
              },
              style: "body",
            }),
            new Paragraph(""),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Title of IM:\t",
                }),
                new TextRun({
                  text: iMTitle,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
              style: "body",
            }),
            new Paragraph({
              // text: "Author/s: _________________________________________________________________",
              children: [
                new TextRun({
                  text: "Author/s:\t",
                }),
                new TextRun({
                  text: authorNames,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
              style: "body",
            }),
            new Paragraph({
              // text: "IM Type: (Module, Course File, Worktext, Textbook, etc., please specify: _________________________________________________________________",
              children: [
                new TextRun({
                  text: "IM Type:\t",
                }),
                new TextRun({
                  text: iMType,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
              style: "body",
            }),
            new Paragraph(""),
            new Paragraph({
              children: [
                new TextRun({
                  text: "To the Reviewers: Check the column corresponding to your rating for each item. Be guided by the following descriptions.",
                  italics: true,
                }),
              ],
              style: "body",
            }),
            new Table({
              borders: {
                bottom: {
                  style: BorderStyle.NONE,
                },
                top: {
                  style: BorderStyle.NONE,
                },
                left: {
                  style: BorderStyle.NONE,
                },
                right: {
                  style: BorderStyle.NONE,
                },
                insideHorizontal: {
                  style: BorderStyle.NONE,
                },
                insideVertical: {
                  style: BorderStyle.NONE,
                },
              },
              width: {
                size: "100%",
                type: WidthType.PERCENTAGE,
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          text: "VM\t-\tVery Much",
                          style: "body",
                          indent: {
                            left: "1in",
                          },
                        }),
                        new Paragraph({
                          text: "M\t-\tMuch",
                          style: "body",
                          indent: {
                            left: "1in",
                          },
                        }),
                        new Paragraph({
                          text: "JE\t-\tJust Enough",
                          style: "body",
                          indent: {
                            left: "1in",
                          },
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          text: "NM\t-\tNot Much",
                          style: "body",
                        }),
                        new Paragraph({
                          text: "NAA\t-\tNot at All",
                          style: "body",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new Paragraph(""),
            new Table({
              width: {
                size: 9000,
                type: WidthType.DXA,
              },
              columnWidths: [5400, 720, 720, 720, 720, 720],
              alignment: AlignmentType.CENTER,
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Criteria",
                              bold: true,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          style: "tableFont",
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "VM",
                              bold: true,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          style: "tableFont",
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "M",
                              bold: true,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          style: "tableFont",
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "JE",
                              bold: true,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          style: "tableFont",
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "NM",
                              bold: true,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          style: "tableFont",
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "NAA",
                              bold: true,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          style: "tableFont",
                        }),
                      ],
                    }),
                  ],
                }),
                ...questionRows1,
              ],
            }),
            new Paragraph(""),

            new Table({
              width: {
                size: 9000,
                type: WidthType.DXA,
              },
              columnWidths: [5400, 720, 720, 720, 720, 720],
              alignment: AlignmentType.CENTER,
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Criteria",
                              bold: true,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          style: "tableFont",
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "VM",
                              bold: true,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          style: "tableFont",
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "M",
                              bold: true,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          style: "tableFont",
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "JE",
                              bold: true,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          style: "tableFont",
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "NM",
                              bold: true,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          style: "tableFont",
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "NAA",
                              bold: true,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          style: "tableFont",
                        }),
                      ],
                    }),
                  ],
                }),
                ...questionRows2,
              ],
            }),

            new Paragraph(""),
            new Paragraph(""),
            new Paragraph({
              text: "Reviewed by:",
              indent: {
                left: "0.5in",
              },
              style: "bodyFont",
            }),
            new Paragraph(""),
            new Paragraph(""),
            new Table({
              borders: {
                bottom: {
                  style: BorderStyle.NONE,
                },
                insideHorizontal: {
                  style: BorderStyle.NONE,
                },
                insideVertical: {
                  style: BorderStyle.NONE,
                },
                left: {
                  style: BorderStyle.NONE,
                },
                right: {
                  style: BorderStyle.NONE,
                },
                top: {
                  style: BorderStyle.NONE,
                },
              },
              width: {
                size: 9000,
                type: WidthType.DXA,
              },
              alignment: AlignmentType.CENTER,
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: coordinatorName,
                              underline: {
                                type: UnderlineType.SINGLE,
                              },
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          style: "bodyFont",
                        }),
                        new Paragraph({
                          text: "IMD Program Coordinator",
                          alignment: AlignmentType.CENTER,
                          style: "bodyFont",
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: seniorFacultyName,
                              underline: {
                                type: UnderlineType.SINGLE,
                              },
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          style: "bodyFont",
                        }),
                        new Paragraph({
                          text: "Senior Faculty",
                          alignment: AlignmentType.CENTER,
                          style: "bodyFont",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),

            new Paragraph(""),
            new Paragraph(""),
            new Paragraph(""),
            new Paragraph({
              children: [
                new TextRun({
                  text: chairpersonName,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
              alignment: AlignmentType.CENTER,
              style: "bodyFont",
            }),
            new Paragraph({
              text: "Program Chair",
              alignment: AlignmentType.CENTER,
              style: "bodyFont",
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      // saveAs from FileSaver will download the file
      saveAs(blob, `${iMTitle}_f013.docx`);
    });
  }

  return (
    <div>
      <FormButton label="F013" secondaryLabel="Instructional Materials Review Form (Implementation Phase)" onClick={download} />
    </div>
  );
}
