import { Eye, Zap, Shield } from "lucide-react";

const TrustSection = () => {
  const features = [
    {
      icon: Eye,
      title: "100% Transparent",
      description: "Track every dollar from donation to impact. Real-time updates with photos, videos, and sensor data.",
    },
    {
      icon: Zap,
      title: "AI-Powered Speed",
      description: "Our AI sensors detect disasters 10-20 minutes before human eyes. Your donation funds instant response.",
    },
    {
      icon: Shield,
      title: "Direct Impact",
      description: "Choose exactly what you fund—drones, supplies, medical kits. Zero middlemen between you and those in need.",
    },
  ];

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          Why Donors Trust Us
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Icon className="w-8 h-8 text-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;