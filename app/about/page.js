import BackButton from "@/components/BackButton";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <div className="max-w-screen-lg mx-auto space-y-12">
        <BackButton />
        
        {/* Hero */}
        <section className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">About QupDating</h1>
          <p className="text-gray-400 text-lg">
            A modern dating experience built around real connections, beautiful moments, and genuine pride.
          </p>
        </section>

        {/* Story */}
        <section className="bg-gray-900 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Why QupDating?</h2>
          <p className="text-gray-300 leading-relaxed">
            QupDating was created to make dating more meaningful. In a world of endless swipes and empty messages, 
            we wanted to build something that feels real. With thoughtful design, a sense of belonging, and a platform 
            that puts emotions first, we give you the chance to meet people you truly want to get to know.
          </p>
        </section>

        {/* Features */}
        <section className="bg-gray-900 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">What Makes Us Unique?</h2>
          <ul className="space-y-4">
            <li className="bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-rose-400">
                🌍 Designed for You
              </h3>
              <p className="text-gray-300">
                Everything is tailored to feel natural — from time zones to expressions and imagery.
              </p>
            </li>
            <li className="bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-rose-400">
                💬 Real-time Messaging with Emojis & Images
              </h3>
              <p className="text-gray-300">
                Send messages instantly with support for images, reactions, and emotions.
              </p>
            </li>
            <li className="bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-rose-400">
                🖼️ Beautiful Profiles with Gallery & Bio
              </h3>
              <p className="text-gray-300">
                Show who you are with large photos, personal text, and authentic charm.
              </p>
            </li>
            <li className="bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-rose-400">
                🎯 Discover & Match with Real People
              </h3>
              <p className="text-gray-300">
                Our system highlights profiles you genuinely share something in common with.
              </p>
            </li>
          </ul>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Ready to Meet Someone?
          </h2>
          <p className="text-gray-400 mb-6">
            Create your profile and join QupDating today.
          </p>
          <a
            href="/register"
            className="inline-block bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-3 rounded-full transition"
          >
            Get Started
          </a>
        </section>
      </div>
    </main>
  );
}
