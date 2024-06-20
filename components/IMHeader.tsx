import useCollegeIM from "@/hooks/useCollegeIM";
import useUserFaculty from "@/hooks/useUserFaculty";
import { IM } from "@prisma/client";

interface IMHeaderProps {
  iM: IM;
  phase: string;
  role: string;
}
export default function IMHeader({ iM, phase, role }: IMHeaderProps) {
  const author = useUserFaculty({
    id: iM.facultyId,
  });
  const college = useCollegeIM({
    id: iM.id,
  });

  return (
    <div className="grid md:grid-cols-4 space-y-2 md:space-y-0">
      <div>
        <p className="font-semibold text-sm">{phase}</p>
        <p className="px-1 border border-palette_orange inline-block rounded-md text-palette_orange font-medium text-xs">
          {role}
        </p>
      </div>
      <div>
        <p className="text-xs text-palette_grey">IM Title</p>
        <p className="text-sm font-semibold">{iM.title}</p>
      </div>
      <div>
        <p className="text-xs text-palette_grey">Author</p>
        <p className="text-sm font-semibold">{author?.name}</p>
      </div>
      <div>
        <p className="text-xs text-palette_grey">College</p>
        <p className="text-sm font-semibold">{college?.name}</p>
      </div>
    </div>
  );
}
