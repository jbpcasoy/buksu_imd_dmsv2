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
      link: "/crud/active_im_file",
      label: "Active IM File",
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
  ];
  return (
    <div className="h-full overflow-y-auto">
      <h1 className="py-2 sticky top-0 bg-white shadow">BUKSU IMD DMS</h1>

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
