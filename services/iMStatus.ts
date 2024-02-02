import prisma from "@/prisma/client";

export default async function iMStatus(id: string) {
  const departmentReview = await prisma.departmentReview.findFirst({
    where: {
      IMFile: {
        IM: {
          id: {
            equals: id,
          },
        },
      },
    },
  });

  const departmentReviewed = await prisma.departmentReviewed.findFirst({
    where: {
      AND: [
        {
          SubmittedCoordinatorSuggestion: {
            CoordinatorSuggestion: {
              CoordinatorReview: {
                DepartmentReview: {
                  IMFile: {
                    IM: {
                      id: {
                        equals: id,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });

  const departmentRevision = await prisma.departmentRevision.findFirst({
    where: {
      AND: [
        {
          IMFile: {
            IM: {
              id: {
                equals: id,
              },
            },
          },
        },
      ],
    },
  });

  const submittedReturnedDepartmentRevision =
    await prisma.submittedReturnedDepartmentRevision.findFirst({
      where: {
        ReturnedDepartmentRevision: {
          DepartmentRevision: {
            IMFile: {
              IM: {
                id: {
                  equals: id,
                },
              },
            },
          },
        },
      },
    });

  const coordinatorEndorsement = await prisma.coordinatorEndorsement.findFirst({
    where: {
      DepartmentRevision: {
        IMFile: {
          IM: {
            id: {
              equals: id,
            },
          },
        },
      },
    },
  });

  const deanEndorsement = await prisma.deanEndorsement.findFirst({
    where: {
      CoordinatorEndorsement: {
        DepartmentRevision: {
          IMFile: {
            IM: {
              id: {
                equals: id,
              },
            },
          },
        },
      },
    },
  });

  const submittedIDDCoordinatorSuggestion =
    await prisma.submittedIDDCoordinatorSuggestion.findFirst({
      where: {
        IDDCoordinatorSuggestion: {
          DeanEndorsement: {
            CoordinatorEndorsement: {
              DepartmentRevision: {
                IMFile: {
                  IM: {
                    id: {
                      equals: id,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

  const cITLRevision = await prisma.cITLRevision.findFirst({
    where: {
      AND: [
        {
          IMFile: {
            IM: {
              id: {
                equals: id,
              },
            },
          },
        },
      ],
    },
  });

  const submittedReturnedCITLRevision =
    await prisma.submittedReturnedCITLRevision.findFirst({
      where: {
        ReturnedCITLRevision: {
          CITLRevision: {
            IMFile: {
              IM: {
                id: {
                  equals: id,
                },
              },
            },
          },
        },
      },
    });

  const iDDCoordinatorEndorsement =
    await prisma.iDDCoordinatorEndorsement.findFirst({
      where: {
        CITLRevision: {
          IMFile: {
            IM: {
              id: {
                equals: id,
              },
            },
          },
        },
      },
    });

  const cITLDirectorEndorsement =
    await prisma.cITLDirectorEndorsement.findFirst({
      where: {
        IDDCoordinatorEndorsement: {
          CITLRevision: {
            IMFile: {
              IM: {
                id: {
                  equals: id,
                },
              },
            },
          },
        },
      },
    });

  const qAMISRevision = await prisma.qAMISRevision.findFirst({
    where: {
      SubmittedQAMISSuggestion: {
        QAMISSuggestion: {
          CITLDirectorEndorsement: {
            IDDCoordinatorEndorsement: {
              CITLRevision: {
                IMFile: {
                  IM: {
                    id: {
                      equals: id,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const qAMISDepartmentEndorsement =
    await prisma.qAMISDepartmentEndorsement.findFirst({
      where: {
        AND: [
          {
            QAMISDeanEndorsement: {
              QAMISRevision: {
                IMFile: {
                  IM: {
                    id: {
                      equals: id,
                    },
                  },
                },
              },
            },
          },
        ],
      },
    });

  const iMERCCITLReviewed = await prisma.iMERCCITLReviewed.findFirst({
    where: {
      AND: [
        {
          SubmittedContentEditorSuggestion: {
            ContentEditorSuggestion: {
              ContentEditorReview: {
                QAMISDepartmentEndorsement: {
                  QAMISDeanEndorsement: {
                    QAMISRevision: {
                      IMFile: {
                        IM: {
                          id: {
                            equals: id,
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
    },
  });

  const iMERCCITLRevision = await prisma.iMERCCITLRevision.findFirst({
    where: {
      IMFile: {
        IM: {
          id: { equals: id },
        },
      },
    },
  });

  const submittedReturnedIMERCCITLRevision =
    await prisma.submittedReturnedIMERCCITLRevision.findFirst({
      where: {
        ReturnedIMERCCITLRevision: {
          IMERCCITLRevision: {
            IMFile: {
              IM: {
                id: {
                  equals: id,
                },
              },
            },
          },
        },
      },
    });

  const iMERCIDDCoordinatorEndorsement =
    await prisma.iMERCIDDCoordinatorEndorsement.findFirst({
      where: {
        IMERCCITLRevision: {
          IMFile: {
            IM: {
              id: {
                equals: id,
              },
            },
          },
        },
      },
    });

  const iMERCCITLDirectorEndorsement =
    await prisma.iMERCCITLDirectorEndorsement.findFirst({
      where: {
        IMERCIDDCoordinatorEndorsement: {
          IMERCCITLRevision: {
            IMFile: {
              IM: {
                id: {
                  equals: id,
                },
              },
            },
          },
        },
      },
    });

  if (iMERCCITLDirectorEndorsement) {
    return "IMERC_CITL_DIRECTOR_ENDORSED";
  } else if (iMERCIDDCoordinatorEndorsement) {
    return "IMERC_CITL_IDD_COORDINATOR_ENDORSED";
  } else if (submittedReturnedIMERCCITLRevision) {
    return "IMERC_CITL_RETURNED_REVISION";
  } else if (iMERCCITLRevision) {
    return "IMERC_CITL_REVISED";
  } else if (iMERCCITLReviewed) {
    return "IMERC_CITL_REVIEWED";
  } else if (qAMISDepartmentEndorsement) {
    return "IMERC_QAMIS_DEPARTMENT_ENDORSED";
  } else if (qAMISRevision) {
    return "IMERC_QAMIS_REVISED";
  } else if (cITLDirectorEndorsement) {
    return "IMPLEMENTATION_CITL_DIRECTOR_ENDORSED";
  } else if (iDDCoordinatorEndorsement) {
    return "IMPLEMENTATION_CITL_IDD_COORDINATOR_ENDORSED";
  } else if (submittedReturnedCITLRevision) {
    return "IMPLEMENTATION_CITL_RETURNED_REVISION";
  } else if (cITLRevision) {
    return "IMPLEMENTATION_CITL_REVISED";
  } else if (submittedIDDCoordinatorSuggestion) {
    return "IMPLEMENTATION_CITL_REVIEWED";
  } else if (deanEndorsement) {
    return "IMPLEMENTATION_DEPARTMENT_DEAN_ENDORSED";
  } else if (coordinatorEndorsement) {
    return "IMPLEMENTATION_DEPARTMENT_COORDINATOR_ENDORSED";
  } else if (submittedReturnedDepartmentRevision) {
    return "IMPLEMENTATION_DEPARTMENT_RETURNED_REVISION";
  } else if (departmentRevision) {
    return "IMPLEMENTATION_DEPARTMENT_REVISED";
  } else if (departmentReviewed) {
    return "IMPLEMENTATION_DEPARTMENT_REVIEWED";
  } else if (departmentReview) {
    return "IMPLEMENTATION_DEPARTMENT_REVIEW";
  } else {
    return "IMPLEMENTATION_DRAFT";
  }
}
