'use client';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Code Control</h1>
        <p className="text-gray-600 text-sm">
          Supabase Auth scaffold — wire @supabase/auth-ui-react here for production login.
        </p>
        <a href="/projects" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg">
          Continue to Projects (dev)
        </a>
      </div>
    </main>
  );
}
