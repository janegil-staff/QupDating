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

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  // Edit modal state
  const [editingEvent, setEditingEvent] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editLocation, setEditLocation] = useState("");

  // RSVP modal state
  const [rsvpEvent, setRsvpEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);

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

  // Create event
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


  // Open edit modal
  const handleEdit = (event) => {
    setEditingEvent(event);
    setEditTitle(event.title);
    setEditDescription(event.description);
    const isoDate = new Date(event.date).toISOString().slice(0, 10);
    setEditDate(isoDate);
    setEditLocation(event.location);
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editingEvent?._id) return;
    try {
      const res = await fetch(`/api/admin/events/${editingEvent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          date: editDate,
          location: editLocation,
        }),
      });
      if (!res.ok) throw new Error("Failed to update event");
      const updated = await res.json();
      setEvents(events.map((e) => (e._id === updated._id ? updated : e)));
      setEditingEvent(null);
    } catch (err) {
      console.error(err);
    }
  };

  // RSVPs
  const handleRSVPs = async (event) => {
    try {
      const res = await fetch(`/api/admin/events/${event._id}/rsvps`);
      if (!res.ok) throw new Error("Failed to fetch RSVPs");
      const attendeesData = await res.json();
      setAttendees(attendeesData);
      setRsvpEvent(event);
    } catch (err) {
      console.error(err);
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
              <label className="block text-gray-300 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-gray-100 focus:ring-2 focus:ring-pink-500"
                required
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
            <div
              key={event._id}
              className="bg-neutral-800 p-6 rounded-xl shadow-md border border-gray-700 hover:border-pink-500 transition"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">{event.title}</h2>
                <span className="text-sm text-gray-400">
                  {new Date(event.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-400">{event.location}</p>
              <p className="mt-2 text-gray-300 line-clamp-3">
                {event.description}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => handleRSVPs(event)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                >
                  <FaUsers /> RSVPs ({event.attendees?.length || 0})
                </button>
                <button
                  onClick={() => handleEdit(event)}
                  className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

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
