"use client"

export default function AchievementsSection({ achievements }) {
  const achievementCategories = [
    { id: 1, name: "Victories", icon: "🏆", color: "bg-yellow-500" },
    { id: 2, name: "Social", icon: "👥", color: "bg-blue-500" },
    { id: 3, name: "Skills", icon: "⚔️", color: "bg-purple-500" },
    { id: 4, name: "Events", icon: "🎪", color: "bg-green-500" },
    { id: 5, name: "Collector", icon: "💎", color: "bg-pink-500" },
  ]

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 card-hover border-2 border-green-200">
      <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-emerald-800">Achievements</h3>
        </div>
      </div>
      <div className="p-4">
        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-white rounded-lg shadow-md p-3 flex items-center space-x-3 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <div
                  className={`${achievementCategories.find((c) => c.id === achievement.category)?.color} w-10 h-10 rounded-full flex items-center justify-center text-white text-xl`}
                >
                  {achievement.icon}
                </div>
                <div>
                  <h4 className="font-medium">{achievement.name}</h4>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No achievements yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
