
  import { Heart, Users, MapPin, Package, Radio, TrendingUp } from "lucide-react";

export default function MainSection() {
  return (
    <div className="pb-12 bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-6xl mt-12 rounded-xl overflow-hidden shadow-md relative">
        <img
          src="https://images.pexels.com/photos/28317514/pexels-photo-28317514.jpeg"
          className="w-full h-[425px] object-cover"
        />
        <div className="absolute inset-0 bg-orange-400/70 flex flex-col justify-center items-center text-center px-6 text-white">
          <span className="mb-4 bg-white/20 text-sm px-6 py-2 rounded-full">
          4 Active Disasters Need Your Help Now
          </span>
          <h1 className="text-5xl font-normal leading-tight mb-3">
            Every Second Counts. <br /> Every Donation Saves Lives.
          </h1>
          <p className="max-w-2xl text-white/90 mb-6">
            AI-powered disaster response connecting your donations directly to
            people in crisis. Track real-time impact. See exactly where your
            money goes.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-orange-600 font-semibold px-6 py-2 rounded-md shadow hover:bg-gray-100 transition">
              Donate Now
            </button>
            <button className="bg-transparent border border-white px-6 py-2 rounded-md hover:bg-white/20 transition">
              Track Impact
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-8 max-w-6xl w-full">
        {[
          { label: "Total Raised", value: "$170K+", icon: Heart, color: "text-red-500" },
          { label: "People Helped", value: "12,847", icon: Users, color: "text-blue-500" },
          { label: "Active Disasters", value: "4", icon: MapPin, color: "text-orange-500" },
          { label: "Supplies Sent", value: "3,421", icon: Package, color: "text-green-500" },
          { label: "AI Sensors", value: "156", icon: Radio, color: "text-purple-500" },
          { label: "Response Time", value: "12min", icon: TrendingUp, color: "text-teal-500" },
        ].map((item, i) => (
          
          <div
            key={i}
            className="rounded-xl border-2 border-gray-200 p-6 text-center flex flex-col items-center hover:shadow-md transition-shadow"
          >
            <item.icon className={`mb-4 ${item.color}`} size={32} />
            <h3 className="text-2xl font-bold mt-2">{item.value}</h3>
            <p className="text-gray-600 text-sm">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
