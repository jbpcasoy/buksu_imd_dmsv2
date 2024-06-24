// Simple example to add text to a document

import { F011Props } from "@/types/forms";
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

export default function F011({
  authorName,
  chairpersonName,
  coordinatorName,
  deanName,
  iDDCoordinatorName,
  iMTitle,
  iMType,
}: F011Props) {
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
                          children: ["Document Code: CITL-F-011"],
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
                  text: "Request for Instructional Material Review Form",
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
            new Paragraph({
              text: "The Director CITL",
              style: "body",
            }),
            new Paragraph({
              text: "Bukidnon State University",
              style: "body",
            }),
            new Paragraph(""),
            new Paragraph({
              text: "Sir/Madam:",
              style: "body",
            }),
            new Paragraph(""),
            new Paragraph({
              text: "I/We would like to request for the review of my/our instructional material herein named, duly reviewed and endorsed by the department/program and college with which the author/s is /are affiliated. The data pertaining to aforementioned work follow:",
              style: "body",
              indent: {
                firstLine: "0.5in",
              },
            }),
            new Paragraph(""),
            new Paragraph({
              numbering: {
                reference: "numerical-bullet-points",
                level: 0,
              },
              style: "body",
              children: [
                new TextRun({
                  text: `Name of Author/Applicant: `,
                }),
                new TextRun({
                  text: authorName,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
            }),
            new Paragraph({
              numbering: {
                reference: "numerical-bullet-points",
                level: 0,
              },
              style: "body",
              children: [
                new TextRun({
                  text: `Title of IM: `,
                }),
                new TextRun({
                  text: iMTitle,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
            }),
            new Paragraph({
              numbering: {
                reference: "numerical-bullet-points",
                level: 0,
              },
              style: "body",
              children: [
                new TextRun({
                  text: `IM Type: (Module, Course File, Worktext, Textbook, etc., please specify: `,
                }),
                new TextRun({
                  text: iMType,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
            }),
            new Paragraph({
              numbering: {
                reference: "numerical-bullet-points",
                level: 0,
              },
              style: "body",
              children: [
                new TextRun({
                  text: `Course Code and Course Descriptive Title for which this IM will be used: `,
                }),
              ],
            }),
            new Paragraph({
              style: "body",
              indent: {
                left: "1in",
              },
              children: [
                new TextRun({
                  text: "                                                                                                                                                      ",
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
            }),
            new Paragraph({
              numbering: {
                reference: "numerical-bullet-points",
                level: 0,
              },
              style: "body",
              children: [
                new TextRun({
                  text: `Semester this IM will be used:`,
                }),
              ],
            }),
            new Table({
              width: {
                size: convertInchesToTwip(6),
                type: WidthType.DXA,
              },
              indent: {
                size: convertInchesToTwip(1),
                type: "dxa",
              },
              columnWidths: [
                convertInchesToTwip(0.4),
                convertInchesToTwip(1),
                convertInchesToTwip(0.4),
                convertInchesToTwip(1.2),
                convertInchesToTwip(0.4),
                convertInchesToTwip(1.2),
                convertInchesToTwip(0.4),
                convertInchesToTwip(1),
              ],
              borders: {
                bottom: {
                  style: BorderStyle.NIL,
                },
                top: {
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
                          children: [
                            new ImageRun({
                              data: ovalCheckbox,
                              transformation: {
                                width: 25,
                                height: 20,
                              },
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          style: "bodyFont",
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Summer",
                            }),
                          ],
                          alignment: AlignmentType.LEFT,
                          style: "bodyFont",
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new ImageRun({
                              data: ovalCheckbox,
                              transformation: {
                                width: 25,
                                height: 20,
                              },
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          style: "bodyFont",
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "1",
                            }),
                            new TextRun({
                              text: "st",
                              superScript: true,
                            }),
                            new TextRun({
                              text: " sem only",
                            }),
                          ],
                          alignment: AlignmentType.LEFT,
                          style: "bodyFont",
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new ImageRun({
                              data: ovalCheckbox,
                              transformation: {
                                width: 25,
                                height: 20,
                              },
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          style: "bodyFont",
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "2",
                            }),
                            new TextRun({
                              text: "nd",
                              superScript: true,
                            }),
                            new TextRun({
                              text: " sem only",
                            }),
                          ],
                          alignment: AlignmentType.LEFT,
                          style: "bodyFont",
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new ImageRun({
                              data: ovalCheckbox,
                              transformation: {
                                width: 25,
                                height: 20,
                              },
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          style: "bodyFont",
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          text: "Every sem.",
                          alignment: AlignmentType.LEFT,
                          style: "bodyFont",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new Paragraph({
              numbering: {
                reference: "numerical-bullet-points",
                level: 0,
              },
              style: "body",
              children: [
                new TextRun({
                  text: `Do you agree to have a Student Evaluation Form included in the IM?`,
                }),
              ],
            }),
            new Table({
              width: {
                size: convertInchesToTwip(2.8),
                type: WidthType.DXA,
              },
              indent: {
                size: convertInchesToTwip(1),
                type: "dxa",
              },
              columnWidths: [
                convertInchesToTwip(0.4),
                convertInchesToTwip(1),
                convertInchesToTwip(0.4),
                convertInchesToTwip(1),
              ],
              borders: {
                bottom: {
                  style: BorderStyle.NIL,
                },
                top: {
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
                          children: [
                            new ImageRun({
                              data: ovalCheckbox,
                              transformation: {
                                width: 25,
                                height: 20,
                              },
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          style: "bodyFont",
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Yes",
                            }),
                          ],
                          alignment: AlignmentType.START,
                          style: "bodyFont",
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new ImageRun({
                              data: ovalCheckbox,
                              transformation: {
                                width: 25,
                                height: 20,
                              },
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          style: "bodyFont",
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "No",
                            }),
                          ],
                          alignment: AlignmentType.START,
                          style: "bodyFont",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new Paragraph({
              style: "body",
              indent: {
                start: "1in",
              },
              spacing: {
                after: 200,
                before: 200,
                lineRule: LineRuleType.EXACT,
              },
              children: [
                new TextRun({
                  text: `I agree to accomplish revisions suggested by the panel of reviewers.`,
                }),
              ],
            }),
            new Table({
              width: {
                size: "100%",
                type: WidthType.PERCENTAGE,
              },
              borders: {
                bottom: {
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
                insideHorizontal: {
                  style: BorderStyle.NONE,
                },
                insideVertical: {
                  style: BorderStyle.NONE,
                },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph({
                          style: "bodyFont",
                          children: [
                            new TextRun({
                              text: `Very respectfully,`,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph({
                          style: "bodyFont",
                          children: [
                            new TextRun({
                              text: authorName,
                              underline: {
                                type: UnderlineType.SINGLE,
                              },
                            }),
                          ],
                        }),
                        new Paragraph({
                          style: "bodyFont",
                          children: [
                            new TextRun({
                              text: `(Printed Name & Signature of Applicant)`,
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),

            new Table({
              width: {
                size: "100%",
                type: WidthType.PERCENTAGE,
              },
              borders: {
                bottom: {
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
                insideHorizontal: {
                  style: BorderStyle.NONE,
                },
                insideVertical: {
                  style: BorderStyle.NONE,
                },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          style: "body",
                          children: [
                            new TextRun({
                              text: `Reviewed and Endorsed:`,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph({
                          indent: {
                            left: "0.5in",
                          },
                          style: "bodyFont",
                          children: [
                            new TextRun({
                              text: coordinatorName,
                              underline: {
                                type: UnderlineType.SINGLE,
                              },
                            }),
                          ],
                        }),
                        new Paragraph({
                          indent: {
                            left: "0.5in",
                          },
                          style: "bodyFont",
                          children: [
                            new TextRun({
                              text: `IMD Program Coordinator`,
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph({
                          style: "bodyFont",
                          children: [
                            new TextRun({
                              text: chairpersonName,
                              underline: {
                                type: UnderlineType.SINGLE,
                              },
                            }),
                          ],
                        }),
                        new Paragraph({
                          style: "bodyFont",
                          children: [
                            new TextRun({
                              text: `Program Chair`,
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new Paragraph(""),
            new Paragraph(""),
            new Paragraph({
              style: "body",
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: deanName,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
            }),
            new Paragraph({
              style: "body",
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `College Dean`,
                }),
              ],
            }),
            new Paragraph({
              text: "",
              style: "body",
              border: {
                top: {
                  style: BorderStyle.THICK,
                },
              },
            }),
            new Paragraph({
              style: "bodyFont",
              indent: {
                left: "0.5in",
              },
              children: [
                new TextRun({
                  text: `Application received on _________________ with 1 Hard copy ________ & Soft Copy _______`,
                }),
              ],
            }),

            new Table({
              width: {
                size: "100%",
                type: WidthType.PERCENTAGE,
              },
              borders: {
                bottom: {
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
                insideHorizontal: {
                  style: BorderStyle.NONE,
                },
                insideVertical: {
                  style: BorderStyle.NONE,
                },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph({
                          style: "bodyFont",
                          children: [
                            new TextRun({
                              text: iDDCoordinatorName,
                              underline: {
                                type: UnderlineType.SINGLE,
                              },
                            }),
                          ],
                        }),
                        new Paragraph({
                          style: "bodyFont",
                          children: [
                            new TextRun({
                              text: `Signature of IDD Coordinator`,
                            }),
                          ],
                        }),
                      ],
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
      saveAs(blob, `${iMTitle}_F011.docx`);
    });
  }

  return (
    <div>
      <FormButton label="F011" secondaryLabel="Endorsement of the Instructional Material (Implementation Phase)" onClick={download} />
    </div>
  );
}
