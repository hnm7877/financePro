import { FeatureSidebar } from "@/components/features/auth/FeatureSidebar";
import { RegistrationForm } from "@/components/features/auth/RegistrationForm";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex-1 flex overflow-hidden">
      {/* Sidebar Illustration Section */}
      <FeatureSidebar />

      {/* Registration Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-background-light dark:bg-background-dark overflow-y-auto">
        <div className="w-full max-w-[540px]">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black mb-2">
              Créer un compte entreprise
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Commencez votre essai gratuit de 14 jours dès maintenant.
            </p>
          </div>

          <RegistrationForm />

          {/* Logos */}
          <div className="mt-8 flex justify-center items-center gap-6">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsIarI9_iTfWu5sf42FYzxp6cWIX8wbElwucSg7ZHNz1x2zXtsWe92KREo08wEYtbQWrAnCJnuztjpqtggWy2KQprKxf-tcsPkxXb3tyDe3MOm0iu4GRDkZbRuHFCRRVpO_Ih-p6T_Mc7sjeSw4y3Gg_S967hUTFZ9pDeMTxyNM3eolygWvomdAlp-Uw0cIpcOt7rD3-6-2Gt3dr70h3nHCM_PJME-UrkymE5dq6IFgFrYnv5vmBIp0kJWClmnUMwV7fUffGhTQz4Y"
              alt="PayPal Logo"
              className="h-5 opacity-40 grayscale hover:grayscale-0 transition-all cursor-pointer"
            />
             <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpVi0uaDAfPndE6XRioTs66Re_a1h13Op7Irwy-XgmZOvTS_d5FsjjHa5cFkSnxhUULszoVOUf5uaK1L2C_ZpPshWFjmglg_ltfUfiYpS_-LGTywmiySVyhfswLk8VgHmeajgvFlrlSu7vxxxK-czvJcInLoLiuwrZaJ10JqLT18B2WHJ2idT53l5DIgi4av8tnOQUQEHrn9SIWEGgmZQr04O4CGB7m-H4YgB3Ujb21Rg_ZadVTzDa0D3fyYYafaKfWEpdZesJwlpf"
              alt="Stripe Logo"
              className="h-5 opacity-40 grayscale hover:grayscale-0 transition-all cursor-pointer"
            />
            <div className="flex items-center gap-1 opacity-40">
              <span className="material-symbols-outlined text-[18px]">
                verified_user
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider">
                GDPR Compliant
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
