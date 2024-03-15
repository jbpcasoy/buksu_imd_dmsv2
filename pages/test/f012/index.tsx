// Simple example to add text to a document

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

export default function TestPage() {
  return (
    <div>
      <IMERCSuggestionActionTaken
        authorNames="John Bryan Pit M. Acaso, Glenmark T. Artiaga"
        chairpersonName="Glenmark T. Artiaga"
        coordinatorName="Keano Lehryns Hyson Jimeno"
        deanName="Airys Prill C. Gorra"
        iMTitle="Computing 101"
        iMType="Module"
        applicantName="John Bryan Pit M. Acaso"
        collegeName="College of Technologies"
        departmentName="Information Technology"
      />
    </div>
  );
}

interface IMERCSuggestionActionTakenProps {
  iMTitle: string;
  authorNames: string;
  iMType: "Module" | "Course File" | "Worktext" | "Textbook";
  departmentName: string;
  collegeName: string;
  applicantName: string;
  coordinatorName: string;
  chairpersonName: string;
  deanName: string;
}

function IMERCSuggestionActionTaken({
  chairpersonName,
  coordinatorName,
  deanName,
  iMTitle,
  iMType,
  applicantName,
  authorNames,
  collegeName,
  departmentName,
}: IMERCSuggestionActionTakenProps) {
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
                          children: ["Document Code: CITL-F-012"],
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
                  text: "Endorsement of Request for Instructional Material Evaluation and Publication",
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
                  text: "(for IPTTU Endorsement and Publication)",
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
                  text: "Title of IM: ",
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
                  text: "Author/s: ",
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
                  text: "IM Type: (Module, Course File, Worktext, Textbook, etc., please specify: ",
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
            new Paragraph({
              children: [
                new TextRun({
                  text: "Department/Program: ",
                }),
                new TextRun({
                  text: departmentName,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
                new TextRun({
                  text: "\tCollege: ",
                }),
                new TextRun({
                  text: collegeName,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
              style: "body",
            }),
            new Paragraph({
              text: "Course Code and Course Descriptive Title for which this IM will be used: ",
              style: "body",
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "                                                                                                                                                                                               ",
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
              style: "body",
            }),
            new Paragraph({
              text: "Semester this IM will be used:",
              style: "body",
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
              text: "Do you have permission to print any material with prior copyright that is included in this IM?",
              style: "body",
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
              children: [
                new TextRun({
                  text: "How long do you expect to use this edition? ",
                }),
                new TextRun({
                  text: "          ",
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
                new TextRun({
                  text: " Semester/s (Specify no. of semesters)",
                }),
              ],
              style: "body",
            }),
            new Paragraph(""),

            new Table({
              width: {
                size: 9000,
                type: WidthType.DXA,
              },
              indent: {
                size: convertInchesToTwip(0.5),
                type: "dxa",
              },
              columnWidths: [6000, 3000],
              borders: {
                bottom: {
                  style: BorderStyle.DOUBLE,
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
                      margins: {
                        bottom: 0,
                        top: 0,
                        left: 0,
                        right: 0,
                        marginUnitType: "dxa",
                      },
                      children: [
                        new Paragraph({
                          style: "bodyFont",
                          children: [
                            new TextRun({
                              text: "Requested by:",
                              italics: true,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph({
                          style: "bodyFont",
                          children: [
                            new TextRun({
                              text: applicantName,
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
                    new TableCell({
                      margins: {
                        bottom: 0,
                        top: 0,
                        left: 0,
                        right: 0,
                        marginUnitType: "dxa",
                      },
                      children: [
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph({
                          style: "bodyFont",
                          children: [
                            new TextRun({
                              text: "Date: ______________",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new Paragraph({
              // text: "Program Recommendation",
              children: [
                new TextRun({
                  text: "Program Recommendation",
                  bold: true,
                }),
              ],
              style: "body",
            }),

            new Paragraph(""),
            new Paragraph({
              // text: "Will the department/program require this IM in the course/s indicated?",
              children: [
                new TextRun({
                  text: "Will the department/program require this IM in the course/s indicated?",
                }),
              ],
              style: "body",
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
              text: "Will the department/program commit to using it for the length of time indicated by the author/s?",
              style: "body",
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
              text: "Will the department/program promote the use of the IM by other schools?",
              style: "body",
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
            new Paragraph(""),
            new Paragraph({
              // text: "Will the department/program promote the use of the IM by other schools?",
              children: [
                new TextRun({
                  text: "I am endorsing the evaluation of this IM for IPTTU endorsement for copyright application and publication.",
                  bold: true,
                }),
              ],
              style: "body",
            }),

            new Paragraph(""),
            new Table({
              width: {
                size: 9000,
                type: WidthType.DXA,
              },
              indent: {
                size: convertInchesToTwip(0.5),
                type: "dxa",
              },
              columnWidths: [6000, 3000],
              borders: {
                bottom: {
                  style: BorderStyle.DOUBLE,
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
                      margins: {
                        bottom: 0,
                        top: 0,
                        left: 0,
                        right: 0,
                        marginUnitType: "dxa",
                      },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Reviewed and Endorsed:",
                            }),
                          ],
                          style: "bodyFont",
                        }),
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph({
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
                          style: "bodyFont",
                          children: [
                            new TextRun({
                              text: `IMD Program Coordinator/Date`,
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      margins: {
                        bottom: 0,
                        top: 0,
                        left: 0,
                        right: 0,
                        marginUnitType: "dxa",
                      },
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
                              text: `Program Chair/Date`,
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "College Recommendation",
                  bold: true,
                }),
              ],
              style: "body",
            }),
            new Paragraph(""),
            new Paragraph({
              // text: "Will the department/program promote the use of the IM by other schools?",
              children: [
                new TextRun({
                  text: "I am endorsing the evaluation of this IM for IPTTU endorsement for copyright application and publication.",
                  bold: true,
                }),
              ],
              style: "body",
            }),
            new Table({
              width: {
                size: 9000,
                type: WidthType.DXA,
              },
              indent: {
                size: convertInchesToTwip(0.5),
                type: "dxa",
              },
              columnWidths: [6000, 3000],
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
                      margins: {
                        bottom: 0,
                        top: 0,
                        left: 0,
                        right: 0,
                        marginUnitType: "dxa",
                      },
                      children: [
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph({
                          style: "bodyFont",
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
                          style: "bodyFont",
                          children: [
                            new TextRun({
                              text: `Signature Over Printed Name of College Dean`,
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      margins: {
                        bottom: 0,
                        top: 0,
                        left: 0,
                        right: 0,
                        marginUnitType: "dxa",
                      },
                      children: [
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph({
                          style: "bodyFont",
                          children: [
                            new TextRun({
                              text: "Date: ______________",
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
      saveAs(blob, "example.docx");
    });
  }

  return (
    <div>
      <button onClick={download}>Download</button>
    </div>
  );
}
