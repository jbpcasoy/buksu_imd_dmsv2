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
import useCollegeIM from "@/hooks/useCollegeIM";
import useDepartmentIM from "@/hooks/useDepartmentIM";
import useIM from "@/hooks/useIM";
import useIMLatestIMFile from "@/hooks/useIMLatestIMFile.";
import useIMLatestPlagiarismFile from "@/hooks/useIMLatestPlagiarismFile";
import useIMLatestQAMISFile from "@/hooks/useIMLatestQAMISFile";
import useIMStatus from "@/hooks/useIMStatus";
import useQAMISRevisionIM from "@/hooks/useQAMISRevisionIM";
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
      .then(() => alert("Successfully endorsed IM"))
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
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
      .then(() => alert("Successfully endorsed IM"))
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
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
      .then(() => alert("Successfully endorsed IM"))
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      })
      .finally(() => {
        router.reload();
      });
  };

  const deleteHandler = (id: string) => {
    axios
      .delete(`/api/im/${id}`)
      .then(() => {
        alert("IM deleted successfully");
        router.push("/department/my_ims");
      })
      .catch((error) => {
        alert(error.response.data.error.message);
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
      .catch((err) => {
        addSnackbar(
          err?.response?.data?.error?.message ?? err.message,
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
            alert("IM has been submitted for endorsement");
          });
      })
      .catch((err) => {
        alert(err?.response?.data?.error?.message ?? err.message);
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
            alert("IM has been submitted for endorsement");
          });
      })
      .catch((err) => {
        alert(err?.response?.data?.error?.message ?? err.message);
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
            return axios.post("/api/imerc_citl_revision", {
              iMFileId: iMFile.id,
              plagiarismFileId: plagiarismFile.id,
            });
          });
      })
      .catch((error) => {
        alert(error.response.data.error.message);
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
          .then(() => {
            alert("IM endorsed successfully");
          });
      })
      .catch((error) => {
        alert(error.response.data.error.message);
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
          .then(() => {
            alert("IM endorsed successfully");
          });
      })
      .catch((error) => {
        alert(error.response.data.error.message);
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
          .then(() => {
            alert("IM endorsed successfully");
          });
      })
      .catch((error) => {
        alert(error.response.data.error.message);
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
          .then(() => {
            alert("IM endorsed successfully");
          });
      })
      .catch((error) => {
        alert(error.response.data.error.message);
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
          .then(() => {
            alert("IM endorsed successfully");
          });
      })
      .catch((error) => {
        alert(error.response.data.error.message);
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
          .then(() => {
            alert("IM endorsed successfully");
          });
      })
      .catch((error) => {
        alert(error.response.data.error.message);
      })
      .finally(() => {
        router.reload();
      });
  };

  if (!iM) return null;

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
                <div className='space-x-2 my-1'>
                  {iM.facultyId !== activeFaculty?.facultyId && (
                    <Link
                      href={`/im/${iM.id}/peer_review`}
                      className='bg-palette_blue text-palette_white py-1 px-2 rounded'
                    >
                      Peer Review
                    </Link>
                  )}

                  {activeCoordinator && (
                    <Link
                      href={`/im/${iM.id}/coordinator_review`}
                      className='bg-palette_blue text-palette_white py-1 px-2 rounded'
                    >
                      Coordinator Review
                    </Link>
                  )}

                  {activeChairperson && (
                    <Link
                      href={`/im/${iM.id}/chairperson_review`}
                      className='bg-palette_blue text-palette_white py-1 px-2 rounded'
                    >
                      Chairperson Review
                    </Link>
                  )}
                </div>
              )}

              {iMStatus === "IMPLEMENTATION_DEPARTMENT_REVIEWED" &&
                iM.facultyId === activeFaculty?.facultyId && (
                  <div className='space-y-1 px-1'>
                    <IMChairpersonSuggestionItems id={iM.id} />
                    <IMCoordinatorSuggestionItems id={iM.id} />
                    <IMPeerSuggestionItems id={iM.id} />
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
                      className='rounded text-palette_white bg-palette_blue px-2 py-1 disabled:bg-opacity-50'
                      disabled={Boolean(!state?.iMFile)}
                      onClick={submitForEndorsementHandler}
                    >
                      Submit for endorsement
                    </button>
                  </div>
                )}

              {(iMStatus === "IMPLEMENTATION_DEPARTMENT_REVISED" ||
                iMStatus ===
                  "IMPLEMENTATION_DEPARTMENT_RETURNED_REVISION_NOT_SUBMITTED") &&
                activeCoordinator && (
                  <div className='space-y-1 p-1'>
                    <IMChairpersonSuggestionItems id={iM.id} editable={false} />
                    <IMCoordinatorSuggestionItems id={iM.id} editable={false} />
                    <IMPeerSuggestionItems id={iM.id} editable={false} />
                    <IMReturnedDepartmentRevisionSuggestionItems
                      id={iM.id}
                      editable={false}
                    />
                    <div className='space-x-1'>
                      <button
                        className='bg-palette_blue text-palette_white rounded px-2 py-1'
                        onClick={coordinatorEndorsementHandler}
                      >
                        Endorse IM
                      </button>
                      <button
                        className='bg-palette_blue text-palette_white rounded px-2 py-1'
                        onClick={returnCoordinatorEndorsementHandler}
                      >
                        Return Revision
                      </button>
                    </div>
                  </div>
                )}

              {iMStatus === "IMPLEMENTATION_DEPARTMENT_COORDINATOR_ENDORSED" &&
                activeDean && (
                  <div>
                    <button
                      className='bg-palette_blue text-palette_white rounded px-2 py-1'
                      onClick={deanEndorsementHandler}
                    >
                      Endorse IM
                    </button>
                  </div>
                )}

              {iMStatus === "IMPLEMENTATION_DEPARTMENT_DEAN_ENDORSED" &&
                activeIDDCoordinator && (
                  <div>
                    <Link
                      href={`/im/${iM.id}/idd_coordinator_suggestion`}
                      className='bg-palette_blue text-palette_white px-2 rounded py-1'
                    >
                      IDD Coordinator Suggestion
                    </Link>
                  </div>
                )}

              {iMStatus === "IMPLEMENTATION_CITL_REVIEWED" &&
                iM.facultyId === activeFaculty?.facultyId && (
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
                    <button
                      className='bg-palette_blue text-palette_white p-2 py-1 rounded'
                      onClick={submitForCITLEndorsementHandler}
                    >
                      Submit for endorsement
                    </button>
                  </div>
                )}

              {(iMStatus === "IMPLEMENTATION_CITL_REVISED" ||
                iMStatus ===
                  "IMPLEMENTATION_CITL_RETURNED_REVISION_NOT_SUBMITTED") &&
                activeIDDCoordinator && (
                  <div className='space-y-1 px-1'>
                    <IMIDDCoordinatorSuggestionItems
                      id={iM.id}
                      editable={false}
                    />
                    <IMReturnedCITLRevisionSuggestionItems
                      id={iM.id}
                      editable={false}
                    />
                    <div className='space-x-1'>
                      <button
                        className='bg-palette_blue text-palette_white p-2 py-1 rounded'
                        onClick={iDDCoordinatorEndorsementHandler}
                      >
                        Endorse IM
                      </button>
                      <button
                        className='bg-palette_blue text-palette_white p-2 py-1 rounded'
                        onClick={returnIDDCoordinatorEndorsementHandler}
                      >
                        Return revision
                      </button>
                    </div>
                  </div>
                )}

              {iMStatus === "IMPLEMENTATION_CITL_IDD_COORDINATOR_ENDORSED" &&
                activeCITLDirector && (
                  <div>
                    <button
                      className='bg-palette_blue text-palette_white px-2 py-1 rounded'
                      onClick={cITLDirectorEndorsementHandler}
                    >
                      Endorse IM
                    </button>
                  </div>
                )}

              {iMStatus === "IMPLEMENTATION_CITL_DIRECTOR_ENDORSED" &&
                iM.facultyId === activeFaculty?.facultyId && (
                  <div>
                    <Link
                      href={`/im/${iM.id}/qamis_suggestion`}
                      className='rounded bg-palette_blue text-palette_white px-2 py-1'
                    >
                      Input QAMIS suggestions
                    </Link>
                  </div>
                )}

              {iMStatus === "IMERC_QAMIS_REVISED" && (
                <div className='space-y-1'>
                  <IMQAMISSuggestionItems id={iM.id} editable={false} />
                  {activeCoordinator && (
                    <button
                      className='bg-palette_blue text-palette_white px-2 py-1 rounded'
                      onClick={onQAMISCoordinatorEndorsement}
                    >
                      Coordinator Endorsement
                    </button>
                  )}
                  {activeChairperson && (
                    <button
                      className='bg-palette_blue text-palette_white px-2 py-1 rounded'
                      onClick={onQAMISChairpersonEndorsement}
                    >
                      Chairperson Endorsement
                    </button>
                  )}
                  {activeDean && (
                    <button
                      className='bg-palette_blue text-palette_white px-2 py-1 rounded'
                      onClick={onQAMISDeanEndorsement}
                    >
                      Dean Endorsement
                    </button>
                  )}
                </div>
              )}

              {iMStatus === "IMERC_QAMIS_DEPARTMENT_ENDORSED" && (
                <div className='space-x-2'>
                  {activeContentSpecialist && (
                    <Link
                      href={`/im/${iM.id}/content_specialist_review`}
                      className='bg-palette_blue text-palette_white px-2 py-1 rounded'
                    >
                      Content Specialist Review
                    </Link>
                  )}

                  {activeCITLDirector && (
                    <Link
                      href={`/im/${iM.id}/content_editor_review`}
                      className='bg-palette_blue text-palette_white px-2 py-1 rounded'
                    >
                      Content Editor Review
                    </Link>
                  )}

                  {activeIDDCoordinator && (
                    <Link
                      href={`/im/${iM.id}/idd_specialist_review`}
                      className='bg-palette_blue text-palette_white px-2 py-1 rounded'
                    >
                      IDD Specialist Review
                    </Link>
                  )}
                </div>
              )}

              {iMStatus === "IMERC_CITL_REVIEWED" &&
                iM.facultyId === activeFaculty?.facultyId && (
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

                    <button
                      className='bg-palette_blue text-palette_white px-2 py-1 rounded mt-1 '
                      onClick={submitForIMERCCITLEndorsementHandler}
                    >
                      Submit for endorsement
                    </button>
                  </div>
                )}

              {(iMStatus === "IMERC_CITL_REVISED" ||
                iMStatus ===
                  "IMPLEMENTATION_IMERC_CITL_RETURNED_REVISION_NOT_SUBMITTED") &&
                activeIDDCoordinator && (
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
                    <div className='space-x-1'>
                      <button
                        className='rounded bg-palette_blue text-palette_white px-2 py-1'
                        onClick={iMERCIDDCoordinatorEndorsementHandler}
                      >
                        Endorse IM
                      </button>
                      <button
                        className='rounded bg-palette_blue text-palette_white px-2 py-1'
                        onClick={returnIMERCIDDCoordinatorEndorsementHandler}
                      >
                        Return revision
                      </button>
                    </div>
                  </div>
                )}

              {iMStatus === "IMERC_CITL_IDD_COORDINATOR_ENDORSED" &&
                activeCITLDirector && (
                  <div>
                    <button
                      className='bg-palette_blue text-palette_white px-2 py-1 rounded'
                      onClick={iMERCCITLDirectorEndorsementHandler}
                    >
                      Endorse IM
                    </button>
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
          alert("IM Updated");
          router.reload();
        })
        .catch((error) => {
          alert(error.response.data.error.message);
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
              <input
                type='submit'
                value='Submit'
                disabled={!formik.isValid}
                className='border rounded py-1 bg-palette_blue text-palette_white'
              />
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
