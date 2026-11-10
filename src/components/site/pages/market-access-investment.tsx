"use client";

import { Globe2, Handshake, Search, Truck, Users, ClipboardCheck } from "lucide-react";
import { ButtonLink, PageHero, SectionHeading } from "@/components/site/ui";
import { useI18n } from "@/i18n/I18nProvider";
import { PhotoScrollSection } from "@/components/site/PhotoScrollSection";
import type { Language } from "@/i18n/messages";

type MarketAccessContent = {
  eyebrow: string;
  heroTitle: string;
  heroIntro: string;
  marketsTitle: string;
  marketsIntro: string;
  markets: { name: string; population: string; text: string }[];
  neighborTitle: string;
  neighborText: string;
  supportTitle: string;
  supportIntro: string;
  support: { title: string; text: string }[];
  deliveryTitle: string;
  deliveryText: string;
  tagline: string;
  contact: string;
};

const content: Record<Language, MarketAccessContent> = {
  en: {
    eyebrow: "Market Access & Investment",
    heroTitle: "Rwanda: Your Gateway to Regional and Continental Opportunities",
    heroIntro: "Rwanda offers international manufacturers, authorised distributors and suppliers a strategic platform to access growing markets across East and Central Africa and the wider African continent.",
    marketsTitle: "Reach across regional trade frameworks",
    marketsIntro: "Through its membership in regional and continental trade frameworks, Rwanda offers opportunities to engage with a large and growing consumer market.",
    markets: [
      { name: "East African Community", population: "353.8 million", text: "people across the EAC market" },
      { name: "COMESA", population: "583 million", text: "people across the COMESA market" },
      { name: "African Continental Free Trade Area", population: "1.55 billion", text: "people across Africa, with Rwanda supporting progressive continental trade integration" },
    ],
    neighborTitle: "A strategic link to eastern DRC",
    neighborText: "Rwanda has important commercial and geographic links with eastern Democratic Republic of Congo, a neighbouring market with substantial demand and business opportunities.",
    supportTitle: "How LEAD MULTI-CHOICE ® supports market access",
    supportIntro: "We bridge international supply opportunities and local demand, helping suppliers understand the Rwandan business environment and build the relationships needed to access the market.",
    support: [
      { title: "Market intelligence and opportunity identification", text: "Identify sector opportunities, procurement requirements, investment prospects and potential demand across Rwanda and the region." },
      { title: "Market entry and local representation", text: "Facilitate introductions, local business representation and engagement with relevant public and private purchasing entities." },
      { title: "Supplier and distributor engagement", text: "Connect international manufacturers, authorised distributors and specialised service providers with prospective local buyers and business partners." },
      { title: "Procurement and supply chain coordination", text: "Support sourcing, procurement processes, logistics coordination and engagement with relevant stakeholders." },
      { title: "Contract and project delivery support", text: "Coordinate local implementation, delivery monitoring and stakeholder engagement to help turn opportunities into successful outcomes." },
    ],
    deliveryTitle: "From market opportunity to successful delivery",
    deliveryText: "Our work goes beyond introductions. We provide local market understanding, coordination and operational support to help international businesses navigate Rwanda's commercial environment, build credible relationships and pursue opportunities across the region.",
    tagline: "Your Local Partner. Your Regional Advantage.",
    contact: "Discuss a market opportunity",
  },
  rw: {
    eyebrow: "Kwinjira ku Isoko n'Ishoramari",
    heroTitle: "U Rwanda: Irembo rigana ku mahirwe yo mu karere no ku mugabane",
    heroIntro: "U Rwanda rutanga urubuga rw'ingenzi ku bakora ibicuruzwa mpuzamahanga, abacuruzi babiherewe uburenganzira n'ababitanga, rubafasha kugera ku masoko akura yo muri Afurika y'Iburasirazuba, yo Hagati no ku mugabane wose.",
    marketsTitle: "Kugera ku masoko binyuze mu masezerano y'ubucuruzi",
    marketsIntro: "Binyuze mu kuba umunyamuryango w'amasezerano y'ubucuruzi yo mu karere no ku mugabane, u Rwanda rutanga amahirwe yo kugera ku isoko rinini kandi rikomeje kwaguka.",
    markets: [
      { name: "Umuryango wa Afurika y'Iburasirazuba", population: "Miliyoni 353.8", text: "z'abaturage bo mu isoko rya EAC" },
      { name: "COMESA", population: "Miliyoni 583", text: "z'abaturage bo mu isoko rya COMESA" },
      { name: "Isoko Rusange rya Afurika", population: "Miliyari 1.55", text: "z'abaturage bo muri Afurika; u Rwanda rushyigikira ishyirwa mu bikorwa ry'ubucuruzi bwihuza ku mugabane" },
    ],
    neighborTitle: "Ihuza ry'ingenzi n'iburasirazuba bwa Kongo",
    neighborText: "U Rwanda rufitanye isano ikomeye y'ubucuruzi n'iy'ahantu n'iburasirazuba bwa Repubulika Iharanira Demokarasi ya Kongo, isoko ry'abaturanyi rifite ibyifuzo n'amahirwe menshi mu bucuruzi.",
    supportTitle: "Uko LEAD MULTI-CHOICE ® ifasha kugera ku isoko",
    supportIntro: "Duhuza amahirwe y'ibicuruzwa mpuzamahanga n'ibikenewe ku isoko ryo mu karere, tugafasha abatanga ibicuruzwa gusobanukirwa ubucuruzi mu Rwanda no kubaka umubano ukenewe kugira ngo bagere ku isoko.",
    support: [
      { title: "Amakuru y'isoko no kumenya amahirwe", text: "Kumenya amahirwe mu nzego zitandukanye, ibisabwa mu masoko, amahirwe y'ishoramari n'ibikenewe mu Rwanda no mu karere." },
      { title: "Kwinjira ku isoko no guhagararirwa mu karere", text: "Guhuza abafatanyabikorwa, guhagararira ubucuruzi mu karere no koroshya ibiganiro n'abaguzi bo mu nzego za Leta n'iz'abikorera." },
      { title: "Guhuza abatanga ibicuruzwa n'ababikwirakwiza", text: "Guhuza abakora ibicuruzwa mpuzamahanga, ababikwirakwiza babiherewe uburenganzira n'abatanga serivisi zihariye n'abaguzi n'abafatanyabikorwa bo mu karere." },
      { title: "Guhuza amasoko n'uruhererekane rw'ibicuruzwa", text: "Gufasha mu gushaka ibicuruzwa, ibikorwa by'amasoko, gutegura ubwikorezi no gukorana n'abafatanyabikorwa bireba." },
      { title: "Gushyigikira amasezerano n'ishyirwa mu bikorwa ry'imishinga", text: "Guhuza ibikorwa mu Rwanda, gukurikirana igeze ku bakiriya no gukorana n'abafatanyabikorwa kugira ngo amahirwe agere ku musaruro mwiza." },
    ],
    deliveryTitle: "Kuva ku mahirwe y'isoko kugeza ku musaruro mwiza",
    deliveryText: "Akazi kacu karenze kumenyekanisha abantu. Dutanga ubumenyi ku isoko ryo mu karere, duhuza ibikorwa kandi tugatanga ubufasha mu mikorere kugira ngo ibigo mpuzamahanga bisobanukirwe ubucuruzi mu Rwanda, byubake umubano wizewe kandi bikurikirane amahirwe yo mu karere.",
    tagline: "Umufatanyabikorwa wawe mu Rwanda. Amahirwe yawe mu karere.",
    contact: "Ganira natwe ku mahirwe y'isoko",
  },
  fr: {
    eyebrow: "Accès au marché et investissement",
    heroTitle: "Le Rwanda : votre porte d'accès aux opportunités régionales et continentales",
    heroIntro: "Le Rwanda offre aux fabricants internationaux, aux distributeurs agréés et aux fournisseurs une plateforme stratégique pour accéder aux marchés en croissance d'Afrique de l'Est, d'Afrique centrale et du continent africain.",
    marketsTitle: "Accéder aux marchés grâce aux cadres commerciaux régionaux",
    marketsIntro: "Grâce à sa participation aux cadres commerciaux régionaux et continentaux, le Rwanda ouvre des possibilités d'accès à un vaste marché de consommation en croissance.",
    markets: [
      { name: "Communauté d'Afrique de l'Est", population: "353,8 millions", text: "de personnes dans le marché de l'EAC" },
      { name: "COMESA", population: "583 millions", text: "de personnes dans le marché du COMESA" },
      { name: "Zone de libre-échange continentale africaine", population: "1,55 milliard", text: "de personnes en Afrique ; le Rwanda soutient la mise en œuvre progressive de l'intégration commerciale continentale" },
    ],
    neighborTitle: "Un lien stratégique avec l'est de la RDC",
    neighborText: "Le Rwanda entretient des liens commerciaux et géographiques importants avec l'est de la République démocratique du Congo, un marché voisin où la demande et les possibilités commerciales sont considérables.",
    supportTitle: "Comment LEAD MULTI-CHOICE ® facilite l'accès au marché",
    supportIntro: "Nous faisons le lien entre l'offre internationale et la demande locale. Nous aidons les fournisseurs à comprendre l'environnement commercial rwandais et à établir les relations nécessaires pour accéder au marché.",
    support: [
      { title: "Intelligence de marché et repérage des opportunités", text: "Repérer les possibilités sectorielles, les exigences des marchés publics, les perspectives d'investissement et la demande potentielle au Rwanda et dans la région." },
      { title: "Entrée sur le marché et représentation locale", text: "Faciliter les mises en relation, la représentation commerciale locale et les échanges avec les acheteurs publics et privés concernés." },
      { title: "Relations avec les fournisseurs et distributeurs", text: "Mettre en relation fabricants internationaux, distributeurs agréés et prestataires spécialisés avec des acheteurs et partenaires locaux potentiels." },
      { title: "Coordination des achats et de la chaîne d'approvisionnement", text: "Accompagner le sourcing, les démarches d'approvisionnement, la coordination logistique et les échanges avec les parties prenantes concernées." },
      { title: "Accompagnement des contrats et de la réalisation des projets", text: "Coordonner la mise en œuvre locale, le suivi des livraisons et les échanges entre parties prenantes pour concrétiser les opportunités." },
    ],
    deliveryTitle: "De l'opportunité de marché à la réussite opérationnelle",
    deliveryText: "Notre rôle va au-delà des mises en relation. Nous apportons une connaissance du marché local, de la coordination et un soutien opérationnel pour aider les entreprises internationales à évoluer dans l'environnement commercial rwandais, à bâtir des relations fiables et à saisir les possibilités régionales.",
    tagline: "Votre partenaire local. Votre avantage régional.",
    contact: "Parlons d'une opportunité de marché",
  },
  sw: {
    eyebrow: "Upatikanaji wa Soko na Uwekezaji",
    heroTitle: "Rwanda: Lango lako la fursa za kikanda na bara zima",
    heroIntro: "Rwanda huwapa watengenezaji wa kimataifa, wasambazaji walioidhinishwa na wauzaji jukwaa muhimu la kufikia masoko yanayokua Afrika Mashariki, Afrika ya Kati na bara lote la Afrika.",
    marketsTitle: "Fikia masoko kupitia mifumo ya biashara ya kikanda",
    marketsIntro: "Kupitia uanachama wake katika mifumo ya biashara ya kikanda na bara, Rwanda hutoa fursa za kushiriki katika soko kubwa na linalokua la watumiaji.",
    markets: [
      { name: "Jumuiya ya Afrika Mashariki", population: "milioni 353.8", text: "ya watu katika soko la EAC" },
      { name: "COMESA", population: "milioni 583", text: "ya watu katika soko la COMESA" },
      { name: "Eneo Huru la Biashara la Bara la Afrika", population: "bilioni 1.55", text: "ya watu barani Afrika; Rwanda inaunga mkono utekelezaji wa hatua kwa hatua wa ushirikiano wa biashara wa bara" },
    ],
    neighborTitle: "Kiungo muhimu na mashariki mwa DRC",
    neighborText: "Rwanda ina uhusiano muhimu wa kibiashara na kijiografia na mashariki mwa Jamhuri ya Kidemokrasia ya Kongo, soko jirani lenye mahitaji makubwa na fursa za biashara.",
    supportTitle: "Jinsi LEAD MULTI-CHOICE ® inavyosaidia upatikanaji wa soko",
    supportIntro: "Tunaunganisha fursa za ugavi wa kimataifa na mahitaji ya ndani. Tunawasaidia wauzaji kuelewa mazingira ya biashara ya Rwanda na kujenga mahusiano yanayohitajika kuingia sokoni.",
    support: [
      { title: "Taarifa za soko na kutambua fursa", text: "Tambua fursa za sekta, mahitaji ya ununuzi, matarajio ya uwekezaji na mahitaji yanayoweza kuwepo Rwanda na katika eneo hili." },
      { title: "Kuingia sokoni na uwakilishi wa ndani", text: "Rahisisha utambulisho, uwakilishi wa biashara wa ndani na mawasiliano na taasisi husika za ununuzi za umma na binafsi." },
      { title: "Ushirikiano na wauzaji na wasambazaji", text: "Unganisha watengenezaji wa kimataifa, wasambazaji walioidhinishwa na watoa huduma maalumu na wanunuzi na washirika wa ndani.", },
      { title: "Uratibu wa ununuzi na ugavi", text: "Saidia utafutaji wa bidhaa, michakato ya ununuzi, uratibu wa usafirishaji na mawasiliano na wadau husika." },
      { title: "Msaada wa mikataba na utekelezaji wa miradi", text: "Ratibu utekelezaji wa ndani, ufuatiliaji wa usafirishaji na ushirikiano wa wadau ili kugeuza fursa kuwa matokeo yenye mafanikio." },
    ],
    deliveryTitle: "Kutoka fursa ya soko hadi utekelezaji wenye mafanikio",
    deliveryText: "Kazi yetu haishii kwenye utambulisho. Tunatoa uelewa wa soko la ndani, uratibu na msaada wa kiutendaji ili kusaidia biashara za kimataifa kuelewa mazingira ya kibiashara ya Rwanda, kujenga mahusiano ya kuaminika na kufuatilia fursa katika eneo hili.",
    tagline: "Mshirika wako wa ndani. Faida yako ya kikanda.",
    contact: "Jadili fursa ya soko",
  },
};

const supportIcons = [Search, Users, Handshake, Truck, ClipboardCheck];

export default function MarketAccessInvestment() {
  const { language } = useI18n();
  const copy = content[language];

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.heroTitle}
        intro={copy.heroIntro}
        image="/site/hero-port.jpg"
        visualKey="marketAccess.hero"
        alt="Containers at an international freight terminal"
      />

      <section className="container-site py-12 md:py-16">
        <SectionHeading title={copy.marketsTitle} intro={copy.marketsIntro} />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {copy.markets.map((market) => (
            <article key={market.name} className="rounded border border-border bg-background p-6 md:p-7">
              <Globe2 className="text-brand-primary" size={23} aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold">{market.name}</h3>
              <p className="mt-5 font-display text-3xl font-bold text-brand-primary">{market.population}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{market.text}</p>
            </article>
          ))}
        </div>
        <aside className="mt-5 rounded border-l-4 border-brass bg-warm p-5 md:p-6">
          <h3 className="font-semibold">{copy.neighborTitle}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.neighborText}</p>
        </aside>
      </section>

      <PhotoScrollSection image="/site/meeting.jpg" visualKey="marketAccess.support" overlayClassName="bg-brand-white/88" className="bg-warm py-12 md:py-16">
        <div className="container-site">
          <SectionHeading title={copy.supportTitle} intro={copy.supportIntro} />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {copy.support.map((item, index) => {
              const Icon = supportIcons[index] ?? Search;
              return (
                <article key={item.title} className="rounded border border-border bg-background p-6">
                  <div className="flex items-center justify-between">
                    <Icon className="text-brand-primary" size={23} aria-hidden="true" />
                    <span className="font-display text-sm font-bold tabular-nums text-brass">0{index + 1}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </PhotoScrollSection>

      <section className="container-site grid gap-6 py-12 md:grid-cols-[1fr_auto] md:items-center md:py-16">
        <div>
          <p className="eyebrow mb-3">{copy.tagline}</p>
          <h2 className="text-[28px] md:text-[38px]">{copy.deliveryTitle}</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">{copy.deliveryText}</p>
        </div>
        <ButtonLink href="/contact#business-enquiry" variant="primary" arrow className="shrink-0">
          {copy.contact}
        </ButtonLink>
      </section>
    </>
  );
}
