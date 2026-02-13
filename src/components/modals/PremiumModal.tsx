"use client";

import { X, Check, Star, Zap, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Lock scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-[#0f172a] border border-slate-800 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Decorative Gradient Background */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-blue-600/20 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">FinTrack <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Premium</span></h2>
                <p className="text-slate-400 text-sm">Débloquez tout le potentiel de votre gestion</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Features List */}
          <div className="space-y-4 mb-8">
            <FeatureItem 
              icon={<Zap className="w-5 h-5 text-amber-400" />}
              title="Automatisation Illimitée"
              description="Traitez et ventilez vos factures sans aucune limite mensuelle."
            />
            <FeatureItem 
              icon={<Shield className="w-5 h-5 text-emerald-400" />}
              title="Sécurité Avancée"
              description="Sauvegardes automatiques et chiffrement renforcé de vos données."
            />
            <FeatureItem 
              icon={<Star className="w-5 h-5 text-purple-400" />}
              title="Support Prioritaire"
              description="Accès direct à nos experts financiers 7j/7."
            />
          </div>

          {/* Pricing & CTA */}
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 mb-6">
            <div className="flex items-end gap-2 mb-1">
              <span className="text-3xl font-bold text-white">29,99€</span>
              <span className="text-slate-500 mb-1">/ mois</span>
            </div>
            <p className="text-xs text-slate-400">Facturation annuelle ou 34,99€ / mois sans engagement.</p>
          </div>

          <button className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transform transition-all hover:scale-[1.02] active:scale-[0.98]">
            Passer à la version Premium
          </button>
          
          <p className="text-center text-xs text-slate-500 mt-4">
            7 jours d'essai gratuit • Annulable à tout moment
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800/50 transition-colors">
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div>
        <h4 className="font-semibold text-white text-sm mb-0.5">{title}</h4>
        <p className="text-slate-400 text-xs leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
