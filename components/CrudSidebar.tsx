import ActiveFacultyContext from "@/contexts/ActiveFacultyContext";
import Link from "next/link";
import { useContext } from "react";

export default function CrudSidebar() {
  const items: {
    link: string;
    label: string;
  }[] = [
    {
      link: "/crud",
      label: "Home",
    },
    {
      link: "/crud/user",
      label: "User",
    },
    {
      link: "/crud/college",
      label: "College",
    },
    {
      link: "/crud/department",
      label: "Department",
    },
    {
      link: "/crud/faculty",
      label: "Faculty",
    },
    {
      link: "/crud/active_faculty",
      label: "Active Faculty",
    },
    {
      link: "/crud/im",
      label: "IM",
    },
    {
      link: "/crud/im_file",
      label: "IM File",
    },
    {
      link: "/crud/chairperson",
      label: "Chairperson",
    },
    {
      link: "/crud/coordinator",
      label: "Coordinator",
    },
    {
      link: "/crud/dean",
      label: "Dean",
    },
    {
      link: "/crud/active_coordinator",
      label: "Active Coordinator",
    },
    {
      link: "/crud/active_chairperson",
      label: "Active Chairperson",
    },
    {
      link: "/crud/active_dean",
      label: "Active Dean",
    },
    {
      link: "/crud/department_review",
      label: "Department Review",
    },
    {
      link: "/crud/peer_review",
      label: "Peer Review",
    },
    {
      link: "/crud/peer_suggestion",
      label: "Peer Suggestion",
    },
    {
      link: "/crud/peer_suggestion_item",
      label: "Peer Suggestion Item",
    },
    {
      link: "/crud/submitted_peer_suggestion",
      label: "Submitted Peer Suggestion",
    },
    {
      link: "/crud/chairperson_review",
      label: "Chairperson Review",
    },
    {
      link: "/crud/chairperson_suggestion",
      label: "Chairperson Suggestion",
    },
    {
      link: "/crud/chairperson_suggestion_item",
      label: "Chairperson Suggestion Item",
    },
    {
      link: "/crud/submitted_chairperson_suggestion",
      label: "Submitted Chairperson Suggestion",
    },
    {
      link: "/crud/coordinator_review",
      label: "Coordinator Review",
    },
    {
      link: "/crud/coordinator_suggestion",
      label: "Coordinator Suggestion",
    },
    {
      link: "/crud/coordinator_suggestion_item",
      label: "Coordinator Suggestion Item",
    },
    {
      link: "/crud/submitted_coordinator_suggestion",
      label: "Submitted Coordinator Suggestion",
    },
    {
      link: "/crud/department_revision",
      label: "Department Revision",
    },
    {
      link: "/crud/coordinator_endorsement",
      label: "Coordinator Endorsement",
    },
    {
      link: "/crud/dean_endorsement",
      label: "Dean Endorsement",
    },
    {
      link: "/crud/department_reviewed",
      label: "Department Reviewed",
    },
    {
      link: "/crud/idd_coordinator",
      label: "IDD Coordinator",
    },
    {
      link: "/crud/active_idd_coordinator",
      label: "Active IDD Coordinator",
    },
    {
      link: "/crud/citl_director",
      label: "CITL Director",
    },
    {
      link: "/crud/active_citl_director",
      label: "Active CITL Director",
    },
    {
      link: "/crud/idd_coordinator_suggestion",
      label: "IDD Coordinator Suggestion",
    },
    {
      link: "/crud/idd_coordinator_suggestion_item",
      label: "IDD Coordinator Suggestion Item",
    },
    {
      link: "/crud/submitted_idd_coordinator_suggestion",
      label: "Submitted IDD Coordinator Suggestion",
    },
    {
      link: "/crud/citl_revision",
      label: "CITL Revision",
    },
    {
      link: "/crud/idd_coordinator_endorsement",
      label: "IDD Coordinator Endorsement",
    },
    {
      link: "/crud/citl_director_endorsement",
      label: "CITL Director Endorsement",
    },
    {
      link: "/crud/qamis_suggestion",
      label: "QAMIS Suggestion",
    },
    {
      link: "/crud/qamis_suggestion_item",
      label: "QAMIS Suggestion Item",
    },
    {
      link: "/crud/submitted_qamis_suggestion",
      label: "Submitted QAMIS Suggestion",
    },
    {
      link: "/crud/qamis_file",
      label: "QAMIS File",
    },
    {
      link: "/crud/qamis_revision",
      label: "QAMIS Revision",
    },
    {
      link: "/crud/qamis_coordinator_endorsement",
      label: "QAMIS Coordinator Endorsement",
    },
    {
      link: "/crud/qamis_chairperson_endorsement",
      label: "QAMIS Chairperson Endorsement",
    },
    {
      link: "/crud/qamis_dean_endorsement",
      label: "QAMIS Dean Endorsement",
    },
    {
      link: "/crud/qamis_department_endorsement",
      label: "QAMIS Department Endorsement",
    },
    {
      link: "/crud/content_specialist_review",
      label: "Content Specialist Review",
    },
    {
      link: "/crud/content_specialist_suggestion",
      label: "Content Specialist Suggestion",
    },
    {
      link: "/crud/content_specialist_suggestion_item",
      label: "Content Specialist Suggestion Item",
    },
    {
      link: "/crud/submitted_content_specialist_suggestion",
      label: "Submitted Content Specialist Suggestion",
    },
    {
      link: "/crud/content_editor_review",
      label: "Content Editor Review",
    },
    {
      link: "/crud/content_editor_suggestion",
      label: "Content Editor Suggestion",
    },
    {
      link: "/crud/content_editor_suggestion_item",
      label: "Content Editor Suggestion Item",
    },
    {
      link: "/crud/submitted_content_editor_suggestion",
      label: "Submitted Content Editor Suggestion",
    },
    {
      link: "/crud/idd_specialist_review",
      label: "IDD Specialist Review",
    },
    {
      link: "/crud/idd_specialist_suggestion",
      label: "IDD Specialist Suggestion",
    },
    {
      link: "/crud/idd_specialist_suggestion_item",
      label: "IDD Specialist Suggestion Item",
    },
    {
      link: "/crud/submitted_idd_specialist_suggestion",
      label: "Submitted IDD Specialist Suggestion",
    },
    {
      link: "/crud/imerc_citl_reviewed",
      label: "IMERC CITL Reviewed",
    },
  ];
  return (
    <div className='h-full overflow-y-auto pb-10'>
      <h1 className='py-2 sticky top-0 bg-white shadow'>BUKSU IMD DMS</h1>

      <div className='flex flex-col'>
        {items.map((item) => (
          <Link href={item.link} className='underline' key={item.link}>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
