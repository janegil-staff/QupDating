"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaUsers,
  FaTrash,
  FaEdit,
  FaCalendarAlt,
  FaPlus,
} from "react-icons/fa";
import ProfileLocation from "@/components/ProfileLocation";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  // RSVP modal state
  const [rsvpEvent, setRsvpEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [editEvent, setEditEvent] = useState(null);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/admin/events");
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

  const handleLocationSelected = (loc) => {
    if (!loc || !loc.lat || !loc.lng) {
      console.error("Invalid location object:", loc);
      return;
    }

    setLocation({
      lat: typeof loc.lat === "function" ? loc.lat() : loc.lat,
      lng: typeof loc.lng === "function" ? loc.lng() : loc.lng,
      name: loc.name || "",
      country: loc.country || "",
    });
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, date, location }),
      });
      if (!res.ok) throw new Error("Failed to create event");
      const newEvent = await res.json();
      console.log(newEvent);
      toast.success("Event created Successfully");
      setEvents([...events, newEvent]);
      setTitle("");
      setDescription("");
      setDate("");
      setLocation("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete event");
      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Error deleting event: " + err.message);
    }
  };

  if (loading) return <p className="text-gray-300">Loading events...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-pink-500 mb-8 flex items-center gap-3">
          <FaCalendarAlt /> Manage Events
        </h1>

        {/* Create Event Form */}
        <form
          onSubmit={handleCreate}
          className="bg-neutral-800 p-6 rounded-xl shadow-md border border-gray-700 mb-8"
        >
          <h2 className="text-xl font-semibold text-pink-500 mb-4 flex items-center gap-2">
            <FaPlus /> Create New Event
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-gray-100 focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Date</label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-gray-100 focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            <div>
              <ProfileLocation
                handleLocationSelected={handleLocationSelected}
                location={location}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-gray-100 focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded text-white"
          >
            Create Event
          </button>
        </form>

        {/* Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event._id} className="p-4 bg-neutral-900 rounded-lg">
              <h2 className="text-lg font-bold text-white">{event.title}</h2>
              <p className="text-gray-400">{event.description}</p>
              <p className="text-gray-300">
                Date: {new Date(event.date).toLocaleDateString()}
              </p>
              {event.location && (
                <div className="mt-2 text-sm text-gray-400">
                  <p>{event.location.name}</p>
                  {event.location.country && (
                    <p>Country: {event.location.country}</p>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleDelete(event._id)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm"
                >
                  <FaTrash /> Delete
                </button>
                <button
                  onClick={() => setEditEvent(event)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm"
                >
                  <FaEdit /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        {editEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-neutral-800 p-6 rounded-xl shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-semibold text-pink-500 mb-4">
                Edit Event
              </h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const res = await fetch(
                      `/api/admin/events/${editEvent._id}`,
                      {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(editEvent),
                      }
                    );
                    if (!res.ok) throw new Error("Failed to update event");
                    const updated = await res.json();
                    toast.success("Event updated successfully");
                    setEvents(
                      events.map((ev) =>
                        ev._id === updated._id ? updated : ev
                      )
                    );
                    setEditEvent(null);
                  } catch (err) {
                    console.error(err);
                    toast.error("Error updating event");
                  }
                }}
              >
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editEvent.title}
                    onChange={(e) =>
                      setEditEvent({ ...editEvent, title: e.target.value })
                    }
                    className="w-full p-2 rounded bg-gray-700 text-gray-100"
                  />
                  <input
                    type="date"
                    value={new Date(editEvent.date).toISOString().slice(0, 10)}
                    onChange={(e) =>
                      setEditEvent({ ...editEvent, date: e.target.value })
                    }
                    className="w-full p-2 rounded bg-gray-700 text-gray-100"
                  />
                  <textarea
                    value={editEvent.description}
                    onChange={(e) =>
                      setEditEvent({
                        ...editEvent,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded bg-gray-700 text-gray-100"
                  />
                  {/* Location editor */}
                  <ProfileLocation
                    handleLocationSelected={(loc) =>
                      setEditEvent({ ...editEvent, location: loc })
                    }
                    location={editEvent.location}
                  />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setEditEvent(null)}
                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded text-white"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* RSVP Modal */}
        {rsvpEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-neutral-800 p-6 rounded-xl shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-semibold text-pink-500 mb-4">
                RSVPs for {rsvpEvent.title}
              </h2>
              {attendees.length > 0 ? (
                <ul className="space-y-2">
                  {attendees.map((user) => (
                    <li
                      key={user._id}
                      className="bg-gray-700 p-2 rounded text-gray-100"
                    >
                      {user.name} ({user.email})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No RSVPs yet.</p>
              )}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setRsvpEvent(null)}
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
