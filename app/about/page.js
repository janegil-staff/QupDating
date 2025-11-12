import BackButton from "@/components/BackButton";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <div className="max-w-screen-lg mx-auto space-y-12">
        <BackButton />
        {/* Hero */}
        <section className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Om QupDating</h1>
          <p className="text-gray-400 text-lg">
            En norsk datingopplevelse som handler om ekte forbindelser, vakre
            øyeblikk og lokal stolthet.
          </p>
        </section>

        {/* Story */}
        <section className="bg-gray-900 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Hvorfor QupDating?</h2>
          <p className="text-gray-300 leading-relaxed">
            QupDating ble skapt for å gjøre dating mer meningsfullt. I en verden
            av raske sveip og tomme meldinger, ønsket vi å bygge noe som føles
            ekte. Med norsk design, lokal tilhørighet og en plattform som setter
            følelser først, gir vi deg muligheten til å møte mennesker du
            faktisk vil bli kjent med.
          </p>
        </section>

        {/* Features */}
        <section className="bg-gray-900 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Hva gjør oss unike?</h2>
          <ul className="space-y-4">
            <li className="bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-rose-400">
                🇳🇴 Norsk design og språk
              </h3>
              <p className="text-gray-300">
                Alt er tilpasset norske brukere – fra tidssone til uttrykk og
                bilder.
              </p>
            </li>
            <li className="bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-rose-400">
                💬 Direktemeldinger med emojis og bilder
              </h3>
              <p className="text-gray-300">
                Send meldinger i sanntid med støtte for bilder og følelser.
              </p>
            </li>
            <li className="bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-rose-400">
                🖼️ Vakre profiler med galleri og bio
              </h3>
              <p className="text-gray-300">
                Vis hvem du er med store bilder, personlig tekst og lokal sjarm.
              </p>
            </li>
            <li className="bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-rose-400">
                🎯 Oppdag og match med ekte mennesker
              </h3>
              <p className="text-gray-300">
                Vårt system viser deg profiler du faktisk har noe til felles
                med.
              </p>
            </li>
          </ul>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Klar for å finne noen?
          </h2>
          <p className="text-gray-400 mb-6">
            Opprett en profil og bli en del av QupDating i dag.
          </p>
          <a
            href="/register"
            className="inline-block bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-3 rounded-full transition"
          >
            Kom i gang
          </a>
        </section>
      </div>
    </main>
  );
}
