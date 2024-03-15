import MainLayout from "@/components/MainLayout";
import IMIMERCCITLDirectorEndorsed from "@/components/im/IMIMERCCITLDirectorEndorsed";
import IMIMERCCITLIDDCoordinatorEndorsed from "@/components/im/IMIMERCCITLIDDCoordinatorEndorsed";
import IMIMERCCITLReviewed from "@/components/im/IMIMERCCITLReviewed";
import IMIMERCCITLRevised from "@/components/im/IMIMERCCITLRevised";
import IMImplementationCITLDirectorEndorsed from "@/components/im/IMImplementationCITLDirectorEndorsed";
import IMImplementationCITLReviewed from "@/components/im/IMImplementationCITLReviewed";
import IMImplementationCITLRevised from "@/components/im/IMImplementationCITLRevised";
import IMImplementationDepartmentCoordinatorEndorsed from "@/components/im/IMImplementationDepartmentCoordinatorEndorsed";
import IMImplementationDepartmentDeanEndorsed from "@/components/im/IMImplementationDepartmentDeanEndorsed";
import IMImplementationDepartmentReview from "@/components/im/IMImplementationDepartmentReview";
import IMImplementationDepartmentReviewed from "@/components/im/IMImplementationDepartmentReviewed";
import IMImplementationDepartmentRevised from "@/components/im/IMImplementationDepartmentRevised";
import IMImplementationDraft from "@/components/im/IMImplementationDraft";
import IMImplementationIDDCoordinatorEndorsed from "@/components/im/IMImplementationIDDCoordinatorEndorsed";
import IMQAMISDepartmentEndorsed from "@/components/im/IMQAMISDepartmentEndorsed";
import IMQAMISRevised from "@/components/im/IMQAMISRevised";
import useIMStatus from "@/hooks/useIMStatus";
import useRefresh from "@/hooks/useRefresh";
import { useRouter } from "next/router";

export default function ViewIM() {
  const router = useRouter();
  const iMId = router.query.id as string;
  const { refresh, refreshFlag } = useRefresh();
  const iMStatus = useIMStatus({ id: iMId as string, refreshFlag });

  return (
    <MainLayout>
      {iMStatus === "IMPLEMENTATION_DRAFT" && (
        <IMImplementationDraft
          iMId={iMId}
          onRefresh={refresh}
          refreshFlag={refreshFlag}
        />
      )}
      {iMStatus === "IMPLEMENTATION_DEPARTMENT_REVIEW" && (
        <IMImplementationDepartmentReview
          iMId={iMId}
          onRefresh={refresh}
          refreshFlag={refreshFlag}
        />
      )}
      {(iMStatus === "IMPLEMENTATION_DEPARTMENT_REVIEWED" ||
        iMStatus === "IMPLEMENTATION_DEPARTMENT_RETURNED_REVISION") && (
        <IMImplementationDepartmentReviewed
          iMId={iMId}
          onRefresh={refresh}
          refreshFlag={refreshFlag}
        />
      )}
      {iMStatus === "IMPLEMENTATION_DEPARTMENT_REVISED" && (
        <IMImplementationDepartmentRevised
          iMId={iMId}
          onRefresh={refresh}
          refreshFlag={refreshFlag}
        />
      )}
      {iMStatus === "IMPLEMENTATION_DEPARTMENT_COORDINATOR_ENDORSED" && (
        <IMImplementationDepartmentCoordinatorEndorsed
          iMId={iMId}
          onRefresh={refresh}
          refreshFlag={refreshFlag}
        />
      )}
      {iMStatus === "IMPLEMENTATION_DEPARTMENT_DEAN_ENDORSED" && (
        <IMImplementationDepartmentDeanEndorsed
          iMId={iMId}
          onRefresh={refresh}
          refreshFlag={refreshFlag}
        />
      )}
      {(iMStatus === "IMPLEMENTATION_CITL_REVIEWED" ||
        iMStatus === "IMPLEMENTATION_CITL_RETURNED_REVISION") && (
        <IMImplementationCITLReviewed
          iMId={iMId}
          onRefresh={refresh}
          refreshFlag={refreshFlag}
        />
      )}
      {iMStatus === "IMPLEMENTATION_CITL_REVISED" && (
        <IMImplementationCITLRevised
          iMId={iMId}
          onRefresh={refresh}
          refreshFlag={refreshFlag}
        />
      )}
      {iMStatus === "IMPLEMENTATION_CITL_IDD_COORDINATOR_ENDORSED" && (
        <IMImplementationIDDCoordinatorEndorsed
          iMId={iMId}
          onRefresh={refresh}
          refreshFlag={refreshFlag}
        />
      )}
      {iMStatus === "IMPLEMENTATION_CITL_DIRECTOR_ENDORSED" && (
        <IMImplementationCITLDirectorEndorsed
          iMId={iMId}
          onRefresh={refresh}
          refreshFlag={refreshFlag}
        />
      )}
      {iMStatus === "IMERC_QAMIS_REVISED" && (
        <IMQAMISRevised
          iMId={iMId}
          onRefresh={refresh}
          refreshFlag={refreshFlag}
        />
      )}
      {iMStatus === "IMERC_QAMIS_DEPARTMENT_ENDORSED" && (
        <IMQAMISDepartmentEndorsed
          iMId={iMId}
          onRefresh={refresh}
          refreshFlag={refreshFlag}
        />
      )}
      {(iMStatus === "IMERC_CITL_REVIEWED" ||
        iMStatus === "IMERC_CITL_RETURNED_REVISION") && (
        <IMIMERCCITLReviewed
          iMId={iMId}
          onRefresh={refresh}
          refreshFlag={refreshFlag}
        />
      )}
      {iMStatus === "IMERC_CITL_REVISED" && (
        <IMIMERCCITLRevised
          iMId={iMId}
          onRefresh={refresh}
          refreshFlag={refreshFlag}
        />
      )}
      {iMStatus === "IMERC_CITL_IDD_COORDINATOR_ENDORSED" && (
        <IMIMERCCITLIDDCoordinatorEndorsed
          iMId={iMId}
          onRefresh={refresh}
          refreshFlag={refreshFlag}
        />
      )}
      {iMStatus === "IMERC_CITL_DIRECTOR_ENDORSED" && (
        <IMIMERCCITLDirectorEndorsed
          iMId={iMId}
          onRefresh={refresh}
          refreshFlag={refreshFlag}
        />
      )}
    </MainLayout>
  );
}
