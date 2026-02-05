import Link from "next/link";
import Footer from "@/components/Footer";

const NEWS = [
  {
    id: 1,
    title: "Hurricane Helene Recovery Efforts Continue Across Southeastern U.S.",
    region: "United States",
    category: "Hurricane",
    date: "Oct 2, 2025",
    excerpt: "Communities in Florida, Georgia, and the Carolinas are rebuilding after catastrophic flooding and wind damage. Federal and state agencies are coordinating relief with local disaster management teams.",
    image: "🌪️",
  },
  {
    id: 2,
    title: "Earthquake Strikes Japan: Early Warning Systems Credited with Saving Lives",
    region: "Japan",
    category: "Earthquake",
    date: "Sep 28, 2025",
    excerpt: "A magnitude 6.2 earthquake hit the Noto Peninsula. The country's advanced early warning system gave residents critical seconds to take cover, highlighting the value of real-time alert technology.",
    image: "🌍",
  },
  {
    id: 3,
    title: "Wildfires Rage Across Mediterranean; Greece and Turkey Evacuate Thousands",
    region: "Mediterranean",
    category: "Wildfire",
    date: "Sep 25, 2025",
    excerpt: "Record heat and dry conditions have fueled unprecedented wildfires. Emergency services are using drones and satellite data to track fire fronts and coordinate evacuations.",
    image: "🔥",
  },
  {
    id: 4,
    title: "Flooding in Pakistan Displaces Millions; International Aid Mobilized",
    region: "Pakistan",
    category: "Flood",
    date: "Sep 20, 2025",
    excerpt: "Monsoon rains have caused severe flooding in Sindh and Punjab. Disaster response teams are working to deliver clean water, shelter, and medical supplies to affected communities.",
    image: "🌊",
  },
  {
    id: 5,
    title: "Volcanic Eruption in Indonesia Triggers Evacuation of 12,000",
    region: "Indonesia",
    category: "Volcanic",
    date: "Sep 15, 2025",
    excerpt: "Mount Marapi has erupted multiple times, spewing ash and forcing mass evacuations. Monitoring systems are tracking seismic activity to predict further eruptions.",
    image: "🌋",
  },
  {
    id: 6,
    title: "Cyclone Threatens East Africa; Madagascar and Mozambique on Alert",
    region: "East Africa",
    category: "Cyclone",
    date: "Sep 10, 2025",
    excerpt: "A strengthening cyclone is expected to make landfall within 48 hours. Preparedness campaigns are urging coastal residents to secure property and follow evacuation orders.",
    image: "🌀",
  },
  {
    id: 7,
    title: "Drought in Amazon Basin Reaches Critical Level; Fires and Health Warnings",
    region: "Brazil",
    category: "Drought",
    date: "Sep 5, 2025",
    excerpt: "The Amazon is experiencing one of its worst dry seasons. Low river levels are affecting transport and drinking water; smoke from forest fires has triggered air quality alerts.",
    image: "☀️",
  },
  {
    id: 8,
    title: "Landslide in Philippines Buries Village; Rescue Operations Underway",
    region: "Philippines",
    category: "Landslide",
    date: "Aug 30, 2025",
    excerpt: "Heavy rains triggered a massive landslide in the southern Philippines. Search and rescue teams are using drones and K-9 units to locate survivors in the debris.",
    image: "⛰️",
  },
];

export default function NewsAndMediaPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-32 sm:pb-20">
          <nav className="text-sm text-slate-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">News and media</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
            News & media
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Disasters and emergency response from around the world. Stay informed with updates on events, relief efforts, and the role of technology in saving lives.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid gap-8 sm:gap-10">
          {NEWS.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-32 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-8 sm:p-6 text-5xl sm:text-4xl">
                  {item.image}
                </div>
                <div className="flex-1 p-6 sm:p-8">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#BF0637]/10 text-[#BF0637]">
                      {item.category}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      {item.region}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 leading-snug">
                    {item.title}
                  </h2>
                  <p className="text-slate-500 text-sm mb-4">{item.date}</p>
                  <p className="text-slate-600 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
