import Link from 'next/link';

export default function DocsPage() {
  const categories = [
    {
      title: "Getting Started",
      items: [
        { name: "Quick Start: Adding Hunts Pip to Your Chart", href: "/docs/quick-start" },
        { name: "Settings & Features", href: "#" },
        { name: "Understanding Market Structure", href: "#" },
      ]
    },
    {
      title: "Premium Plan",
      items: [
        { name: "Premium Plan Features", href: "/docs/premium" },
      ]
    },
    {
      title: "Ultimate Plan",
      items: [
        { name: "Ultimate Plan Features", href: "/docs/ultimate" },
      ]
    },
    {
      title: "Trading Strategies",
      items: [
        { name: "Market Structure Trading", href: "#" },
        { name: "Support & Resistance Zones", href: "#" },
        { name: "Advanced Entry Strategies", href: "#" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Corner gradient */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-[600px] h-[600px] opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #DD0000 0%, #FF5B41 50%, transparent 70%)',
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Knowledge Base</span>
        </nav>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Knowledge <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #00dd5e 0%, #ff0000 100%)' }}>Base</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Learn how to use our indicators and get the most out of your trading strategy.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6">{category.title}</h2>
              <ul className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link 
                      href={item.href}
                      className="flex items-center text-gray-300 hover:text-white transition-colors group"
                    >
                      <span className="text-[#00dd5e] mr-3 group-hover:mr-4 transition-all">→</span>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

