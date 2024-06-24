// Simple example to add text to a document

import { F015Props } from "@/types/forms";
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
} from "docx";
import saveAs from "file-saver";
import { useEffect, useState } from "react";
import { FormButton } from "./FormButton";

export default function F015({
  coordinatorName,
  iMERCReview,
  iDDCoordinatorName,
  qAMISReview,
  authorName,
  iMTitle,
  programName,
}: F015Props) {
  const [buksuLogo, setBuksuLogo] = useState<ArrayBuffer>();
  const [citlLogo, setCitlLogo] = useState<ArrayBuffer>();
  const [educateInnovateLead, setEducateInnovateLead] = useState<ArrayBuffer>();

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

  function download() {
    if (!buksuLogo || !citlLogo || !educateInnovateLead) {
      return;
    }

    const qAMISReviewRows = qAMISReview.map((review, index) => {
      return new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: String(index + 1),
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: review.suggestion,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: review.pageNumber.toString(),
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: review.actionTaken,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: review.pageNumber.toString(),
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: review.remarks,
              }),
            ],
          }),
        ],
      });
    });

    const qAMISReviewTable = new Table({
      width: {
        size: 10450,
        type: WidthType.DXA,
      },
      columnWidths: [300, 2030, 2030, 2030, 2030, 2030],
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: "",
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "Suggestions",
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "IM Part & Page No.",
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "Action Taken",
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "IM Part & Page No.",
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "Remarks",
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
          ],
        }),
        ...qAMISReviewRows,
      ],
    });

    const iMERCReviewRows = iMERCReview.map((review, index) => {
      return new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: String(index + 1),
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: review.suggestion,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: review.pageNumber.toString(),
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: review.actionTaken,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: review.pageNumber.toString(),
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: review.remarks,
              }),
            ],
          }),
        ],
      });
    });

    const iMERCReviewTable = new Table({
      width: {
        size: 10450,
        type: WidthType.DXA,
      },
      columnWidths: [300, 2030, 2030, 2030, 2030, 2030],
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: "",
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "Suggestions",
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "IM Part & Page No.",
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "Action Taken",
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "IM Part & Page No.",
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "Remarks",
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
          ],
        }),
        ...iMERCReviewRows,
      ],
    });

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
                          children: ["Document Code: CITL-F-015"],
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
                          children: ["Revision No.: 00"],
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
              text: "Suggestions and Actions Taken on IM Evaluation from IMERC",
              alignment: AlignmentType.CENTER,
              spacing: {
                before: 200,
                lineRule: LineRuleType.EXACT,
              },
            }),
            new Paragraph({
              text: "(for IPTTU Endorsement)",
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 400,
                lineRule: LineRuleType.EXACT,
              },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Title of IM:",
                }),
                new TextRun({
                  text:
                    iMTitle +
                    "                                                                                                                  ",
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
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
                  style: BorderStyle.NIL,
                },
                left: {
                  style: BorderStyle.NIL,
                },
                right: {
                  style: BorderStyle.NIL,
                },
                top: {
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
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Program: ",
                            }),
                            new TextRun({
                              text: programName + "          ",
                              underline: {
                                type: UnderlineType.SINGLE,
                              },
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Author: ",
                            }),
                            new TextRun({
                              text: authorName + "          ",
                              underline: {
                                type: UnderlineType.SINGLE,
                              },
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
              spacing: {
                before: 200,
                lineRule: LineRuleType.EXACT,
              },
              children: [
                new TextRun({
                  text: "A. QAMIS (Student and Teacher-Users)",
                }),
              ],
            }),
            qAMISReviewTable,
            new Paragraph({
              children: [
                new TextRun({
                  text: "*Add Rows as necessary.",
                  italics: true,
                }),
                new PageBreak(),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "B. IMERC",
                }),
              ],
            }),
            iMERCReviewTable,
            new Paragraph({
              children: [
                new TextRun({
                  text: "*Add Rows as necessary.",
                  italics: true,
                }),
              ],
            }),
            new Paragraph({
              spacing: {
                before: 400,
                lineRule: LineRuleType.EXACT,
              },
              children: [
                new TextRun({
                  text: `Prepared by: `,
                }),
                new TextRun({
                  text: `${authorName}`,
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
              children: [
                new TextRun({
                  text: "                      Author's Signature Over Printed Name",
                }),
              ],
            }),
            new Paragraph({
              spacing: {
                before: 400,
                lineRule: LineRuleType.EXACT,
              },
              children: [
                new TextRun({
                  text: `Reviewed by: `,
                }),
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
              children: [
                new TextRun({
                  text: "                       IMD Program Coordinator",
                }),
              ],
            }),
            new Paragraph({
              spacing: {
                before: 400,
                lineRule: LineRuleType.EXACT,
              },
              children: [
                new TextRun({
                  text: `Noted by: `,
                }),
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
              children: [
                new TextRun({
                  text: "                 IDD Coordinator",
                }),
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      // saveAs from FileSaver will download the file
      saveAs(blob, `${iMTitle}_F015.docx`);
    });
  }

  return (
    <div>
      <FormButton label="F015" secondaryLabel="Suggestions and Actions Taken on IM Evaluation from IMERC (for
        IPTTU Endorsement)" onClick={download} />
    </div>
  );
}
