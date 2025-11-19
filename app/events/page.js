"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from "react-icons/fa";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); // auto-hide after 3s
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events"); // public events API
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRSVP = async (eventId) => {
    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: "POST",
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error || "Failed to RSVP");
      // Update the event in state with new attendee list
      setEvents(events.map((e) => (e._id === updated._id ? updated : e)));
      showToast(userIsNowAttending ? "You're going!" : "RSVP removed", "success");
    } catch (err) {
      console.error(err);
      showToast("Error RSVPing: " + err.message, "error");
    }
  };

  if (loading) return <p className="text-gray-300">Loading events...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-pink-500 mb-8 flex items-center gap-3">
          <FaCalendarAlt /> Upcoming Events
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-neutral-800 p-6 rounded-xl shadow-md border border-gray-700 hover:border-pink-500 transition cursor-pointer"
              onClick={() => setSelectedEvent(event)}
            >
              <h2 className="text-lg font-semibold">{event.title}</h2>
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <FaMapMarkerAlt /> {event.location}
              </p>
              <p className="text-sm text-gray-400">
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="mt-2 text-gray-300 line-clamp-3">
                {event.description}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRSVP(event._id);
                }}
                className="mt-4 flex items-center gap-2 bg-pink-600 hover:bg-pink-700 px-3 py-1 rounded text-sm"
              >
                <FaUsers /> RSVP ({event.attendees?.length || 0})
              </button>
            </div>
          ))}
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-neutral-800 p-6 rounded-xl shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-semibold text-pink-500 mb-4">
                {selectedEvent.title}
              </h2>
              <p className="text-gray-300 mb-2">{selectedEvent.description}</p>
              <p className="text-gray-400 mb-1">📍 {selectedEvent.location}</p>
              <p className="text-gray-400 mb-4">
                📅 {new Date(selectedEvent.date).toLocaleDateString()}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
