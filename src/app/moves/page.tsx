import Link from 'next/link';
import { moves } from './moves-data';
import { type Move } from './types';

export default function MovesPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Pole Dance Moves</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Browse our collection of pole dance moves. Each move includes detailed instructions,
          requirements, and muscle engagement information.
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button className="px-4 py-2 rounded-full bg-purple-600 text-white text-sm">All</button>
        <button className="px-4 py-2 rounded-full bg-gray-700 text-gray-300 text-sm hover:bg-purple-600">Beginner</button>
        <button className="px-4 py-2 rounded-full bg-gray-700 text-gray-300 text-sm hover:bg-purple-600">Intermediate</button>
        <button className="px-4 py-2 rounded-full bg-gray-700 text-gray-300 text-sm hover:bg-purple-600">Advanced</button>
        <button className="px-4 py-2 rounded-full bg-gray-700 text-gray-300 text-sm hover:bg-purple-600">Expert</button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {moves.map((move) => (
          <div
            key={move.id}
            className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700 hover:border-purple-500 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">{move.name}</h2>
                <div className={`text-sm mb-4 ${
                  move.difficulty === 'Expert' ? 'text-red-400' :
                  move.difficulty === 'Advanced' ? 'text-orange-400' :
                  move.difficulty === 'Intermediate' ? 'text-yellow-400' :
                  'text-green-400'
                }`}>{move.difficulty}</div>
              </div>
            </div>
            
            <p className="text-gray-300 mb-4">{move.description}</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Requirements</h3>
                <ul className="list-disc list-inside text-gray-300 text-sm">
                  {move.requirements.map((req) => (
                    <li key={req}>{req}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Main Muscles</h3>
                <div className="flex flex-wrap gap-2">
                  {move.muscles.map((muscle) => (
                    <span
                      key={muscle}
                      className="px-2 py-1 text-xs rounded-full bg-purple-900/50 text-purple-200 border border-purple-800"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href={`/practice?move=${move.id}`}
                className="inline-block mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Practice Move
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-white mb-4">Safety First</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Always warm up properly before attempting any moves</li>
          <li>Practice moves in order of difficulty</li>
          <li>Master the basics before moving to intermediate and advanced moves</li>
          <li>Take regular breaks and stay hydrated</li>
          <li>If something doesn&apos;t feel right, stop and reassess</li>
          <li>For advanced moves, always practice with a spotter or instructor present</li>
        </ul>
      </div>
    </div>
  );
} 