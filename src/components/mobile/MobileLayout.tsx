export function MobileLayout() {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-earth-stone/20 via-white to-earth-sand/20">
      {/* TOP BAR - Current stock or app title */}
      <header className="flex-shrink-0 p-3 bg-white border-b border-earth-stone/30">
        <div className="h-5 w-32 bg-earth-stone/40 rounded" />
      </header>

      {/* HORIZONTAL WATCHLIST SCROLL */}
      <div className="flex-shrink-0 p-2 bg-white border-b border-earth-stone/30">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`flex-shrink-0 h-8 w-20 rounded-full border transition-colors ${
                i === 0 ? 'bg-earth-sand/30 border-earth-sage/50' : 'bg-white border-earth-stone/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* MAIN CONTENT - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Chart */}
        <div className="h-64 p-3">
          <div className="h-full bg-white rounded-lg border border-earth-stone/30 flex items-center justify-center">
            <span className="text-earth-sage font-medium">Chart Area</span>
          </div>
        </div>

        {/* Tabs: Buy/Sell | Trade History */}
        <div className="p-3">
          <div className="flex gap-2 mb-3">
            <div className="h-8 w-20 bg-earth-forest rounded" />
            <div className="h-8 w-24 bg-earth-stone/30 rounded" />
          </div>

          {/* Buy/Sell Form */}
          <div className="bg-white rounded-lg border border-earth-stone/30 p-4 space-y-3">
            <div className="h-10 bg-earth-stone/10 border border-earth-stone/30 rounded" />
            <div className="h-4 w-32 bg-earth-stone/20 rounded" />
            <div className="h-12 w-full bg-earth-forest rounded" />
          </div>

          {/* Trade History */}
          <div className="bg-white rounded-lg border border-earth-stone/30 p-4 mt-4">
            <p className="text-xs font-semibold text-earth-sage uppercase tracking-wider mb-3">
              Trade History
            </p>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-earth-stone/20 last:border-0"
              >
                <div className="h-4 w-16 bg-earth-stone/20 rounded" />
                <div className="h-4 w-10 bg-earth-stone/20 rounded" />
                <div className="h-4 w-12 bg-earth-stone/20 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM NAV - Search, Portfolio, etc. */}
      <nav className="flex-shrink-0 flex items-center justify-around p-3 bg-white border-t border-earth-stone/30">
        <div className="h-5 w-5 bg-earth-stone/40 rounded" />
        <div className="h-5 w-5 bg-earth-stone/40 rounded" />
        <div className="h-5 w-5 bg-earth-stone/40 rounded" />
        <div className="h-5 w-5 bg-earth-stone/40 rounded" />
      </nav>
    </div>
  );
}
