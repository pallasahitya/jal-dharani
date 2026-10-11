import React from 'react';
import { useApp } from '../../context/AppContext';
import { Droplet, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setNavTab, setMapLayer } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base font-display mb-3">
              <Droplet className="w-5 h-5 text-teal-400 fill-teal-400" />
              <span>Jal-Dharani</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-4">
              Community-driven heat and water resilience platform enabling citizens, youth collectives, and grassroots volunteers across India to understand their hydrology, organize real-world conservation, and document impact.
            </p>
            <div className="text-[11px] text-slate-500">
              Not waiting for government action · Citizen stewardship in practice
            </div>
          </div>

          <div>
            <div className="text-slate-200 font-semibold mb-3 tracking-wide uppercase text-[11px]">
              Three Environmental Layers
            </div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setNavTab('maps');
                    setMapLayer('surface-water');
                  }}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Surface Water Layer (Rivers, Canals, Lakes, Ponds)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setNavTab('maps');
                    setMapLayer('aquifer');
                  }}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Aquifer Layer (Groundwater Levels, Basalt & Alluvium)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setNavTab('maps');
                    setMapLayer('heat-map');
                  }}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Heat Map (Thermal Stress, Wet-Bulb & Cooling Zones)
                </button>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-slate-200 font-semibold mb-3 tracking-wide uppercase text-[11px]">
              Education Topics
            </div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => setNavTab('education')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Water Pollution & Nullahs
                </button>
              </li>
              <li>
                <button
                  onClick={() => setNavTab('education')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Groundwater & Aquifer Depletion
                </button>
              </li>
              <li>
                <button
                  onClick={() => setNavTab('education')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Safe Rainwater Harvesting & Pits
                </button>
              </li>
              <li>
                <button
                  onClick={() => setNavTab('education')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Heat & Water Coupled Stress
                </button>
              </li>
              <li>
                <button
                  onClick={() => setNavTab('education')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  El Niño & Monsoon Science
                </button>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-slate-200 font-semibold mb-3 tracking-wide uppercase text-[11px]">
              Authoritative Benchmarks
            </div>
            <p className="text-slate-400 leading-relaxed mb-3">
              Official baselines referenced from Indian meteorological and water institutions:
            </p>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span>Central Ground Water Board (CGWB)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span>Central Pollution Control Board (CPCB NWMP)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span>India Meteorological Department (IMD)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span>India Water Resources Information System (WRIS)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <div>
            © {new Date().getFullYear()} Jal-Dharani Collective · Built for community-led water & heat resilience in India.
          </div>
          <div className="flex items-center gap-6">
            <span>Official Data vs Citizen Observations Separated</span>
            <span aria-hidden="true">·</span>
            <span>Open Source Climate Action</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
