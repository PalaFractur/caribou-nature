import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { connecter } from "@/lib/auth";
import { Eye, EyeOff } from "lucide-react";

export default function Connexion() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Veuillez remplir tous les champs."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = connecter(form.email, form.password);
    setLoading(false);
    if (!result.success) { setError(result.error || "Erreur de connexion."); return; }
    navigate("/mon-compte");
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />

      <section className="py-16 md:py-24">
        <div className="container max-w-sm mx-auto">
          <div className="bg-blanc-casse rounded-card shadow-card p-8">
            <div className="text-center mb-8">
              <span className="text-4xl">🦌</span>
              <h1 className="text-2xl mt-3 mb-1">Se connecter</h1>
              <p className="font-body text-sm text-gris-chaud">Accédez à votre espace client</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5 font-body text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label className="font-body text-sm font-semibold text-brun block mb-1.5">Email</label>
                <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="marie@exemple.fr" />
              </div>

              <div>
                <label className="font-body text-sm font-semibold text-brun block mb-1.5">Mot de passe</label>
                <div className="relative">
                  <Input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="Votre mot de passe" className="pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gris-chaud hover:text-brun">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full mt-2">
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            <p className="font-body text-sm text-center text-gris-chaud mt-6">
              Pas encore de compte ?{" "}
              <Link to="/inscription" className="text-ocre hover:text-terracotta font-semibold transition-colors">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
