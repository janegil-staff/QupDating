export default function EventsModule() {
  // Example data — replace with API fetch
  const events = [
    {
      _id: "1",
      title: "Singles Night at Bryggen",
      date: "2025-11-25",
      location: "Bergen, Norway",
      description: "A cozy evening for singles to mingle by the waterfront.",
      attendees: ["user1", "user2", "user3"],
    },
    {
      _id: "2",
      title: "Hiking Meetup",
      date: "2025-12-02",
      location: "Mount Ulriken",
      description: "Join fellow adventurers for a hike up Bergen’s iconic peak.",
      attendees: ["user4", "user5"],
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-pink-500 mb-6">📅 Manage Events</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-neutral-800 p-6 rounded-xl shadow-md border border-gray-700 hover:border-pink-500 transition"
          >
            {/* Event Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <span className="text-sm text-gray-400">{event.date}</span>
            </div>

            {/* Event Details */}
            <p className="text-sm text-gray-400">{event.location}</p>
            <p className="mt-2 text-gray-300 line-clamp-3">{event.description}</p>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-4">
              <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
                RSVPs ({event.attendees.length})
              </button>
              <button className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm">
                Edit
              </button>
              <button className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
