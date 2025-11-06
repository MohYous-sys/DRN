import { Radio, AlertCircle, Users, Trophy } from "lucide-react";

// Helper function to map custom badge types to Tailwind classes
type BadgeType = "sensor" | "rescue" | "placed" | string;
type BadgeVariant = "secondary" | "default" | string;

interface UpdateDetail {
    label: string;
    value: string;
    critical?: boolean;
}

interface LiveUpdate {
    icon: any;
    title: string;
    badge?: BadgeType | null;
    description: string;
    details?: UpdateDetail[];
    image?: string;
    location?: string;
    time?: string;
}

interface Contributor {
    name: string;
    amount: number;
    events: number;
    badges: string[];
    rank: number;
}

const getBadgeClasses = (badgeType: BadgeType | null = null, variant: BadgeVariant | null = null): string => {
    const baseClasses: string = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex-shrink-0";

    if (variant === "secondary") {
        return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`;
    }
    
    if (badgeType === "sensor" || badgeType === "rescue") {
        return `${baseClasses} bg-red-600 text-white hover:bg-red-700`;
    }

    return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
};

const LiveUpdatesSection = () => {
  const liveUpdates = [
    {
      icon: Radio,
      title: "AI Sensor Alert: Temperature Spike Detected",
      badge: "sensor",
      description: "Thermal sensors detected +5°C temperature increase in Northern California zone. Drone surveillance deployed.",
      details: [
        { label: "Temperature", value: "42°C" },
        { label: "Wind Speed", value: "25 km/h" },
        { label: "Humidity", value: "12%" },
        { label: "Risk Level", value: "Critical", critical: true },
      ],
      location: "Northern California",
      time: "2 min ago",
    },
    {
      icon: Users,
      title: "Rescue Team Update: 47 Evacuated",
      badge: "rescue",
      description: "Team Alpha successfully evacuated 47 residents from danger zone. Medical support en route.",
      location: "Northern California",
      time: "15 min ago",
    },
    {
      icon: AlertCircle,
      title: "Relief Supplies Delivered",
      badge: "placed",
      description: "Emergency food kits and medical supplies delivered to Bangladesh Delta evacuation centers.",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=200&fit=crop",
      location: "Bangladesh Delta",
      time: "32 min ago",
    },
  ];

  const topContributors = [
    {
      name: "Emily Johnson",
      amount: 15000,
      events: 8,
      badges: ["Top Donor", "Early Responder"],
      rank: 1,
    },
    {
      name: "Michael Chen",
      amount: 12500,
      events: 6,
      badges: ["Flood Relief", "Consistent Supporter"],
      rank: 2,
    },
    {
      name: "Sarah Williams",
      amount: 10200,
      events: 9,
      badges: ["Community Champion", "Monthly Donor"],
      rank: 3,
    },
    {
      name: "David Martinez",
      amount: 8750,
      events: 5,
      badges: ["Hurricane Relief", "Tech Supporter"],
      rank: 4,
    },
    {
      name: "Lisa Anderson",
      amount: 7200,
      events: 7,
      badges: ["Community Builder", "Quick Responder"],
      rank: 5,
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Live Updates */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              {/* Using red as proxy for 'emergency' */}
              <Radio className="w-6 h-6 text-red-500 animate-pulse" /> 
              <h2 className="text-2xl font-bold text-gray-900">Live Updates</h2>
            </div>

            <div className="space-y-4">
              {liveUpdates.map((update, index) => {
                const Icon = update.icon;
                return (
                  // Replaced <Card> with a styled <div>
                  <div 
                    key={index} 
                    className="p-5 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-gray-100">
                        <Icon className="w-5 h-5 text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-bold text-gray-900">{update.title}</h3>
                          
                          <span className={getBadgeClasses(update.badge)}>
                            {update.badge}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">
                          {update.description}
                        </p>

                        {update.details && (
                          <div className="bg-gray-100 rounded-lg p-3 mb-3 grid grid-cols-2 gap-2">
                            {update.details.map((detail, detailIndex) => (
                              <div key={detailIndex}>
                                <div className="text-xs text-gray-500">
                                  {detail.label}
                                </div>
                                <div className={`text-sm font-semibold ${detail.critical ? "text-red-600" : "text-gray-900"}`}>
                                  {detail.value}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {update.image && (
                          <img
                            src={update.image}
                            alt="Update"
                            className="rounded-lg w-full h-32 object-cover mb-3"
                          />
                        )}

                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>📍 {update.location}</span>
                          <span>🕐 {update.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-6 h-6 text-yellow-500" /> 
              <h2 className="text-2xl font-bold text-gray-900">Top Contributors</h2>
            </div>

            <div className="p-5 border rounded-lg bg-white shadow-sm">
              <div className="space-y-4">
                {topContributors.map((contributor, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 pb-4 border-b border-gray-200 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2">
                      {contributor.rank <= 3 ? (
                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                          <Trophy className="w-5 h-5 text-yellow-500" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-gray-500">
                            #{contributor.rank}
                          </span>
                        </div>
                      )}
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-gray-600">
                          {contributor.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <p className="font-bold text-gray-900">{contributor.name}</p>
                        <span className="text-sm font-bold text-blue-600 whitespace-nowrap">
                          ${contributor.amount.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">
                        💚 {contributor.events} events
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {contributor.badges.map((badge, badgeIndex) => (
                          <span 
                            key={badgeIndex} 
                            className={`${getBadgeClasses(null, "secondary")} text-xs`}
                          >
                            {badge}
                          </span>
                        ))}
                        {contributor.rank === 1 && (
                          <span className={`${getBadgeClasses(null, "default")} text-xs`}>
                            +1
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveUpdatesSection;