export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          AI<span className="text-primary-600">Packr</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          Your AI-powered travel packing assistant. Get personalized recommendations 
          based on weather, activities, and your wardrobe.
        </p>
        <div className="space-x-4">
          <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
            Get Started
          </button>
          <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </main>
  );
}