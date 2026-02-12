"use client";

export function CashflowChart() {
  return (
    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">Évolution des Flux</h3>
          <p className="text-sm text-slate-500">Performances semestrielles du capital</p>
        </div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <span className="size-2 rounded-full bg-primary"></span> Revenus
          </span>
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <span className="size-2 rounded-full bg-slate-300"></span> Dépenses
          </span>
        </div>
      </div>
      <div className="p-6 flex-1 min-h-[300px] flex flex-col justify-end">
        <div className="relative h-64 w-full">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#135bec" stopOpacity="0.2"></stop>
                <stop offset="100%" stopColor="#135bec" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            {/* Area */}
            <path
              d="M0,80 Q10,75 20,60 T40,65 T60,40 T80,50 T100,20 V100 H0 Z"
              fill="url(#chartGradient)"
            ></path>
            {/* Line Revenues */}
            <path
              d="M0,80 Q10,75 20,60 T40,65 T60,40 T80,50 T100,20"
              fill="none"
              stroke="#135bec"
              strokeWidth="2"
            ></path>
            {/* Line Expenses */}
            <path
              d="M0,90 Q10,85 20,88 T40,75 T60,82 T80,70 T100,85"
              fill="none"
              stroke="#94a3b8"
              strokeDasharray="4"
              strokeWidth="1.5"
            ></path>
          </svg>
        </div>
        <div className="flex justify-between mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
          <span>Janv</span>
          <span>Févr</span>
          <span>Mars</span>
          <span>Avr</span>
          <span>Mai</span>
          <span>Juin</span>
        </div>
      </div>
    </div>
  );
}
