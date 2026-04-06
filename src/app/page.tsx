
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50 text-slate-900">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-blue-600">
          QueueLess
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          La fin de l'attente physique.
        </p>
      </header>

      <div className="flex flex-col gap-6 w-full max-w-sm">
        <Link
          href="/ticket"
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-center text-lg"
        >
          Utilisateur
        </Link>

        <Link
          href="/login"
          className="block w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 px-6 rounded-lg transition-colors text-center text-lg"
        >
          Professionnel
        </Link>
      </div>

      <footer className="mt-12 text-sm text-slate-400">
        MVP v0.1.0
      </footer>
    </main>
  );
}
