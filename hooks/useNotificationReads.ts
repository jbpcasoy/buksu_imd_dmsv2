import { NotificationRead } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useNotificationReadsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useNotificationReads({
  skip,
  take,
  filter,
}: useNotificationReadsParams) {
  const [state, setState] = useState<{
    notificationReads: NotificationRead[];
    count: number;
  }>({
    count: 0,
    notificationReads: [],
  });

  useEffect(() => {
    axios
      .get("/api/notification_read", {
        params: {
          skip,
          take,
          filter,
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [skip, take, filter]);

  return state;
}
