import LegalPage, { Section, SubSection, InfoBox } from "@/components/LegalPage";

export default function Confidentialite() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      subtitle="Protection de vos données personnelles — RGPD"
      lastUpdated="1er janvier 2025"
    >
      <InfoBox>
        Caribou Nature s'engage à protéger la vie privée de ses clients et visiteurs. Cette politique explique quelles données nous collectons, pourquoi et comment nous les utilisons, conformément au Règlement Général sur la Protection des Données (RGPD — UE 2016/679) et à la loi Informatique et Libertés.
      </InfoBox>

      <Section title="1. Responsable du traitement">
        <p>
          Le responsable du traitement des données est :<br />
          <strong>Caribou Nature</strong>, représenté par Denis Bertrand<br />
          12 rue Saint-Amable, 63200 Riom, France<br />
          Email : <a href="mailto:caribounature@gmail.com" className="text-ocre hover:text-terracotta">caribounature@gmail.com</a><br />
          Tél. : <a href="tel:0473648055" className="text-ocre hover:text-terracotta">04 73 64 80 55</a>
        </p>
      </Section>

      <Section title="2. Données collectées">
        <SubSection title="Lors de la création d'un compte">
          <ul className="list-disc pl-4 space-y-1">
            <li>Prénom et nom</li>
            <li>Adresse email</li>
            <li>Mot de passe (stocké de façon sécurisée)</li>
            <li>Date d'inscription</li>
          </ul>
        </SubSection>
        <SubSection title="Lors d'une commande">
          <ul className="list-disc pl-4 space-y-1">
            <li>Coordonnées complètes (nom, prénom, adresse, code postal, ville)</li>
            <li>Numéro de téléphone</li>
            <li>Adresse email</li>
            <li>Détail et montant de la commande</li>
            <li>Mode de livraison choisi</li>
          </ul>
        </SubSection>
        <SubSection title="Lors de la navigation">
          <ul className="list-disc pl-4 space-y-1">
            <li>Données de navigation (pages visitées, durée de visite) — via cookies analytiques si consentis</li>
            <li>Adresse IP (anonymisée)</li>
            <li>Type de navigateur et système d'exploitation</li>
          </ul>
        </SubSection>
        <SubSection title="Via le formulaire de contact">
          <ul className="list-disc pl-4 space-y-1">
            <li>Nom, prénom, email</li>
            <li>Contenu du message</li>
          </ul>
        </SubSection>
      </Section>

      <Section title="3. Finalités et bases légales du traitement">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse mt-2">
            <thead>
              <tr className="bg-sable">
                <th className="text-left p-3 font-semibold text-brun border border-sable/60 rounded-tl">Finalité</th>
                <th className="text-left p-3 font-semibold text-brun border border-sable/60">Base légale</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Traitement et suivi des commandes", "Exécution du contrat"],
                ["Gestion du compte client", "Exécution du contrat"],
                ["Communication relative à votre commande", "Exécution du contrat"],
                ["Réponse aux demandes de contact", "Intérêt légitime"],
                ["Amélioration du site (statistiques anonymes)", "Consentement"],
                ["Respect des obligations légales et comptables", "Obligation légale"],
              ].map(([finalite, base], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-blanc-casse" : "bg-creme"}>
                  <td className="p-3 border border-sable/40 text-foreground">{finalite}</td>
                  <td className="p-3 border border-sable/40 text-gris-chaud">{base}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="4. Durée de conservation">
        <ul className="list-disc pl-4 space-y-2">
          <li><strong>Données de compte client :</strong> jusqu'à la suppression du compte, puis 3 ans pour les besoins de prospection éventuelle</li>
          <li><strong>Données de commande :</strong> 10 ans à compter de la commande (obligation comptable)</li>
          <li><strong>Données de contact :</strong> 3 ans à compter du dernier contact</li>
          <li><strong>Données de navigation (cookies) :</strong> 13 mois maximum</li>
        </ul>
      </Section>

      <Section title="5. Destinataires des données">
        <p>
          Vos données personnelles sont destinées exclusivement à Caribou Nature et à ses sous-traitants techniques strictement nécessaires au fonctionnement du site (hébergeur Vercel Inc.). Nous ne vendons, ne louons ni ne cédons vos données à des tiers à des fins commerciales.
        </p>
        <p>
          En cas de transfert de données hors de l'Union européenne (ex. : hébergeur américain), Caribou Nature s'assure que ce transfert est encadré par des garanties appropriées (clauses contractuelles types de la Commission européenne, etc.).
        </p>
      </Section>

      <Section title="6. Vos droits">
        <InfoBox>
          Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants sur vos données personnelles.
        </InfoBox>
        <div className="space-y-2">
          {[
            ["Droit d'accès", "Obtenir une copie des données vous concernant."],
            ["Droit de rectification", "Corriger des données inexactes ou incomplètes."],
            ["Droit à l'effacement", "Demander la suppression de vos données (« droit à l'oubli »), sous réserve de nos obligations légales."],
            ["Droit à la limitation", "Demander la suspension temporaire du traitement."],
            ["Droit à la portabilité", "Recevoir vos données dans un format structuré et lisible par machine."],
            ["Droit d'opposition", "Vous opposer au traitement de vos données pour des raisons tenant à votre situation particulière."],
            ["Droit de retrait du consentement", "Retirer à tout moment un consentement préalablement donné (ex. : cookies analytiques)."],
          ].map(([droit, desc]) => (
            <div key={droit} className="flex gap-3 items-start">
              <span className="text-ocre font-bold text-base shrink-0">→</span>
              <p><strong>{droit} :</strong> {desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 font-semibold">
          Pour exercer ces droits, contactez-nous à : <a href="mailto:caribounature@gmail.com" className="text-ocre hover:text-terracotta">caribounature@gmail.com</a>
        </p>
        <p>
          Nous nous engageons à répondre dans un délai d'un mois. En cas de réponse insatisfaisante, vous pouvez introduire une réclamation auprès de la <strong>CNIL</strong> (Commission Nationale de l'Informatique et des Libertés) — <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-ocre hover:text-terracotta">www.cnil.fr</a>.
        </p>
      </Section>

      <Section title="7. Sécurité des données">
        <p>
          Caribou Nature met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre la perte, la destruction, l'altération, l'accès ou la divulgation non autorisés : connexion sécurisée (HTTPS), accès restreint aux données, mots de passe stockés sous forme hachée.
        </p>
      </Section>

      <Section title="8. Cookies">
        <p>
          Pour en savoir plus sur l'utilisation des cookies sur ce site, consultez notre <a href="/cookies" className="text-ocre hover:text-terracotta">Politique de cookies</a>.
        </p>
      </Section>

      <Section title="9. Modification de la politique">
        <p>
          Caribou Nature se réserve le droit de mettre à jour la présente politique à tout moment. La date de dernière mise à jour est indiquée en haut de cette page. Nous vous encourageons à consulter régulièrement cette page.
        </p>
      </Section>
    </LegalPage>
  );
}
