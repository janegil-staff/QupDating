"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (res.ok && !res.error) {
      router.push("/profile");
    } else {
      setError("Feil e-post eller passord.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 p-6 rounded-xl space-y-4 w-full max-w-md relative"
      >
        <h2 className="text-2xl font-bold text-pink-500">Logg inn</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 rounded bg-neutral-800 text-white"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 rounded bg-neutral-800 text-white"
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 rounded text-white ${
            loading
              ? "bg-neutral-700 cursor-not-allowed"
              : "bg-pink-600 hover:bg-pink-700"
          }`}
        >
          {loading ? "Laster inn..." : "Logg inn"}
        </button>

        {loading && (
          <div className="absolute top-4 right-4">
            <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
          </div>
        )}
        <p>
          Don’t have an account?{" "}
          <Link
            href="/register"
            style={{ color: "#0070f3", fontWeight: "bold" }}
          >
            Register here
          </Link>
        </p>
        <p>
          Forgot your password?{" "}
          <Link
            href="/forgot-password"
            className="text-pink-500 hover:underline"
          >
            Reset it here
          </Link>
        </p>
      </form>
    </div>
  );
}
