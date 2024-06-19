import { SnackbarContext } from "@/components/SnackbarProvider";
import useActiveFaculties from "@/hooks/useActiveFaculties";
import useCoAuthors from "@/hooks/useCoAuthors";
import useDepartmentReviewIM from "@/hooks/useDepartmentReviewIM";
import useRefresh from "@/hooks/useRefresh";
import useUserFaculty from "@/hooks/useUserFaculty";
import { ActiveFaculty, CoAuthor, Faculty, User } from "@prisma/client";
import axios from "axios";
import { useContext, useState } from "react";

interface IMCoAuthorsProps {
  iMId: string;
}

export default function IMCoAuthors({ iMId }: IMCoAuthorsProps) {
  const departmentReview = useDepartmentReviewIM({
    id: iMId,
  });
  const [openOptions, setOpenOptions] = useState(false);
  const [state, setState] = useState<{
    skip: number;
    take: number;
    filter?: {
      name?: string;
      notCoAuthorOfIM?: string;
    };
    sort?: {
      field?: string;
      direction?: string;
    };
    options?: {
      includeName?: boolean;
    };
  }>({
    skip: 0,
    take: 10,
    filter: {
      name: undefined,
      notCoAuthorOfIM: iMId,
    },
    sort: {
      field: "name",
      direction: "asc",
    },
    options: {
      includeName: true,
    },
  });
  console.log("IMCoauthors rendered");
  const { refreshFlag, refresh } = useRefresh();
  const { activeFaculties, count } = useActiveFaculties(state, refreshFlag);
  const { addSnackbar } = useContext(SnackbarContext);
  const [coAuthorsQuery, setCoAuthorsQuery] = useState({
    skip: 0,
    take: Number(process.env.NEXT_PUBLIC_MAX_QUERY_TAKE),
    filter: {
      iMId: iMId,
    },
  });
  const { coAuthors } = useCoAuthors(coAuthorsQuery, refreshFlag);

  const addCoAuthor = async (activeFaculty: ActiveFaculty) => {
    console.log("Adding co-author");
    return axios
      .post(`/api/co_author/`, {
        iMId,
        activeFacultyId: activeFaculty.id,
      })
      .then(() => {
        addSnackbar("Co-author added successfully");
        refresh();
      })
      .catch((err: any) => {
        addSnackbar(
          err?.response?.data?.error?.message ?? "Unknown Error",
          "error"
        );
      });
  };

  return (
    <div className="">
      {!departmentReview && (
        <div>
          <input
            type="text"
            placeholder="Name"
            className="w-52 mb-1 rounded-lg border border-palette_orange focus:rounded-b-none focus:border-gray-500 focus:bg-white focus:ring-0"
            onChange={(e) => {
              setState((prev) => ({
                ...prev,
                filter: {
                  ...prev.filter,
                  name: e.target.value === "" ? undefined : e.target.value,
                },
              }));
            }}
            onFocus={() => {
              setOpenOptions(true);
            }}
            onBlur={(e) => {
              if (!e.relatedTarget || !e.relatedTarget.closest(".options")) {
                setOpenOptions(false);
              }
            }}
          />
          {count > 0 && openOptions && (
            <div className="rounded-b shadow-lg w-72 absolute bg-white options">
              {activeFaculties.map((activeFaculty) => (
                <FacultyOption
                  activeFaculty={activeFaculty}
                  key={activeFaculty.id}
                  onSelectFaculty={() => addCoAuthor(activeFaculty)}
                />
              ))}
            </div>
          )}
          {count < 1 && openOptions && (
            <div className="rounded-b shadow-lg w-72 absolute bg-white">
              <p className="text-palette_grey p-2 text-center">None found</p>
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col items-left gap-1">
        {coAuthors.map((coAuthor) => {
          return (
            <CoAuthorChip
              key={coAuthor.id}
              coAuthor={coAuthor}
              onDelete={refresh}
              allowDelete={!departmentReview}
            />
          );
        })}
        {coAuthors.length < 1 && (
          <div className="bg-palette_light_grey_2 rounded-lg p-2 flex items-center min-w-52 text-sm">
            <p>N/A</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface CoAuthorChipProps {
  coAuthor: CoAuthor;
  onDelete: () => any;
  allowDelete?: boolean;
}

function CoAuthorChip({
  coAuthor,
  onDelete,
  allowDelete = true,
}: CoAuthorChipProps) {
  const user = useUserFaculty({
    id: coAuthor.facultyId,
  });
  const [loading, setLoading] = useState(false);

  axios.interceptors.request.use(
    function (config) {
      setLoading(true);
      return config;
    },
    function (error) {
      console.log({ error });
      setLoading(false);
      return Promise.reject(error);
    }
  );
  axios.interceptors.response.use(
    function (response) {
      setLoading(false);
      return response;
    },
    function (error) {
      console.log({ error });
      setLoading(false);
      return Promise.reject(error);
    }
  );
  const { addSnackbar } = useContext(SnackbarContext);
  const handleDelete = async () => {
    return axios
      .delete(`/api/co_author/${coAuthor.id}`)
      .then(() => {
        onDelete();
      })
      .catch((error: any) => {
        addSnackbar(
          error?.response?.data?.error?.message ?? "Unknown Error",
          "error"
        );
      });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-palette_orange rounded-lg p-2 flex items-center justify-between space-x-1 min-w-52 text-ellipsis overflow-hidden text-sm">
      <p>{user.name}</p>
      {allowDelete && (
        <button
          disabled={loading}
          className="bg-palette_blue rounded-full h-3 w-3 hover:bg-opacity-90 active:bg-opacity-100 flex items-center justify-center"
          onClick={handleDelete}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            className="h-2 w-2 fill-palette_white"
          >
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </button>
      )}
    </div>
  );
}

interface FacultyOptionProps {
  activeFaculty: ActiveFaculty;
  onSelectFaculty: () => any;
}
function FacultyOption({ activeFaculty, onSelectFaculty }: FacultyOptionProps) {
  type TypedActiveFaculty = ActiveFaculty & {
    Faculty: Faculty & { User: User };
  };
  const typedActiveFaculty: TypedActiveFaculty =
    activeFaculty as TypedActiveFaculty;
  return (
    <div className="hover:bg-palette_grey hover:bg-opacity-10 active:bg-opacity-30 w-72 p-1 text-palette_blue cursor-pointer select-none">
      <p
        onMouseDown={() => {
          onSelectFaculty();
        }}
      >
        {typedActiveFaculty.Faculty.User.name}
      </p>
    </div>
  );
}
