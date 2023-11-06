import { useEffect, useState } from "react";
import { Announcement, IM } from "@prisma/client";
import axios from "axios";

export interface useAnnouncementParams {
  id: string;
}
export default function useAnnouncement({ id }: useAnnouncementParams) {
  const [state, setState] = useState<Announcement | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/announcement/${id}`)
      .then((res) => {
        if(!subscribe) return;
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
        setState(null);
      });

    return () => {
      subscribe = false;
    };
  }, [id]);

  return state;
}
