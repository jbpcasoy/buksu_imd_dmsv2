import Confirmation from "@/components/Confirmation";
import FileUpload from "@/components/FileUpload";
import IMChairpersonSuggestionItems from "@/components/IMChairpersonSuggestionItems";
import IMContentEditorSuggestionItems from "@/components/IMContentEditorSuggestionItems";
import IMContentSpecialistSuggestionItems from "@/components/IMContentSpecialistSuggestionItems";
import IMCoordinatorSuggestionItems from "@/components/IMCoordinatorSuggestionItems";
import IMIDDCoordinatorSuggestionItems from "@/components/IMIDDCoordinatorSuggestionItems";
import IMIDDSpecialistSuggestionItems from "@/components/IMIDDSpecialistSuggestionItems";
import IMPeerSuggestionItems from "@/components/IMPeerSuggestionItems";
import IMQAMISSuggestionItems from "@/components/IMQAMISSuggestionItems";
import IMReturnedCITLRevisionSuggestionItems from "@/components/IMReturnedCITLRevisionSuggestionItems";
import IMReturnedDepartmentRevisionSuggestionItems from "@/components/IMReturnedDepartmentRevisionSuggestionItems";
import IMReturnedIMERCCITLRevisionSuggestionItems from "@/components/IMReturnedIMERCCITLRevisionSuggestionItems";
import Loading from "@/components/Loading";
import MainLayout from "@/components/MainLayout";
import Modal from "@/components/Modal";
import { SnackbarContext } from "@/components/SnackbarProvider";
import useActiveCITLDirectorMe from "@/hooks/useActiveCITLDirectorMe";
import useActiveChairpersonMe from "@/hooks/useActiveChairpersonMe";
import useActiveContentSpecialistMe from "@/hooks/useActiveContentSpecialistMe";
import useActiveCoordinatorMe from "@/hooks/useActiveCoordinatorMe";
import useActiveDeanMe from "@/hooks/useActiveDeanMe";
import useActiveFacultyMe from "@/hooks/useActiveFacultyMe";
import useActiveIDDCoordinatorMe from "@/hooks/useActiveIDDCoordinatorMe";
import useCITLDirectorEndorsement from "@/hooks/useCITLDirectorEndorsement";
import useCITLDirectorEndorsementIM from "@/hooks/useCITLDirectorEndorsementIM";
import useChairpersonReviewIM from "@/hooks/useChairpersonReviewIM";
import useCollegeIM from "@/hooks/useCollegeIM";
import useContentEditorReviewIM from "@/hooks/useContentEditorReviewIM";
import useContentSpecialistReviewIM from "@/hooks/useContentSpecialistReviewIM";
import useCoordinatorEndorsementIM from "@/hooks/useCoordinatorEndorsementIM";
import useCoordinatorReviewIM from "@/hooks/useCoordinatorReviewIM";
import useDeanEndorsementIM from "@/hooks/useDeanEndorsementIM";
import useDepartmentIM from "@/hooks/useDepartmentIM";
import useIDDCoordinatorEndorsementIM from "@/hooks/useIDDCoordinatorEndorsementIM";
import useIDDSpecialistReviewIM from "@/hooks/useIDDSpecialistReviewIM";
import useIM from "@/hooks/useIM";
import useIMERCCITLDirectorEndorsementIM from "@/hooks/useIMERCCITLDirectorEndorsementIM";
import useIMERCIDDCoordinatorEndorsementIM from "@/hooks/useIMERCIDDCoordinatorEndorsementIM";
import useIMLatestIMFile from "@/hooks/useIMLatestIMFile.";
import useIMLatestPlagiarismFile from "@/hooks/useIMLatestPlagiarismFile";
import useIMLatestQAMISFile from "@/hooks/useIMLatestQAMISFile";
import useIMStatus from "@/hooks/useIMStatus";
import usePeerReviewIM from "@/hooks/usePeerReviewIM";
import useQAMISChairpersonEndorsement from "@/hooks/useQAMISChairpersonEndorsement";
import useQAMISChairpersonEndorsementIM from "@/hooks/useQAMISChairpersonEndorsementIM";
import useQAMISCoordinatorEndorsementIM from "@/hooks/useQAMISCoordinatorEndorsementIM";
import useQAMISDeanEndorsementIM from "@/hooks/useQAMISDeanEndorsementIM";
import useQAMISRevisionIM from "@/hooks/useQAMISRevisionIM";
import useSubmittedChairpersonSuggestionIM from "@/hooks/useSubmittedChairpersonSuggestionIM";
import useSubmittedContentEditorSuggestionIM from "@/hooks/useSubmittedContentEditorSuggestionIM";
import useSubmittedContentSpecialistSuggestionIM from "@/hooks/useSubmittedContentSpecialistSuggestionIM";
import useSubmittedCoordinatorSuggestionIM from "@/hooks/useSubmittedCoordinatorSuggestionIM";
import useSubmittedIDDCoordinatorSuggestionIM from "@/hooks/useSubmittedIDDCoordinatorSuggestionIM";
import useSubmittedIDDSpecialistSuggestionIM from "@/hooks/useSubmittedIDDSpecialistSuggestionIM";
import useSubmittedPeerSuggestionIM from "@/hooks/useSubmittedPeerSuggestionIM";
import useUserFaculty from "@/hooks/useUserFaculty";
import {
  ActiveFaculty,
  CoordinatorEndorsement,
  DepartmentReview,
  DepartmentRevision,
  IM,
  IMFile,
} from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import Error from "next/error";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import * as Yup from "yup";

export default function ViewIM() {
  const router = useRouter();
  const iMId = router.query.id;
  const iM = useIM({ id: iMId as string });
  const [state, setState] = useState<{
    iMFile?: File | null;
    plagiarismFile?: File | null;
    openConfirmation: boolean;
  }>({
    openConfirmation: false,
  });
  const iMStatus = useIMStatus({ id: iMId as string });
  const activeFaculty = useActiveFacultyMe();
  const activeCoordinator = useActiveCoordinatorMe();
  const activeChairperson = useActiveChairpersonMe();
  const activeDean = useActiveDeanMe();
  const activeIDDCoordinator = useActiveIDDCoordinatorMe();
  const activeCITLDirector = useActiveCITLDirectorMe();
  const activeContentSpecialist = useActiveContentSpecialistMe();
  const qAMISRevision = useQAMISRevisionIM({ id: iMId as string });
  const iMFile = useIMLatestIMFile({ id: iMId as string });
  const qAMISFile = useIMLatestQAMISFile({ id: iMId as string });
  const plagiarismFile = useIMLatestPlagiarismFile({ id: iMId as string });
  const department = useDepartmentIM({ id: iMId as string });
  const college = useCollegeIM({ id: iMId as string });
  const user = useUserFaculty({
    id: iM?.facultyId,
  });
  const submittedPeerSuggestion = useSubmittedPeerSuggestionIM({
    id: iMId as string,
  });
  const submittedChairpersonSuggestion = useSubmittedChairpersonSuggestionIM({
    id: iMId as string,
  });
  const submittedCoordinatorSuggestion = useSubmittedCoordinatorSuggestionIM({
    id: iMId as string,
  });
  const chairpersonEndorsement = useQAMISChairpersonEndorsementIM({
    id: iMId as string,
  });
  const coordinatorEndorsement = useQAMISCoordinatorEndorsementIM({
    id: iMId as string,
  });
  const deanEndorsement = useQAMISDeanEndorsementIM({
    id: iMId as string,
  });
  const submittedContentSpecialistSuggestion =
    useSubmittedContentSpecialistSuggestionIM({
      id: iMId as string,
    });
  const submittedIDDSpecialistSuggestion =
    useSubmittedIDDSpecialistSuggestionIM({
      id: iMId as string,
    });
  const submittedContentEditorSuggestion =
    useSubmittedContentEditorSuggestionIM({
      id: iMId as string,
    });

  const { addSnackbar } = useContext(SnackbarContext);

  const closeConfirmation = () => {
    setState((prev) => ({
      ...prev,
      openConfirmation: false,
    }));
  };

  const openConfirmation = () => {
    setState((prev) => ({
      ...prev,
      openConfirmation: true,
    }));
  };

  const onQAMISChairpersonEndorsement = () => {
    axios
      .post("/api/qamis_chairperson_endorsement", {
        qAMISRevisionId: qAMISRevision?.id,
        activeChairpersonId: activeChairperson?.id,
      })
      .then(() => addSnackbar("Successfully endorsed IM"))
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ?? "Failed to endorse IM",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  };

  const onQAMISCoordinatorEndorsement = () => {
    axios
      .post("/api/qamis_coordinator_endorsement", {
        qAMISRevisionId: qAMISRevision?.id,
        activeCoordinatorId: activeCoordinator?.id,
      })
      .then(() => addSnackbar("Successfully endorsed IM"))
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ?? "Failed to endorse IM",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  };

  const onQAMISDeanEndorsement = () => {
    axios
      .post("/api/qamis_dean_endorsement", {
        qAMISRevisionId: qAMISRevision?.id,
        activeDeanId: activeDean?.id,
      })
      .then(() => addSnackbar("Successfully endorsed IM"))
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ?? "Failed to endorse IM",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  };

  const deleteHandler = (id: string) => {
    axios
      .delete(`/api/im/${id}`)
      .then(() => {
        addSnackbar("IM deleted successfully");
        router.push("/department/my_ims");
      })
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ?? "Failed to delete IM",
          "error"
        );
      });
  };

  const submitForReviewHandler = async () => {
    if (!state?.iMFile || !iMId) return;

    const formData = new FormData();
    formData.append("file", state.iMFile);
    formData.append("iMId", iMId as string);
    return axios
      .post<IMFile>("/api/im_file", formData)
      .then(async (res) => {
        return axios
          .post<DepartmentReview>("/api/department_review/", {
            iMFileId: res.data.id,
          })
          .then(() => {
            addSnackbar("IM has been submitted for review");
          });
      })
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ?? "Failed to submit for review",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  };

  const submitForEndorsementHandler = async () => {
    if (!state?.iMFile || !iMId) return;

    const formData = new FormData();
    formData.append("file", state.iMFile);
    formData.append("iMId", iMId as string);
    return axios
      .post<IMFile>("/api/im_file", formData)
      .then(async (res) => {
        return axios
          .post<DepartmentReview>("/api/department_revision/", {
            iMFileId: res.data.id,
          })
          .then(() => {
            addSnackbar("IM has been submitted for endorsement");
          });
      })
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ??
            "Failed to submit IM for endorsement",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  };

  const submitForCITLEndorsementHandler = async () => {
    if (!state?.iMFile || !iMId) return;

    const formData = new FormData();
    formData.append("file", state.iMFile);
    formData.append("iMId", iMId as string);
    return axios
      .post<IMFile>("/api/im_file", formData)
      .then(async (res) => {
        return axios
          .post<DepartmentReview>("/api/citl_revision/", {
            iMFileId: res.data.id,
          })
          .then(() => {
            addSnackbar("IM has been submitted for endorsement");
          });
      })
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ??
            "Failed to submit IM for endorsement",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  };

  const submitForIMERCCITLEndorsementHandler = async () => {
    console.log({ state });
    if (!state?.iMFile || !state?.plagiarismFile) return;

    const iMFormData = new FormData();
    iMFormData.append("file", state.iMFile);
    iMFormData.append("iMId", iMId as string);
    return axios
      .post("/api/im_file", iMFormData)
      .then((res) => {
        const iMFile = res.data;
        if (!state?.plagiarismFile) return;

        const plagiarismFormData = new FormData();
        plagiarismFormData.append("file", state.plagiarismFile);
        plagiarismFormData.append("iMId", iMId as string);
        return axios
          .post("/api/plagiarism_file", plagiarismFormData)
          .then((res) => {
            const plagiarismFile = res.data;
            return axios
              .post("/api/imerc_citl_revision", {
                iMFileId: iMFile.id,
                plagiarismFileId: plagiarismFile.id,
              })
              .then(() => {
                addSnackbar("IM has been submitted for endorsement");
              });
          });
      })
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ??
            "Failed to submit IM for endorsement",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  };

  const coordinatorEndorsementHandler = async () => {
    if (!activeCoordinator) return;

    return axios
      .get<DepartmentRevision>(`/api/department_revision/im/${iMId}`)
      .then((res) => {
        const departmentRevision = res.data;
        if (!departmentRevision) return;

        return axios
          .post<CoordinatorEndorsement>(`/api/coordinator_endorsement`, {
            departmentRevisionId: departmentRevision.id,
            activeCoordinatorId: activeCoordinator.id,
          })
          .then(() => addSnackbar("Successfully endorsed IM"));
      })
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ?? "Failed to endorse IM",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  };

  const returnCoordinatorEndorsementHandler = async () => {
    router.push(`/im/${iMId}/returned_department_revision`);
  };

  const deanEndorsementHandler = async () => {
    if (!activeDean) return;

    return axios
      .get<DepartmentRevision>(`/api/coordinator_endorsement/im/${iMId}`)
      .then((res) => {
        const coordinatorEndorsement = res.data;
        if (!coordinatorEndorsement) return;

        return axios
          .post<CoordinatorEndorsement>(`/api/dean_endorsement`, {
            coordinatorEndorsementId: coordinatorEndorsement.id,
            activeDeanId: activeDean.id,
          })
          .then(() => addSnackbar("Successfully endorsed IM"));
      })
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ?? "Failed to endorse IM",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  };

  const iDDCoordinatorEndorsementHandler = async () => {
    if (!activeIDDCoordinator) return;

    return axios
      .get<DepartmentRevision>(`/api/citl_revision/im/${iMId}`)
      .then((res) => {
        const cITLRevision = res.data;
        if (!cITLRevision) return;

        return axios
          .post<CoordinatorEndorsement>(`/api/idd_coordinator_endorsement`, {
            cITLRevisionId: cITLRevision.id,
            activeIDDCoordinatorId: activeIDDCoordinator.id,
          })
          .then(() => addSnackbar("Successfully endorsed IM"));
      })
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ?? "Failed to endorse IM",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  };

  const returnIDDCoordinatorEndorsementHandler = async () => {
    router.push(`/im/${iMId}/returned_citl_revision`);
  };

  const cITLDirectorEndorsementHandler = async () => {
    if (!activeCITLDirector) return;

    return axios
      .get<DepartmentRevision>(`/api/idd_coordinator_endorsement/im/${iMId}`)
      .then((res) => {
        const iDDCoordinatorEndorsement = res.data;
        if (!iDDCoordinatorEndorsement) return;

        return axios
          .post<CoordinatorEndorsement>(`/api/citl_director_endorsement`, {
            iDDCoordinatorEndorsementId: iDDCoordinatorEndorsement.id,
            activeCITLDirectorId: activeCITLDirector.id,
          })
          .then(() => addSnackbar("Successfully endorsed IM"));
      })
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ?? "Failed to endorse IM",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  };

  const iMERCIDDCoordinatorEndorsementHandler = async () => {
    if (!activeIDDCoordinator) return;

    return axios
      .get<DepartmentRevision>(`/api/imerc_citl_revision/im/${iMId}`)
      .then((res) => {
        const iMERCCITLRevision = res.data;
        if (!iMERCCITLRevision) return;

        return axios
          .post<CoordinatorEndorsement>(
            `/api/imerc_idd_coordinator_endorsement`,
            {
              iMERCCITLRevisionId: iMERCCITLRevision.id,
              activeIDDCoordinatorId: activeIDDCoordinator.id,
            }
          )
          .then(() => addSnackbar("Successfully endorsed IM"));
      })
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ?? "Failed to endorse IM",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  };

  const returnIMERCIDDCoordinatorEndorsementHandler = async () => {
    return router.push(`/im/${iMId}/returned_imerc_citl_revision`);
  };

  const iMERCCITLDirectorEndorsementHandler = async () => {
    if (!activeCITLDirector) return;

    return axios
      .get<DepartmentRevision>(
        `/api/imerc_idd_coordinator_endorsement/im/${iMId}`
      )
      .then((res) => {
        const iMERCIDDCoordinatorEndorsement = res.data;
        if (!iMERCIDDCoordinatorEndorsement) return;

        return axios
          .post<CoordinatorEndorsement>(
            `/api/imerc_citl_director_endorsement`,
            {
              iMERCIDDCoordinatorEndorsementId:
                iMERCIDDCoordinatorEndorsement.id,
              activeCITLDirectorId: activeCITLDirector.id,
            }
          )
          .then(() => addSnackbar("Successfully endorsed IM"));
      })
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ?? "Failed to endorse IM",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  };

  if (iM === null) {
    return (
      <MainLayout>
        <Error statusCode={404} title='IM Not Found' />
      </MainLayout>
    );
  }
  if (iM === undefined) {
    return (
      <MainLayout>
        <Loading />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className='flex h-full border rounded p-1 overflow-auto space-x-1'>
        <div className='flex-1 px-1 h-full overflow-auto'>
          <div className='flex flex-col h-full overflow-auto'>
            <div className='flex mb-2'>
              <div className='flex-1'>
                <div className='flex'>
                  <h2 className='flex-1 uppercase'>{iM.title}</h2>
                  <div>
                    {
                      <ActionMenu
                        activeFaculty={activeFaculty}
                        iM={iM}
                        iMStatus={iMStatus}
                        deleteHandler={deleteHandler}
                        showIMPDF={Boolean(iMFile)}
                        showQAMISPDF={Boolean(qAMISFile)}
                        showPlagiarismPDF={Boolean(plagiarismFile)}
                      />
                    }
                  </div>
                </div>
                <div className='flex space-x-10'>
                  <div className='flex space-x-2 mt-2'>
                    <img
                      className='w-10 h-10 rounded-full'
                      src={user?.image ?? ""}
                    />
                    <div className='text-xs text-palette_grey'>
                      <p className='uppercase font-bold'>{user?.name}</p>
                      {iM?.createdAt && (
                        <p>
                          {DateTime.fromJSDate(new Date(iM.createdAt)).toFormat(
                            "DD | t"
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className='space-x-4'>
                      <span className='text-xs text-palette_grey'>
                        Type: {iM.type}
                      </span>
                      <span className='text-xs text-palette_grey'>
                        Status: {iMStatus}
                      </span>
                    </div>
                    <p className='text-xs text-palette_grey'>
                      Department: {department?.name} | {college?.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex-1 h-full overflow-auto'>
              {iMStatus === "IMPLEMENTATION_DRAFT" &&
                iM.facultyId === activeFaculty?.facultyId && (
                  <div>
                    <FileUpload
                      onFileChange={(e) => {
                        setState((prev) => ({
                          ...prev,
                          iMFile: e.target.files?.item(0),
                        }));
                      }}
                      onFileReset={() => {
                        setState((prev) => ({
                          ...prev,
                          iMFile: undefined,
                        }));
                      }}
                    />
                    <button
                      className='rounded text-palette_white bg-palette_blue px-2 py-1 disabled:bg-opacity-50 flex items-center space-x-2'
                      disabled={Boolean(!state?.iMFile)}
                      onClick={openConfirmation}
                    >
                      <span>Submit for Review</span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        height='1em'
                        viewBox='0 0 384 512'
                        className='fill-palette_white'
                      >
                        <path d='M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 408c0 13.3-10.7 24-24 24s-24-10.7-24-24V305.9l-31 31c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l72-72c9.4-9.4 24.6-9.4 33.9 0l72 72c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-31-31V408z' />
                      </svg>
                    </button>
                    {state.openConfirmation && (
                      <Confirmation
                        onClose={closeConfirmation}
                        onConfirm={submitForReviewHandler}
                      />
                    )}
                  </div>
                )}

              {iMStatus === "IMPLEMENTATION_DEPARTMENT_REVIEW" && (
                <div className='flex flex-col'>
                  <div>
                    <DepartmentReviewStatus iMId={iMId as string} />
                  </div>
                  <div className='space-x-2 my-1'>
                    {iM.facultyId !== activeFaculty?.facultyId &&
                      !submittedPeerSuggestion && (
                        <Link
                          href={`/im/${iM.id}/peer_review`}
                          className='bg-palette_blue text-palette_white py-1 px-2 rounded inline-flex items-center space-x-2 hover:bg-opacity-90'
                        >
                          <span>Peer Review</span>
                          <span>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              height='1em'
                              viewBox='0 0 576 512'
                              className='fill-palette_white'
                            >
                              <path d='M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V285.7l-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z' />
                            </svg>
                          </span>
                        </Link>
                      )}

                    {activeCoordinator && !submittedCoordinatorSuggestion && (
                      <Link
                        href={`/im/${iM.id}/coordinator_review`}
                        className='bg-palette_blue text-palette_white py-1 px-2 rounded inline-flex items-center space-x-2 hover:bg-opacity-90'
                      >
                        <span>Coordinator Review</span>
                        <span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            height='1em'
                            viewBox='0 0 576 512'
                            className='fill-palette_white'
                          >
                            <path d='M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V285.7l-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z' />
                          </svg>
                        </span>
                      </Link>
                    )}

                    {activeChairperson && !submittedChairpersonSuggestion && (
                      <Link
                        href={`/im/${iM.id}/chairperson_review`}
                        className='bg-palette_blue text-palette_white py-1 px-2 rounded inline-flex items-center space-x-2 hover:bg-opacity-90'
                      >
                        <span>Chairperson Review</span>
                        <span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            height='1em'
                            viewBox='0 0 576 512'
                            className='fill-palette_white'
                          >
                            <path d='M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V285.7l-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z' />
                          </svg>
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {iMStatus === "IMPLEMENTATION_DEPARTMENT_REVIEWED" && (
                <div className='flex flex-col'>
                  <div>
                    <DepartmentReviewStatus iMId={iMId as string} />
                  </div>
                  {iM.facultyId === activeFaculty?.facultyId && (
                    <div className='space-y-1 px-1'>
                      <IMPeerSuggestionItems id={iM.id} />
                      <IMChairpersonSuggestionItems id={iM.id} />
                      <IMCoordinatorSuggestionItems id={iM.id} />
                      <IMReturnedDepartmentRevisionSuggestionItems id={iM.id} />
                      <FileUpload
                        onFileChange={(e) => {
                          setState((prev) => ({
                            ...prev,
                            iMFile: e.target.files?.item(0),
                          }));
                        }}
                        onFileReset={() => {
                          setState((prev) => ({
                            ...prev,
                            iMFile: undefined,
                          }));
                        }}
                      />

                      <button
                        className='rounded text-palette_white bg-palette_blue px-2 py-1 disabled:bg-opacity-50 flex items-center space-x-2 hover:bg-opacity-90'
                        disabled={Boolean(!state?.iMFile)}
                        onClick={openConfirmation}
                      >
                        <span>Submit for endorsement</span>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          height='1em'
                          viewBox='0 0 384 512'
                          className='fill-palette_white'
                        >
                          <path d='M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 408c0 13.3-10.7 24-24 24s-24-10.7-24-24V305.9l-31 31c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l72-72c9.4-9.4 24.6-9.4 33.9 0l72 72c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-31-31V408z' />
                        </svg>
                      </button>
                      {state.openConfirmation && (
                        <Confirmation
                          onClose={closeConfirmation}
                          onConfirm={submitForEndorsementHandler}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}

              {(iMStatus === "IMPLEMENTATION_DEPARTMENT_REVISED" ||
                iMStatus ===
                  "IMPLEMENTATION_DEPARTMENT_RETURNED_REVISION_NOT_SUBMITTED") && (
                <div className='flex flex-col'>
                  <div>
                    <DepartmentEndorsementStatus iMId={iMId as string} />
                  </div>
                  {activeCoordinator && (
                    <div className='space-y-1 p-1'>
                      <IMChairpersonSuggestionItems
                        id={iM.id}
                        editable={false}
                      />
                      <IMCoordinatorSuggestionItems
                        id={iM.id}
                        editable={false}
                      />
                      <IMPeerSuggestionItems id={iM.id} editable={false} />
                      <IMReturnedDepartmentRevisionSuggestionItems
                        id={iM.id}
                        editable={false}
                      />
                      <div className='space-x-1 flex'>
                        <>
                          <button
                            className='rounded text-palette_white bg-palette_blue px-2 py-1 disabled:bg-opacity-50 flex items-center space-x-2 hover:bg-opacity-90'
                            onClick={openConfirmation}
                          >
                            <span>Endorse IM</span>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              height='1em'
                              viewBox='0 0 448 512'
                              className='fill-palette_white'
                            >
                              <path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z' />
                            </svg>
                          </button>
                          {state.openConfirmation && (
                            <Confirmation
                              onClose={closeConfirmation}
                              onConfirm={coordinatorEndorsementHandler}
                            />
                          )}
                        </>
                        <button
                          className='rounded text-palette_white bg-palette_blue px-2 py-1 disabled:bg-opacity-50 flex items-center space-x-2 hover:bg-opacity-90'
                          onClick={returnCoordinatorEndorsementHandler}
                        >
                          <span>Return Revision</span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            height='1em'
                            viewBox='0 0 512 512'
                            className='fill-palette_white'
                          >
                            <path d='M48.5 224H40c-13.3 0-24-10.7-24-24V72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8H48.5z' />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {iMStatus ===
                "IMPLEMENTATION_DEPARTMENT_COORDINATOR_ENDORSED" && (
                <div className='flex flex-col'>
                  <div>
                    <DepartmentEndorsementStatus iMId={iMId as string} />
                  </div>
                  {activeDean && (
                    <div>
                      <>
                        <button
                          className='rounded text-palette_white bg-palette_blue px-2 py-1 disabled:bg-opacity-50 flex items-center space-x-2 hover:bg-opacity-90'
                          onClick={openConfirmation}
                        >
                          <span>Endorse IM</span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            height='1em'
                            viewBox='0 0 448 512'
                            className='fill-palette_white'
                          >
                            <path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z' />
                          </svg>
                        </button>
                        {state.openConfirmation && (
                          <Confirmation
                            onClose={closeConfirmation}
                            onConfirm={deanEndorsementHandler}
                          />
                        )}
                      </>
                    </div>
                  )}
                </div>
              )}

              {iMStatus === "IMPLEMENTATION_DEPARTMENT_DEAN_ENDORSED" && (
                <div className='flex flex-col'>
                  <div>
                    <CITLReviewStatus iMId={iMId as string} />
                  </div>
                  {activeIDDCoordinator && (
                    <div>
                      <Link
                        href={`/im/${iM.id}/idd_coordinator_suggestion`}
                        className='bg-palette_blue text-palette_white py-1 px-2 rounded inline-flex items-center space-x-2 hover:bg-opacity-90'
                      >
                        <span>IDD Coordinator Suggestion</span>
                        <span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            height='1em'
                            viewBox='0 0 576 512'
                            className='fill-palette_white'
                          >
                            <path d='M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V285.7l-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z' />
                          </svg>
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {iMStatus === "IMPLEMENTATION_CITL_REVIEWED" && (
                <div className='flex flex-col'>
                  <div>
                    <CITLReviewStatus iMId={iMId as string} />
                  </div>
                  {iM.facultyId === activeFaculty?.facultyId && (
                    <div className='space-y-1 px-1'>
                      <IMIDDCoordinatorSuggestionItems id={iM.id} />
                      <IMReturnedCITLRevisionSuggestionItems id={iM.id} />
                      <FileUpload
                        onFileChange={(e) => {
                          setState((prev) => ({
                            ...prev,
                            iMFile: e.target.files?.item(0),
                          }));
                        }}
                        onFileReset={() => {
                          setState((prev) => ({
                            ...prev,
                            iMFile: undefined,
                          }));
                        }}
                      />

                      <>
                        <button
                          className='rounded text-palette_white bg-palette_blue px-2 py-1 disabled:bg-opacity-50 flex items-center space-x-2 hover:bg-opacity-90'
                          onClick={openConfirmation}
                          disabled={!Boolean(state.iMFile)}
                        >
                          <span>Submit for endorsement</span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            height='1em'
                            viewBox='0 0 448 512'
                            className='fill-palette_white'
                          >
                            <path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z' />
                          </svg>
                        </button>
                        {state.openConfirmation && (
                          <Confirmation
                            onClose={closeConfirmation}
                            onConfirm={submitForCITLEndorsementHandler}
                          />
                        )}
                      </>
                    </div>
                  )}
                </div>
              )}

              {(iMStatus === "IMPLEMENTATION_CITL_REVISED" ||
                iMStatus ===
                  "IMPLEMENTATION_CITL_RETURNED_REVISION_NOT_SUBMITTED") && (
                <div className='flex flex-col'>
                  <div>
                    <CITLReviewStatus iMId={iMId as string} />
                  </div>
                  {activeIDDCoordinator && (
                    <div className='space-y-1 px-1'>
                      <IMIDDCoordinatorSuggestionItems
                        id={iM.id}
                        editable={false}
                      />
                      <IMReturnedCITLRevisionSuggestionItems
                        id={iM.id}
                        editable={false}
                      />

                      <div className='space-x-1 flex'>
                        <>
                          <button
                            className='rounded text-palette_white bg-palette_blue px-2 py-1 disabled:bg-opacity-50 flex items-center space-x-2 hover:bg-opacity-90'
                            onClick={openConfirmation}
                          >
                            <span>Endorse IM</span>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              height='1em'
                              viewBox='0 0 448 512'
                              className='fill-palette_white'
                            >
                              <path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z' />
                            </svg>
                          </button>
                          {state.openConfirmation && (
                            <Confirmation
                              onClose={closeConfirmation}
                              onConfirm={iDDCoordinatorEndorsementHandler}
                            />
                          )}
                        </>
                        <button
                          className='rounded text-palette_white bg-palette_blue px-2 py-1 disabled:bg-opacity-50 flex items-center space-x-2 hover:bg-opacity-90'
                          onClick={returnIDDCoordinatorEndorsementHandler}
                        >
                          <span>Return Revision</span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            height='1em'
                            viewBox='0 0 512 512'
                            className='fill-palette_white'
                          >
                            <path d='M48.5 224H40c-13.3 0-24-10.7-24-24V72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8H48.5z' />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {iMStatus === "IMPLEMENTATION_CITL_IDD_COORDINATOR_ENDORSED" && (
                <div className='flex flex-col'>
                  <div>
                    <CITLReviewStatus iMId={iMId as string} />
                  </div>
                  {activeCITLDirector && (
                    <div>
                      <>
                        <button
                          className='rounded text-palette_white bg-palette_blue px-2 py-1 disabled:bg-opacity-50 flex items-center space-x-2 hover:bg-opacity-90'
                          onClick={openConfirmation}
                        >
                          <span>Endorse IM</span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            height='1em'
                            viewBox='0 0 448 512'
                            className='fill-palette_white'
                          >
                            <path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z' />
                          </svg>
                        </button>
                        {state.openConfirmation && (
                          <Confirmation
                            onClose={closeConfirmation}
                            onConfirm={cITLDirectorEndorsementHandler}
                          />
                        )}
                      </>
                    </div>
                  )}
                </div>
              )}

              {iMStatus === "IMPLEMENTATION_CITL_DIRECTOR_ENDORSED" && (
                <div className='flex flex-col'>
                  <div>
                    <CITLReviewStatus iMId={iMId as string} />
                  </div>
                  {iM.facultyId === activeFaculty?.facultyId && (
                    <div>
                      <Link
                        href={`/im/${iM.id}/qamis_suggestion`}
                        className='bg-palette_blue text-palette_white py-1 px-2 rounded inline-flex items-center space-x-2 hover:bg-opacity-90'
                      >
                        <span>Input QAMIS suggestions</span>
                        <span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            height='1em'
                            viewBox='0 0 576 512'
                            className='fill-palette_white'
                          >
                            <path d='M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V285.7l-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z' />
                          </svg>
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {iMStatus === "IMERC_QAMIS_REVISED" && (
                <div className='flex flex-col'>
                  <div>
                    <QAMISCollegeEndorsementStatus iMId={iMId as string} />
                  </div>
                  <div className='space-y-1'>
                    <IMQAMISSuggestionItems id={iM.id} editable={false} />
                    {activeCoordinator && !coordinatorEndorsement && (
                      <>
                        <button
                          className='rounded text-palette_white bg-palette_blue px-2 py-1 disabled:bg-opacity-50 flex items-center space-x-2 hover:bg-opacity-90'
                          onClick={openConfirmation}
                        >
                          <span>Coordinator Endorsement</span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            height='1em'
                            viewBox='0 0 448 512'
                            className='fill-palette_white'
                          >
                            <path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z' />
                          </svg>
                        </button>
                        {state.openConfirmation && (
                          <Confirmation
                            onClose={closeConfirmation}
                            onConfirm={onQAMISCoordinatorEndorsement}
                          />
                        )}
                      </>
                    )}
                    {activeChairperson && !chairpersonEndorsement && (
                      <>
                        <button
                          className='rounded text-palette_white bg-palette_blue px-2 py-1 disabled:bg-opacity-50 flex items-center space-x-2 hover:bg-opacity-90'
                          onClick={openConfirmation}
                        >
                          <span>Chairperson Endorsement</span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            height='1em'
                            viewBox='0 0 448 512'
                            className='fill-palette_white'
                          >
                            <path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z' />
                          </svg>
                        </button>
                        {state.openConfirmation && (
                          <Confirmation
                            onClose={closeConfirmation}
                            onConfirm={onQAMISChairpersonEndorsement}
                          />
                        )}
                      </>
                    )}
                    {activeDean && !deanEndorsement && (
                      <>
                        <button
                          className='rounded text-palette_white bg-palette_blue px-2 py-1 disabled:bg-opacity-50 flex items-center space-x-2 hover:bg-opacity-90'
                          onClick={openConfirmation}
                        >
                          <span>Dean Endorsement</span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            height='1em'
                            viewBox='0 0 448 512'
                            className='fill-palette_white'
                          >
                            <path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z' />
                          </svg>
                        </button>
                        {state.openConfirmation && (
                          <Confirmation
                            onClose={closeConfirmation}
                            onConfirm={onQAMISDeanEndorsement}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {iMStatus === "IMERC_QAMIS_DEPARTMENT_ENDORSED" && (
                <div className='flex flex-col'>
                  <div>
                    <IMERCReviewStatus iMId={iMId as string} />
                  </div>
                  <div className='space-x-2'>
                    {activeContentSpecialist &&
                      !submittedContentSpecialistSuggestion && (
                        <Link
                          href={`/im/${iM.id}/content_specialist_review`}
                          className='bg-palette_blue text-palette_white py-1 px-2 rounded inline-flex items-center space-x-2 hover:bg-opacity-90'
                        >
                          <span>Content Specialist Review</span>
                          <span>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              height='1em'
                              viewBox='0 0 576 512'
                              className='fill-palette_white'
                            >
                              <path d='M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V285.7l-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z' />
                            </svg>
                          </span>
                        </Link>
                      )}

                    {activeCITLDirector &&
                      !submittedContentEditorSuggestion && (
                        <Link
                          href={`/im/${iM.id}/content_editor_review`}
                          className='bg-palette_blue text-palette_white py-1 px-2 rounded inline-flex items-center space-x-2 hover:bg-opacity-90'
                        >
                          <span>Content Editor Review</span>
                          <span>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              height='1em'
                              viewBox='0 0 576 512'
                              className='fill-palette_white'
                            >
                              <path d='M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V285.7l-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z' />
                            </svg>
                          </span>
                        </Link>
                      )}

                    {activeIDDCoordinator &&
                      !submittedIDDSpecialistSuggestion && (
                        <Link
                          href={`/im/${iM.id}/idd_specialist_review`}
                          className='bg-palette_blue text-palette_white py-1 px-2 rounded inline-flex items-center space-x-2 hover:bg-opacity-90'
                        >
                          <span>IDD Specialist Review</span>
                          <span>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              height='1em'
                              viewBox='0 0 576 512'
                              className='fill-palette_white'
                            >
                              <path d='M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V285.7l-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z' />
                            </svg>
                          </span>
                        </Link>
                      )}
                  </div>
                </div>
              )}

              {iMStatus === "IMERC_CITL_REVIEWED" && (
                <div className='flex flex-col'>
                  <div>
                    <IMERCReviewStatus iMId={iMId as string} />
                  </div>
                  {iM.facultyId === activeFaculty?.facultyId && (
                    <div className='space-y-1 px-1'>
                      <IMContentSpecialistSuggestionItems id={iM.id} />
                      <IMIDDSpecialistSuggestionItems id={iM.id} />
                      <IMContentEditorSuggestionItems id={iM.id} />
                      <IMReturnedIMERCCITLRevisionSuggestionItems id={iM.id} />

                      <div className='flex flex-col w-full space-y-1'>
                        <FileUpload
                          label='UPLOAD PLAGIARISM FILE'
                          onFileChange={(e) => {
                            setState((prev) => ({
                              ...prev,
                              plagiarismFile: e.target.files?.item(0),
                            }));
                          }}
                          onFileReset={() => {
                            setState((prev) => ({
                              ...prev,
                              iMFile: undefined,
                            }));
                          }}
                        />
                        <FileUpload
                          label='UPLOAD IM FILE'
                          onFileChange={(e) => {
                            setState((prev) => ({
                              ...prev,
                              iMFile: e.target.files?.item(0),
                            }));
                          }}
                          onFileReset={() => {
                            setState((prev) => ({
                              ...prev,
                              qAMISFile: undefined,
                            }));
                          }}
                        />
                      </div>

                      <>
                        <button
                          className='rounded text-palette_white bg-palette_blue px-2 py-1 disabled:bg-opacity-50 flex items-center space-x-2 hover:bg-opacity-90'
                          onClick={openConfirmation}
                          disabled={!Boolean(state.iMFile)}
                        >
                          <span>Submit for endorsement</span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            height='1em'
                            viewBox='0 0 448 512'
                            className='fill-palette_white'
                          >
                            <path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z' />
                          </svg>
                        </button>
                        {state.openConfirmation && (
                          <Confirmation
                            onClose={closeConfirmation}
                            onConfirm={submitForIMERCCITLEndorsementHandler}
                          />
                        )}
                      </>
                    </div>
                  )}
                </div>
              )}

              {(iMStatus === "IMERC_CITL_REVISED" ||
                iMStatus ===
                  "IMPLEMENTATION_IMERC_CITL_RETURNED_REVISION_NOT_SUBMITTED") && (
                <div className='flex flex-col'>
                  <div>
                    <IMERCEndorsementStatus iMId={iMId as string} />
                  </div>
                  {activeIDDCoordinator && (
                    <div className='space-y-1 px-1'>
                      <IMContentSpecialistSuggestionItems
                        id={iM.id}
                        editable={false}
                      />
                      <IMIDDSpecialistSuggestionItems
                        id={iM.id}
                        editable={false}
                      />
                      <IMContentEditorSuggestionItems
                        id={iM.id}
                        editable={false}
                      />
                      <IMReturnedIMERCCITLRevisionSuggestionItems
                        id={iM.id}
                        editable={false}
                      />
                      <div className='space-x-1 flex'>
                        <>
                          <button
                            className='rounded text-palette_white bg-palette_blue px-2 py-1 disabled:bg-opacity-50 flex items-center space-x-2 hover:bg-opacity-90'
                            onClick={openConfirmation}
                          >
                            <span>Endorse IM</span>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              height='1em'
                              viewBox='0 0 448 512'
                              className='fill-palette_white'
                            >
                              <path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z' />
                            </svg>
                          </button>
                          {state.openConfirmation && (
                            <Confirmation
                              onClose={closeConfirmation}
                              onConfirm={iMERCIDDCoordinatorEndorsementHandler}
                            />
                          )}
                        </>
                        <button
                          className='rounded text-palette_white bg-palette_blue px-2 py-1 disabled:bg-opacity-50 flex items-center space-x-2 hover:bg-opacity-90'
                          onClick={returnIMERCIDDCoordinatorEndorsementHandler}
                        >
                          <span>Return Revision</span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            height='1em'
                            viewBox='0 0 512 512'
                            className='fill-palette_white'
                          >
                            <path d='M48.5 224H40c-13.3 0-24-10.7-24-24V72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8H48.5z' />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {iMStatus === "IMERC_CITL_IDD_COORDINATOR_ENDORSED" && (
                <div className='flex flex-col'>
                  <div>
                    <IMERCEndorsementStatus iMId={iMId as string} />
                  </div>
                  {activeCITLDirector && (
                    <div>
                      <>
                        <button
                          className='rounded text-palette_white bg-palette_blue px-2 py-1 disabled:bg-opacity-50 flex items-center space-x-2 hover:bg-opacity-90'
                          onClick={openConfirmation}
                        >
                          <span>Endorse IM</span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            height='1em'
                            viewBox='0 0 448 512'
                            className='fill-palette_white'
                          >
                            <path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z' />
                          </svg>
                        </button>
                        {state.openConfirmation && (
                          <Confirmation
                            onClose={closeConfirmation}
                            onConfirm={iMERCCITLDirectorEndorsementHandler}
                          />
                        )}
                      </>
                    </div>
                  )}
                </div>
              )}

              {iMStatus === "IMERC_CITL_DIRECTOR_ENDORSED" && (
                <div>
                  <IMERCEndorsementStatus iMId={iMId as string} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='flex flex-1 h-full'>
          {iMFile && (
            <iframe
              src={`/api/im_file/${iMFile.id}/pdf`}
              title={iM.title}
              className='w-full h-full rounded'
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}

interface ActionMenuProps {
  iM: IM;
  activeFaculty?: ActiveFaculty | null;
  iMStatus?: string | null;
  deleteHandler: (id: string) => void;
  showIMPDF: boolean;
  showQAMISPDF: boolean;
  showPlagiarismPDF: boolean;
}
function ActionMenu({
  iM,
  activeFaculty,
  iMStatus,
  deleteHandler,
  showIMPDF,
  showPlagiarismPDF,
  showQAMISPDF,
}: ActionMenuProps) {
  const [state, setState] = useState({
    openMenu: false,
    openConfirmation: false,
  });
  const menuRef: any = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setState((prev) => ({ ...prev, openMenu: false }));
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setState((prev) => ({ ...prev, openMenu: false }));
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className='relative inline-block text-left' ref={menuRef}>
      <div>
        <button
          type='button'
          className='inline-flex justify-center items-center space-x-2 w-full rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50'
          id='options-menu'
          aria-haspopup='true'
          aria-expanded='true'
          onClick={() =>
            setState((prev) => ({ ...prev, openMenu: !prev.openMenu }))
          }
        >
          <span>Actions</span>
          {!state.openMenu && (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='1em'
              viewBox='0 0 320 512'
              className='fill-palette_blue'
            >
              <path d='M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z' />
            </svg>
          )}
          {state.openMenu && (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='1em'
              viewBox='0 0 320 512'
              className='fill-palette_blue'
            >
              <path d='M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z' />
            </svg>
          )}
        </button>
      </div>

      {state.openMenu && (
        <div className='origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'>
          <div
            className='py-1'
            role='menu'
            aria-orientation='vertical'
            aria-labelledby='options-menu'
          >
            <Link
              href={`/im/${iM.id}/all_reviews`}
              className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              role='menuitem'
            >
              All reviews
            </Link>
            <Link
              href={`/im/${iM.id}/all_suggestions`}
              className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              role='menuitem'
            >
              All suggestions
            </Link>
            <Link
              href={`/im/${iM.id}/track`}
              className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              role='menuitem'
            >
              Track
            </Link>
            {showIMPDF && (
              <Link
                href={`/api/im_file/im/${iM.id}/pdf`}
                target='_blank'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                role='menuitem'
              >
                View IM PDF
              </Link>
            )}
            {showQAMISPDF && (
              <Link
                href={`/api/qamis_file/im/${iM.id}/pdf`}
                target='_blank'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                role='menuitem'
              >
                View QAMIS PDF
              </Link>
            )}
            {showPlagiarismPDF && (
              <Link
                href={`/api/plagiarism_file/im/${iM.id}/pdf`}
                target='_blank'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                role='menuitem'
              >
                View Plagiarism PDF
              </Link>
            )}
            {iM.facultyId === activeFaculty?.facultyId &&
              iMStatus === "IMPLEMENTATION_DRAFT" && <EditIM />}
            {iM.facultyId === activeFaculty?.facultyId &&
              iMStatus === "IMPLEMENTATION_DRAFT" && (
                <>
                  <button
                    onClick={() =>
                      setState((prev) => ({ ...prev, openConfirmation: true }))
                    }
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
                    role='menuitem'
                  >
                    Delete
                  </button>

                  {state.openConfirmation && (
                    <Confirmation
                      onClose={() =>
                        setState((prev) => ({
                          ...prev,
                          openConfirmation: false,
                        }))
                      }
                      onConfirm={() => {
                        deleteHandler(iM.id);
                      }}
                    />
                  )}
                </>
              )}
          </div>
        </div>
      )}
    </div>
  );
}

function EditIM() {
  const router = useRouter();
  const iMId = router.query.id;
  const iM = useIM({ id: iMId as string });
  const [openEdit, setOpenEdit] = useState(false);
  const { addSnackbar } = useContext(SnackbarContext);

  const formik = useFormik({
    initialValues: {
      title: "",
      type: "MODULE",
    },
    validationSchema: Yup.object({
      title: Yup.string().required(),
      type: Yup.string()
        .oneOf(["MODULE", "COURSE_FILE", "WORKTEXT", "TEXTBOOK"])
        .required(),
    }),

    onSubmit: (values) => {
      axios
        .put(`/api/im/${iMId}`, values)
        .then(() => {
          addSnackbar("IM Updated successfully");
        })
        .catch((error) => {
          addSnackbar(
            error.response.data?.error?.message ?? "Failed to update IM",
            "error"
          );
        })
        .finally(() => {
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!iM) return;

    formik.setValues({
      title: iM.title,
      type: iM.type,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iM]);

  useEffect(() => {
    console.log({ iM });
  }, [iM]);

  return (
    <>
      <button
        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
        onClick={() => setOpenEdit(true)}
      >
        Edit
      </button>
      {openEdit && (
        <Modal title='Edit IM' onClose={() => setOpenEdit(false)}>
          <form onSubmit={formik.handleSubmit} noValidate>
            <div className='flex flex-col space-y-1'>
              <input
                placeholder='Title'
                {...formik.getFieldProps("title")}
                className='rounded'
              />
              <select {...formik.getFieldProps("type")} className='rounded'>
                <option value='MODULE'>Module</option>
                <option value='COURSE_FILE'>Course File</option>
                <option value='WORKTEXT'>Worktext</option>
                <option value='TEXTBOOK'>Textbook</option>
              </select>
              <button
                type='submit'
                disabled={!formik.isValid}
                className='bg-palette_blue text-white rounded inline-flex items-center justify-center py-1 space-x-2 hover:bg-opacity-90 disabled:bg-opacity-50'
              >
                <span>Submit</span>
                <span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    height='1em'
                    viewBox='0 0 448 512'
                    className='fill-palette_white'
                  >
                    <path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z' />
                  </svg>
                </span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

interface DepartmentReviewStatusProps {
  iMId: string;
}
function DepartmentReviewStatus({ iMId }: DepartmentReviewStatusProps) {
  const peerReview = usePeerReviewIM({ id: iMId });
  const submittedPeerSuggestion = useSubmittedPeerSuggestionIM({ id: iMId });
  const chairpersonReview = useChairpersonReviewIM({ id: iMId });
  const submittedChairpersonSuggestion = useSubmittedChairpersonSuggestionIM({
    id: iMId,
  });
  const coordinatorReview = useCoordinatorReviewIM({ id: iMId });
  const submittedCoordinatorSuggestion = useSubmittedCoordinatorSuggestionIM({
    id: iMId,
  });
  return (
    <div className='grid grid-cols-2'>
      <StatusItem label='Peer Review' success={Boolean(peerReview)} />
      <StatusItem
        label='Peer Suggestion'
        success={Boolean(submittedPeerSuggestion)}
      />
      <StatusItem
        label='Chairperson Review'
        success={Boolean(chairpersonReview)}
      />
      <StatusItem
        label='Chairperson Suggestion'
        success={Boolean(submittedChairpersonSuggestion)}
      />
      <StatusItem
        label='Coordinator Review'
        success={Boolean(coordinatorReview)}
      />
      <StatusItem
        label='Coordinator Suggestion'
        success={Boolean(submittedCoordinatorSuggestion)}
      />
    </div>
  );
}

interface StatusItemProps {
  success: boolean;
  label: string;
}
function StatusItem({ label, success }: StatusItemProps) {
  return (
    <div>
      <span
        className={`rounded-full text-palette_white px-1 inline-flex justify-center items-center px-2 text-sm space-x-1 ${
          success ? "bg-palette_success" : "bg-palette_grey"
        }`}
      >
        <span>{label}</span>
        <span>
          {!success && (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='14'
              width='14'
              viewBox='0 0 512 512'
              className='fill-palette_white'
            >
              <path d='M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z' />
            </svg>
          )}
          {success && (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='14'
              width='10'
              viewBox='0 0 448 512'
              className='fill-palette_white'
            >
              <path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z' />
            </svg>
          )}
        </span>
      </span>
    </div>
  );
}

interface DepartmentEndorsementStatusProps {
  iMId: string;
}
function DepartmentEndorsementStatus({
  iMId,
}: DepartmentEndorsementStatusProps) {
  const coordinatorEndorsement = useCoordinatorEndorsementIM({
    id: iMId,
  });
  const deanEndorsement = useDeanEndorsementIM({
    id: iMId,
  });

  return (
    <div className='grid grid-cols-2'>
      <StatusItem
        label='Coordinator Endorsement'
        success={Boolean(coordinatorEndorsement)}
      />
      <StatusItem label='Dean Endorsement' success={Boolean(deanEndorsement)} />
    </div>
  );
}

interface CITLReviewStatusProps {
  iMId: string;
}
function CITLReviewStatus({ iMId }: CITLReviewStatusProps) {
  const submittedIDDCoordinatorSuggestion =
    useSubmittedIDDCoordinatorSuggestionIM({
      id: iMId,
    });
  const iDDCoordinatorEndorsement = useIDDCoordinatorEndorsementIM({
    id: iMId,
  });
  const cITLDirectorEndorsement = useCITLDirectorEndorsementIM({
    id: iMId,
  });

  return (
    <div className='grid grid-cols-2'>
      <div className='col-span-2'>
        <StatusItem
          label='IDD Coordinator Review'
          success={Boolean(submittedIDDCoordinatorSuggestion)}
        />
      </div>
      <StatusItem
        label='IDD Coordinator Endorsement'
        success={Boolean(iDDCoordinatorEndorsement)}
      />
      <StatusItem
        label='CITL Director Endorsement'
        success={Boolean(cITLDirectorEndorsement)}
      />
    </div>
  );
}

interface QAMISCollegeEndorsementStatusProps {
  iMId: string;
}
function QAMISCollegeEndorsementStatus({
  iMId,
}: QAMISCollegeEndorsementStatusProps) {
  const chairpersonEndorsement = useQAMISChairpersonEndorsementIM({
    id: iMId,
  });
  const coordinatorEndorsement = useQAMISCoordinatorEndorsementIM({
    id: iMId,
  });
  const deanEndorsement = useQAMISDeanEndorsementIM({
    id: iMId,
  });

  return (
    <div className='grid grid-cols-2'>
      <StatusItem
        label='Chairperson Endorsement'
        success={Boolean(chairpersonEndorsement)}
      />
      <StatusItem
        label='Coordinator Endorsement'
        success={Boolean(coordinatorEndorsement)}
      />
      <StatusItem label='Dean Endorsement' success={Boolean(deanEndorsement)} />
    </div>
  );
}

interface IMERCReviewStatusProps {
  iMId: string;
}
function IMERCReviewStatus({ iMId }: IMERCReviewStatusProps) {
  const contentSpecialistReview = useContentSpecialistReviewIM({
    id: iMId,
  });
  const iDDSpecialistReview = useIDDSpecialistReviewIM({
    id: iMId,
  });
  const contentEditorReview = useContentEditorReviewIM({
    id: iMId,
  });
  const submittedContentSpecialistSuggestion =
    useSubmittedContentSpecialistSuggestionIM({
      id: iMId,
    });
  const submittedIDDSpecialistSuggestion =
    useSubmittedIDDSpecialistSuggestionIM({
      id: iMId,
    });
  const submittedContentEditor = useSubmittedContentEditorSuggestionIM({
    id: iMId,
  });
  return (
    <div className='grid grid-cols-2'>
      <StatusItem
        label='Content Specialist Review'
        success={Boolean(contentSpecialistReview)}
      />
      <StatusItem
        label='Content Specialist Suggestion'
        success={Boolean(submittedContentSpecialistSuggestion)}
      />
      <StatusItem
        label='IDD Specialist Review'
        success={Boolean(iDDSpecialistReview)}
      />
      <StatusItem
        label='IDD Specialist Suggestion'
        success={Boolean(submittedIDDSpecialistSuggestion)}
      />
      <StatusItem
        label='Content Editor Review'
        success={Boolean(contentEditorReview)}
      />
      <StatusItem
        label='Content Editor Suggestion'
        success={Boolean(submittedContentEditor)}
      />
    </div>
  );
}

interface IMERCEndorsementStatusProps {
  iMId: string;
}
function IMERCEndorsementStatus({ iMId }: IMERCEndorsementStatusProps) {
  const iMERCIDDCoordinatorEndorsement = useIMERCIDDCoordinatorEndorsementIM({
    id: iMId,
  });
  const iMERCCITLDirectorEndorsement = useIMERCCITLDirectorEndorsementIM({
    id: iMId,
  });
  return (
    <div className='grid grid-cols-1 my-1'>
      <StatusItem
        label='IDD Coordinator Endorsement'
        success={Boolean(iMERCIDDCoordinatorEndorsement)}
      />
      <StatusItem
        label='CITL Director Endorsement'
        success={Boolean(iMERCCITLDirectorEndorsement)}
      />
    </div>
  );
}
