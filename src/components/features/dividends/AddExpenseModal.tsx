import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createExpenseSchema, CreateExpenseInput, ExpenseCategory, ExpensePeriod } from "@/types/expense";
import { useExpenseStore } from "@/store/useExpenseStore";
import { useUserStore } from "@/store/useUserStore";
import { useToastStore } from "@/store/useToastStore";
import { cn } from "@/lib/utils";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddExpenseModal({ isOpen, onClose }: AddExpenseModalProps) {
  const { saveExpense } = useExpenseStore();
  const { user } = useUserStore();
  const { addToast } = useToastStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateExpenseInput>({
    resolver: zodResolver(createExpenseSchema) as any,
    defaultValues: {
      description: "",
      amount: 0,
      category: ExpenseCategory.AUTRES,
      period: ExpensePeriod.MONTHLY,
      startDate: new Date().toISOString().split("T")[0],
      status: "Active",
    },
  });

  const onSubmit = async (data: CreateExpenseInput) => {
    if (!user?.email) {
      addToast("Utilisateur non connecté", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await saveExpense(user.email, data);
      addToast("Dépense ajoutée avec succès", "success");
      reset();
      onClose();
    } catch (error) {
      addToast("Erreur lors de l'ajout de la dépense", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
          <h2 className="text-xl font-bold text-white">Ajouter une Dépense</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-slate-400">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Description */}
          <div>
            <label className="block text-sm font-bold mb-2 text-white">
              Description
            </label>
            <input
              {...register("description")}
              type="text"
              className={cn(
                "w-full px-4 py-3 rounded-lg border bg-slate-800 text-white placeholder-slate-500 transition-colors focus:ring-2 focus:ring-primary focus:border-transparent",
                errors.description
                  ? "border-rose-500"
                  : "border-slate-600"
              )}
              placeholder="Ex: Abonnement serveur cloud"
            />
            {errors.description && (
              <p className="text-rose-400 text-xs mt-1 font-medium">{errors.description.message}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-bold mb-2 text-white">
              Montant
            </label>
            <div className="relative">
              <input
                {...register("amount", { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                className={cn(
                  "w-full pl-12 pr-4 py-3 rounded-lg border bg-slate-800 text-white placeholder-slate-500 transition-colors focus:ring-2 focus:ring-primary focus:border-transparent",
                  errors.amount
                    ? "border-rose-500"
                    : "border-slate-600"
                )}
                placeholder="0.00"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                {user?.country === "FR" ? "€" : "FCFA"}
              </div>
            </div>
            {errors.amount && (
              <p className="text-rose-400 text-xs mt-1 font-medium">{errors.amount.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold mb-2 text-white">
              Catégorie
            </label>
            <select
              {...register("category")}
              className={cn(
                "w-full px-4 py-3 rounded-lg border bg-slate-800 text-white transition-colors focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer",
                errors.category
                  ? "border-rose-500"
                  : "border-slate-600"
              )}
            >
              {Object.values(ExpenseCategory).map((category) => (
                <option key={category} value={category} className="bg-slate-800">
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-rose-400 text-xs mt-1 font-medium">{errors.category.message}</p>
            )}
          </div>

          {/* Period */}
          <div>
            <label className="block text-sm font-bold mb-2 text-white">
              Période
            </label>
            <select
              {...register("period")}
              className={cn(
                "w-full px-4 py-3 rounded-lg border bg-slate-800 text-white transition-colors focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer",
                errors.period
                  ? "border-rose-500"
                  : "border-slate-600"
              )}
            >
              {Object.values(ExpensePeriod).map((period) => (
                <option key={period} value={period} className="bg-slate-800">
                  {period}
                </option>
              ))}
            </select>
            {errors.period && (
              <p className="text-rose-400 text-xs mt-1 font-medium">{errors.period.message}</p>
            )}
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-bold mb-2 text-white">
              Date de début
            </label>
            <input
              {...register("startDate")}
              type="date"
              className={cn(
                "w-full px-4 py-3 rounded-lg border bg-slate-800 text-white transition-colors focus:ring-2 focus:ring-primary focus:border-transparent",
                errors.startDate
                  ? "border-rose-500"
                  : "border-slate-600"
              )}
            />
            {errors.startDate && (
              <p className="text-rose-400 text-xs mt-1 font-medium">{errors.startDate.message}</p>
            )}
          </div>

          {/* End Date (Optional) */}
          <div>
            <label className="block text-sm font-bold mb-2 text-white">
              Date de fin <span className="text-slate-400 font-normal">(optionnelle)</span>
            </label>
            <input
              {...register("endDate")}
              type="date"
              className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-800 text-white transition-colors focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.endDate && (
              <p className="text-rose-400 text-xs mt-1 font-medium">{errors.endDate.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg border border-slate-700 hover:bg-slate-800 text-white font-bold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg bg-primary hover:bg-blue-700 text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Enregistrement...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">add</span>
                  Ajouter la dépense
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
