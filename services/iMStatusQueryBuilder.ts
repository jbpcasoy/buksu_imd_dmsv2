import { Prisma } from "@prisma/client";

export default function iMStatusQueryBuilder(filterStatus?: string) {
  let statusQuery: Prisma.IMWhereInput = {};
  switch (filterStatus) {
    case "IMPLEMENTATION_DRAFT":
      statusQuery = {
        AND: [
          {
            IMFile: {
              none: {
                DepartmentReview: {
                  isNot: null,
                },
              },
            },
          },
        ],
      };
      break;
    case "IMPLEMENTATION_DEPARTMENT_REVIEW":
      statusQuery = {
        AND: [
          {
            IMFile: {
              some: {
                DepartmentReview: {
                  OR: [
                    {
                      CoordinatorReview: {
                        is: null,
                      },
                    },
                    {
                      CoordinatorReview: {
                        CoordinatorSuggestion: {
                          is: null,
                        },
                      },
                    },
                    {
                      CoordinatorReview: {
                        CoordinatorSuggestion: {
                          SubmittedCoordinatorSuggestion: {
                            is: null,
                          },
                        },
                      },
                    },
                    {
                      CoordinatorReview: {
                        CoordinatorSuggestion: {
                          SubmittedCoordinatorSuggestion: {
                            DepartmentReviewed: {
                              is: null,
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      };
      break;
    case "IMPLEMENTATION_DEPARTMENT_REVIEWED":
      statusQuery = {
        AND: [
          {
            IMFile: {
              some: {
                DepartmentReview: {
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      SubmittedCoordinatorSuggestion: {
                        DepartmentReviewed: {
                          OR: [
                            {
                              DepartmentRevision: {
                                none: {}
                              }
                            },
                            {
                              DepartmentRevision: {
                                every: {
                                  AND: [
                                    {
                                      CoordinatorEndorsement: {
                                        is: null,
                                      }
                                    },
                                    {
                                      ReturnedDepartmentRevision: {
                                        SubmittedReturnedDepartmentRevision: {
                                          isNot: null,
                                        }
                                      }
                                    }
                                  ]
                                }
                              },
                            }
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      };
      break;
    case "IMPLEMENTATION_DEPARTMENT_REVISED":
      statusQuery = {
        AND: [
          {
            IMFile: {
              some: {
                DepartmentReview: {
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      SubmittedCoordinatorSuggestion: {
                        DepartmentReviewed: {
                          AND: [
                            {
                              DepartmentRevision: {
                                some: {},
                              },
                            },
                            {
                              DepartmentRevision: {
                                none: {
                                  CoordinatorEndorsement: {
                                    isNot: null,
                                  },
                                },
                              },
                            },
                            {
                              DepartmentRevision: {
                                some: {
                                  OR: [
                                    {
                                      ReturnedDepartmentRevision: {
                                        is: null
                                      }
                                    },
                                    {
                                      ReturnedDepartmentRevision: {
                                        SubmittedReturnedDepartmentRevision: {
                                          is: null,
                                        }
                                      }
                                    }
                                  ]
                                }
                              }
                            }
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      };
      break;
    case "IMPLEMENTATION_DEPARTMENT_COORDINATOR_ENDORSED":
      statusQuery = {
        AND: [
          {
            IMFile: {
              some: {
                DepartmentReview: {
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      SubmittedCoordinatorSuggestion: {
                        DepartmentReviewed: {
                          DepartmentRevision: {
                            some: {
                              CoordinatorEndorsement: {
                                DeanEndorsement: {
                                  is: null,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      };
      break;
    case "IMPLEMENTATION_DEPARTMENT_DEAN_ENDORSED":
      statusQuery = {
        AND: [
          {
            IMFile: {
              some: {
                DepartmentReview: {
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      SubmittedCoordinatorSuggestion: {
                        DepartmentReviewed: {
                          DepartmentRevision: {
                            some: {
                              CoordinatorEndorsement: {
                                DeanEndorsement: {
                                  OR: [
                                    {
                                      IDDCoordinatorSuggestion: {
                                        is: null,
                                      },
                                    },
                                    {
                                      IDDCoordinatorSuggestion: {
                                        SubmittedIDDCoordinatorSuggestion: {
                                          is: null,
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      };
      break;
    case "IMPLEMENTATION_CITL_REVIEWED":
      statusQuery = {
        AND: [
          {
            IMFile: {
              some: {
                DepartmentReview: {
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      SubmittedCoordinatorSuggestion: {
                        DepartmentReviewed: {
                          DepartmentRevision: {
                            some: {
                              CoordinatorEndorsement: {
                                DeanEndorsement: {
                                  IDDCoordinatorSuggestion: {
                                    SubmittedIDDCoordinatorSuggestion: {
                                      OR: [
                                        {
                                          CITLRevision: {
                                            none: {},
                                          },
                                        },
                                        {
                                          CITLRevision: {
                                            every: {
                                              AND: [
                                                {
                                                  IDDCoordinatorEndorsement: {
                                                    is: null,
                                                  }
                                                },
                                                {
                                                  ReturnedCITLRevision: {
                                                    SubmittedReturnedCITLRevision: {
                                                      isNot: null,
                                                    }
                                                  }
                                                }
                                              ]
                                            }
                                          }
                                        }
                                      ]
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      };
      break;
    case "IMPLEMENTATION_CITL_REVISED":
      statusQuery = {
        AND: [
          {
            IMFile: {
              some: {
                DepartmentReview: {
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      SubmittedCoordinatorSuggestion: {
                        DepartmentReviewed: {
                          DepartmentRevision: {
                            some: {
                              CoordinatorEndorsement: {
                                DeanEndorsement: {
                                  IDDCoordinatorSuggestion: {
                                    SubmittedIDDCoordinatorSuggestion: {
                                      AND: [
                                        {
                                          CITLRevision: {
                                            some: {},
                                          },
                                        },
                                        {
                                          CITLRevision: {
                                            none: {
                                              IDDCoordinatorEndorsement: {
                                                isNot: null,
                                              },
                                            },
                                          },
                                        },
                                        {
                                          CITLRevision: {
                                            some: {
                                              OR: [
                                                {
                                                  ReturnedCITLRevision: {
                                                    is: null,
                                                  }
                                                },
                                                {
                                                  ReturnedCITLRevision: {
                                                    SubmittedReturnedCITLRevision: {
                                                      is: null,
                                                    }
                                                  }
                                                }
                                              ]
                                            }
                                          }
                                        }
                                      ],
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      };
      break;
    case "IMPLEMENTATION_CITL_IDD_COORDINATOR_ENDORSED":
      statusQuery = {
        AND: [
          {
            IMFile: {
              some: {
                DepartmentReview: {
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      SubmittedCoordinatorSuggestion: {
                        DepartmentReviewed: {
                          DepartmentRevision: {
                            some: {
                              CoordinatorEndorsement: {
                                DeanEndorsement: {
                                  IDDCoordinatorSuggestion: {
                                    SubmittedIDDCoordinatorSuggestion: {
                                      CITLRevision: {
                                        some: {
                                          IDDCoordinatorEndorsement: {
                                            CITLDirectorEndorsement: {
                                              is: null,
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      };
      break;
    case "IMPLEMENTATION_CITL_DIRECTOR_ENDORSED":
      statusQuery = {
        AND: [
          {
            IMFile: {
              some: {
                DepartmentReview: {
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      SubmittedCoordinatorSuggestion: {
                        DepartmentReviewed: {
                          DepartmentRevision: {
                            some: {
                              CoordinatorEndorsement: {
                                DeanEndorsement: {
                                  IDDCoordinatorSuggestion: {
                                    SubmittedIDDCoordinatorSuggestion: {
                                      CITLRevision: {
                                        some: {
                                          IDDCoordinatorEndorsement: {
                                            CITLDirectorEndorsement: {
                                              OR: [
                                                {
                                                  QAMISSuggestion: {
                                                    is: null,
                                                  },
                                                },
                                                {
                                                  QAMISSuggestion: {
                                                    SubmittedQAMISSuggestion: {
                                                      is: null,
                                                    },
                                                  },
                                                },
                                              ],
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      };
      break;
    case "IMERC_QAMIS_REVISED":
      statusQuery = {
        AND: [
          {
            IMFile: {
              some: {
                DepartmentReview: {
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      SubmittedCoordinatorSuggestion: {
                        DepartmentReviewed: {
                          DepartmentRevision: {
                            some: {
                              CoordinatorEndorsement: {
                                DeanEndorsement: {
                                  IDDCoordinatorSuggestion: {
                                    SubmittedIDDCoordinatorSuggestion: {
                                      CITLRevision: {
                                        some: {
                                          IDDCoordinatorEndorsement: {
                                            CITLDirectorEndorsement: {
                                              QAMISSuggestion: {
                                                SubmittedQAMISSuggestion: {
                                                  QAMISRevision: {
                                                    OR: [
                                                      {
                                                        QAMISDeanEndorsement: {
                                                          is: null,
                                                        },
                                                      },
                                                      {
                                                        QAMISDeanEndorsement: {
                                                          QAMISDepartmentEndorsement:
                                                          {
                                                            is: null,
                                                          },
                                                        },
                                                      },
                                                    ],
                                                  },
                                                },
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      };
      break;
    case "IMERC_QAMIS_DEPARTMENT_ENDORSED":
      statusQuery = {
        AND: [
          {
            IMFile: {
              some: {
                DepartmentReview: {
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      SubmittedCoordinatorSuggestion: {
                        DepartmentReviewed: {
                          DepartmentRevision: {
                            some: {
                              CoordinatorEndorsement: {
                                DeanEndorsement: {
                                  IDDCoordinatorSuggestion: {
                                    SubmittedIDDCoordinatorSuggestion: {
                                      CITLRevision: {
                                        some: {
                                          IDDCoordinatorEndorsement: {
                                            CITLDirectorEndorsement: {
                                              QAMISSuggestion: {
                                                SubmittedQAMISSuggestion: {
                                                  QAMISRevision: {
                                                    QAMISDeanEndorsement: {
                                                      QAMISDepartmentEndorsement:
                                                      {
                                                        OR: [
                                                          {
                                                            ContentEditorReview:
                                                            {
                                                              is: null,
                                                            },
                                                          },
                                                          {
                                                            ContentEditorReview:
                                                            {
                                                              ContentEditorSuggestion:
                                                              {
                                                                is: null,
                                                              },
                                                            },
                                                          },
                                                          {
                                                            ContentEditorReview:
                                                            {
                                                              ContentEditorSuggestion:
                                                              {
                                                                SubmittedContentEditorSuggestion:
                                                                {
                                                                  is: null,
                                                                },
                                                              },
                                                            },
                                                          },
                                                          {
                                                            ContentEditorReview:
                                                            {
                                                              ContentEditorSuggestion:
                                                              {
                                                                SubmittedContentEditorSuggestion:
                                                                {
                                                                  IMERCCITLReviewed:
                                                                  {
                                                                    is: null,
                                                                  },
                                                                },
                                                              },
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      };
      break;
    case "IMERC_CITL_REVIEWED":
      statusQuery = {
        AND: [
          {
            IMFile: {
              some: {
                DepartmentReview: {
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      SubmittedCoordinatorSuggestion: {
                        DepartmentReviewed: {
                          DepartmentRevision: {
                            some: {
                              CoordinatorEndorsement: {
                                DeanEndorsement: {
                                  IDDCoordinatorSuggestion: {
                                    SubmittedIDDCoordinatorSuggestion: {
                                      CITLRevision: {
                                        some: {
                                          IDDCoordinatorEndorsement: {
                                            CITLDirectorEndorsement: {
                                              QAMISSuggestion: {
                                                SubmittedQAMISSuggestion: {
                                                  QAMISRevision: {
                                                    QAMISDeanEndorsement: {
                                                      QAMISDepartmentEndorsement:
                                                      {
                                                        ContentEditorReview: {
                                                          ContentEditorSuggestion:
                                                          {
                                                            SubmittedContentEditorSuggestion:
                                                            {
                                                              IMERCCITLReviewed:
                                                              {
                                                                OR: [
                                                                  {
                                                                    IMERCCITLRevision:
                                                                    {
                                                                      none: {},
                                                                    },
                                                                  },
                                                                  {
                                                                    IMERCCITLRevision: {
                                                                      every: {
                                                                        AND: [
                                                                          {
                                                                            IMERCIDDCoordinatorEndorsement: {
                                                                              is: null
                                                                            }
                                                                          },
                                                                          {
                                                                            ReturnedIMERCCITLRevision: {
                                                                              SubmittedReturnedIMERCCITLRevision: {
                                                                                isNot: null
                                                                              }
                                                                            }
                                                                          }]
                                                                      }
                                                                    }
                                                                  }
                                                                ]
                                                              },
                                                            },
                                                          },
                                                        },
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      };
      break;
    case "IMERC_CITL_REVISED":
      statusQuery = {
        AND: [
          {
            IMFile: {
              some: {
                DepartmentReview: {
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      SubmittedCoordinatorSuggestion: {
                        DepartmentReviewed: {
                          DepartmentRevision: {
                            some: {
                              CoordinatorEndorsement: {
                                DeanEndorsement: {
                                  IDDCoordinatorSuggestion: {
                                    SubmittedIDDCoordinatorSuggestion: {
                                      CITLRevision: {
                                        some: {
                                          IDDCoordinatorEndorsement: {
                                            CITLDirectorEndorsement: {
                                              QAMISSuggestion: {
                                                SubmittedQAMISSuggestion: {
                                                  QAMISRevision: {
                                                    QAMISDeanEndorsement: {
                                                      QAMISDepartmentEndorsement:
                                                      {
                                                        ContentEditorReview: {
                                                          ContentEditorSuggestion:
                                                          {
                                                            SubmittedContentEditorSuggestion:
                                                            {
                                                              IMERCCITLReviewed:
                                                              {
                                                                AND: [
                                                                  {
                                                                    IMERCCITLRevision:
                                                                    {
                                                                      some: {},
                                                                    },
                                                                  },
                                                                  {
                                                                    IMERCCITLRevision:
                                                                    {
                                                                      none: {
                                                                        IMERCIDDCoordinatorEndorsement:
                                                                        {
                                                                          isNot: null,
                                                                        },
                                                                      },
                                                                    },
                                                                  },

                                                                  {
                                                                    IMERCCITLRevision:
                                                                    {
                                                                      some: {
                                                                        OR: [
                                                                          {
                                                                            ReturnedIMERCCITLRevision:
                                                                            {
                                                                              is: null,
                                                                            },
                                                                          },
                                                                          {
                                                                            ReturnedIMERCCITLRevision: {
                                                                              SubmittedReturnedIMERCCITLRevision: {
                                                                                is: null,
                                                                              }
                                                                            }
                                                                          }
                                                                        ]
                                                                      },
                                                                    },
                                                                  },
                                                                ],
                                                              },
                                                            },
                                                          },
                                                        },
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      };
      break;
    case "IMERC_CITL_IDD_COORDINATOR_ENDORSED":
      statusQuery = {
        AND: [
          {
            IMFile: {
              some: {
                DepartmentReview: {
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      SubmittedCoordinatorSuggestion: {
                        DepartmentReviewed: {
                          DepartmentRevision: {
                            some: {
                              CoordinatorEndorsement: {
                                DeanEndorsement: {
                                  IDDCoordinatorSuggestion: {
                                    SubmittedIDDCoordinatorSuggestion: {
                                      CITLRevision: {
                                        some: {
                                          IDDCoordinatorEndorsement: {
                                            CITLDirectorEndorsement: {
                                              QAMISSuggestion: {
                                                SubmittedQAMISSuggestion: {
                                                  QAMISRevision: {
                                                    QAMISDeanEndorsement: {
                                                      QAMISDepartmentEndorsement:
                                                      {
                                                        ContentEditorReview: {
                                                          ContentEditorSuggestion:
                                                          {
                                                            SubmittedContentEditorSuggestion:
                                                            {
                                                              IMERCCITLReviewed:
                                                              {
                                                                IMERCCITLRevision:
                                                                {
                                                                  some: {
                                                                    IMERCIDDCoordinatorEndorsement:
                                                                    {
                                                                      IMERCCITLDirectorEndorsement:
                                                                      {
                                                                        is: null,
                                                                      },
                                                                    },
                                                                  },
                                                                },
                                                              },
                                                            },
                                                          },
                                                        },
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      };
      break;
    case "IMERC_CITL_DIRECTOR_ENDORSED":
      statusQuery = {
        AND: [
          {
            IMFile: {
              some: {
                DepartmentReview: {
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      SubmittedCoordinatorSuggestion: {
                        DepartmentReviewed: {
                          DepartmentRevision: {
                            some: {
                              CoordinatorEndorsement: {
                                DeanEndorsement: {
                                  IDDCoordinatorSuggestion: {
                                    SubmittedIDDCoordinatorSuggestion: {
                                      CITLRevision: {
                                        some: {
                                          IDDCoordinatorEndorsement: {
                                            CITLDirectorEndorsement: {
                                              QAMISSuggestion: {
                                                SubmittedQAMISSuggestion: {
                                                  QAMISRevision: {
                                                    QAMISDeanEndorsement: {
                                                      QAMISDepartmentEndorsement:
                                                      {
                                                        ContentEditorReview: {
                                                          ContentEditorSuggestion:
                                                          {
                                                            SubmittedContentEditorSuggestion:
                                                            {
                                                              IMERCCITLReviewed:
                                                              {
                                                                IMERCCITLRevision:
                                                                {
                                                                  some: {
                                                                    IMERCIDDCoordinatorEndorsement:
                                                                    {
                                                                      IMERCCITLDirectorEndorsement:
                                                                      {
                                                                        isNot:
                                                                          null,
                                                                      },
                                                                    },
                                                                  },
                                                                },
                                                              },
                                                            },
                                                          },
                                                        },
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      };
      break;
    default:
      statusQuery = {};
  }
  return statusQuery;
}
