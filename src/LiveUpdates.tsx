import { useEffect, useState } from 'react';
import { Radio, AlertCircle, Users, Trophy } from "lucide-react";

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
    const baseClasses: string = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex-shrink-0";

    if (variant === "secondary") {
        return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`;
    }
    if (badgeType === "sensor" || badgeType === "rescue") {
        return `${baseClasses} bg-red-600 text-white hover:bg-red-700`;
    }
    return `${baseClasses} bg-red-600 text-white hover:bg-red-700`;
};

const LiveUpdatesSection = () => {
  const liveUpdates = [
    {
      icon: Radio,
      title: "AI Sensor Alert: Temperature Spike Detected",
      badge: "sensor",
      description: "Thermal sensors detected +5°C temperature increase in Aswan zone. Drone surveillance deployed.",
      details: [
        { label: "Temperature", value: "42°C" },
        { label: "Wind Speed", value: "25 km/h" },
        { label: "Humidity", value: "12%" },
        { label: "Risk Level", value: "Critical", critical: true },
      ],
      location: "Aswan, Egypt",
      time: "2 days ago",
    },
    {
      icon: Users,
      title: "Rescue Team Update: 47 Evacuated",
      badge: "rescue",
      description: "Team Alpha successfully evacuated 47 residents from danger zone. Medical support en route.",
      location: "Latakia, Syria",
      time: "5 days ago",
    },
    {
      icon: AlertCircle,
      title: "Relief Supplies Delivered",
      badge: "placed",
      description: "Emergency food kits and medical supplies delivered to Yemen evacuation centers.",
      image: "https://images.pexels.com/photos/34612590/pexels-photo-34612590.jpeg",
      location: "Aden, Yemen",
      time: "7 days ago",
    },
  ];

  const [topContributors, setTopContributors] = useState<Contributor[] | null>(null);
  const [loadingTopContributors, setLoadingTopContributors] = useState(false);
  const [topContributorsError, setTopContributorsError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingTopContributors(true);
      setTopContributorsError(null);
      try {
        const res = await fetch('/api/donations', { credentials: 'include' });
        if (!res.ok) throw new Error(`Donations status ${res.status}`);
        const donations = await res.json();

        const map = new Map<string, { name: string; amount: number; events: number; badges: string[] }>();
        (donations || []).forEach((d: any) => {
          const name = d.DonorUsername || d.Donor || 'Anonymous';
          const key = String(name);
          const amt = Number(d.Amount || 0);
          const existing = map.get(key) || { name: key, amount: 0, events: 0, badges: [] };
          existing.amount += amt;
          existing.events += 1;
          map.set(key, existing);
        });

        const arr = Array.from(map.values())
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5)
          .map((e, i) => ({ name: e.name, amount: e.amount, events: e.events, badges: e.badges, rank: i + 1 }));

        if (mounted) setTopContributors(arr);
      } catch (err: any) {
        console.error('Failed to load top contributors', err);
        if (mounted) setTopContributorsError(err.message || 'Failed to load top contributors');
      } finally {
        if (mounted) setLoadingTopContributors(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Radio className="w-6 h-6 text-red-500 animate-pulse" /> 
              <h2 className="text-2xl font-bold text-gray-900">Live Updates</h2>
            </div>

            <div className="space-y-4">
              {liveUpdates.map((update, index) => {
                const Icon = update.icon;
                return (
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
                {loadingTopContributors && <p className="text-sm text-gray-500">Loading top contributors...</p>}
                {topContributorsError && <p className="text-sm text-red-500">Error: {topContributorsError}</p>}
                {(!loadingTopContributors && !topContributorsError) && (topContributors || []).map((contributor, index) => (
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
                        <span className="text-sm font-bold text-red-600 whitespace-nowrap">
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