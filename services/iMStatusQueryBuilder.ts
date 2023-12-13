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
                  isNot: null,
                },
              },
            },
          },
          {
            IMFile: {
              none: {
                DepartmentReview: {
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      SubmittedCoordinatorSuggestion: {
                        DepartmentReviewed: {
                          isNot: null,
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
                          isNot: null,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          {
            IMFile: {
              none: {
                DepartmentReview: {
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      SubmittedCoordinatorSuggestion: {
                        DepartmentReviewed: {
                          DepartmentRevision: {
                            some: {},
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
                          DepartmentRevision: {
                            some: {},
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          {
            IMFile: {
              none: {
                DepartmentReview: {
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      SubmittedCoordinatorSuggestion: {
                        DepartmentReviewed: {
                          DepartmentRevision: {
                            some: {
                              CoordinatorEndorsement: {
                                isNot: null,
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
                                isNot: null,
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
          {
            IMFile: {
              none: {
                DepartmentReview: {
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      SubmittedCoordinatorSuggestion: {
                        DepartmentReviewed: {
                          DepartmentRevision: {
                            some: {
                              CoordinatorEndorsement: {
                                DeanEndorsement: {
                                  isNot: null,
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
                                  isNot: null,
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
          {
            IMFile: {
              none: {
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
                                      isNot: null,
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
                                      isNot: null,
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
          {
            IMFile: {
              none: {
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
                                        some: {},
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
                                      CITLRevision: {
                                        some: {},
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
          {
            IMFile: {
              none: {
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
                                            isNot: null,
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
                                            isNot: null,
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
          {
            IMFile: {
              none: {
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
                                              isNot: null,
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
                                              isNot: null,
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
          {
            IMFile: {
              none: {
                QAMISRevision: {
                  isNot: null,
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
                QAMISRevision: {
                  isNot: null,
                },
              },
            },
          },
          {
            IMFile: {
              none: {
                QAMISRevision: {
                  QAMISDeanEndorsement: {
                    QAMISDepartmentEndorsement: {
                      isNot: null,
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
                QAMISRevision: {
                  QAMISDeanEndorsement: {
                    QAMISDepartmentEndorsement: {
                      isNot: null,
                    },
                  },
                },
              },
            },
          },
          {
            IMFile: {
              none: {
                QAMISRevision: {
                  QAMISDeanEndorsement: {
                    QAMISDepartmentEndorsement: {
                      ContentEditorReview: {
                        ContentEditorSuggestion: {
                          SubmittedContentEditorSuggestion: {
                            IMERCCITLReviewed: {
                              isNot: null,
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
                QAMISRevision: {
                  QAMISDeanEndorsement: {
                    QAMISDepartmentEndorsement: {
                      ContentEditorReview: {
                        ContentEditorSuggestion: {
                          SubmittedContentEditorSuggestion: {
                            IMERCCITLReviewed: {
                              isNot: null,
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
          {
            IMFile: {
              none: {
                QAMISRevision: {
                  QAMISDeanEndorsement: {
                    QAMISDepartmentEndorsement: {
                      ContentEditorReview: {
                        ContentEditorSuggestion: {
                          SubmittedContentEditorSuggestion: {
                            IMERCCITLReviewed: {
                              IMERCCITLRevision: {
                                some: {},
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
                QAMISRevision: {
                  QAMISDeanEndorsement: {
                    QAMISDepartmentEndorsement: {
                      ContentEditorReview: {
                        ContentEditorSuggestion: {
                          SubmittedContentEditorSuggestion: {
                            IMERCCITLReviewed: {
                              IMERCCITLRevision: {
                                some: {},
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
          {
            IMFile: {
              none: {
                QAMISRevision: {
                  QAMISDeanEndorsement: {
                    QAMISDepartmentEndorsement: {
                      ContentEditorReview: {
                        ContentEditorSuggestion: {
                          SubmittedContentEditorSuggestion: {
                            IMERCCITLReviewed: {
                              IMERCCITLRevision: {
                                some: {
                                  IMERCIDDCoordinatorEndorsement: {
                                    isNot: null,
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
                QAMISRevision: {
                  QAMISDeanEndorsement: {
                    QAMISDepartmentEndorsement: {
                      ContentEditorReview: {
                        ContentEditorSuggestion: {
                          SubmittedContentEditorSuggestion: {
                            IMERCCITLReviewed: {
                              IMERCCITLRevision: {
                                some: {
                                  IMERCIDDCoordinatorEndorsement: {
                                    isNot: null,
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
          {
            IMFile: {
              none: {
                QAMISRevision: {
                  QAMISDeanEndorsement: {
                    QAMISDepartmentEndorsement: {
                      ContentEditorReview: {
                        ContentEditorSuggestion: {
                          SubmittedContentEditorSuggestion: {
                            IMERCCITLReviewed: {
                              IMERCCITLRevision: {
                                some: {
                                  IMERCIDDCoordinatorEndorsement: {
                                    IMERCCITLDirectorEndorsement: {
                                      isNot: null,
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
                QAMISRevision: {
                  QAMISDeanEndorsement: {
                    QAMISDepartmentEndorsement: {
                      ContentEditorReview: {
                        ContentEditorSuggestion: {
                          SubmittedContentEditorSuggestion: {
                            IMERCCITLReviewed: {
                              IMERCCITLRevision: {
                                some: {
                                  IMERCIDDCoordinatorEndorsement: {
                                    IMERCCITLDirectorEndorsement: {
                                      isNot: null,
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
