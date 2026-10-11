import React, { useState } from 'react';
import { Droplet, Flame, CloudRain, ShieldAlert, ArrowDown, Activity as ActivityIcon } from 'lucide-react';

export const InteractiveSimulation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'infiltration' | 'heat-demand'>('infiltration');

  // Simulator 1: Rainwater Infiltration vs Runoff
  const [rainfallMm, setRainfallMm] = useState<number>(60); // 10 to 120 mm
  const [pavedPercent, setPavedPercent] = useState<number>(70); // 0 to 95%
  const [soilType, setSoilType] = useState<'alluvium' | 'basalt' | 'clay'>('basalt');

  // Infiltration calculation
  const soilPermeabilityFactor = soilType === 'alluvium' ? 0.75 : soilType === 'basalt' ? 0.45 : 0.25;
  const unpavedFraction = (100 - pavedPercent) / 100;
  const potentialInfiltration = rainfallMm * unpavedFraction * soilPermeabilityFactor;
  const actualInfiltrationMm = Math.round(potentialInfiltration * 10) / 10;
  const runoffMm = Math.round((rainfallMm - actualInfiltrationMm) * 10) / 10;
  const runoffPercentage = Math.round((runoffMm / rainfallMm) * 100);

  // Simulator 2: Heatwave & Water Demand Surge
  const [ambientTempC, setAmbientTempC] = useState<number>(42);
  const [humidityPercent, setHumidityPercent] = useState<number>(38);

  // Evaporation & Demand calculations
  const baselineDemandLitersPerCapita = 135; // standard Indian municipal benchmark
  const tempExcess = Math.max(0, ambientTempC - 30);
  const waterDemandSurgePercent = Math.min(65, Math.round(tempExcess * 3.4));
  const dailyEvaporativeDepthMm = Math.round((3 + tempExcess * 0.6) * 10) / 10;
  // Simplified Stull wet-bulb estimation approximation
  const estimatedWetBulbC = Math.round(
    ambientTempC * Math.atan(0.151977 * Math.pow(humidityPercent + 8.313659, 0.5)) +
    Math.atan(ambientTempC + humidityPercent) -
    Math.atan(humidityPercent - 1.676331) +
    0.00391838 * Math.pow(humidityPercent, 1.5) * Math.atan(0.023101 * humidityPercent) -
    4.686035
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
        <div>
          <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block mb-1">
            Interactive Hydrology & Climate Laboratory
          </span>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Cause & Effect: Why Local Conditions Determine Survival
          </h2>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setActiveTab('infiltration')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'infiltration'
                ? 'bg-white text-teal-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Infiltration vs Runoff</span>
          </button>
          <button
            onClick={() => setActiveTab('heat-demand')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'heat-demand'
                ? 'bg-white text-rose-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Heat & Water Stress</span>
          </button>
        </div>
      </div>

      {activeTab === 'infiltration' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* CONTROLS */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Rainfall Intensity:</span>
                <span className="font-mono text-teal-800 font-bold">{rainfallMm} mm / hour</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                step="5"
                value={rainfallMm}
                onChange={(e) => setRainfallMm(Number(e.target.value))}
                className="w-full accent-teal-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Light Drizzle (10mm)</span>
                <span>Monsoon Downpour (60mm)</span>
                <span>Cloudburst (120mm)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Impervious Concrete Paving:</span>
                <span className="font-mono text-rose-700 font-bold">{pavedPercent}% Covered</span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                step="5"
                value={pavedPercent}
                onChange={(e) => setPavedPercent(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Natural Sponge / Parks (10%)</span>
                <span>Suburban (50%)</span>
                <span>Dense Concrete Urban Core (90%)</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Regional Subsoil Hydrogeology
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSoilType('alluvium')}
                  className={`p-2 text-xs rounded-lg border text-left transition-colors ${
                    soilType === 'alluvium'
                      ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-[11px] uppercase">Alluvium Sand</div>
                  <div className="text-[10px] text-slate-500 font-normal">High Infiltration</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSoilType('basalt')}
                  className={`p-2 text-xs rounded-lg border text-left transition-colors ${
                    soilType === 'basalt'
                      ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-[11px] uppercase">Deccan Basalt</div>
                  <div className="text-[10px] text-slate-500 font-normal">Moderate Fractures</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSoilType('clay')}
                  className={`p-2 text-xs rounded-lg border text-left transition-colors ${
                    soilType === 'clay'
                      ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-[11px] uppercase">Black Cotton Clay</div>
                  <div className="text-[10px] text-slate-500 font-normal">Slow Permeability</div>
                </button>
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 leading-relaxed">
              <strong>Key Principle:</strong> Rain does NOT automatically become groundwater. When {pavedPercent}% of the land is paved, {runoffPercentage}% of this rainfall rushes across the streets as flash runoff without reaching the aquifer!
            </div>
          </div>

          {/* VISUAL OUTPUT DISPLAY */}
          <div className="lg:col-span-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-4">
              Real-Time Simulated Water Split
            </h4>

            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-rose-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                    Surface Runoff (Flood Risk)
                  </span>
                  <span className="font-mono text-rose-700 font-bold">
                    {runoffMm} mm ({runoffPercentage}%)
                  </span>
                </div>
                <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 transition-all duration-300"
                    style={{ width: `${runoffPercentage}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    Groundwater Recharge Infiltration
                  </span>
                  <span className="font-mono text-emerald-800 font-bold">
                    {actualInfiltrationMm} mm ({100 - runoffPercentage}%)
                  </span>
                </div>
                <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${100 - runoffPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center p-3 bg-white rounded-lg border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                  Aquifer Replenishment
                </span>
                <span className="text-lg font-bold font-mono text-emerald-700">
                  +{actualInfiltrationMm} mm
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Water table recharge</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                  Street Inundation Threat
                </span>
                <span className="text-lg font-bold font-mono text-rose-700">
                  {runoffPercentage > 65 ? 'High Flood' : runoffPercentage > 40 ? 'Moderate' : 'Low'}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Drainage culvert capacity</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* SIMULATOR 2 CONTROLS */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Peak Summer Ambient Temperature:</span>
                <span className="font-mono text-rose-700 font-bold">{ambientTempC}°C</span>
              </div>
              <input
                type="range"
                min="30"
                max="48"
                step="1"
                value={ambientTempC}
                onChange={(e) => setAmbientTempC(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Moderate (30°C)</span>
                <span>Heatwave (42°C)</span>
                <span>Extreme Emergency (48°C)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Relative Humidity:</span>
                <span className="font-mono text-amber-700 font-bold">{humidityPercent}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="85"
                step="5"
                value={humidityPercent}
                onChange={(e) => setHumidityPercent(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Dry Desert Air (15%)</span>
                <span>Inland Plains (40%)</span>
                <span>Humid Coast (80%)</span>
              </div>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 leading-relaxed">
              <strong>Coupled Impact:</strong> Extreme heat directly drives water consumption and lake evaporation. At {ambientTempC}°C, municipal water demand surges by +{waterDemandSurgePercent}%, triggering heavy borewell extraction exactly when surface ponds lose {dailyEvaporativeDepthMm} mm every single day!
            </div>
          </div>

          {/* SIMULATOR 2 DISPLAY */}
          <div className="lg:col-span-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-4">
              Heat-Induced Environmental Strain
            </h4>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                  Water Demand Surge
                </span>
                <span className="text-xl font-bold font-mono text-rose-700">
                  +{waterDemandSurgePercent}%
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Over baseline 135 LPCD
                </span>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                  Open Lake Evaporation
                </span>
                <span className="text-xl font-bold font-mono text-amber-600">
                  {dailyEvaporativeDepthMm} mm/day
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Daily surface water loss
                </span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-700">Physiological Wet-Bulb Temp:</span>
                <span className="font-mono font-bold text-slate-900">{estimatedWetBulbC}°C</span>
              </div>
              <div className="text-xs text-slate-600 leading-relaxed">
                {estimatedWetBulbC >= 31 ? (
                  <span className="text-rose-700 font-bold flex items-center gap-1">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                    Dangerously High Wet-Bulb! Human sweating efficiency drops sharply. Community water stations are lifesaving.
                  </span>
                ) : (
                  <span>
                    Wet-bulb temperature allows physiological cooling with adequate shade and hydration.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
