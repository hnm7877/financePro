import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUserStore } from "@/store/useUserStore";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { useEffect } from "react";
import { InvoiceCategory } from "@/types/invoice";

const invoiceSchema = z.object({
  merchant: z.string().min(1, "Marchand requis"),
  date: z.string().min(1, "Date requise"),
  category: z.nativeEnum(InvoiceCategory),
  amount: z.number().min(0.01, "Montant invalide"),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export function ManualInvoiceForm() {
  const { user } = useUserStore();
  const { setMerchant, setDate, setCategory, setAmount, currentInvoice } = useInvoiceStore();
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      merchant: currentInvoice.merchant,
      date: currentInvoice.date,
      category: currentInvoice.category,
      amount: currentInvoice.amount,
    },
  });

  const watchedMerchant = useWatch({ control, name: "merchant" });
  const watchedDate = useWatch({ control, name: "date" });
  const watchedCategory = useWatch({ control, name: "category" });
  const watchedAmount = useWatch({ control, name: "amount" });

  useEffect(() => { setMerchant(watchedMerchant || ""); }, [watchedMerchant, setMerchant]);
  useEffect(() => { setDate(watchedDate || ""); }, [watchedDate, setDate]);
  useEffect(() => { setCategory(watchedCategory || ""); }, [watchedCategory, setCategory]);
  useEffect(() => { setAmount(watchedAmount || 0); }, [watchedAmount, setAmount]);

  const onSubmit = (data: InvoiceFormValues) => {
    // This is handled by the "Valider et Ventiler" button in DistributionPanel
    console.log("Form valid:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10 grid grid-cols-2 gap-6">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Marchand / Fournisseur
        </label>
        <input
          {...register("merchant")}
          className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg py-2.5 text-sm focus:ring-primary focus:border-primary transition-all"
          placeholder="Ex: Amazon Web Services"
          type="text"
        />
        {errors.merchant && (
          <p className="text-[10px] text-red-500 font-bold uppercase">{errors.merchant.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Date de facturation
        </label>
        <input
          {...register("date")}
          className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg py-2.5 text-sm focus:ring-primary focus:border-primary transition-all"
          type="date"
        />
        {errors.date && (
          <p className="text-[10px] text-red-500 font-bold uppercase">{errors.date.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Catégorie
        </label>
        <select
          {...register("category")}
          className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg py-2.5 text-sm focus:ring-primary focus:border-primary transition-all"
        >
          {Object.values(InvoiceCategory).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Montant TTC ({user?.country === "FR" ? "€" : "FCFA"})
        </label>
        <div className="relative">
          <input
            {...register("amount", { valueAsNumber: true })}
            className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg py-2.5 text-sm font-bold focus:ring-primary focus:border-primary transition-all"
            type="number"
            step="0.01"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-primary font-bold pointer-events-none">
            {user?.country === "FR" ? "EUR" : "XOF"}
          </div>
        </div>
        {errors.amount && (
          <p className="text-[10px] text-red-500 font-bold uppercase">{errors.amount.message}</p>
        )}
      </div>
    </form>
  );
}
