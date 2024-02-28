// Simple example to add text to a document

import { F014Props } from "@/types/forms";
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

export default function F014({
  iMTitle,
  iMType,
  authorNames,
  contentSpecialistRatings,
  contentEditorRatings,
  iDDSpecialistRatings,
  cITLDirectorName,
  contentSpecialistName,
  iDDCoordinatorName,
}: F014Props) {
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
                          children: ["Document Code: CITL-F-014"],
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
        "The presentation facilitates comprehension.",
        "The content is free from gender-bias.",
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
          ],
        })
      );

      for (let j = 0; j < sectionQuestions.length; j++) {
        const question = sectionQuestions[j];
        const contentSpecialistRating = contentSpecialistRatings[i][j];
        const contentEditorRating = contentEditorRatings[i][j];
        const iDDSpecialistRating = iDDSpecialistRatings[i][j];

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
                children: [
                  new Paragraph({
                    text: contentSpecialistRating as string,
                    alignment: AlignmentType.CENTER,
                    style: "tableFont",
                  }),
                ],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  new Paragraph({
                    text: contentEditorRating as string,
                    alignment: AlignmentType.CENTER,
                    style: "tableFont",
                  }),
                ],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  new Paragraph({
                    text: iDDSpecialistRating as string,
                    alignment: AlignmentType.CENTER,
                    style: "tableFont",
                  }),
                ],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children: [],
              }),
            ],
          })
        );
      }
    }

    const titles2 = [
      "The Examples for the Application of the Concepts",
      "The Exercises/Activities",
      "The Rubrics (if applicable)",
    ];

    const questions2 = [
      [
        "Examples are provided to illustrate the concepts discussed.",
        "The examples are consistent with the concepts discussed.",
        "They relate to real-world situations.",
        "They motivate students to participate in the learning process.",
        "They illustrate attainment of learning outcomes.",
      ],
      [
        "The exercises/activities are appropriate for demonstrating the learned concepts.",
        "There are provisions that encourage students to work collaboratively.",
        "The exercises/activities develop creativity, critical thinking, and problem-solving skills of the students.",
        "They encourage students to communicate effectively.",
        "They are prepared within the capability of the students.",
      ],
      [
        "The rubrics are appropriate for the assessment.",
        "The rubrics describe the criteria through which the learners’ outputs are rated.",
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
          ],
        })
      );

      for (let j = 0; j < sectionQuestions.length; j++) {
        const question = sectionQuestions[j];
        const contentSpecialistRating = contentSpecialistRatings[i + 5][j];
        const contentEditorRating = contentEditorRatings[i + 5][j];
        const iDDSpecialistRating = iDDSpecialistRatings[i + 5][j];

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
                children: [
                  new Paragraph({
                    text: contentSpecialistRating as string,
                    alignment: AlignmentType.CENTER,
                    style: "tableFont",
                  }),
                ],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  new Paragraph({
                    text: contentEditorRating as string,
                    alignment: AlignmentType.CENTER,
                    style: "tableFont",
                  }),
                ],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  new Paragraph({
                    text: iDDSpecialistRating as string,
                    alignment: AlignmentType.CENTER,
                    style: "tableFont",
                  }),
                ],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
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
                  text: "(IMERC)",
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
              columnWidths: [4000, 1197, 1197, 1197, 1409],
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
                              text: "Content Specialist",
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
                              text: "Content Editor",
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
                              text: "IDD Specialist",
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
                              text: "Remarks",
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
              columnWidths: [4000, 1197, 1197, 1197, 1409],
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
                              text: "Content Specialist",
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
                              text: "Content Editor",
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
                              text: "IDD Specialist",
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
                              text: "Remarks",
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
            new Paragraph(""),
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
                              text: contentSpecialistName,
                              underline: {
                                type: UnderlineType.SINGLE,
                              },
                            }),
                          ],
                          style: "bodyFont",
                        }),
                        new Paragraph({
                          text: "Content Specialist",
                          style: "bodyFont",
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: cITLDirectorName,
                              underline: {
                                type: UnderlineType.SINGLE,
                              },
                            }),
                          ],
                          style: "bodyFont",
                        }),
                        new Paragraph({
                          text: "Content Editor",
                          style: "bodyFont",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),

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
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: iDDCoordinatorName,
                              underline: {
                                type: UnderlineType.SINGLE,
                              },
                            }),
                          ],
                          style: "bodyFont",
                        }),
                        new Paragraph({
                          text: "IDD Specialist",
                          style: "bodyFont",
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [],
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      // saveAs from FileSaver will download the file
      saveAs(blob, `${iMTitle}_F014.docx`);
    });
  }

  return (
    <div>
      <button onClick={download} className="underline">
        F014 - Instructional Materials Review Form (IMERC)
      </button>
    </div>
  );
}
