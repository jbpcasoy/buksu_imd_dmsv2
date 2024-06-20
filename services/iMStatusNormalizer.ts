export default function iMStatusNormalizer(
  iMStatus: string | null | undefined
) {
  switch (iMStatus) {
    case "IMPLEMENTATION_DRAFT":
      return "Draft";
    case "IMPLEMENTATION_DEPARTMENT_REVIEW":
      return "Department Review";
    case "IMPLEMENTATION_DEPARTMENT_REVIEWED":
      return "Department Reviewed";
    case "IMPLEMENTATION_DEPARTMENT_REVISED":
      return "Department Revised";
    case "IMPLEMENTATION_DEPARTMENT_RETURNED_REVISION":
      return "Returned Department Revision";
    case "IMPLEMENTATION_DEPARTMENT_COORDINATOR_ENDORSED":
      return "Coordinator Endorsed";
    case "IMPLEMENTATION_DEPARTMENT_DEAN_ENDORSED":
      return "Dean Endorsed";
    case "IMPLEMENTATION_CITL_REVIEWED":
      return "CITL Reviewed";
    case "IMPLEMENTATION_CITL_REVISED":
      return "CITL Revised";
    case "IMPLEMENTATION_CITL_RETURNED_REVISION":
      return "Returned CITL Revision";
    case "IMPLEMENTATION_CITL_IDD_COORDINATOR_ENDORSED":
      return "IDD Coordinator Endorsed";
    case "IMPLEMENTATION_CITL_DIRECTOR_ENDORSED":
      return "CITL Director Endorsed";
    case "IMERC_QAMIS_REVISED":
      return "QAMIS Revised";
    case "IMERC_QAMIS_DEPARTMENT_ENDORSED":
      return "QAMIS Department Endorsed";
    case "IMERC_CITL_REVIEWED":
      return "IMERC Reviewed";
    case "IMERC_CITL_REVISED":
      return "IMERC Revised";
    case "IMERC_CITL_RETURNED_REVISION":
      return "Returned IMERC Revision";
    case "IMERC_CITL_IDD_COORDINATOR_ENDORSED":
      return "IMDB Approved";
    case "IMERC_CITL_DIRECTOR_ENDORSED":
      return "Endorsed to VPAA";
    default:
      return "";
  }
}
