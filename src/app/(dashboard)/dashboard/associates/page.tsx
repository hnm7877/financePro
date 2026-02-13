"use client";

import { useEffect, useState } from "react";
import { 
  Pencil, 
  Trash2,
  Plus,
  Users,
  PieChart,
  TrendingUp,
  MoreVertical
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/useUserStore";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Associate {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  roles: ('Dirigeant' | 'Associé' | 'Gérant' | 'Investisseur' | 'Conseiller')[];
  share: number;
  avatar: string;
  isPrimary: boolean;
  status: 'Actif' | 'Suspendu';
}

const AVAILABLE_ROLES = ['Dirigeant', 'Associé', 'Gérant', 'Investisseur', 'Conseiller'] as const;

export default function AssociatesPage() {
  const { user } = useUserStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssociate, setEditingAssociate] = useState<Associate | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    associateEmail: "",
    phone: "",
    roles: ["Associé"] as Associate['roles'],
    share: 0,
  });

  // Wait for hydration to ensure 'user' is loaded from localStorage
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if session is missing after hydration
  useEffect(() => {
    if (mounted && !user?.email) {
      router.push("/login");
    }
  }, [mounted, user, router]);

  const { data: associates = [], isLoading } = useQuery<Associate[]>({
    queryKey: ["associates", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await fetch(`/api/associates?email=${user.email}`);
      if (!res.ok) throw new Error("Failed to fetch associates");
      return res.json();
    },
    enabled: !!user?.email && mounted,
  });

  const addAssociateMutation = useMutation({
    mutationFn: async (newAssociate: typeof formData) => {
      if (!user?.email) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }
      
      const payload = { ...newAssociate, email: user.email };
      const res = await fetch("/api/associates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to add associate");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["associates"] });
      setIsModalOpen(false);
      setEditingAssociate(null);
      setFormData({ name: "", associateEmail: "", phone: "", roles: ["Associé"], share: 0 });
    },
    onError: (error) => {
      console.error("Add Associate Error:", error);
      alert(`Erreur lors de l'ajout: ${error.message}`);
    }
  });

  const updateAssociateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Associate> | typeof formData }) => {
      const res = await fetch(`/api/associates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update associate");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["associates"] });
      setIsModalOpen(false);
      setEditingAssociate(null);
      setFormData({ name: "", associateEmail: "", phone: "", roles: ["Associé"], share: 0 });
    },
    onError: (error) => {
      console.error("Update Associate Error:", error);
      alert(`Erreur lors de la modification: ${error.message}`);
    }
  });

  const deleteAssociateMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/associates/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete associate");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["associates"] });
    },
    onError: (error) => {
      console.error("Delete Associate Error:", error);
      alert(`Erreur lors de la suppression: ${error.message}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting formData:", formData);
    if (editingAssociate) {
      updateAssociateMutation.mutate({ id: editingAssociate._id, updates: formData });
    } else {
      addAssociateMutation.mutate(formData);
    }
  };

  const openEditModal = (associate: Associate) => {
    setEditingAssociate(associate);
    setFormData({
      name: associate.name,
      associateEmail: associate.email,
      phone: associate.phone || "",
      roles: associate.roles || ["Associé"],
      share: Math.round(associate.share * 100),
    });
    setIsModalOpen(true);
  };

  const toggleRole = (role: Associate['roles'][number]) => {
    setFormData(prev => {
      const roles = prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role];
      return { ...prev, roles };
    });
  };

  const totalShare = associates.reduce((acc, curr) => acc + curr.share, 0);

  // Show nothing or loading during hydration/missing session
  if (!mounted || isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0d1117] text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium animate-pulse tracking-wide">Initialisation de votre espace...</p>
        </div>
      </div>
    );
  }

  // Final check to prevent rendering dashboard without user email
  if (!user?.email) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden" suppressHydrationWarning={true}>
      <div className="p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Gestion des Associés</h1>
            <p className="text-slate-500 text-sm">Gérez les profils, les parts sociales et le suivi en temps réel.</p>
          </div>
          <button 
            onClick={() => {
              setEditingAssociate(null);
              setFormData({ name: "", associateEmail: "", phone: "", roles: ["Associé"], share: 0 });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-500/20"
            suppressHydrationWarning={true}
          >
            <Plus size={20} />
            <span>Nouvel Associé</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3 text-blue-500 mb-4">
              <Users size={20} />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Associés</span>
            </div>
            <div className="text-3xl font-bold">{associates.length}</div>
          </div>

          <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3 text-emerald-500 mb-4">
              <PieChart size={20} />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Capital Réparti</span>
            </div>
            <div className="text-3xl font-bold">{(totalShare * 100).toFixed(0)}%</div>
          </div>

          <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3 text-blue-500 mb-4">
              <TrendingUp size={20} />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Dépenses Totales</span>
            </div>
            <div className="text-3xl font-bold">0 €</div>
          </div>

          <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3 text-orange-500 mb-4">
              <Plus size={20} />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Dividendes Dus</span>
            </div>
            <div className="text-3xl font-bold">0 €</div>
          </div>
        </div>

        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Associé</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Rôles & Contact</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Parts Détenues</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {associates.map((associate) => (
                <tr key={associate._id} className={cn("hover:bg-slate-800/50 transition-colors", associate.status === 'Suspendu' && "opacity-50")}>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                        {associate.avatar ? (
                          <img src={associate.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Users size={20} className="text-slate-400" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{associate.name}</span>
                        <span className="text-xs text-slate-500">ID: {associate._id?.slice(-6).toUpperCase() || "N/A"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap gap-1">
                        {(associate.roles || []).map((role) => (
                          <span key={role} className={cn(
                            "text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-md",
                            role === 'Dirigeant' ? "bg-purple-500/10 text-purple-500 border border-purple-500/20" :
                            role === 'Gérant' ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                            "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                          )}>
                            {role}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">{associate.email}</span>
                      {associate.phone && <span className="text-xs text-slate-500">{associate.phone}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-2 min-w-[120px]">
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${associate.share * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold">{(associate.share * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditModal(associate)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-blue-500"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          const newStatus = associate.status === 'Actif' ? 'Suspendu' : 'Actif';
                          updateAssociateMutation.mutate({ id: associate._id, updates: { status: newStatus } });
                        }}
                        className={cn(
                          "p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400",
                          associate.status === 'Actif' ? "hover:text-yellow-500" : "hover:text-emerald-500 text-emerald-500 font-bold"
                        )}
                        title={associate.status === 'Actif' ? "Suspendre" : "Activer"}
                      >
                        <MoreVertical size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm("Êtes-vous sûr de vouloir supprimer cet associé ?")) {
                            deleteAssociateMutation.mutate(associate._id);
                          }
                        }}
                        disabled={deleteAssociateMutation.isPending}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-red-500 disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-xl font-bold mb-6">
              {editingAssociate ? "Modifier l'associé" : "Ajouter un associé"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom complet</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-800 bg-slate-900 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Ex: Jean Dupont"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  value={formData.associateEmail}
                  onChange={(e) => setFormData({ ...formData, associateEmail: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-800 bg-slate-900 focus:border-blue-500 outline-none transition-colors"
                  placeholder="jean.dupont@exemple.com"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-800 bg-slate-900 focus:border-blue-500 outline-none transition-colors"
                    placeholder="01 23 45 67 89"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Parts (%)</label>
                  <input 
                    type="number" 
                    value={formData.share}
                    onChange={(e) => setFormData({ ...formData, share: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-800 bg-slate-900 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Ex: 25"
                    max="100"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Fonctions / Rôles (Plusieurs possibles)</label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_ROLES.map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => toggleRole(role)}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg border text-xs transition-all",
                        formData.roles.includes(role)
                          ? "bg-blue-600/20 border-blue-600 text-blue-400"
                          : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700"
                      )}
                    >
                      <div className={cn(
                        "w-3 h-3 rounded flex items-center justify-center border",
                        formData.roles.includes(role) ? "bg-blue-600 border-blue-600" : "border-slate-700"
                      )}>
                        {formData.roles.includes(role) && <Plus size={10} className="text-white" />}
                      </div>
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-800 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={addAssociateMutation.isPending || updateAssociateMutation.isPending}
                  className="flex-1 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {addAssociateMutation.isPending || updateAssociateMutation.isPending ? "Action..." : editingAssociate ? "Modifier" : "Valider"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
