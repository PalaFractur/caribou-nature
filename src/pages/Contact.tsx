import { useState } from "react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";

type FormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Votre nom est requis";
  if (!data.email.trim()) {
    errors.email = "Votre email est requis";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Adresse email invalide";
  }
  if (!data.subject) errors.subject = "Veuillez choisir un sujet";
  if (!data.message.trim()) {
    errors.message = "Votre message est requis";
  } else if (data.message.trim().length < 10) {
    errors.message = "Message trop court (10 caractères minimum)";
  }
  return errors;
}

const Contact = () => {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    await new Promise((res) => setTimeout(res, 1000));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />

      {/* Hero */}
      <section className="bg-sable py-14 md:py-20 text-center">
        <div className="container">
          <h1 className="mb-3">Contactez-nous</h1>
          <p className="font-body text-gris-chaud text-lg max-w-xl mx-auto">
            Une question sur un jouet, une commande par téléphone ou un conseil cadeau ? On est là pour vous aider.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Infos de contact */}
            <div className="space-y-6">
              <div className="bg-blanc-casse rounded-card p-6 shadow-card">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-ocre/15 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-ocre" />
                  </div>
                  <div>
                    <h4 className="mb-0.5">Adresse</h4>
                    <p className="font-body text-sm text-gris-chaud">12 rue Saint-Amable<br />63200 Riom, Puy-de-Dôme</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-ocre/15 rounded-xl flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-ocre" />
                  </div>
                  <div>
                    <h4 className="mb-0.5">Téléphone</h4>
                    <a href="tel:0473648055" className="font-body text-sm text-ocre hover:text-terracotta transition-colors font-semibold">
                      04 73 64 80 55
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-ocre/15 rounded-xl flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-ocre" />
                  </div>
                  <div>
                    <h4 className="mb-0.5">Email</h4>
                    <a href="mailto:caribounature@gmail.com" className="font-body text-sm text-ocre hover:text-terracotta transition-colors font-semibold">
                      caribounature@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-blanc-casse rounded-card p-6 shadow-card">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-ocre/15 rounded-xl flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-ocre" />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-3">Horaires d'ouverture</h4>
                    <div className="font-body text-sm space-y-1.5">
                      <div className="flex justify-between text-brun"><span>Lundi</span><span className="text-terracotta font-semibold">Fermé</span></div>
                      <div className="flex justify-between text-brun"><span>Mar – Ven</span><span>9h30–12h · 14h–19h</span></div>
                      <div className="flex justify-between text-brun"><span>Samedi</span><span>9h30–12h30 · 14h30–19h</span></div>
                      <div className="flex justify-between text-brun"><span>Dimanche</span><span className="text-terracotta font-semibold">Fermé</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-ocre/10 border border-ocre/25 rounded-card p-5">
                <p className="font-body text-sm text-brun font-semibold mb-1">💡 Commande rapide</p>
                <p className="font-body text-sm text-gris-chaud">
                  Vous pouvez aussi commander directement par téléphone ou par email. On vous prépare votre commande et vous prévenons quand elle est prête.
                </p>
              </div>
            </div>

            {/* Formulaire */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-card p-10 text-center">
                  <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
                  <h2 className="text-emerald-800 mb-3">Message envoyé !</h2>
                  <p className="font-body text-emerald-700 mb-6">
                    Merci <strong>{form.name}</strong>, nous avons bien reçu votre message. Nous vous répondrons dans les plus brefs délais.
                  </p>
                  <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}>
                    Envoyer un autre message
                  </Button>
                </div>
              ) : (
                <div className="bg-blanc-casse rounded-card p-8 shadow-card">
                  <h2 className="mb-6">Envoyez-nous un message</h2>
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="font-body text-sm font-semibold text-brun block mb-1.5">
                          Votre nom <span className="text-terracotta">*</span>
                        </label>
                        <Input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Marie Dupont"
                          className={errors.name ? "border-terracotta" : ""}
                        />
                        {errors.name && <p className="font-body text-xs text-terracotta mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="font-body text-sm font-semibold text-brun block mb-1.5">
                          Email <span className="text-terracotta">*</span>
                        </label>
                        <Input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="marie@exemple.fr"
                          className={errors.email ? "border-terracotta" : ""}
                        />
                        {errors.email && <p className="font-body text-xs text-terracotta mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="font-body text-sm font-semibold text-brun block mb-1.5">
                          Téléphone <span className="text-gris-chaud font-normal">(facultatif)</span>
                        </label>
                        <Input
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="06 12 34 56 78"
                        />
                      </div>
                      <div>
                        <label className="font-body text-sm font-semibold text-brun block mb-1.5">
                          Sujet <span className="text-terracotta">*</span>
                        </label>
                        <select
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          className={`w-full h-10 rounded-md border px-3 py-2 font-body text-sm bg-background text-brun focus:outline-none focus:ring-2 focus:ring-ocre/40 ${errors.subject ? "border-terracotta" : "border-input"}`}
                        >
                          <option value="">Choisir un sujet...</option>
                          <option value="commande">Passer une commande</option>
                          <option value="conseil">Demande de conseil</option>
                          <option value="click-collect">Click & Collect</option>
                          <option value="cadeau">Idée cadeau</option>
                          <option value="autre">Autre</option>
                        </select>
                        {errors.subject && <p className="font-body text-xs text-terracotta mt-1">{errors.subject}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="font-body text-sm font-semibold text-brun block mb-1.5">
                        Message <span className="text-terracotta">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Bonjour, je recherche un jouet pour..."
                        className={`w-full rounded-md border px-3 py-2 font-body text-sm bg-background text-brun resize-none focus:outline-none focus:ring-2 focus:ring-ocre/40 ${errors.message ? "border-terracotta" : "border-input"}`}
                      />
                      {errors.message && <p className="font-body text-xs text-terracotta mt-1">{errors.message}</p>}
                    </div>

                    <Button type="submit" disabled={submitting} className="w-full md:w-auto gap-2">
                      {submitting ? "Envoi en cours..." : (<><Send size={16} /> Envoyer le message</>)}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
