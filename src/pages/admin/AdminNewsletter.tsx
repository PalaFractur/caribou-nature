import { useEffect, useState } from "react";
import { Mail, Download } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/lib/supabase";

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

function exportCSV(subscribers: Subscriber[]) {
  const rows = [
    ["Email", "Date d'inscription"],
    ...subscribers.map((s) => [s.email, new Date(s.subscribed_at).toLocaleDateString("fr-FR")]),
  ];
  const csv = rows.map((r) => r.map((cell) => `"${cell}"`).join(";")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `newsletter_caribounature_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false })
      .then(({ data }) => {
        setSubscribers((data || []) as Subscriber[]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Newsletter">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-ocre/30 border-t-ocre rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Newsletter">
      {/* Stats + actions */}
      <div className="flex flex-wrap items-start gap-4 mb-6">
        <div className="bg-blanc-casse rounded-card shadow-card px-5 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-card bg-blue-100 flex items-center justify-center">
            <Mail size={18} className="text-blue-700" />
          </div>
          <div>
            <p className="font-display text-xl font-bold text-brun">{subscribers.length}</p>
            <p className="font-body text-xs text-gris-chaud">
              Abonné{subscribers.length > 1 ? "s" : ""} au total
            </p>
          </div>
        </div>

        {subscribers.length > 0 && (
          <button
            onClick={() => exportCSV(subscribers)}
            className="flex items-center gap-2 h-12 px-4 bg-brun hover:bg-ocre text-creme font-body text-sm font-semibold rounded-card shadow-soft transition-colors"
          >
            <Download size={16} />
            Exporter CSV
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-blanc-casse rounded-card shadow-card overflow-hidden">
        {subscribers.length === 0 ? (
          <div className="p-12 text-center">
            <Mail size={40} className="text-gris-chaud/30 mx-auto mb-3" />
            <p className="font-body text-gris-chaud font-medium mb-1">Aucun abonné pour le moment</p>
            <p className="font-body text-sm text-gris-chaud/70">
              Les inscriptions depuis le pied de page du site apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-sable/20 text-left">
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Email</th>
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Date d'inscription</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sable/20">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-sable/10 transition-colors">
                    <td className="px-5 py-4 font-body text-sm text-brun">{sub.email}</td>
                    <td className="px-5 py-4 font-body text-sm text-gris-chaud whitespace-nowrap">
                      {new Date(sub.subscribed_at).toLocaleDateString("fr-FR", {
                        day: "2-digit", month: "long", year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
