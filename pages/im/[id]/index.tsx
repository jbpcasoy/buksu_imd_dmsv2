import FileUpload from "@/components/FileUpload";
import IMChairpersonSuggestionItems from "@/components/IMChairpersonSuggestionItems";
import IMContentEditorSuggestionItems from "@/components/IMContentEditorSuggestionItems";
import IMContentSpecialistSuggestionItems from "@/components/IMContentSpecialistSuggestionItems";
import IMCoordinatorSuggestionItems from "@/components/IMCoordinatorSuggestionItems";
import IMIDDCoordinatorSuggestionItems from "@/components/IMIDDCoordinatorSuggestionItems";
import IMIDDSpecialistSuggestionItems from "@/components/IMIDDSpecialistSuggestionItems";
import IMPeerSuggestionItems from "@/components/IMPeerSuggestionItems";
import IMReturnedCITLRevisionSuggestionItems from "@/components/IMReturnedCITLRevisionSuggestionItems";
import IMReturnedDepartmentRevisionSuggestionItems from "@/components/IMReturnedDepartmentRevisionSuggestionItems";
import IMReturnedIMERCCITLRevisionSuggestionItems from "@/components/IMReturnedIMERCCITLRevisionSuggestionItems";
import MainLayout from "@/components/MainLayout";
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
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEventHandler, useState } from "react";

export default function ViewIM() {
  const router = useRouter();
  const iMId = router.query.id;
  const iM = useIM({ id: iMId as string });
  const [state, setState] = useState<{
    iMFile?: File | null;
    plagiarismFile?: File | null;
  }>();
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

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState((prev) => ({ ...prev, iMFile: e.target.files?.item(0) }));
  };
  const onPlagiarismFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState((prev) => ({ ...prev, plagiarismFile: e.target.files?.item(0) }));
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
            alert("IM has been submitted for review");
          });
      })
      .catch((err) => {
        alert(err?.response?.data?.error?.message ?? err.message);
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
      <div className='flex'>
        <div className='flex-1'>
          <h2 className='flex-1 uppercase'>{iM.title}</h2>
          <div className='space-x-4'>
            <span className='text-sm text-palette_grey'>Type: {iM.type}</span>
            <span className='text-sm text-palette_grey'>
              Status: {iMStatus}
            </span>
          </div>
          <p className='text-sm text-palette_grey'>
            Department: {department?.name} | {college?.name}
          </p>
        </div>
        <div>
          {
            <ActionMenu
              activeFaculty={activeFaculty}
              iM={iM}
              iMStatus={iMStatus}
              deleteHandler={deleteHandler}
            />
          }
        </div>
      </div>
      <div className='flex space-x-2 mt-2'>
        <img className='w-10 h-10 rounded-full' src={user?.image ?? ""} />
        <div className='text-sm text-palette_grey'>
          <p className='uppercase font-bold'>{user?.name}</p>
          {iM?.createdAt && (
            <p>
              {DateTime.fromJSDate(new Date(iM.createdAt)).toFormat("DD | t")}
            </p>
          )}
        </div>
      </div>

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
              className='rounded text-palette_white bg-palette_blue px-2 py-1 disabled:bg-opacity-50'
              disabled={Boolean(!state?.iMFile)}
              onClick={submitForReviewHandler}
            >
              Submit for Review
            </button>
          </div>
        )}

      {iMStatus === "IMPLEMENTATION_DEPARTMENT_REVIEW" && (
        <div className='space-x-2'>
          {iM.facultyId !== activeFaculty?.facultyId && (
            <Link href={`/im/${iM.id}/peer_review`} className='border rounded'>
              Peer Review
            </Link>
          )}

          {activeCoordinator && (
            <Link
              href={`/im/${iM.id}/coordinator_review`}
              className='border rounded'
            >
              Coordinator Review
            </Link>
          )}

          {activeChairperson && (
            <Link
              href={`/im/${iM.id}/chairperson_review`}
              className='border rounded'
            >
              Chairperson Review
            </Link>
          )}
        </div>
      )}

      {iMStatus === "IMPLEMENTATION_DEPARTMENT_REVIEWED" &&
        iM.facultyId === activeFaculty?.facultyId && (
          <div>
            <IMChairpersonSuggestionItems id={iM.id} />
            <IMCoordinatorSuggestionItems id={iM.id} />
            <IMPeerSuggestionItems id={iM.id} />
            <IMReturnedDepartmentRevisionSuggestionItems id={iM.id} />
            <input type='file' onChange={onFileChange} accept='.pdf' />
            <button
              className='border rounded'
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
          <div className='space-x-1'>
            <IMChairpersonSuggestionItems id={iM.id} editable={false} />
            <IMCoordinatorSuggestionItems id={iM.id} editable={false} />
            <IMPeerSuggestionItems id={iM.id} editable={false} />
            <IMReturnedDepartmentRevisionSuggestionItems
              id={iM.id}
              editable={false}
            />
            <button
              className='border rounded'
              onClick={coordinatorEndorsementHandler}
            >
              Endorse IM
            </button>
            <button
              className='border rounded'
              onClick={returnCoordinatorEndorsementHandler}
            >
              Return revision
            </button>
          </div>
        )}

      {iMStatus === "IMPLEMENTATION_DEPARTMENT_COORDINATOR_ENDORSED" &&
        activeDean && (
          <div>
            <button className='border rounded' onClick={deanEndorsementHandler}>
              Endorse IM
            </button>
          </div>
        )}

      {iMStatus === "IMPLEMENTATION_DEPARTMENT_DEAN_ENDORSED" &&
        activeIDDCoordinator && (
          <div>
            <Link
              href={`/im/${iM.id}/idd_coordinator_suggestion`}
              className='border rounded'
            >
              IDD Coordinator Suggestion
            </Link>
          </div>
        )}

      {iMStatus === "IMPLEMENTATION_CITL_REVIEWED" &&
        iM.facultyId === activeFaculty?.facultyId && (
          <div>
            <IMIDDCoordinatorSuggestionItems id={iM.id} />
            <IMReturnedCITLRevisionSuggestionItems id={iM.id} />

            <input type='file' onChange={onFileChange} accept='.pdf' />
            <button
              className='border rounded'
              onClick={submitForCITLEndorsementHandler}
            >
              Submit for endorsement
            </button>
          </div>
        )}

      {(iMStatus === "IMPLEMENTATION_CITL_REVISED" ||
        iMStatus === "IMPLEMENTATION_CITL_RETURNED_REVISION_NOT_SUBMITTED") &&
        activeIDDCoordinator && (
          <div className='space-x-1'>
            <IMIDDCoordinatorSuggestionItems id={iM.id} editable={false} />
            <IMReturnedCITLRevisionSuggestionItems
              id={iM.id}
              editable={false}
            />
            <button
              className='border rounded'
              onClick={iDDCoordinatorEndorsementHandler}
            >
              Endorse IM
            </button>
            <button
              className='border rounded'
              onClick={returnIDDCoordinatorEndorsementHandler}
            >
              Return revision
            </button>
          </div>
        )}

      {iMStatus === "IMPLEMENTATION_CITL_IDD_COORDINATOR_ENDORSED" &&
        activeCITLDirector && (
          <div>
            <button
              className='border rounded'
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
              className='border rounded'
            >
              Input QAMIS suggestions
            </Link>
          </div>
        )}

      {iMStatus === "IMERC_QAMIS_REVISED" && (
        <div className='space-x-2'>
          {activeCoordinator && (
            <button
              className='border rounded'
              onClick={onQAMISCoordinatorEndorsement}
            >
              Coordinator Endorsement
            </button>
          )}
          {activeChairperson && (
            <button
              className='border rounded'
              onClick={onQAMISChairpersonEndorsement}
            >
              Chairperson Endorsement
            </button>
          )}
          {activeDean && (
            <button className='border rounded' onClick={onQAMISDeanEndorsement}>
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
              className='border rounded'
            >
              Content Specialist Review
            </Link>
          )}

          {activeCITLDirector && (
            <Link
              href={`/im/${iM.id}/content_editor_review`}
              className='border rounded'
            >
              Content Editor Review
            </Link>
          )}

          {activeIDDCoordinator && (
            <Link
              href={`/im/${iM.id}/idd_specialist_review`}
              className='border rounded'
            >
              IDD Specialist Review
            </Link>
          )}
        </div>
      )}

      {iMStatus === "IMERC_CITL_REVIEWED" &&
        iM.facultyId === activeFaculty?.facultyId && (
          <div>
            <IMContentSpecialistSuggestionItems id={iM.id} />
            <IMIDDSpecialistSuggestionItems id={iM.id} />
            <IMContentEditorSuggestionItems id={iM.id} />
            <IMReturnedIMERCCITLRevisionSuggestionItems id={iM.id} />

            <p>Plagiarism File:</p>
            <input
              type='file'
              onChange={onPlagiarismFileChange}
              accept='.pdf'
            />
            <br />
            <p>IM File:</p>
            <input
              type='file'
              id='im_file'
              onChange={onFileChange}
              accept='.pdf'
            />
            <br />
            <button
              className='border rounded'
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
          <div className='space-x-1'>
            <IMContentSpecialistSuggestionItems id={iM.id} editable={false} />
            <IMIDDSpecialistSuggestionItems id={iM.id} editable={false} />
            <IMContentEditorSuggestionItems id={iM.id} editable={false} />
            <IMReturnedIMERCCITLRevisionSuggestionItems
              id={iM.id}
              editable={false}
            />
            <button
              className='border rounded'
              onClick={iMERCIDDCoordinatorEndorsementHandler}
            >
              Endorse IM
            </button>
            <button
              className='border rounded'
              onClick={returnIMERCIDDCoordinatorEndorsementHandler}
            >
              Return revision
            </button>
          </div>
        )}

      {iMStatus === "IMERC_CITL_IDD_COORDINATOR_ENDORSED" &&
        activeCITLDirector && (
          <div>
            <button
              className='border rounded'
              onClick={iMERCCITLDirectorEndorsementHandler}
            >
              Endorse IM
            </button>
          </div>
        )}

      <div className='flex'>
        {qAMISFile && iMStatus === "IMERC_QAMIS_REVISED" && (
          <div className='flex flex-col w-full'>
            <p className='text-sm font-bold text-center'>QAMIS FILE</p>
            <iframe
              src={`/api/qamis_file/${qAMISFile.id}/pdf`}
              title='QAMIS File'
              className='w-full h-screen'
            />
          </div>
        )}
        {plagiarismFile && iMStatus === "IMERC_CITL_REVISED" && (
          <div className='flex flex-col w-full'>
            <p className='text-sm font-bold text-center'>PLAGIARISM FILE</p>
            <iframe
              src={`/api/plagiarism_file/${plagiarismFile.id}/pdf`}
              title='Plagiarism File'
              className='w-full h-screen'
            />
          </div>
        )}
        {iMFile && (
          <div className='flex flex-col w-full'>
            <p className='text-sm font-bold text-center'>IM FILE</p>
            <iframe
              src={`/api/im_file/${iMFile.id}/pdf`}
              title={iM.title}
              className='w-full h-screen'
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}

interface ActionMenuProps {
  iM: IM;
  activeFaculty?: ActiveFaculty | null;
  iMStatus?: string | null;
  deleteHandler: (id: string) => void;
}
function ActionMenu({
  iM,
  activeFaculty,
  iMStatus,
  deleteHandler,
}: ActionMenuProps) {
  const [state, setState] = useState({
    openMenu: false,
  });

  return (
    <div className='relative inline-block text-left'>
      <div>
        <button
          type='button'
          className='inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500'
          id='options-menu'
          aria-haspopup='true'
          aria-expanded='true'
          onClick={() =>
            setState((prev) => ({ ...prev, openMenu: !prev.openMenu }))
          }
        >
          Actions
          <svg
            className='-mr-1 ml-2 h-5 w-5'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            aria-hidden='true'
          >
            <path
              fillRule='evenodd'
              d='M10 6a4 4 0 100 8 4 4 0 000-8z'
              clipRule='evenodd'
            />
            <path d='M10 4a6 6 0 100 12A6 6 0 0010 4z' />
          </svg>
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
            {iM.facultyId === activeFaculty?.facultyId &&
              iMStatus === "IMPLEMENTATION_DRAFT" && (
                <Link
                  href={`/im/${iM.id}/edit`}
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                  role='menuitem'
                >
                  Edit
                </Link>
              )}
            {iM.facultyId === activeFaculty?.facultyId &&
              iMStatus === "IMPLEMENTATION_DRAFT" && (
                <button
                  onClick={() => deleteHandler(iM.id)}
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                  role='menuitem'
                >
                  Delete
                </button>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
