import CrudLayout from "@/components/CrudLayout";
import useEvents from "@/hooks/useEvents";
import Link from "next/link";
import { useState } from "react";

export default function EventsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { events, count } = useEvents(state);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return { ...prev, skip: nextVal <= count ? nextVal : prev.skip };
    });
  };

  const handlePrev = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };

  return (
    <CrudLayout>
      <div className="flex justify-between">
        <h2>Event</h2>
        <Link className="border rounded" href={`/crud/event/add`}>
          Add
        </Link>
      </div>

      <div>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>id</th>
              <th>createdAt</th>
              <th>updatedAt</th>
              <th>type</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              return (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>{new Date(event.createdAt).toLocaleString()}</td>
                  <td>{new Date(event.updatedAt).toLocaleString()}</td>
                  <td>{event.type}</td>
                  <td>
                    <Link
                      href={`/crud/event/${event.id}`}
                      className="border rounded"
                    >
                      view
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-end space-x-1">
          <p>
            {state.skip} - {state.skip + state.take} of {count}
          </p>
          <button className="border rounded" onClick={handlePrev}>
            prev
          </button>
          <button className="border rounded" onClick={handleNext}>
            next
          </button>
        </div>
      </div>
    </CrudLayout>
  );
}
