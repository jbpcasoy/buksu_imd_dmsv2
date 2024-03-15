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

export default function TestPage() {
  return (
    <div>
      <IMERCSuggestionActionTaken
        coordinatorName="Glenmark T. Artiaga"
        iDDCoordinatorName="Ayris Prill C. Gorra"
        iMTitle="Teaching Physical Education"
        authorNames="John Bryan Pit M. Acaso, Glenmark T. Artiaga, Keano Lehryns Hynson Jimeno"
        collegeName="College of Education"
        courseCode="PE4A"
        departmentName="Physical Education"
        iMType="MODULE"
        semester={1}
        syEnd={2024}
        syStart={2023}
      />
    </div>
  );
}

interface Suggestion {
  suggestion: string;
  actionTaken: string;
  pageNumber: number;
  remarks: string;
}

interface IMERCSuggestionActionTakenProps {
  iMTitle: string;
  authorNames: string;
  courseCode: string;
  semester: 1 | 2;
  syStart: number;
  syEnd: number;
  iMType: "MODULE" | "COURSE_FILE" | "WORKTEXT" | "TEXTBOOK";
  departmentName: string;
  collegeName: string;
  coordinatorName: string;
  iDDCoordinatorName: string;
}

function IMERCSuggestionActionTaken({
  coordinatorName,
  iDDCoordinatorName,
  iMTitle,
  authorNames,
  collegeName,
  courseCode,
  departmentName,
  iMType,
  semester,
  syEnd,
  syStart,
}: IMERCSuggestionActionTakenProps) {
  const [buksuLogo, setBuksuLogo] = useState<ArrayBuffer>();
  const [citlLogo, setCitlLogo] = useState<ArrayBuffer>();
  const [educateInnovateLead, setEducateInnovateLead] = useState<ArrayBuffer>();
  const [distribution, setDistribution] = useState<ArrayBuffer>();

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
    fetch("/images/citl-logo.png")
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
    fetch("/images/distribution-checkbox.png")
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        // `buffer` now contains the image data as a buffer
        console.log("Image converted to buffer:", buffer);
        setDistribution(buffer);
      });
  }, []);

  function download() {
    if (!buksuLogo || !citlLogo || !educateInnovateLead || !distribution) {
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
                          children: ["Document Code: CITL-F-001"],
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
                          children: ["Revision No.: 1"],
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
                          children: ["Issue Date: April 18, 2022"],
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
        }),
        new Paragraph({
          text: "Malaybalay City, Bukidnon 8700",
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "Tel (088) 813-5661 to 5663; TeleFax (088) 813-2717, ",
            }),
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
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "OFFICE OF THE VICE PRESIDENT FOR ACADEMIC AFFAIRS",
              bold: true,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "Center for Innovative Teaching and Learning",
              color: "F2C050",
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
                width: 50,
                height: 50,
              },
              floating: {
                zIndex: 10,
                horizontalPosition: {
                  relative: HorizontalPositionRelativeFrom.LEFT_MARGIN,
                  offset: 500000,
                },
                verticalPosition: {
                  relative: VerticalPositionRelativeFrom.TOP_MARGIN,
                  offset: 600000,
                },
              },
            }),
            new ImageRun({
              data: citlLogo,
              transformation: {
                width: 50,
                height: 50,
              },
              floating: {
                zIndex: 10,
                horizontalPosition: {
                  relative: HorizontalPositionRelativeFrom.LEFT_MARGIN,
                  offset: 1000000,
                },
                verticalPosition: {
                  relative: VerticalPositionRelativeFrom.TOP_MARGIN,
                  offset: 600000,
                },
              },
            }),
            new ImageRun({
              data: educateInnovateLead,
              transformation: {
                width: 70.5,
                height: 51,
              },
              floating: {
                zIndex: 10,
                horizontalPosition: {
                  relative: HorizontalPositionRelativeFrom.RIGHT_MARGIN,
                  offset: -700000,
                },
                verticalPosition: {
                  relative: VerticalPositionRelativeFrom.TOP_MARGIN,
                  offset: 600000,
                },
              },
            }),
          ],
        }),
      ],
    });

    const doc = new Document({
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
                  text: "Endorsement of the Instructional Material",
                  bold: true,
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
                  text: "(Implementation Phase)",
                  bold: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 400,
                lineRule: LineRuleType.EXACT,
              },
            }),
            new Paragraph({
              indent: {
                start: "0.5in",
                end: "0.5in",
              },
              children: [
                new TextRun({
                  text: `Title: \t\t`,
                }),
                new TextRun({
                  text: `${iMTitle}`,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
            }),
            new Paragraph({
              indent: {
                start: "0.5in",
                end: "0.5in",
              },
              children: [
                new TextRun({
                  text: "Author/s: \t",
                }),
                new TextRun({
                  text: `${authorNames}`,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
            }),
            new Paragraph({
              indent: {
                start: "0.5in",
                end: "0.5in",
              },
              children: [
                new TextRun({
                  text: "Course Code: \t",
                }),
                new TextRun({
                  text: `${courseCode}`,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
                new TextRun({
                  text: "\tSem./SY:  ",
                }),
                new TextRun({
                  text: `${semester}/${syStart}-${syEnd}`,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
            }),
            new Paragraph({
              indent: {
                start: "0.5in",
                end: "0.5in",
              },
              children: [
                new TextRun({
                  text: "IM Type: \t",
                }),
                new TextRun({
                  text: `${iMType}`,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
            }),
            new Paragraph({
              indent: {
                start: "0.5in",
                end: "0.5in",
              },
              children: [
                new TextRun({
                  text: "Program/Department: ",
                }),
                new TextRun({
                  text: `${departmentName}`,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
                new TextRun({
                  text: "\tCollege: ",
                }),
                new TextRun({
                  text: `${collegeName}`,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
            }),
            new Paragraph({
              spacing: {
                before: 600,
                after: 400,
                lineRule: LineRuleType.EXACT,
              },
              indent: {
                start: "0.5in",
                end: "0.5in",
              },
              children: [
                new TextRun({
                  text: "This instructional material, having undergone review from the Program IM Committee, is endorsed for:",
                }),
              ],
            }),
            new Table({
              width: {
                size: 7600,
                type: WidthType.DXA,
              },
              borders: {
                bottom: {
                  style: BorderStyle.NIL,
                },
                right: {
                  style: BorderStyle.NIL,
                },
                top: {
                  style: BorderStyle.NIL,
                },
                left: {
                  style: BorderStyle.NIL,
                },
                insideVertical: {
                  style: BorderStyle.NIL,
                },
              },
              alignment: AlignmentType.CENTER,
              columnWidths: [700, 1500, 700, 1500, 700, 2500],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new ImageRun({
                              data: distribution,
                              transformation: {
                                width: 35,
                                height: 25,
                              },
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Printing",
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new ImageRun({
                              data: distribution,
                              transformation: {
                                width: 35,
                                height: 25,
                              },
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          text: "e-Distribution",
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new ImageRun({
                              data: distribution,
                              transformation: {
                                width: 35,
                                height: 25,
                              },
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          text: "Printing & e-Distribution",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new Paragraph({
              spacing: {
                before: 800,
                lineRule: LineRuleType.EXACT,
              },
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `${coordinatorName}`,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
            }),
            new Paragraph({
              spacing: {
                after: 400,
                lineRule: LineRuleType.EXACT,
              },
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "IMD Program Coordinator",
                }),
              ],
            }),
            new Paragraph({
              spacing: {
                before: 800,
                lineRule: LineRuleType.EXACT,
              },
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `${iDDCoordinatorName}`,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
            }),
            new Paragraph({
              spacing: {
                after: 400,
                lineRule: LineRuleType.EXACT,
              },
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "IDD Coordinator",
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
