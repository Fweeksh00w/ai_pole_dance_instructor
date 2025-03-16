import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Welcome to AI Pole Dance Instructor</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Learn pole dancing with real-time AI feedback, personalized guidance, and track your progress
          as you master new moves.
        </p>
      </section>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Real-time Feedback</h2>
          <p className="text-gray-300">
            Get instant feedback on your form and technique using advanced AI pose estimation technology.
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Structured Learning</h2>
          <p className="text-gray-300">
            Follow a progressive curriculum from beginner to advanced moves, with detailed tutorials and safety guidance.
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Track Progress</h2>
          <p className="text-gray-300">
            Monitor your improvement over time with detailed analytics and achievement tracking.
          </p>
        </div>
      </div>

      <section className="text-center space-y-6">
        <h2 className="text-2xl font-semibold text-white">Ready to Start?</h2>
        <div className="flex justify-center gap-4">
          <a
            href="/practice"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Start Practice
          </a>
          <a
            href="/moves"
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Browse Moves
          </a>
        </div>
      </section>

      <section className="bg-red-900/20 border border-red-800 rounded-lg p-6 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-white mb-4">Safety First</h2>
        <p className="text-gray-300">
          Please ensure you have proper safety equipment, including a secure pole and crash mats.
          Always warm up before practicing and listen to your body. If you&apos;re new to pole dancing,
          we recommend taking in-person classes alongside using this app.
        </p>
      </section>
    </div>
  );
}
