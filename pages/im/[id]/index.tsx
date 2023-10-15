import MainLayout from "@/components/MainLayout";
import useActiveCITLDirectorMe from "@/hooks/useActiveCITLDirectorMe";
import useActiveChairpersonMe from "@/hooks/useActiveChairpersonMe";
import useActiveCoordinatorMe from "@/hooks/useActiveCoordinatorMe";
import useActiveDeanMe from "@/hooks/useActiveDeanMe";
import useActiveIDDCoordinatorMe from "@/hooks/useActiveIDDCoordinatorMe";
import useIM from "@/hooks/useIM";
import useIMStatus from "@/hooks/useIMStatus";
import useQAMISRevisionIM from "@/hooks/useQAMISRevisionIM";
import {
  CoordinatorEndorsement,
  DepartmentReview,
  DepartmentRevision,
  IMERCCITLRevision,
  IMFile,
} from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEventHandler, useState } from "react";

export default function ViewIM() {
  const router = useRouter();
  const iMId = router.query.id;
  const iM = useIM({ id: iMId as string });
  const [state, setState] = useState<File | null>();
  const iMStatus = useIMStatus({ id: iMId as string });
  const activeCoordinator = useActiveCoordinatorMe();
  const activeChairperson = useActiveChairpersonMe();
  const activeDean = useActiveDeanMe();
  const activeIDDCoordinator = useActiveIDDCoordinatorMe();
  const activeCITLDirector = useActiveCITLDirectorMe();
  const qAMISRevision = useQAMISRevisionIM({ id: iMId as string });

  const onQAMISChairpersonEndorsement = () => {
    axios
      .post("/api/qamis_chairperson_endorsement", {
        qAMISRevisionId: qAMISRevision?.id,
        activeChairpersonId: activeChairperson?.id,
      })
      .then(() => alert("Successfully endorsed IM"))
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
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
      });
  };

  const deleteHandler = (id: string) => {
    axios.delete(`/api/im/${id}`).then(() => {
      alert("IM deleted successfully");
    });
  };

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState(e.target.files?.item(0));
  };

  const submitForReviewHandler = async () => {
    if (!state || !iMId) return;

    const formData = new FormData();
    formData.append("file", state);
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
    if (!state || !iMId) return;

    const formData = new FormData();
    formData.append("file", state);
    formData.append("iMId", iMId as string);
    return axios
      .post<IMFile>("/api/im_file", formData)
      .then(async (res) => {
        return axios
          .post<DepartmentReview>("/api/department_revision/", {
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

  const submitForCITLEndorsementHandler = async () => {
    if (!state || !iMId) return;

    const formData = new FormData();
    formData.append("file", state);
    formData.append("iMId", iMId as string);
    return axios
      .post<IMFile>("/api/im_file", formData)
      .then(async (res) => {
        return axios
          .post<DepartmentReview>("/api/citl_revision/", {
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

  const submitForIMERCCITLEndorsementHandler = async () => {
    if (!state || !iMId) return;

    const formData = new FormData();
    formData.append("file", state);
    formData.append("iMId", iMId as string);
    return axios
      .post<IMFile>("/api/im_file", formData)
      .then(async (res) => {
        return axios
          .post("/api/imerc_citl_revision/", {
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
      });
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
      });
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
          .post<CoordinatorEndorsement>(`/api/imerc_idd_coordinator_endorsement`, {
            iMERCCITLRevisionId: iMERCCITLRevision.id,
            activeIDDCoordinatorId: activeIDDCoordinator.id,
          })
          .then(() => {
            alert("IM endorsed successfully");
          });
      })
      .catch((error) => {
        alert(error.response.data.error.message);
      });
  };

  if (!iM) return null;

  return (
    <MainLayout>
      <div className='flex'>
        <h2 className='flex-1'>View IM</h2>

        <div>
          <Link href={`/im/${iM.id}/edit`} className='border rounded'>
            edit
          </Link>
          <button
            onClick={() => deleteHandler(iM.id)}
            className='border rounded'
          >
            delete
          </button>
        </div>
      </div>
      <p>id: {iM.id}</p>
      <p>createdAt: {new Date(iM.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(iM.updatedAt).toLocaleString()}</p>
      <p>facultyId: {iM.facultyId}</p>
      <p>title: {iM.title}</p>
      <p>type: {iM.type}</p>
      {iMStatus === "IMPLEMENTATION_DRAFT" && (
        <div>
          <input type='file' onChange={onFileChange} />
          <button className='border rounded' onClick={submitForReviewHandler}>
            Submit for review
          </button>
        </div>
      )}

      {iMStatus === "IMPLEMENTATION_DEPARTMENT_REVIEW" && (
        <div className='space-x-2'>
          <Link href={`/im/${iM.id}/peer_review`} className='border rounded'>
            Peer Review
          </Link>

          <Link
            href={`/im/${iM.id}/coordinator_review`}
            className='border rounded'
          >
            Coordinator Review
          </Link>

          <Link
            href={`/im/${iM.id}/chairperson_review`}
            className='border rounded'
          >
            Chairperson Review
          </Link>
        </div>
      )}

      {iMStatus === "IMPLEMENTATION_DEPARTMENT_REVIEWED" && (
        <div>
          <input type='file' onChange={onFileChange} />
          <button
            className='border rounded'
            onClick={submitForEndorsementHandler}
          >
            Submit for endorsement
          </button>
        </div>
      )}

      {iMStatus === "IMPLEMENTATION_DEPARTMENT_REVISED" && (
        <div>
          <button
            className='border rounded'
            onClick={coordinatorEndorsementHandler}
          >
            Endorse IM
          </button>
        </div>
      )}

      {iMStatus === "IMPLEMENTATION_DEPARTMENT_COORDINATOR_ENDORSED" && (
        <div>
          <button className='border rounded' onClick={deanEndorsementHandler}>
            Endorse IM
          </button>
        </div>
      )}

      {iMStatus === "IMPLEMENTATION_DEPARTMENT_DEAN_ENDORSED" && (
        <div>
          <Link
            href={`/im/${iM.id}/idd_coordinator_suggestion`}
            className='border rounded'
          >
            IDD Coordinator Suggestion
          </Link>
        </div>
      )}

      {iMStatus === "IMPLEMENTATION_CITL_REVIEWED" && (
        <div>
          <input type='file' onChange={onFileChange} />
          <button
            className='border rounded'
            onClick={submitForCITLEndorsementHandler}
          >
            Submit for endorsement
          </button>
        </div>
      )}

      {iMStatus === "IMPLEMENTATION_CITL_REVISED" && (
        <div>
          <button
            className='border rounded'
            onClick={iDDCoordinatorEndorsementHandler}
          >
            Endorse IM
          </button>
        </div>
      )}

      {iMStatus === "IMPLEMENTATION_CITL_IDD_COORDINATOR_ENDORSED" && (
        <div>
          <button
            className='border rounded'
            onClick={cITLDirectorEndorsementHandler}
          >
            Endorse IM
          </button>
        </div>
      )}

      {iMStatus === "IMPLEMENTATION_CITL_DIRECTOR_ENDORSED" && (
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
          <button
            className='border rounded'
            onClick={onQAMISCoordinatorEndorsement}
          >
            Coordinator Endorsement
          </button>
          <button
            className='border rounded'
            onClick={onQAMISChairpersonEndorsement}
          >
            Chairperson Endorsement
          </button>
          <button className='border rounded' onClick={onQAMISDeanEndorsement}>
            Dean Endorsement
          </button>
        </div>
      )}

      {iMStatus === "IMERC_QAMIS_DEPARTMENT_ENDORSED" && (
        <div className='space-x-2'>
          <Link
            href={`/im/${iM.id}/content_specialist_review`}
            className='border rounded'
          >
            Content Specialist Review
          </Link>

          <Link
            href={`/im/${iM.id}/content_editor_review`}
            className='border rounded'
          >
            Content Editor Review
          </Link>

          <Link
            href={`/im/${iM.id}/idd_specialist_review`}
            className='border rounded'
          >
            IDD Specialist Review
          </Link>
        </div>
      )}

      {iMStatus === "IMERC_CITL_REVIEWED" && (
        <div>
          <input type='file' onChange={onFileChange} />
          <button
            className='border rounded'
            onClick={submitForIMERCCITLEndorsementHandler}
          >
            Submit for endorsement
          </button>
        </div>
      )}

      {iMStatus === "IMERC_CITL_REVISED" && (
        <div>
          <button
            className='border rounded'
            onClick={iMERCIDDCoordinatorEndorsementHandler}
          >
            Endorse IM
          </button>
        </div>
      )}
    </MainLayout>
  );
}
