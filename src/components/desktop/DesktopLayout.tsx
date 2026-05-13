export function DesktopLayout() {
  return (
    <div className="h-full flex flex-row bg-gradient-to-b from-earth-stone/20 via-white to-earth-sand/20">
      {/* LEFT SIDEBAR - Watchlist + Mini Portfolio */}
      <aside className="w-80 flex-shrink-0 border-r border-earth-stone/30 flex flex-col bg-white">
        {/* Search */}
        <div className="p-4 border-b border-earth-stone/30">
          <div className="h-10 bg-earth-stone/10 border border-earth-stone/30 rounded-lg" />
        </div>

        {/* Watchlist chips */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-xs font-semibold text-earth-sage uppercase tracking-wider">Watchlist</p>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                i === 0
                  ? 'bg-earth-sand/30 border-earth-sage/50'
                  : 'bg-white border-earth-stone/30 hover:bg-earth-stone/20'
              }`}
            >
              <div>
                <div className="h-4 w-16 bg-earth-stone/40 rounded" />
                <div className="h-3 w-24 bg-earth-stone/20 rounded mt-1" />
              </div>
              <div className="text-right">
                <div className="h-4 w-14 bg-earth-stone/40 rounded" />
                {/* Terra Cotta on even rows, Warm Crimson on odd rows */}
                {i % 2 === 0 ? (
                  <div className="h-3 w-10 rounded mt-1 ml-auto" style={{ backgroundColor: '#b3423a', opacity: 0.4 }} />
                ) : (
                  <div className="h-3 w-10 rounded mt-1 ml-auto" style={{ backgroundColor: '#b3423a', opacity: 0.4 }} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mini Portfolio Summary */}
        <div className="p-4 border-t border-earth-stone/30 bg-earth-stone/10">
          <p className="text-xs font-semibold text-earth-sage uppercase tracking-wider mb-2">Portfolio</p>
          <div className="h-4 w-32 bg-earth-stone/40 rounded mb-1" />
          <div className="h-3 w-24 bg-earth-stone/20 rounded" />
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* COLOR SWATCH TEST */}
        <div className="p-4 bg-white border-b border-earth-stone/30">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-earth-moss">Terra Cotta:</span>
              <span className="text-sm font-semibold" style={{ color: '#b1524a' }}>-2.45%</span>
              <span className="text-sm font-semibold" style={{ color: '#b1524a' }}>-$4.32</span>
              <div className="h-8 w-16 rounded border" style={{ backgroundColor: '#b1524a', opacity: 0.15, borderColor: '#b1524a' }} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-earth-moss">Warm Crimson:</span>
              <span className="text-sm font-semibold" style={{ color: '#b3423a' }}>-2.45%</span>
              <span className="text-sm font-semibold" style={{ color: '#b3423a' }}>-$4.32</span>
              <div className="h-8 w-16 rounded border" style={{ backgroundColor: '#b3423a', opacity: 0.15, borderColor: '#b3423a' }} />
            </div>
          </div>
        </div>

        {/* Stock header */}
        <div className="p-4 border-b border-earth-stone/30 bg-white">
          <div className="h-6 w-40 bg-earth-stone/40 rounded mb-1" />
          <div className="h-4 w-24 bg-earth-stone/20 rounded" />
        </div>

        {/* Chart */}
        <div className="h-96 p-4">
          <div className="h-full bg-white rounded-lg border border-earth-stone/30 flex items-center justify-center">
            <span className="text-earth-sage font-medium">Chart Area</span>
          </div>
        </div>

        {/* Buy/Sell Form + Trade History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {/* Buy/Sell Form */}
          <div className="bg-white rounded-lg border border-earth-stone/30 p-4">
            <div className="flex gap-2 mb-3">
              <div className="h-8 w-16 bg-earth-forest rounded" />
              {/* Terra Cotta sell button */}
              <div className="h-8 w-16 rounded" style={{ backgroundColor: '#b3423a' }} />
              {/* Warm Crimson sell button */}
              <div className="h-8 w-16 rounded" style={{ backgroundColor: '#b3423a' }} />
            </div>
            <div className="h-10 bg-earth-stone/10 border border-earth-stone/30 rounded mb-3" />
            <div className="h-4 w-32 bg-earth-stone/20 rounded mb-2" />
            <div className="h-10 w-full bg-earth-forest rounded" />
          </div>

          {/* Trade History */}
          <div className="bg-white rounded-lg border border-earth-stone/30 p-4">
            <p className="text-xs font-semibold text-earth-sage uppercase tracking-wider mb-3">
              Trade History
            </p>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-earth-stone/20 last:border-0"
              >
                <div className="h-4 w-20 bg-earth-stone/20 rounded" />
                {/* Terra Cotta on buy rows, Warm Crimson on sell rows */}
                {i % 2 === 0 ? (
                  <div className="h-4 w-12 rounded" style={{ backgroundColor: '#b1524a', opacity: 0.3 }} />
                ) : (
                  <div className="h-4 w-12 rounded" style={{ backgroundColor: '#b1524a', opacity: 0.3 }} />
                )}
                <div className="h-4 w-16 bg-earth-stone/20 rounded" />
                <div className="h-4 w-24 bg-earth-stone/20 rounded" />
              </div>
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-earth-stone/20 last:border-0"
              >
                <div className="h-4 w-20 bg-earth-stone/20 rounded" />
                {/* Terra Cotta on buy rows, Warm Crimson on sell rows */}
                {i % 2 === 0 ? (
                  <div className="h-4 w-12 rounded" style={{ backgroundColor: '#b3423a', opacity: 0.3 }} />
                ) : (
                  <div className="h-4 w-12 rounded" style={{ backgroundColor: '#b3423a', opacity: 0.3 }} />
                )}
                <div className="h-4 w-16 bg-earth-stone/20 rounded" />
                <div className="h-4 w-24 bg-earth-stone/20 rounded" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}