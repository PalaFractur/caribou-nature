import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useAdmin } from "@/lib/auth";

export default function AdminLogin() {
  const { isAuthenticated, login } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate("/admin");
    } else {
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="min-h-screen bg-brun flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-blanc-casse rounded-card shadow-card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🍃</div>
            <h1 className="font-display text-2xl text-brun mb-1">Caribou Nature</h1>
            <p className="font-body text-sm text-gris-chaud">Espace administrateur</p>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-ocre/10 rounded-card flex items-center justify-center">
              <Lock size={22} className="text-ocre" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="font-body text-sm font-semibold text-brun block mb-1.5">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="admin@caribounature.fr"
                autoComplete="email"
                className={`w-full h-10 rounded-btn px-4 font-body text-sm border bg-white focus:outline-none focus:ring-2 focus:ring-ocre transition-colors ${
                  error ? "border-terracotta" : "border-sable hover:border-gris-chaud"
                }`}
              />
            </div>

            <div>
              <label className="font-body text-sm font-semibold text-brun block mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full h-10 rounded-btn px-4 pr-10 font-body text-sm border bg-white focus:outline-none focus:ring-2 focus:ring-ocre transition-colors ${
                    error ? "border-terracotta" : "border-sable hover:border-gris-chaud"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gris-chaud hover:text-brun transition-colors"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-terracotta/10 border border-terracotta/30 rounded-btn px-4 py-2.5">
                <p className="font-body text-sm text-terracotta">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-ocre hover:bg-terracotta disabled:opacity-60 text-white font-body font-semibold text-sm rounded-btn transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Connexion en cours…
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          <p className="font-body text-xs text-gris-chaud/60 text-center mt-6">
            Accès réservé à l'administration · Caribou Nature
          </p>
        </div>

        <p className="font-body text-xs text-sable/40 text-center mt-4">
          © {new Date().getFullYear()} Caribou Nature
        </p>
      </div>
    </div>
  );
}
