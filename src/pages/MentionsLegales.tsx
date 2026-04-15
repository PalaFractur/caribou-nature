import LegalPage, { Section, SubSection, InfoBox } from "@/components/LegalPage";

export default function MentionsLegales() {
  return (
    <LegalPage
      title="Mentions légales"
      lastUpdated="1er janvier 2025"
    >
      <InfoBox>
        Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance en l'économie numérique (LCEN), les présentes mentions légales sont portées à la connaissance des utilisateurs du site caribounature-riom.fr.
      </InfoBox>

      <Section title="1. Éditeur du site">
        <p>Le présent site est édité par :</p>
        <ul className="list-none space-y-1 mt-2">
          <li><strong>Raison sociale :</strong> Caribou Nature</li>
          <li><strong>Forme juridique :</strong> Commerce indépendant</li>
          <li><strong>Adresse :</strong> 12 rue Saint-Amable, 63200 Riom, France</li>
          <li><strong>Téléphone :</strong> <a href="tel:0473648055" className="text-ocre hover:text-terracotta">04 73 64 80 55</a></li>
          <li><strong>Email :</strong> <a href="mailto:caribounature@gmail.com" className="text-ocre hover:text-terracotta">caribounature@gmail.com</a></li>
          <li><strong>Directeur de la publication :</strong> Denis Bertrand</li>
        </ul>
      </Section>

      <Section title="2. Hébergement">
        <p>Ce site est hébergé par :</p>
        <ul className="list-none space-y-1 mt-2">
          <li><strong>Hébergeur :</strong> Vercel Inc.</li>
          <li><strong>Adresse :</strong> 340 Pine Street, Suite 1201, San Francisco, CA 94104, États-Unis</li>
          <li><strong>Site :</strong> <a href="https://vercel.com" className="text-ocre hover:text-terracotta" target="_blank" rel="noopener noreferrer">vercel.com</a></li>
        </ul>
      </Section>

      <Section title="3. Propriété intellectuelle">
        <p>
          L'ensemble des éléments constituant ce site (textes, graphismes, logiciels, photographies, images, sons, plans, noms, logos, marques, créations et œuvres protégeables diverses) sont la propriété exclusive de Caribou Nature ou de ses partenaires.
        </p>
        <p>
          Toute reproduction, représentation, modification, publication, adaptation totale ou partielle des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sauf autorisation écrite préalable de Caribou Nature.
        </p>
        <p>
          Toute exploitation non autorisée du site ou de l'un des éléments qu'il contient sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.
        </p>
      </Section>

      <Section title="4. Responsabilité">
        <SubSection title="Contenu du site">
          <p>
            Les informations fournies sur ce site le sont à titre indicatif. Caribou Nature s'efforce d'assurer l'exactitude des informations publiées mais ne peut garantir l'exhaustivité ou l'absence d'erreur. Les prix, disponibilités et caractéristiques des produits peuvent évoluer sans préavis.
          </p>
        </SubSection>
        <SubSection title="Liens hypertextes">
          <p>
            Le site peut contenir des liens vers des sites extérieurs. Caribou Nature n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu, leur fonctionnement et leur politique de confidentialité.
          </p>
        </SubSection>
        <SubSection title="Disponibilité du site">
          <p>
            Caribou Nature s'engage à faire ses meilleurs efforts pour assurer la disponibilité du site, mais ne peut être tenu responsable en cas d'interruption temporaire pour maintenance, mise à jour ou en cas de force majeure.
          </p>
        </SubSection>
      </Section>

      <Section title="5. Droit applicable et juridiction">
        <p>
          Le présent site est soumis au droit français. En cas de litige relatif à l'utilisation du site, les tribunaux français seront seuls compétents.
        </p>
        <p>
          Pour toute réclamation ou question, vous pouvez nous contacter à l'adresse suivante : <a href="mailto:caribounature@gmail.com" className="text-ocre hover:text-terracotta">caribounature@gmail.com</a>.
        </p>
      </Section>

      <Section title="6. Médiation">
        <p>
          Conformément à l'article L. 616-1 du Code de la consommation, nous vous informons que vous pouvez avoir recours à un médiateur de la consommation en cas de litige non résolu. Vous pouvez vous adresser à la plateforme européenne de règlement en ligne des litiges : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-ocre hover:text-terracotta">ec.europa.eu/consumers/odr</a>.
        </p>
      </Section>
    </LegalPage>
  );
}
