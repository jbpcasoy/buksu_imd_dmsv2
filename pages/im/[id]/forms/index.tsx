import MainLayout from "@/components/MainLayout";
import F001 from "@/components/forms/F001";
import F003 from "@/components/forms/F003";
import F004 from "@/components/forms/F004";
import F005 from "@/components/forms/F005";
import F011 from "@/components/forms/F011";
import F012 from "@/components/forms/F012";
import F013 from "@/components/forms/F013";
import F014 from "@/components/forms/F014";
import F015 from "@/components/forms/F015";
import useF001 from "@/hooks/useF001";
import useF003 from "@/hooks/useF003";
import useF004 from "@/hooks/useF004";
import useF005 from "@/hooks/useF005";
import useF011 from "@/hooks/useF011";
import useF012 from "@/hooks/useF012";
import useF013 from "@/hooks/useF013";
import useF014 from "@/hooks/useF014";
import useF015 from "@/hooks/useF015";
import { useRouter } from "next/router";

export default function FormsPage() {
  const router = useRouter();
  const iMId = router.query.id as string;
  const f001 = useF001({ iMId: iMId as string });
  const f003 = useF003({ iMId: iMId as string });
  const f004 = useF004({ iMId: iMId as string });
  const f005 = useF005({ iMId: iMId as string });
  const f011 = useF011({ iMId: iMId as string });
  const f012 = useF012({ iMId: iMId as string });
  const f013 = useF013({ iMId: iMId as string });
  const f014 = useF014({ iMId: iMId as string });
  const f015 = useF015({ iMId: iMId as string });

  return (
    <MainLayout>
      <div className="bg-palette_white h-full rounded-2xl p-4 space-y-1 flex flex-col overflow-auto">
        <div className="pb-4">
          <div className="inline-flex space-x-1 border border-palette_orange p-2 rounded-lg items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="w-5 h-5 stroke-palette_grey"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
            <h2 className="font-medium ">Forms</h2>
          </div>
        </div>
        <div className="flex-1 overflow-auto ">
          <div className="">{f001 && <F001 {...f001} />}</div>
          <div className="">{f003 && <F003 {...f003} />}</div>
          <div className="">{f004 && <F004 {...f004} />}</div>
          <div className="">{f005 && <F005 {...f005} />}</div>
          <div className="">{f011 && <F011 {...f011} />}</div>
          <div className="">{f012 && <F012 {...f012} />}</div>
          <div className="">{f013 && <F013 {...f013} />}</div>
          <div className="">{f014 && <F014 {...f014} />}</div>
          <div className="">{f015 && <F015 {...f015} />}</div>
        </div>
      </div>
    </MainLayout>
  );
}
