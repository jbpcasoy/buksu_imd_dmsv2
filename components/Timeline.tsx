import { Event } from "@prisma/client";

interface TimelineProps {
  events: Event[];
}

export default function Timeline({ events }: TimelineProps) {
  // return <!-- component -->
  return (
    <div className="bg-white rounded-lg flex flex-col h-full overflow-auto">
      <div className="relative px-4 flex-1 h-full">
        <div className="absolute h-full border border-dashed border-opacity-20 border-secondary"></div>

        {events.map((event) => {
          return (
            <div
              className="flex items-center w-full my-6 -ml-1.5"
              key={event.id}
            >
              <div className="w-1/12 z-10">
                <div className="w-3.5 h-3.5 bg-palette_light_blue rounded-full"></div>
              </div>
              <div className="w-11/12">
                <p className="text-sm">{event.message}</p>
                <p className="text-xs text-gray-500">3 min ago</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
