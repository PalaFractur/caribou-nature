export interface User {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  dateInscription: string;
}

const USERS_KEY = "cn_users";
const SESSION_KEY = "cn_session";

function getUsers(): (User & { password: string })[] {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

function saveUsers(users: (User & { password: string })[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function inscrire(prenom: string, nom: string, email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: "Un compte existe déjà avec cet email." };
  }
  const newUser: User & { password: string } = {
    id: crypto.randomUUID(),
    prenom,
    nom,
    email,
    password,
    dateInscription: new Date().toLocaleDateString("fr-FR"),
  };
  saveUsers([...users, newUser]);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ id: newUser.id, prenom, nom, email, dateInscription: newUser.dateInscription }));
  return { success: true };
}

export function connecter(email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) {
    return { success: false, error: "Email ou mot de passe incorrect." };
  }
  const { password: _, ...session } = user;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true };
}

export function deconnecter() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): User | null {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}
