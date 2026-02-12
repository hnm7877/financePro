export function FeatureSidebar() {
  return (
    <div className="hidden lg:flex flex-col justify-between w-1/3 p-12 bg-primary text-white relative overflow-hidden h-full">
      <div className="relative z-10">
        <h1 className="text-4xl font-black leading-tight mb-6">
          Simplifiez votre gestion financière.
        </h1>
        <p className="text-primary-100 text-lg font-medium leading-relaxed opacity-90">
          Prenez le contrôle total de vos flux de trésorerie avec une
          répartition automatisée par associé et une visibilité en temps réel.
        </p>

        <div className="mt-12 space-y-8">
          <div className="flex items-start gap-4">
            <div className="bg-white/10 p-2 rounded-lg">
              <span className="material-symbols-outlined text-white">
                account_balance_wallet
              </span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Suivi des dépenses</h3>
              <p className="text-sm opacity-80">
                Catégorisation automatique de chaque transaction.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-white/10 p-2 rounded-lg">
              <span className="material-symbols-outlined text-white">
                groups
              </span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Multi-associés</h3>
              <p className="text-sm opacity-80">
                Répartition intelligente des dividendes et frais.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-white/10 p-2 rounded-lg">
              <span className="material-symbols-outlined text-white">
                shield_with_heart
              </span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Sécurité Bancaire</h3>
              <p className="text-sm opacity-80">
                Chiffrement AES-256 et conformité DSP2.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Abstract Decoration */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 -right-20 w-60 h-60 bg-blue-400/20 rounded-full blur-2xl"></div>

      <div className="relative z-10">
        <p className="text-xs opacity-70">
          © 2024 FinTrack PRO. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
