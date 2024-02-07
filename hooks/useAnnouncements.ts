import { Announcement } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useAnnouncementsParams {
  skip: number;
  take: number;
  filter?: object;
  sort?: object;
}
export default function useAnnouncements({
  skip,
  take,
  filter,
  sort,
}: useAnnouncementsParams) {
  const [state, setState] = useState<{
    announcements: Announcement[];
    count: number;
  }>({
    count: 0,
    announcements: [],
  });

  useEffect(() => {
    axios
      .get("/api/announcement", {
        params: {
          skip,
          take,
          filter,
          sort,
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [skip, take, filter, sort]);

  return state;
}
