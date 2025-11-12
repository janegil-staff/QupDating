
export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-600 via-purple-700 to-gray-900 text-white flex flex-col items-center justify-center px-6">
      
      <section className="text-center max-w-2xl">
   
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Finn kjærligheten i Bergen
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-6">
          Den norske datingappen som setter ekte forbindelser først. Chat, match og møt folk i nærheten — helt gratis.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/register"
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Kom i gang
          </a>
          <a
            href="/about"
            className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-gray-900 transition"
          >
            Les mer
          </a>
        </div>
      </section>

      <section className="mt-12">
        <img
          src="/images/couple-smiling.png"
          alt="Smilende par i Bergen"
          className="rounded-xl shadow-lg max-w-md mx-auto"
        />
      </section>
    </main>
  );
}
