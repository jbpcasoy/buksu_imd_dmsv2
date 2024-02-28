// Simple example to add text to a document

import BuksuLogo from "@/public/images/buksu-logo-min-512x512.png";
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
import fs from "fs";
import { useEffect, useState } from "react";

export default function TestPage() {
  return (
    <div>
      <SuggestionActionTaken
        cITLDirectorName="Cecille Marie T. Improgo"
        cITLReview={[
          {
            actionTaken:
              "CITL This is a ver long content to test the rendering of documents",
            pageNumber: 0,
            remarks:
              "CITL This is a ver long content to test the rendering of documents",
            suggestion:
              "CITL This is a ver long content to test the rendering of documents",
          },
        ]}
        coordinatorName="Glenmark T. Artiaga"
        iDDCoordinatorName="Ayris Prill C. Gorra"
        programReview={[
          {
            actionTaken:
              "Program This is a ver long content to test the rendering of documents",
            pageNumber: 0,
            remarks:
              "Program This is a ver long content to test the rendering of documents",
            suggestion:
              "Program This is a ver long content to test the rendering of documents",
          },
        ]}
        vPAAName="Hazel Jean M. Abeuela"
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

interface SuggestionActionTakenProps {
  programReview: Suggestion[];
  coordinatorName: string;
  cITLReview: Suggestion[];
  iDDCoordinatorName: string;
  cITLDirectorName: string;
  vPAAName: string;
}

function SuggestionActionTaken({
  cITLDirectorName,
  coordinatorName,
  cITLReview,
  iDDCoordinatorName,
  programReview,
  vPAAName,
}: SuggestionActionTakenProps) {
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

    const programReviewRows = programReview.map(
      (review) =>
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph(review.suggestion)],
            }),
            new TableCell({
              children: [new Paragraph(review.actionTaken)],
            }),
            new TableCell({
              children: [new Paragraph(review.pageNumber.toString())],
            }),
            new TableCell({
              children: [new Paragraph(review.remarks)],
            }),
          ],
        })
    );

    const programReviewTable = new Table({
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
                  text: "Section",
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
                  text: "Page Number",
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
        ...programReviewRows,
      ],
    });

    const cITLReviewRows = cITLReview.map(
      (review) =>
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph(review.suggestion)],
            }),
            new TableCell({
              children: [new Paragraph(review.actionTaken)],
            }),
            new TableCell({
              children: [new Paragraph(review.pageNumber.toString())],
            }),
            new TableCell({
              children: [new Paragraph(review.remarks)],
            }),
          ],
        })
    );

    const cITLReviewTable = new Table({
      alignment: AlignmentType.CENTER,
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
                  text: "Section",
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
                  text: "Page Number",
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
        ...cITLReviewRows,
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
                          children: ["Document Code: CITL-F-003"],
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
                          children: ["Issue Date: December 7, 2020"],
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
          text: "Tel (088) 813-5661 to 5663; TeleFax (088) 813-2717,",
          alignment: AlignmentType.CENTER,
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
        }),
        new Paragraph({
          run: {
            size: "5pt",
          },
          border: {
            bottom: {
              style: BorderStyle.SINGLE,
              size: 1,
            },
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
              text: "Suggestions and Action Taken",
              alignment: AlignmentType.CENTER,
              spacing: {
                before: 200,
                after: 200,
                lineRule: LineRuleType.EXACT,
              },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Part A. Program Review",
                  bold: true,
                }),
              ],
            }),
            programReviewTable,
            new Paragraph({
              indent: {
                firstLine: "1in",
              },
              children: [
                new TextRun({
                  text: "Add Rows as necessary.",
                  italics: true,
                }),
              ],
            }),
            new Paragraph({
              indent: {
                firstLine: "0.5in",
              },
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
              indent: {
                firstLine: "0.5in",
              },
              spacing: {
                after: 200,
                lineRule: LineRuleType.EXACT,
              },
              children: [
                new TextRun({
                  text: "                       Program IM Coordinator",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Part B. CITL Review",
                  bold: true,
                }),
              ],
            }),
            cITLReviewTable,
            new Paragraph({
              indent: {
                firstLine: "1in",
              },
              children: [
                new TextRun({
                  text: "Add Rows as necessary.",
                  italics: true,
                }),
              ],
            }),
            new Paragraph({
              indent: {
                firstLine: "0.5in",
              },
              spacing: {
                before: 400,
                lineRule: LineRuleType.EXACT,
              },
              children: [
                new TextRun({
                  text: `Reviewed by: `,
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
              indent: {
                firstLine: "0.5in",
              },
              spacing: {
                after: 400,
                lineRule: LineRuleType.EXACT,
              },
              children: [
                new TextRun({
                  text: "                       IDD Coordinator",
                }),
              ],
            }),

            new Paragraph({
              indent: {
                firstLine: "0.5in",
              },
              spacing: {
                before: 400,
                lineRule: LineRuleType.EXACT,
              },
              children: [
                new TextRun({
                  text: `                       `,
                }),
                new TextRun({
                  text: `${cITLDirectorName}`,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
            }),
            new Paragraph({
              indent: {
                firstLine: "0.5in",
              },
              spacing: {
                after: 400,
                lineRule: LineRuleType.EXACT,
              },
              children: [
                new TextRun({
                  text: "                       CITL Director",
                }),
              ],
            }),
            new Paragraph({
              indent: {
                firstLine: "0.5in",
              },
              spacing: {
                before: 400,
                lineRule: LineRuleType.EXACT,
              },
              children: [
                new TextRun({
                  text: `                       `,
                }),
                new TextRun({
                  text: `${vPAAName}`,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
            }),
            new Paragraph({
              indent: {
                firstLine: "0.5in",
              },
              spacing: {
                after: 400,
                lineRule: LineRuleType.EXACT,
              },
              children: [
                new TextRun({
                  text: "                       VPAA",
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
