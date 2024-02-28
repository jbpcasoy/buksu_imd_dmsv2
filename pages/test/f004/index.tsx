// Simple example to add text to a document

import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  Footer,
  FrameAnchorType,
  Header,
  HorizontalPositionRelativeFrom,
  ImageRun,
  LineRuleType,
  Packer,
  PageBreak,
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
  CheckBox,
  Drawing,
  LevelFormat,
  convertInchesToTwip,
} from "docx";
import saveAs from "file-saver";
import { useEffect, useState } from "react";
import { tuple } from "yup";

export default function TestPage() {
  return (
    <div>
      <IMERCSuggestionActionTaken />
    </div>
  );
}

interface Suggestion {
  suggestion: string;
  actionTaken: string;
  pageNumber: number;
  remarks: string;
}

function IMERCSuggestionActionTaken() {
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
                          children: ["Document Code: CITL-F-004"],
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

    const questions = [
      "The module contains the expected outcomes for the entire course.",
      "The module's topics/concepts are informative.",
      "The presented topics/concepts are sufficient.",
      "The module contains illustrations that enhance my understanding of the lesson.",
      "The presentation of the module's parts or sections are easy to follow.",
      "The module's images, figures, graphics, audios, or videos (as may be applicable) are clear.",
      "The module's hyperlinks (as may be applicable) are functional.",
      "The ideas are presented using a language that is easy to understand.",
      "The instructions are clear.",
      "The module's contents are relevant to the course.",
      "The module leads me to develop critical thinking skills.",
      "The activities reflect real-life experiences.",
      "The module contains activities/tasks that are appropriate to the course.",
      "The sequencing of activities in every lesson/unit encourages me to perform them since they start from easy to difficult ones.",
      "The activities are varied.",
      "The module allows for flexible learning.",
      "The module allows me to synthesize or summarize my learnings in every lesson/unit.",
      "The module allows me to do independent learning. ",
    ];

    const questionRows = questions.map((question) => {
      return new TableRow({
        children: [
          new TableCell({
            children: [
              // new Paragraph({
              //   text: question,
              // }),

              new Paragraph({
                numbering: {
                  reference: "table-numerical-bullet-points",
                  level: 0,
                },
                indent: {
                  left: "0.5in",
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
        ],
      });
    });

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
                      left: "0.25in",
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
                format: LevelFormat.DECIMAL,
                alignment: AlignmentType.LEFT,
                text: "%1. ",
                style: {
                  paragraph: {
                    indent: {
                      hanging: "0.25in",
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
                  text: "Student Opinionnaire",
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
                  text: `Directions: Please put a check in the space of your choice that corresponds to your rating of a given feature. Please do not leave any item blank.`,
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
                convertInchesToTwip(0.6),
                convertInchesToTwip(0.6),
                convertInchesToTwip(0.6),
                convertInchesToTwip(0.6),
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
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          text: "Yes",
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          text: "Some-what",
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          text: "No",
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Not Applicable",
                              size: "7pt",
                            }),
                          ],
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
              numbering: {
                reference: "numerical-bullet-points",
                level: 0,
              },
              children: [
                new TextRun({
                  text: `What I like in the module is/are:`,
                }),
              ],
            }),
            new Paragraph({
              spacing: {
                after: 100,
                before: 100,
                lineRule: LineRuleType.EXACT,
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
              numbering: {
                reference: "numerical-bullet-points",
                level: 0,
              },
              children: [
                new TextRun({
                  text: `What I think can still be improved in the module is/are:`,
                }),
              ],
            }),
            new Paragraph({
              spacing: {
                after: 100,
                before: 100,
                lineRule: LineRuleType.EXACT,
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
      saveAs(blob, "example.docx");
    });
  }

  return (
    <div>
      <button onClick={download}>Download</button>
    </div>
  );
}
