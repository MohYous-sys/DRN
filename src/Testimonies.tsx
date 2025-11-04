import { Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "When the floods came, I thought we'd lost everything. Thanks to the donors and the rapid AI detection, rescue teams found us in time. My family is safe because of your support.",
      name: "Maria Santos",
      role: "Beneficiary",
      location: "Bangladesh Delta",
      badgeClasses: "bg-gray-100 text-gray-700 hover:bg-gray-200", 
    },
    {
      quote: "I love being able to choose exactly what my donation funds—like drone batteries or food kits. The real-time updates showing my impact make me feel truly connected to the mission.",
      name: "Emily Johnson",
      role: "Donor",
      location: "California, USA",
      badgeClasses: "bg-primary text-gray-700 hover:bg-primary/90 bg-gray-100", 
    },
    {
      quote: "The AI sensors give us a 10-20 minute head start on disasters. That's the difference between life and death. Every donation directly powers these life-saving systems.",
      name: "Dr. Sarah Chen",
      role: "Field Coordinator",
      location: "Field Coordinator, California",
      badgeClasses: "bg-gray-100 text-gray-700 hover:bg-gray-200", 
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-100">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Voices from the Field
          </h2>
          <p className="text-gray-500 text-lg">
            Real stories from donors, coordinators, and people whose lives were saved
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <Quote className="w-8 h-8 text-gray-300 mb-4" />
              <p className="text-gray-900 italic mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-gray-600">
                    {testimonial.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <span 
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mt-1 ${testimonial.badgeClasses}`}
                  >
                    {testimonial.role}
                  </span>
                  
                  {testimonial.location && (
                    <p className="text-sm text-gray-500 mt-1">
                      {testimonial.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;