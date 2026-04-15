import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { CheckCircle, Eye, EyeOff } from "lucide-react";

export default function Inscription() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Partial<typeof form & { global: string }>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, global: undefined }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.prenom.trim()) e.prenom = "Prénom requis";
    if (!form.nom.trim()) e.nom = "Nom requis";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide";
    if (form.password.length < 6) e.password = "6 caractères minimum";
    if (form.password !== form.confirm) e.confirm = "Les mots de passe ne correspondent pas";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    const result = await signUp(form.prenom, form.nom, form.email, form.password);
    setLoading(false);
    if (!result.success) { setErrors({ global: result.error }); return; }
    setSuccess(true);
    setTimeout(() => navigate("/mon-compte"), 1800);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />

      <section className="py-16 md:py-24">
        <div className="container max-w-md mx-auto">

          {success ? (
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-card p-10 text-center">
              <CheckCircle size={52} className="text-emerald-500 mx-auto mb-4" />
              <h2 className="text-emerald-800 mb-2">Compte créé !</h2>
              <p className="font-body text-emerald-700">Bienvenue {form.prenom} ! Redirection en cours...</p>
            </div>
          ) : (
            <div className="bg-blanc-casse rounded-card shadow-card p-8">
              <div className="text-center mb-8">
                <span className="text-4xl">🦌</span>
                <h1 className="text-2xl mt-3 mb-1">Créer un compte</h1>
                <p className="font-body text-sm text-gris-chaud">Rejoignez la famille Caribou Nature</p>
              </div>

              {errors.global && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5 font-body text-sm text-red-700">
                  {errors.global}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-body text-sm font-semibold text-brun block mb-1.5">Prénom <span className="text-terracotta">*</span></label>
                    <Input name="prenom" value={form.prenom} onChange={handleChange} placeholder="Marie" className={errors.prenom ? "border-terracotta" : ""} />
                    {errors.prenom && <p className="font-body text-xs text-terracotta mt-1">{errors.prenom}</p>}
                  </div>
                  <div>
                    <label className="font-body text-sm font-semibold text-brun block mb-1.5">Nom <span className="text-terracotta">*</span></label>
                    <Input name="nom" value={form.nom} onChange={handleChange} placeholder="Dupont" className={errors.nom ? "border-terracotta" : ""} />
                    {errors.nom && <p className="font-body text-xs text-terracotta mt-1">{errors.nom}</p>}
                  </div>
                </div>

                <div>
                  <label className="font-body text-sm font-semibold text-brun block mb-1.5">Email <span className="text-terracotta">*</span></label>
                  <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="marie@exemple.fr" className={errors.email ? "border-terracotta" : ""} />
                  {errors.email && <p className="font-body text-xs text-terracotta mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="font-body text-sm font-semibold text-brun block mb-1.5">Mot de passe <span className="text-terracotta">*</span></label>
                  <div className="relative">
                    <Input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="6 caractères minimum" className={errors.password ? "border-terracotta pr-10" : "pr-10"} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gris-chaud hover:text-brun">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="font-body text-xs text-terracotta mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="font-body text-sm font-semibold text-brun block mb-1.5">Confirmer le mot de passe <span className="text-terracotta">*</span></label>
                  <Input name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="Répétez votre mot de passe" className={errors.confirm ? "border-terracotta" : ""} />
                  {errors.confirm && <p className="font-body text-xs text-terracotta mt-1">{errors.confirm}</p>}
                </div>

                <Button type="submit" disabled={loading} className="w-full mt-2">
                  {loading ? "Création en cours..." : "Créer mon compte"}
                </Button>
              </form>

              <p className="font-body text-sm text-center text-gris-chaud mt-6">
                Déjà un compte ?{" "}
                <Link to="/connexion" className="text-ocre hover:text-terracotta font-semibold transition-colors">
                  Se connecter
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
