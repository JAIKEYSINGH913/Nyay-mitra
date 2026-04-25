"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-bg-primary py-20 px-6 border-t border-border-color transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex flex-col mb-8">
            <span className="font-space text-2xl font-black tracking-tighter text-text-primary uppercase leading-none">
              NYAY-MITRA
            </span>
            <span className="telemetry-label !text-[8px] opacity-40 mt-1">SOVEREIGN_JUDICIAL_ENVIRONMENT</span>
          </Link>
          <p className="text-text-secondary opacity-60 text-sm leading-relaxed max-w-sm mb-10">
            An advanced computational legal environment designed for the Indian judiciary and elite law practices. Sovereign. Precise. Industrial.
          </p>
          <div className="flex gap-4">
            {[
              { icon: "terminal", label: "TERMINAL" },
              { icon: "hub", label: "HUB" },
              { icon: "shield", label: "SHIELD" }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="w-10 h-10 bg-bg-surface-low border border-border-color flex items-center justify-center hover:bg-primary-container hover:text-white transition-all cursor-pointer rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <span className="material-symbols-outlined text-sm">{item.icon}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* System Column */}
        <div>
          <h5 className="telemetry-label text-primary-container mb-8 font-black">System</h5>
          <ul className="flex flex-col gap-4">
            {["Architecture", "Telemetry", "Neural Net", "Archive"].map((link) => (
              <li key={link}>
                <Link href="#" className="telemetry-label !text-muted hover:text-[#e5e2e1] transition-colors">{link}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Protocols Column */}
        <div>
          <h5 className="telemetry-label text-secondary-container mb-8 font-black">Protocols</h5>
          <ul className="flex flex-col gap-4">
            {["IPC_BNS Delta", "Authority Hub", "Privacy Layer", "Support"].map((link) => (
              <li key={link}>
                <Link href="#" className="telemetry-label !text-muted hover:text-[#e5e2e1] transition-colors">{link}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-border-color flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="telemetry-label !text-[10px] opacity-40">© 2026 NYAY-MITRA. ALL_RIGHTS_RESERVED.</span>
        <div className="flex gap-6">
           <span className="telemetry-label !text-[10px] opacity-40">VERSION_4.02.1_STABLE</span>
           <span className="telemetry-label !text-[10px] opacity-40">ENCRYPTION_AES_256</span>
        </div>
      </div>
    </footer>
  );
}
