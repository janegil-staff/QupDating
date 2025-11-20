"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [localImages, setLocalImages] = useState([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Upload images first
      const formData = new FormData();
      localImages.forEach((img) => formData.append("images", img.file));

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const { images } = await uploadRes.json();

      // Submit registration
      const form = new FormData(e.target);
      form.append("images", JSON.stringify(images));

      const res = await fetch("/api/register", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      const result = await signIn("credentials", {
        email: form.get("email"),
        password: form.get("password"),
        redirect: false,
      });

      if (result.ok) {
        toast.success("User created successfully, an email has been sendt to you. If you cant see it, look in the garbage mail");
        router.push("/profile/edit");
      }
    } catch (error) {
      console.error("Register failed:", result.error);
      toast.error("Register failed:", result.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-neutral-900 p-6 rounded-xl shadow-xl space-y-5"
      >
        <h2 className="text-3xl font-bold text-pink-500 text-center">
          Create Profile
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        {/* Birthdate */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Birthdate
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* Day */}
            <select
              name="birthDay"
              required
              className="bg-neutral-800 text-white px-4 py-2 rounded-lg border border-gray-700"
            >
              <option value="">Day</option>
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            {/* Month */}
            <select
              name="birthMonth"
              required
              className="bg-neutral-800 text-white px-4 py-2 rounded-lg border border-gray-700"
            >
              <option value="">Month</option>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month, i) => (
                <option key={month} value={i + 1}>
                  {month}
                </option>
              ))}
            </select>

            {/* Year */}
            <select
              name="birthYear"
              required
              className="bg-neutral-800 text-white px-4 py-2 rounded-lg border border-gray-700"
            >
              <option value="">Year</option>
              {[...Array(82)].map((_, i) => {
                const year = new Date().getFullYear() - i - 18;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <select
          name="gender"
          required
          className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <ImageUploader onImagesChange={setLocalImages} />

        <button
          type="submit"
          className="w-full py-2 px-4 bg-pink-500 text-white rounded hover:bg-pink-600 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Creating account...
            </div>
          ) : (
            "Register"
          )}
        </button>

        <p className="mt-4 text-sm text-center text-gray-400">
          Already a member?{" "}
          <a href="/login" className="text-pink-500 hover:underline">
            Log in here
          </a>
        </p>
      </form>
    </div>
  );
}
