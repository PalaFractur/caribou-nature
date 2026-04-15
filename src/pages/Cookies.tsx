import LegalPage, { Section, SubSection, InfoBox } from "@/components/LegalPage";

export default function Cookies() {
  return (
    <LegalPage
      title="Politique de cookies"
      subtitle="Comment et pourquoi nous utilisons des cookies"
      lastUpdated="1er janvier 2025"
    >
      <InfoBox>
        Conformément à la loi n° 78-17 du 6 janvier 1978 et aux recommandations de la CNIL, cette page vous informe sur l'utilisation des cookies sur le site caribounature-riom.fr.
      </InfoBox>

      <Section title="1. Qu'est-ce qu'un cookie ?">
        <p>
          Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de la visite d'un site internet. Il permet au site de mémoriser des informations sur votre visite (langue préférée, identifiant de session, préférences, etc.) pour améliorer votre expérience de navigation.
        </p>
        <p>
          Les cookies ne contiennent pas de logiciel malveillant et ne peuvent pas accéder aux fichiers présents sur votre terminal.
        </p>
      </Section>

      <Section title="2. Les cookies utilisés sur ce site">
        <SubSection title="Cookies strictement nécessaires — Exemption de consentement">
          <p>
            Ces cookies sont indispensables au fonctionnement du site et ne peuvent pas être désactivés. Ils ne stockent aucune information personnellement identifiable.
          </p>
          <div className="mt-2 space-y-2">
            {[
              { nom: "cn_session", duree: "Session", finalite: "Maintien de la session utilisateur connecté" },
              { nom: "cn_users", duree: "1 an", finalite: "Mémorisation des comptes clients (localStorage)" },
            ].map((cookie) => (
              <div key={cookie.nom} className="bg-blanc-casse border border-sable rounded p-3">
                <p><strong className="font-mono text-brun">{cookie.nom}</strong></p>
                <p className="text-gris-chaud text-xs mt-0.5">Durée : {cookie.duree} · {cookie.finalite}</p>
              </div>
            ))}
          </div>
        </SubSection>

        <SubSection title="Cookies de performance et statistiques — Consentement requis">
          <p>
            Ces cookies nous permettent de mesurer la fréquentation du site et d'analyser les comportements de navigation de façon anonyme, afin d'améliorer nos contenus et la performance du site.
          </p>
          <p>
            Ils ne sont déposés qu'après votre consentement explicite. En l'absence de consentement, aucun cookie analytique n'est utilisé.
          </p>
          <div className="mt-2">
            <div className="bg-blanc-casse border border-sable rounded p-3">
              <p><strong className="font-mono text-brun">_ga, _gid (Google Analytics)</strong></p>
              <p className="text-gris-chaud text-xs mt-0.5">Durée : 13 mois max · Mesure d'audience anonymisée</p>
            </div>
          </div>
        </SubSection>

        <SubSection title="Cookies de fonctionnalité — Exemption de consentement">
          <p>
            Ces cookies permettent au site de mémoriser vos préférences de navigation (langue, produits consultés) pour vous offrir une expérience personnalisée. Ils ne sont pas partagés avec des tiers.
          </p>
        </SubSection>

        <SubSection title="Cookies tiers et réseaux sociaux">
          <p>
            Ce site peut intégrer des contenus de réseaux sociaux (boutons de partage Facebook, Instagram). Ces intégrations peuvent déposer des cookies tiers soumis aux politiques de confidentialité de ces plateformes. Caribou Nature n'a aucun contrôle sur ces cookies.
          </p>
          <ul className="list-disc pl-4 mt-2 space-y-1">
            <li>Facebook : <a href="https://fr-fr.facebook.com/policies/cookies/" target="_blank" rel="noopener noreferrer" className="text-ocre hover:text-terracotta">politique cookies Facebook</a></li>
            <li>Instagram : <a href="https://help.instagram.com/1896641480634370" target="_blank" rel="noopener noreferrer" className="text-ocre hover:text-terracotta">politique cookies Instagram</a></li>
          </ul>
        </SubSection>
      </Section>

      <Section title="3. Durée de conservation des cookies">
        <p>
          La durée de vie des cookies varie selon leur nature :
        </p>
        <ul className="list-disc pl-4 space-y-2 mt-2">
          <li><strong>Cookies de session :</strong> supprimés automatiquement à la fermeture du navigateur</li>
          <li><strong>Cookies persistants :</strong> conservés selon leur durée propre, au maximum 13 mois conformément aux recommandations de la CNIL</li>
        </ul>
      </Section>

      <Section title="4. Comment gérer vos cookies ?">
        <InfoBox>
          Vous pouvez à tout moment choisir de désactiver, limiter ou supprimer les cookies en configurant votre navigateur. Attention : la désactivation des cookies strictement nécessaires peut perturber le fonctionnement normal du site.
        </InfoBox>

        <SubSection title="Via votre navigateur">
          <p>La plupart des navigateurs permettent de gérer les cookies dans leurs paramètres :</p>
          <ul className="list-disc pl-4 space-y-1 mt-2">
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-ocre hover:text-terracotta">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/fr/kb/protection-renforcee-contre-pistage-firefox" target="_blank" rel="noopener noreferrer" className="text-ocre hover:text-terracotta">Mozilla Firefox</a></li>
            <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-ocre hover:text-terracotta">Microsoft Edge</a></li>
            <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-ocre hover:text-terracotta">Safari (Mac)</a></li>
            <li><a href="https://support.apple.com/fr-fr/HT201265" target="_blank" rel="noopener noreferrer" className="text-ocre hover:text-terracotta">Safari (iPhone / iPad)</a></li>
          </ul>
        </SubSection>

        <SubSection title="Via la plateforme de la CNIL">
          <p>
            Vous pouvez également utiliser le site <a href="https://www.youronlinechoices.com/fr/" target="_blank" rel="noopener noreferrer" className="text-ocre hover:text-terracotta">youronlinechoices.com</a> pour gérer vos préférences de ciblage publicitaire.
          </p>
        </SubSection>
      </Section>

      <Section title="5. Vos droits">
        <p>
          Conformément au RGPD et à la loi Informatique et Libertés, vous disposez de droits sur vos données personnelles collectées via les cookies. Pour les exercer, consultez notre <a href="/politique-de-confidentialite" className="text-ocre hover:text-terracotta">Politique de confidentialité</a> ou contactez-nous à <a href="mailto:caribounature@gmail.com" className="text-ocre hover:text-terracotta">caribounature@gmail.com</a>.
        </p>
      </Section>

      <Section title="6. Modification de cette politique">
        <p>
          Caribou Nature se réserve le droit de modifier la présente politique à tout moment, notamment pour se conformer à toute évolution législative ou réglementaire. La date de dernière mise à jour est indiquée en haut de cette page.
        </p>
      </Section>
    </LegalPage>
  );
}
