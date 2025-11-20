import AuthWrapper from '@/components/AuthWrapper';

export default function Home() {
  return (
    <main className="min-h-screen bg-base-200">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-8">Job Application Tracker</h1>
        <AuthWrapper />
      </div>
    </main>
  );
}

