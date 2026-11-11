"use client";

import {
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Compass,
  Factory,
  FileCheck2,
  FileText,
  Handshake,
  Layers,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import type { ProcurementResource } from "@/lib/cms/procurement-resources";
import { ButtonLink, PageHero, SectionHeading } from "@/components/site/ui";
import { ProcurementResourceCarousel } from "@/components/site/ProcurementResourceCarousel";
import { PhotoScrollSection } from "@/components/site/PhotoScrollSection";
import { useI18n } from "@/i18n/I18nProvider";

type ProcurementContent = {
  eyebrow: string;
  heroTitle: string;
  heroIntro: string;
  tabsBuyer: string;
  tabsSupplier: string;
  tabsOpportunities: string;
  principlesEyebrow: string;
  principlesTitle: string;
  principlesIntro: string;
  principles: { title: string; text: string }[];
  processTitle: string;
  processIntro: string;
  steps: { step: string; title: string; text: string }[];
  benefitsTitle: string;
  benefits: { title: string; text: string }[];
  supplierEyebrow: string;
  supplierTitle: string;
  supplierIntro: string;
  considerations: { title: string; text: string }[];
  opportunitiesEyebrow: string;
  opportunitiesTitle: string;
  opportunitiesIntro: string;
  aboutTitle: string;
  aboutText1: string;
  aboutText2: string;
  coordinationEyebrow: string;
  coordinationTitle: string;
  coordinationText: string;
  ctaButton: string;
};

const content: Record<string, ProcurementContent> & { en: ProcurementContent } = {
  en: {
    eyebrow: "Procurement & Strategic Sourcing",
    heroTitle: "Strategic Sourcing & Procurement Opportunities",
    heroIntro:
      "Bridging the gap between purchasing entities and global suppliers through structured strategic sourcing, while guiding manufacturers and licensed distributors entering Rwanda and East Africa.",
    tabsBuyer: "For Purchasing Entities",
    tabsSupplier: "For Manufacturers & Distributors",
    tabsOpportunities: "Browse Opportunities",
    principlesEyebrow: "Core Principles",
    principlesTitle: "Strategic Sourcing — Foundational Principles",
    principlesIntro:
      "Strategic sourcing moves beyond basic purchasing to optimize total value, supplier reliability, and compliance across every procurement cycle.",
    principles: [
      {
        title: "Holistic Evaluation",
        text: "Balance total cost, specifications, delivery, sustainability, and innovation.",
      },
      {
        title: "Data-Driven Decisions",
        text: "Use spend, market, and supplier performance data to guide choices.",
      },
      {
        title: "Continuous Process",
        text: "Review supplier performance, contracts, and market changes over time.",
      },
    ],
    processTitle: "Typical 7-Step Strategic Sourcing Process",
    processIntro:
      "A clear sequence for sourcing goods, equipment, and services.",
    steps: [
      {
        step: "01",
        title: "Analyse Spend and Requirements",
        text: "Review spend, specifications, quantities, and delivery timelines.",
      },
      {
        step: "02",
        title: "Identify Supplier Market",
        text: "Map local, regional, and international supplier options.",
      },
      {
        step: "03",
        title: "Develop Supplier Shortlist",
        text: "Check supplier capability, certifications, finances, and track record.",
      },
      {
        step: "04",
        title: "Select Suppliers (RFP / RFQ)",
        text: "Compare proposals using clear, consistent evaluation criteria.",
      },
      {
        step: "05",
        title: "Negotiate and Finalise Contracts",
        text: "Agree on pricing, warranties, delivery terms, and service levels.",
      },
      {
        step: "06",
        title: "Implement & Manage Supplier Relationships",
        text: "Coordinate logistics, customs clearance, acceptance, and supplier follow-up.",
      },
      {
        step: "07",
        title: "Review and Optimise Continuously",
        text: "Review supplier performance and identify improvements.",
      },
    ],
    benefitsTitle: "Measurable Sourcing Benefits",
    benefits: [
      {
        title: "Cost Savings",
        text: "Capture sustainable direct savings and optimize lifecycle operating expenses.",
      },
      {
        title: "Improved Quality",
        text: "Strict adherence to technical requirements, certifications, and compliance.",
      },
      {
        title: "Supply Resilience",
        text: "Mitigate shortages with qualified secondary suppliers and predictable lead times.",
      },
      {
        title: "Stronger Partnerships",
        text: "Build long-term, mutually accountable relationships with verified manufacturers.",
      },
    ],
    supplierEyebrow: "Manufacturer & Distributor Perspective",
    supplierTitle: "Supplying Rwanda & Regional Markets: Key Considerations",
    supplierIntro:
      "A practical sequence for manufacturers and licensed distributors preparing to serve purchasing entities in Rwanda and the region.",
    considerations: [
      {
        title: "Understand the market and buyer requirements",
        text: "Identify relevant sectors, purchasing entities, demand, and the requirements that apply to your products or services.",
      },
      {
        title: "Confirm product approvals and compliance",
        text: "Check applicable standards, product registrations, and import requirements, including RSB or Rwanda FDA requirements where relevant.",
      },
      {
        title: "Establish local representation",
        text: "Choose a credible local representative to support introductions, communication, and follow-up with purchasing entities.",
      },
      {
        title: "Prepare for procurement and tendering",
        text: "Review buyer procedures, eligibility criteria, required documents, bid securities, and the terms of each opportunity.",
      },
      {
        title: "Plan delivery and ongoing support",
        text: "Coordinate freight, customs, in-country handling, delivery acceptance, warranty support, and maintenance where required.",
      },
    ],
    opportunitiesEyebrow: "Selected Opportunities",
    opportunitiesTitle: "Selected Procurement Opportunities",
    opportunitiesIntro:
      "Browse selected tender and consultancy opportunities from relevant sources.",
    aboutTitle: "About these opportunity listings",
    aboutText1:
      "These links lead to individual tender and consultancy opportunities. Review each notice for its requirements and deadline.",
    aboutText2:
      "Lead Multi-Choice ® does not own or administer these listings and cannot guarantee an award or issue procurement decisions. Confirm the requirements, submission process, and closing date in each original listing.",
    coordinationEyebrow: "Coordination support",
    coordinationTitle: "Need help acting on an opportunity?",
    coordinationText:
      "Suppliers and institutional buyers can contact Lead Multi-Choice ® to discuss appropriate coordination support, from supplier introductions to logistics and delivery follow-up.",
    ctaButton: "Discuss a Business Opportunity",
  },
  rw: {
    eyebrow: "Amasoko n'Ubujyanama mu Gushaka Ibicuruzwa",
    heroTitle: "Gushaka Ibicuruzwa mu Buryo bw'Ingenzi n'Amahirwe y'Amasoko",
    heroIntro:
      "Guhuza ibigo bigura n'abatanga ibicuruzwa mpuzamahanga bizewe binyuze mu gushaka ibicuruzwa mu buryo buhamye, no gufasha abakora ibicuruzwa n'ababikwirakwiza binjira ku isoko ry'u Rwanda n'irya Afurika y'Iburasirazuba.",
    tabsBuyer: "Ku Bigo Bigura Ibicuruzwa",
    tabsSupplier: "Ku Bakora n'Abakwirakwiza Ibicuruzwa",
    tabsOpportunities: "Reba Amahirwe y'Amasoko",
    principlesEyebrow: "Amahame y'Ubujyanama",
    principlesTitle: "Gushaka Ibicuruzwa mu Buryo bw'Ingenzi — Amahame y'Ibanze",
    principlesIntro:
      "Ubu buryo burenze kugura gusa; butuma habaho agaciro gakomeye, ubwizerane n'iyubahirizwa ry'amabwiriza mu migendekere y'amasoko.",
    principles: [
      {
        title: "Isesengura Ryuzuye",
        text: "Gusuzuma ikiguzi cyose, ubuziranenge, igihe cyo kugeza ibicuruzwa, kuramba n'udushya—hashingiwe ku birenze igiciro cyo ku isoko gusa.",
      },
      {
        title: "Ibyemezo Bishingiye ku Makuru",
        text: "Gukoresha isesengura ry'amafaranga asohoka, amakuru ku batanga ibicuruzwa n'ubushakashatsi ku isoko kugira ngo hagirwe ubwumvikane bunoze.",
      },
      {
        title: "Gukomeza Kwiyubaka no Gukurikirana",
        text: "Gukurikirana imikorere y'abatanga ibicuruzwa, amasezerano no kugabanya ingaruka mbi zishobora kugaragara.",
      },
    ],
    processTitle: "Intambwe 7 mu Gushaka Ibicuruzwa mu Buryo bw'Ingenzi",
    processIntro:
      "Uburyo bufasha inzego z'abaguzi kubona ibikoresho na serivisi bifite ubuziranenge bwo hejuru kandi bikazigama umutungo.",
    steps: [
      {
        step: "01",
        title: "Gusesengura Ibyakoreshejwe n'Ibikenewe",
        text: "Kureba uko amafaranga akoreshwa, ibyo abaguzi bakeneye n'igihe ibikoresho bigomba kubonekera.",
      },
      {
        step: "02",
        title: "Kumenya Isoko ry'Abatanga Ibicuruzwa",
        text: "Gushakisha abatunganya ibicuruzwa n'ababikwirakwiza mu karere no ku rwego mpuzamahanga.",
      },
      {
        step: "03",
        title: "Gutoranya Abatanga Ibicuruzwa Bakwiye",
        text: "Gusuzuma ibyemezo by'ubuziranenge, ubushobozi bw'amafaranga n'uburambe mu itangwa ry'ibicuruzwa.",
      },
      {
        step: "04",
        title: "Gutoranya Binyuze mu Ipiganwa (RFP / RFQ)",
        text: "Gutegura amabwiriza asobanutse yo gupiganwa ashingiye ku bipimo bisobanutse by'isuzuma.",
      },
      {
        step: "05",
        title: "Kuganira no Gusoza Amasezerano",
        text: "Kumvikana ku biciro, garanti, uburyo bwo kwishyura n'ingengabihe yo kugeza ibicuruzwa.",
      },
      {
        step: "06",
        title: "Gushyira mu Bikorwa no Gucunga Umubano",
        text: "Guhuza ubwikorezi bwo mu gihugu, gasutamo, kwakira ibicuruzwa no gukurikirana ubufatanye.",
      },
      {
        step: "07",
        title: "Gusuzuma no Kunoza Ibikorwa Ubudahwema",
        text: "Gupima imikorere y'abatanga ibicuruzwa, gukemura inzitizi no kongera inyungu mu mikoranire.",
      },
    ],
    benefitsTitle: "Inyungu z'Ubu Buryo",
    benefits: [
      {
        title: "Kuzigama Amafaranga",
        text: "Kugabanya ibiciro no kuzigama mu buryo burambye mu gihe cy'imikoreshereze y'igicuruzwa.",
      },
      {
        title: "Ubuziranenge Bunoze",
        text: "Kuzuza ibipimo bya tekiniki n'amabwiriza y'ubuziranenge yemewe mu gihugu no hanze.",
      },
      {
        title: "Kwirinda Inzitizi",
        text: "Kugira abatanga ibicuruzwa basimbura hagamijwe ko ibikoresho bidahagarara.",
      },
      {
        title: "Ubufatanye Burambye",
        text: "Kubaka umubano w'igihe kirekire wizerana n'abakora ibicuruzwa ku rwego rw'isi.",
      },
    ],
    supplierEyebrow: "Uruhande rw'Abakora n'Abakwirakwiza Ibicuruzwa",
    supplierTitle: "Kugeza Ibicuruzwa mu Rwanda no mu Karere: Iby'Ingenzi Kwitondera",
    supplierIntro:
      "Icyo abakora ibicuruzwa mpuzamahanga n'ababikwirakwiza babiherewe uburenganzira bagomba kumenya mbere yo kwinjira ku isoko ry'u Rwanda.",
    considerations: [
      {
        title: "Kuzuza Amabwiriza n'Ibyemezo by'Ubuziranenge",
        text: "Gushaka ibyemezo by'Ikigo cy'Ubuziranenge (RSB), Rwanda FDA n'izindi nzego zibifitiye ububasha mbere yo gutumiza ibicuruzwa.",
      },
      {
        title: "Kugira Umufatanyabikorwa Ukwemerewe mu Karere",
        text: "Gukorana n'ikigo cyemewe mu gihugu gishobora guhagararira izina ryawe, kwitabira inama no gukurikirana ubucuruzi.",
      },
      {
        title: "Kuzuza Ibisabwa mu Masoko ya Leta n'ay'Ibigo",
        text: "Gusobanukirwa n'uburyo bwa UMUCYO e-procurement, ingwate z'ipiganwa (bid bonds) n'amasezerano arambye.",
      },
      {
        title: "Ubwikorezi, Gasutamo n'Ububiko",
        text: "Gukurikirana ubwikorezi bwerekeza i Kigali, ububiko bwa gasutamo (bonded warehouse) n'amahoro ya gasutamo muri EAC/COMESA.",
      },
      {
        title: "Ubufasha Nyuma yo Kugurisha na Garanti",
        text: "Gutegura ubufasha mu bya tekiniki, kuboneka kw'ibice by'ibikoresho (spare parts) no guhugura abakoresha ibyo bikorwa.",
      },
    ],
    opportunitiesEyebrow: "Amahirwe Yatoranyijwe",
    opportunitiesTitle: "Amahirwe y'Amasoko Yatoranyijwe",
    opportunitiesIntro:
      "Reba amahirwe yatoranyijwe y'amasoko n'ubujyanama aturutse mu masoko anyuranye.",
    aboutTitle: "Ibyerekeye aya mahirwe",
    aboutText1:
      "Izi linki zijyana ku mahirwe yihariye y'amasoko n'ubujyanama. Reba buri tangazo kugira ngo umenye ibisabwa n'itariki ntarengwa.",
    aboutText2:
      "Lead Multi-Choice ® ntabwo ari yo nyiri aya matangazo kandi ntishobora kwemeza ko uzatsinda cyangwa gufata ibyemezo by'amasoko. Reba ibisabwa, uko usaba n'itariki yo gusoza muri buri tangazo.",
    coordinationEyebrow: "Gufasha guhuza ibikorwa",
    coordinationTitle: "Ukeneye ubufasha bwo gukurikirana amahirwe?",
    coordinationText:
      "Abatanga ibicuruzwa n'inzego z'abaguzi bashobora kuvugana na Lead Multi-Choice ® bakaganira ku bufasha bukwiye bwo guhuza ibikorwa, kuva ku guhuza abatanga ibicuruzwa kugeza ku bwikorezi no gukurikirana ishyikirizwa.",
    ctaButton: "Ganira natwe ku mahirwe y'ubucuruzi",
  },
  fr: {
    eyebrow: "Achats et approvisionnement stratégique",
    heroTitle: "Approvisionnement stratégique et opportunités de marchés",
    heroIntro:
      "Rapprocher les entités adjudicatrices des fournisseurs internationaux fiables grâce à des méthodes d'achats stratégiques, tout en guidant les fabricants et distributeurs agréés entrant au Rwanda et en Afrique de l'Est.",
    tabsBuyer: "Pour les entités acheteuses",
    tabsSupplier: "Pour les fabricants et distributeurs",
    tabsOpportunities: "Consulter les opportunités",
    principlesEyebrow: "Principes directeurs",
    principlesTitle: "Approvisionnement stratégique — Principes fondamentaux",
    principlesIntro:
      "L'approvisionnement stratégique va bien au-delà de l'achat ponctuel pour maximiser la valeur globale, la fiabilité et la conformité.",
    principles: [
      {
        title: "Évaluation holistique",
        text: "Prend en compte le coût total de possession, la qualité technique, les délais de livraison, la durabilité et l'innovation—au-delà du simple prix facial.",
      },
      {
        title: "Décisions fondées sur les données",
        text: "Exploite l'analyse détaillée des dépenses, les matrices de compétences fournisseurs et les études de marché pour négocier en position éclairée.",
      },
      {
        title: "Processus continu",
        text: "Comprend la réévaluation régulière des prestataires, la gestion rigoureuse des contrats et la veille proactive du marché.",
      },
    ],
    processTitle: "Le processus d'approvisionnement stratégique en 7 étapes",
    processIntro:
      "Une démarche éprouvée qui aide les acheteurs à se procurer biens, équipements et services avec une qualité garantie et des coûts optimisés.",
    steps: [
      {
        step: "01",
        title: "Analyser les dépenses et les besoins",
        text: "Cartographier les postes de dépenses, les spécifications techniques requises, les volumes prévisionnels et les délais.",
      },
      {
        step: "02",
        title: "Identifier le marché fournisseurs",
        text: "Analyser l'écosystème des fabricants locaux, régionaux et internationaux pour mesurer les capacités de production.",
      },
      {
        step: "03",
        title: "Établir une présélection de fournisseurs",
        text: "Évaluer les fournisseurs candidats selon leurs certifications, leur solidité financière et leurs références antérieures.",
      },
      {
        step: "04",
        title: "Sélectionner les prestataires (RFP / RFQ)",
        text: "Émettre des dossiers d'appels d'offres structurés avec des critères d'évaluation transparents et pondérés.",
      },
      {
        step: "05",
        title: "Négocier et finaliser les contrats",
        text: "Structurer des accords commerciaux équilibrés couvrant prix, garanties, conditions de livraison (Incoterms) et pénalités.",
      },
      {
        step: "06",
        title: "Déployer et piloter la relation fournisseur",
        text: "Coordonner la logistique locale, le dédouanement, les tests de réception et la gestion opérationnelle de la relation (SRM).",
      },
      {
        step: "07",
        title: "Revue et optimisation continues",
        text: "Mesurer la performance des fournisseurs via des KPIs, lever les blocages et sécuriser des gains récurrents.",
      },
    ],
    benefitsTitle: "Bénéfices tangibles",
    benefits: [
      {
        title: "Économies substantielles",
        text: "Obtenir des réductions directes pérennes et optimiser les coûts de cycle de vie.",
      },
      {
        title: "Excellence de la qualité",
        text: "Respect rigoureux des cahiers des charges et des certifications requises.",
      },
      {
        title: "Résilience de la chaîne",
        text: "Réduire les risques de rupture grâce à des fournisseurs de substitution pré-qualifiés.",
      },
      {
        title: "Partenariats solides",
        text: "Bâtir des relations pérennes et mutuellement responsables avec des fabricants certifiés.",
      },
    ],
    supplierEyebrow: "Perspective fabricants & distributeurs",
    supplierTitle: "Fournir le marché rwandais et régional : points d'attention clés",
    supplierIntro:
      "Pour les fabricants internationaux et distributeurs agréés souhaitant approvisionner les entités publiques et privées du Rwanda.",
    considerations: [
      {
        title: "Conformité réglementaire et homologation",
        text: "Obtention des certifications obligatoires auprès du Rwanda Standards Board (RSB), de la Rwanda FDA et des autorisations sectorielles d'importation.",
      },
      {
        title: "Représentation locale agréée",
        text: "Collaboration avec un représentant local enregistré et crédible capable de défendre vos intérêts commerciaux et de participer aux réunions officielles.",
      },
      {
        title: "Critères d'éligibilité aux marchés publics",
        text: "Maîtrise des exigences du système e-procurement UMUCYO, des garanties de soumission, des cautions de bonne fin et des accords-cadres.",
      },
      {
        title: "Logistique, douanes et entreposage",
        text: "Acheminement multimodal vers Kigali, entrepôts sous douane, application des tarifs douaniers EAC/COMESA et livraison sur site.",
      },
      {
        title: "Service après-vente, maintenance et garantie",
        text: "Mise en place d'un support technique local, disponibilité des pièces détachées et formation des utilisateurs pour protéger la réputation de la marque.",
      },
    ],
    opportunitiesEyebrow: "Opportunités sélectionnées",
    opportunitiesTitle: "Opportunités d'approvisionnement sélectionnées",
    opportunitiesIntro:
      "Consultez une sélection d'appels d'offres et de missions de conseil provenant de différentes sources.",
    aboutTitle: "À propos de ces opportunités",
    aboutText1:
      "Ces liens renvoient vers des appels d'offres et des missions de conseil. Consultez chaque avis pour connaître les exigences et la date limite.",
    aboutText2:
      "Lead Multi-Choice ® ne possède ni ne gère ces annonces et ne peut garantir une attribution ni prendre de décision d'achat. Vérifiez les exigences, la procédure et la date limite dans chaque annonce.",
    coordinationEyebrow: "Coordination et accompagnement",
    coordinationTitle: "Besoin d'aide pour concrétiser une opportunité ?",
    coordinationText:
      "Fournisseurs et acheteurs institutionnels peuvent contacter Lead Multi-Choice ® pour définir l'appui approprié, de la mise en relation à la logistique et au suivi des livraisons.",
    ctaButton: "Discuter d'une opportunité commerciale",
  },
  sw: {
    eyebrow: "Ununuzi na Upatikanaji wa Kimkakati",
    heroTitle: "Upatikanaji wa Kimkakati na Fursa za Ununuzi",
    heroIntro:
      "Kuunganisha taasisi za ununuzi na wasambazaji wa kimataifa wanaoaminika kupitia mbinu za kimkakati za ununuzi, huku tukiongoza watengenezaji na wasambazaji wanaoingia Rwanda na Afrika Mashariki.",
    tabsBuyer: "Kwa Taasisi za Ununuzi",
    tabsSupplier: "Kwa Watengenezaji na Wasambazaji",
    tabsOpportunities: "Tazama Fursa",
    principlesEyebrow: "Kanuni za Msingi",
    principlesTitle: "Upatikanaji wa Kimkakati — Kanuni Muhimu",
    principlesIntro:
      "Upatikanaji wa kimkakati unavuka ununuzi wa kawaida ili kuongeza thamani ya jumla, uaminifu wa wasambazaji na uzingatiaji wa taratibu.",
    principles: [
      {
        title: "Tathmini ya Kina",
        text: "Kuzingatia gharama ya jumla ya umiliki, ubora wa kiufundi, muda wa uwasilishaji na ubunifu—badala ya kuangalia bei ya awali pekee.",
      },
      {
        title: "Maamuzi Yanayotegemea Data",
        text: "Kutumia uchambuzi wa matumizi, uwezo wa wazalishaji na utafiti wa soko kufanya maamuzi sahihi ya kibiashara.",
      },
      {
        title: "Mchakato Endelevu",
        text: "Kujumuisha tathmini ya mara kwa mara ya wasambazaji, usimamizi wa mikataba na udhibiti wa hatari za ununuzi.",
      },
    ],
    processTitle: "Mchakato wa Hatua 7 wa Upatikanaji wa Kimkakati",
    processIntro:
      "Mwongozo uliopangiliwa unaosaidia taasisi za ununuzi kupata bidhaa na huduma zenye ubora na kuokoa gharama.",
    steps: [
      {
        step: "01",
        title: "Changanua Matumizi na Mahitaji",
        text: "Chunguza mwelekeo wa matumizi, vigezo vya kiufundi vinavyotakiwa na ratiba ya uwasilishaji.",
      },
      {
        step: "02",
        title: "Tambua Soko la Wasambazaji",
        text: "Tathmini wazalishaji wa ndani, kikanda na kimataifa ili kuelewa uwezo wao wa uzalishaji.",
      },
      {
        step: "03",
        title: "Andaa Orodha Fupi ya Wasambazaji",
        text: "Chuja wazalishaji kulingana na vyeti vya ubora, uwezo wa kifedha na historia ya utendaji wao.",
      },
      {
        step: "04",
        title: "Chagua Wasambazaji (RFP / RFQ)",
        text: "Toa nyaraka za zabuni zilizopangiliwa zenye vigezo vya uwazi vya tathmini.",
      },
      {
        step: "05",
        title: "Jadili na Kamilisha Mikataba",
        text: "Panga mikataba ya kibiashara inayojumuisha bei, dhamana, masharti ya usafirishaji na malipo.",
      },
      {
        step: "06",
        title: "Utekelezaji na Usimamizi wa Mahusiano",
        text: "Ratibu usafirishaji wa ndani, taratibu za forodha, ukaguzi wa bidhaa na usimamizi wa watoa huduma.",
      },
      {
        step: "07",
        title: "Tathmini na Boresha Mara kwa Mara",
        text: "Pima utendaji wa wasambazaji kulingana na viwango maalum na tatua changamoto zozote mapema.",
      },
    ],
    benefitsTitle: "Manufaa ya Kimkakati",
    benefits: [
      {
        title: "Uokoaji wa Gharama",
        text: "Pata uokoaji endelevu na punguza gharama za uendeshaji katika mzunguko mzima wa bidhaa.",
      },
      {
        title: "Ubora wa Juu",
        text: "Uzingatiaji madhubuti wa vigezo vya kiufundi na viwango vinavyohitajika kisheria.",
      },
      {
        title: "Uthabiti wa Ugavi",
        text: "Punguza hatari za upungufu wa bidhaa kupitia wasambazaji mbadala waliohakikiwa.",
      },
      {
        title: "Ushirikiano Imara",
        text: "Jenga mahusiano ya muda mrefu na ya kuaminiana na wazalishaji waliothibitishwa.",
      },
    ],
    supplierEyebrow: "Mtazamo wa Wazalishaji na Wasambazaji",
    supplierTitle: "Kusambaza Rwanda na Masoko ya Kikanda: Mambo Muhimu ya Kuzingatia",
    supplierIntro:
      "Kwa watengenezaji wa kimataifa na wasambazaji walioidhinishwa wanaotaka kuuza bidhaa kwa taasisi za umma na binafsi nchini Rwanda.",
    considerations: [
      {
        title: "Uzingatiaji wa Sheria na Vyeti vya Ubora",
        text: "Kupata vyeti vya lazima kutoka Shirika la Viwango la Rwanda (RSB), Rwanda FDA na vibali husika vya uagizaji.",
      },
      {
        title: "Uwakilishi wa Ndani Ulioidhinishwa",
        text: "Kushirikiana na mwakilishi wa ndani aliyeidhinishwa na kusajiliwa kisheria ili kusimamia maslahi ya chapa yako.",
      },
      {
        title: "Vigezo vya Kushiriki Zabuni za Umma",
        text: "Kuelewa vigezo vya mfumo wa ununuzi wa kielektroniki wa UMUCYO, dhamana za zabuni na mikataba ya mfumo.",
      },
      {
        title: "Usafirishaji, Forodha na Ghala",
        text: "Kuratibu usafirishaji hadi Kigali, ghala za forodha (bonded warehouses), ushuru wa EAC/COMESA na uwasilishaji wa mwisho.",
      },
      {
        title: "Huduma Baada ya Mauzo na Dhamana",
        text: "Kuweka utayari wa msaada wa kiufundi, upatikanaji wa vipuri na mafunzo kwa watumiaji ili kulinda sifa ya chapa.",
      },
    ],
    opportunitiesEyebrow: "Fursa Zilizochaguliwa",
    opportunitiesTitle: "Fursa za Ununuzi Zilizochaguliwa",
    opportunitiesIntro:
      "Vinjari zabuni na fursa za ushauri zilizochaguliwa kutoka vyanzo mbalimbali.",
    aboutTitle: "Kuhusu matangazo haya ya fursa",
    aboutText1:
      "Viungo hivi vinaelekeza kwenye zabuni na fursa za ushauri. Soma kila tangazo ili kuona mahitaji na tarehe ya mwisho.",
    aboutText2:
      "Lead Multi-Choice ® haimiliki wala kusimamia matangazo haya na haiwezi kuhakikisha tuzo au kutoa maamuzi ya ununuzi. Thibitisha mahitaji, utaratibu wa kutuma na tarehe ya mwisho kwenye tangazo husika.",
    coordinationEyebrow: "Msaada wa Uratibu",
    coordinationTitle: "Unahitaji msaada kutumia fursa?",
    coordinationText:
      "Wasambazaji na wanunuzi wa kitaasisi wanaweza kuwasiliana na Lead Multi-Choice ® kujadili msaada unaofaa wa uratibu, kutoka utambulisho hadi uwasilishaji.",
    ctaButton: "Jadili Fursa ya Biashara",
  },
  zh: {
    eyebrow: "采购与战略寻源",
    heroTitle: "战略寻源与采购商机",
    heroIntro:
      "通过规范的战略寻源流程，弥合采购实体与国际可靠供应商之间的鸿沟；同时为进军卢旺达及东非市场的全球制造商与授权分销商提供全方位落地指引。",
    tabsBuyer: "面向采购实体",
    tabsSupplier: "面向制造商与分销商",
    tabsOpportunities: "浏览采购商机",
    principlesEyebrow: "核心原则",
    principlesTitle: "战略寻源 — 核心基石原则",
    principlesIntro:
      "战略寻源超越了基础的单次买卖行为，旨在全流程优化总成本、供应链可靠性与合规性。",
    principles: [
      {
        title: "全面综合评估",
        text: "综合考量总体拥有成本（TCO）、技术规格、交付可靠度、可持续性与技术创新，而非仅仅关注最初的单价。",
      },
      {
        title: "数据驱动决策",
        text: "运用支出分析、供应商能力矩阵及严谨的市场调研，在商业谈判中确立知情与优势地位。",
      },
      {
        title: "持续优化机制",
        text: "涵盖长效的供应商绩效再评估、合同合规监管及前瞻性供应链风险缓释，形成良性循环。",
      },
    ],
    processTitle: "标准 7 步战略寻源流程",
    processIntro:
      "结构化且透明的寻源路线图，帮助机构采购方以可预测的品质和显著的成本节约获得物资与专业服务。",
    steps: [
      {
        step: "01",
        title: "分析支出结构与业务需求",
        text: "详细梳理历史支出形态、用户技术要求、预期采购规模与交付时间表。",
      },
      {
        step: "02",
        title: "评估供应商市场格局",
        text: "深入调研本国、区域及全球制造商生态系统，精确研判市场供需与产能分布。",
      },
      {
        step: "03",
        title: "制定合格供应商初选名单",
        text: "严格审核候选供应商的技术资质认证、财务信誉、生产交付能力与过往履约记录。",
      },
      {
        step: "04",
        title: "供应商甄选 (RFP / RFQ)",
        text: "编制标准化招标文件或询价单，建立清晰客观、多维权重的评分遴选标准。",
      },
      {
        step: "05",
        title: "商务谈判与合同定案",
        text: "达成权责对等的商业合同，锁定价格、保修条款、服务等级协议（SLA）及交付约定。",
      },
      {
        step: "06",
        title: "履约落地与供应商关系管理",
        text: "统筹境内运输协调、海关清关、交付验收测试及战略供应商关系维系（SRM）。",
      },
      {
        step: "07",
        title: "持续复盘与迭代优化",
        text: "依据关键绩效指标（KPI）定期考评供应商履约水准，化解潜在堵点，创造长期复利价值。",
      },
    ],
    benefitsTitle: "战略寻源带来的可量化价值",
    benefits: [
      {
        title: "实质成本节约",
        text: "捕获显著的直接采购节约，并有效压降资产全生命周期的综合运营成本。",
      },
      {
        title: "品质与规格达标",
        text: "严格契合行业顶尖技术规范、国际质量标准及法定合规认证要求。",
      },
      {
        title: "供应链韧性与抗险",
        text: "建立备选合规供应商储备池，降低断供风险，保障交货周期稳定可靠。",
      },
      {
        title: "稳固的长期伙伴关系",
        text: "与经过实地核验的国际顶尖制造商建立互信互惠、责任明晰的长期商业合作关系。",
      },
    ],
    supplierEyebrow: "制造商与分销商视角",
    supplierTitle: "向卢旺达及区域市场供货：核心考量要点",
    supplierIntro:
      "面向希望在卢旺达及东非市场建立稳健销售网络、向公共机构及大型企业供货的全球制造商和分销商。",
    considerations: [
      {
        title: "法规合规与质量标准认证",
        text: "妥善办理卢旺达标准局（RSB）、卢旺达 FDA 及行业特定主管部门的法定认证与准入批文。",
      },
      {
        title: "官方授权本地商业代表",
        text: "与信誉良好的本土持牌机构合作，依法代表您的品牌参加商务会议、对接采购方并处理日常跟进。",
      },
      {
        title: "公共与机构招投标准入资质",
        text: "熟谙 UMUCYO 政府采购电子系统要求、投标保函、履约担保以及框架供货协议的规范准则。",
      },
      {
        title: "多式联运、报关清关与仓储物流",
        text: "统筹国际货运抵基加利的陆空联运、保税仓储、EAC/COMESA 关税协调及点对点交付。",
      },
      {
        title: "售后服务保障、维保与零配件储备",
        text: "建立健全的本地售后技术支持、零配件现货库和终端用户技术培训，捍卫品牌长远口碑与续约率。",
      },
    ],
    opportunitiesEyebrow: "精选采购机会",
    opportunitiesTitle: "精选采购与招标机会",
    opportunitiesIntro:
      "浏览来自相关渠道的精选招标和咨询机会。",
    aboutTitle: "关于这些机会列表",
    aboutText1:
      "这些链接指向具体的招标和咨询机会。请查看每则公告中的要求和截止日期。",
    aboutText2:
      "Lead Multi-Choice ® 不拥有或管理这些列表，也无法保证中标或发布采购决定。请在每条原始列表中确认要求、提交流程和截止日期。",
    coordinationEyebrow: "协调与支持服务",
    coordinationTitle: "需要在招标商机落地方面获得支持？",
    coordinationText:
      "供应商与机构买家均可联系 Lead Multi-Choice ®，商洽专业的落地支持方案——从商务对接到端到端物流交付全程护航。",
    ctaButton: "洽谈商务合作机会",
  },
  de: {
    eyebrow: "Beschaffung & Strategischer Einkauf",
    heroTitle: "Strategische Beschaffung & Beschaffungschancen",
    heroIntro:
      "Wir verbinden Einkäufer mit zuverlässigen internationalen Lieferanten durch strukturierte strategische Beschaffung und begleiten globale Hersteller beim Markteintritt in Ruanda und Ostafrika.",
    tabsBuyer: "Für Beschaffungsstellen",
    tabsSupplier: "Für Hersteller & Händler",
    tabsOpportunities: "Ausschreibungen durchsuchen",
    principlesEyebrow: "Grundprinzipien",
    principlesTitle: "Strategischer Einkauf — Grundlegende Prinzipien",
    principlesIntro:
      "Strategischer Einkauf geht über den einfachen Einkauf hinaus, um Gesamtwert, Zuverlässigkeit und Konformität zu maximieren.",
    principles: [
      {
        title: "Ganzheitliche Bewertung",
        text: "Berücksichtigt Gesamtbetriebskosten (TCO), Spezifikationen, Liefertreue, Nachhaltigkeit und Innovation – nicht nur den reinen Preis.",
      },
      {
        title: "Datenbasierte Entscheidungen",
        text: "Nutzt detaillierte Ausgabenanalysen, Lieferantenkompetenzmatrizen und Marktforschung für fundierte Verhandlungen.",
      },
      {
        title: "Kontinuierlicher Prozess",
        text: "Umfasst stetige Leistungsbewertungen, Vertragsüberwachung und vorausschauendes Risikomanagement.",
      },
    ],
    processTitle: "Der 7-stufige strategische Beschaffungsprozess",
    processIntro:
      "Ein strukturierter Leitfaden, der Einkäufern hilft, Waren, Ausrüstung und Dienstleistungen mit verlässlicher Qualität und Einsparungen zu beschaffen.",
    steps: [
      {
        step: "01",
        title: "Bedarfs- und Ausgabenanalyse",
        text: "Analyse der Ausgabenstrukturen, technischen Spezifikationen, Mengen und Lieferfristen.",
      },
      {
        step: "02",
        title: "Lieferantenmarktanalyse",
        text: "Untersuchung des Hersteller- und Händlermarktes auf lokaler, regionaler und globaler Ebene.",
      },
      {
        step: "03",
        title: "Lieferantenvorauswahl (Shortlist)",
        text: "Prüfung von Zertifizierungen, Bonität, Kapazität und Erfolgsbilanz potenzieller Partner.",
      },
      {
        step: "04",
        title: "Lieferantenauswahl (RFP / RFQ)",
        text: "Ausschreibung mit transparenten, gewichteten Bewertungskriterien für fairen Wettbewerb.",
      },
      {
        step: "05",
        title: "Vertragsverhandlung & Abschluss",
        text: "Ausarbeitung ausgewogener Vereinbarungen bezüglich Preisen, Garantien, Lieferbedingungen (Incoterms) und SLAs.",
      },
      {
        step: "06",
        title: "Umsetzung & Lieferantenmanagement",
        text: "Koordination von Logistik, Zollabfertigung, Abnahmeprüfungen und Supplier Relationship Management (SRM).",
      },
      {
        step: "07",
        title: "Kontinuierliche Optimierung",
        text: "Überwachung der Lieferantenleistung anhand von KPIs und fortlaufende Identifikation von Wertschöpfungspotenzialen.",
      },
    ],
    benefitsTitle: "Messbare Vorteile",
    benefits: [
      {
        title: "Kosteneinsparungen",
        text: "Erzielung nachhaltiger Einsparungen und Optimierung der Lebenszykluskosten.",
      },
      {
        title: "Höchste Qualität",
        text: "Strikte Einhaltung technischer Standards und regulatorischer Vorgaben.",
      },
      {
        title: "Lieferkettenresilienz",
        text: "Risikominimierung durch qualifizierte Zweitlieferanten und stabile Vorlaufzeiten.",
      },
      {
        title: "Starke Partnerschaften",
        text: "Aufbau langfristiger, vertrauensvoller Beziehungen zu geprüften Herstellern.",
      },
    ],
    supplierEyebrow: "Hersteller- & Händlerperspektive",
    supplierTitle: "Lieferung nach Ruanda & in die Region: Wichtige Faktoren",
    supplierIntro:
      "Für internationale Hersteller und autorisierte Händler, die öffentliche und private Abnehmer in Ruanda beliefern möchten.",
    considerations: [
      {
        title: "Regulatorische Konformität & Normen",
        text: "Erfüllung der Zertifizierungsanforderungen des Rwanda Standards Board (RSB), der Rwanda FDA und sektorspezifischer Importgenehmigungen.",
      },
      {
        title: "Autorisierte lokale Vertretung",
        text: "Zusammenarbeit mit einem registrierten lokalen Partner, der Ihr Unternehmen rechtssicher vertritt und Termine wahrnimmt.",
      },
      {
        title: "Ausschreibungsvoraussetzungen",
        text: "Verständnis des UMUCYO-E-Procurement-Portals, von Bietungsgarantien, Vertragserfüllungsbürgschaften und Rahmenvereinbarungen.",
      },
      {
        title: "Logistik, Zoll & Lagerhaltung",
        text: "Koordination des Transports nach Kigali, Zolllagerung, EAC/COMESA-Zolltarife und Endauslieferung.",
      },
      {
        title: "Kundendienst, Garantie & Wartung",
        text: "Bereitstellung technischer Unterstützung vor Ort, Ersatzteilverfügbarkeit und Anwenderschulungen zur Sicherung des Markenrufs.",
      },
    ],
    opportunitiesEyebrow: "Ausgewählte Möglichkeiten",
    opportunitiesTitle: "Ausgewählte Beschaffungsmöglichkeiten",
    opportunitiesIntro:
      "Entdecken Sie ausgewählte Ausschreibungen und Beratungsaufträge aus relevanten Quellen.",
    aboutTitle: "Über diese Angebotsseiten",
    aboutText1:
      "Diese Links führen zu einzelnen Ausschreibungen und Beratungsaufträgen. Die Anforderungen und Fristen finden Sie in der jeweiligen Bekanntmachung.",
    aboutText2:
      "Lead Multi-Choice ® ist nicht Eigentümer oder Verwalter dieser Angebote und kann keine Vergabe garantieren oder Beschaffungsentscheidungen treffen. Bestätigen Sie die Anforderungen, den Einreichungsprozess und das Schlussdatum im jeweiligen Originalangebot.",
    coordinationEyebrow: "Koordinationsunterstützung",
    coordinationTitle: "Benötigen Sie Hilfe bei der Wahrnehmung einer Möglichkeit?",
    coordinationText:
      "Lieferanten und institutionelle Käufer können Lead Multi-Choice ® kontaktieren, um geeignete Koordinationsunterstützung zu besprechen, von Lieferantenvorstellungen bis zur Logistik- und Liefernachverfolgung.",
    ctaButton: "Geschäftsmöglichkeit besprechen",
  },
  ar: {
    eyebrow: "المشتريات والتوريد الاستراتيجي",
    heroTitle: "التوريد الاستراتيجي وفرص المشتريات",
    heroIntro:
      "نسد الفجوة بين جهات الشراء والموردين الدوليين الموثوقين من خلال التوريد الاستراتيجي المنظم، مع توجيه المصنعين والموزعين المعتمدين لدخول رواندا وشرق أفريقيا.",
    tabsBuyer: "لجهات الشراء",
    tabsSupplier: "للمصنعين والموزعين",
    tabsOpportunities: "استعراض الفرص",
    principlesEyebrow: "المبادئ الأساسية",
    principlesTitle: "التوريد الاستراتيجي — المبادئ الجوهرية",
    principlesIntro:
      "يتجاوز التوريد الاستراتيجي مجرد الشراء التقليدي لتحقيق القيمة الكلية والموثوقية والامتثال في كل دورة شراء.",
    principles: [
      {
        title: "التقييم الشامل",
        text: "يأخذ في الاعتبار التكلفة الإجمالية للملكية (TCO)، والمواصفات الفنية، والالتزام بمواعيد التسليم، والاستدامة والابتكار—وليس السعر المبدئي فقط.",
      },
      {
        title: "قرارات مبنية على البيانات",
        text: "يعتمد على تحليل الإنفاق المفصل، ومصفوفات كفاءة الموردين، وأبحاث السوق الدقيقة للتفاوض من موقع تجاري قوي ومدروس.",
      },
      {
        title: "عملية تحسين مستمرة",
        text: "تشمل إعادة التقييم الدوري لأداء الموردين، ومراقبة الالتزام بالعقود، والتخفيف الاستباقي لمخاطر سلاسل الإمداد.",
      },
    ],
    processTitle: "عملية التوريد الاستراتيجي النموذجية في 7 خطوات",
    processIntro:
      "خريطة طريق منهجية وشفافة تساعد جهات الشراء على تأمين السلع والمعدات والخدمات بأعلى جودة وتوفير حقيقي في التكاليف.",
    steps: [
      {
        step: "01",
        title: "تحليل الإنفاق وتحديد المتطلبات",
        text: "فحص أنماط الإنفاق، والمواصفات الفنية للمستخدمين، والأحجام المطلوبة، وجداول التسليم الزمنية.",
      },
      {
        step: "02",
        title: "تحديد ودراسة سوق الموردين",
        text: "استقصاء منظومة المصنعين والموزعين محلياً وإقليمياً ودولياً لفهم ديناميكيات السوق والقدرات الإنتاجية.",
      },
      {
        step: "03",
        title: "إعداد القائمة المختصرة للموردين",
        text: "فحص وتأهيل الموردين المرشحين بناءً على الشهادات المعتمدة، والملاءة المالية، وسجل الأعمال السابق.",
      },
      {
        step: "04",
        title: "اختيار الموردين (RFP / RFQ)",
        text: "إصدار وثائق المناقصات أو طلبات عروض الأسعار المنظمة وفقاً لمعايير تقييم شفافة ومتعددة الأبعاد.",
      },
      {
        step: "05",
        title: "التفاوض وإبرام العقود",
        text: "صياغة اتفاقيات تجارية متوازنة تغطي الأسعار، وفترات الضمان، وشروط التسليم (Incoterms)، ومستويات الخدمة.",
      },
      {
        step: "06",
        title: "التنفيذ وإدارة علاقات الموردين",
        text: "تنسيق الخدمات اللوجستية الميدانية، والتخليص الجمركي، وفحوصات القبول، وإدارة علاقات الموردين (SRM).",
      },
      {
        step: "07",
        title: "المراجعة والتحسين المستمر",
        text: "قياس أداء الموردين مقابل مؤشرات الأداء الرئيسية (KPIs)، وحل العقبات، وتحقيق وفورات مستدامة.",
      },
    ],
    benefitsTitle: "الفوائد القابلة للقياس",
    benefits: [
      {
        title: "وفورات حقيقية في التكلفة",
        text: "تحقيق وفورات مباشرة ومستدامة وتحسين تكاليف التشغيل طوال دورة حياة المنتج.",
      },
      {
        title: "جودة فنية متفوقة",
        text: "الالتزام التام بالمواصفات الفنية المعتمدة والمعايير التنظيمية الصارمة.",
      },
      {
        title: "مرونة سلسلة التوريد",
        text: "الحد من مخاطر انقطاع الإمدادات من خلال توفير موردين مؤهلين بدلاء.",
      },
      {
        title: "شراكات طويلة الأمد",
        text: "بناء علاقات استراتيجية وموثوقة مع كبرى الشركات المصنعة المعتمدة حول العالم.",
      },
    ],
    supplierEyebrow: "منظور المصنعين والموزعين",
    supplierTitle: "التوريد إلى رواندا والأسواق الإقليمية: اعتبارات رئيسية",
    supplierIntro:
      "للمصنعين الدوليين والموزعين المعتمدين الراغبين في تأسيس حضور تجاري دائم وتوريد المنتجات لجهات الشراء في رواندا.",
    considerations: [
      {
        title: "الامتثال التنظيمي وشهادات المعايير",
        text: "استخراج الشهادات الإلزامية من هيئة المعايير الرواندية (RSB)، وهيئة الغذاء والدواء (Rwanda FDA)، والتراخيص القطاعية.",
      },
      {
        title: "التمثيل التجاري المحلي المعتمد",
        text: "الشراكة مع ممثل محلي مسجل وموثوق في رواندا لتمثيل علامتك التجارية قانونياً وحضور الاجتماعات الرسمية والمتابعة التجارية.",
      },
      {
        title: "شروط التأهل للمناقصات والمشتريات",
        text: "فهم متطلبات نظام المشتريات الحكومية الإلكتروني (UMUCYO)، وخطابات الضمان البنكية، والاتفاقيات الإطارية.",
      },
      {
        title: "اللوجستيات والتخليص الجمركي والتخزين",
        text: "تنسيق الشحن المتعدد الوسائط إلى كيغالي، والمستودعات الجمركية، والتعريفات الجمركية لـ EAC/COMESA، والتسليم النهائي.",
      },
      {
        title: "خدمات ما بعد البيع والضمان والصيانة",
        text: "توفير الدعم الفني المحلي، وتوافر قطع الغيار، وتدريب المستخدمين لحماية سمعة العلامة التجارية وضمان استمرارية الطلب.",
      },
    ],
    opportunitiesEyebrow: "فرص مختارة",
    opportunitiesTitle: "فرص المشتريات المختارة",
    opportunitiesIntro:
      "تصفح مجموعة مختارة من المناقصات والفرص الاستشارية من مصادر مختلفة。",
    aboutTitle: "حول قوائم الفرص هذه",
    aboutText1:
      "تؤدي هذه الروابط إلى مناقصات وفرص استشارية محددة. راجع كل إعلان لمعرفة المتطلبات والموعد النهائي.",
    aboutText2:
      "لا تملك Lead Multi-Choice ® هذه القوائم ولا تديرها ولا تستطيع ضمان الفوز بأي عقد أو إصدار قرارات المشتريات. تأكد من المتطلبات وعملية التقديم وتاريخ الإغلاق في كل قائمة أصلية.",
    coordinationEyebrow: "دعم التنسيق",
    coordinationTitle: "هل تحتاج إلى مساعدة في اغتنام فرصة؟",
    coordinationText:
      "يمكن للموردين والمشترين المؤسسيين الاتصال بـ Lead Multi-Choice ® لمناقشة دعم التنسيق المناسب، من تعريفات الموردين إلى اللوجستيات ومتابعة التسليم.",
    ctaButton: "ناقش فرصة تجارية",
  },
};

const heroImage = "/site/warehouse.jpg";

export default function Procurement({ resources }: { resources: ProcurementResource[] }) {
  const { language } = useI18n();
  const copy = content[language] ?? content.en;

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.heroTitle}
        intro={copy.heroIntro}
        image={heroImage}
        visualKey="procurement.hero"
        alt="Organised warehouse shelves"
      />

      {/* Quick Nav Anchors */}
      <nav aria-label="Page navigation" className="sticky top-[84px] z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="container-site flex flex-wrap items-center justify-center gap-3 py-3 text-sm md:text-base">
          <a
            href="#purchasing-entities"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-brand-white px-4 py-1.5 font-medium text-foreground transition-colors hover:border-brand-primary hover:text-brand-primary"
          >
            <Users size={14} className="text-brand-primary" />
            <span>{copy.tabsBuyer}</span>
          </a>
          <a
            href="#manufacturers-distributors"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-brand-white px-4 py-1.5 font-medium text-foreground transition-colors hover:border-brand-primary hover:text-brand-primary"
          >
            <Factory size={14} className="text-brand-primary" />
            <span>{copy.tabsSupplier}</span>
          </a>
          <a
            href="#browse-opportunities"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-brand-white px-4 py-1.5 font-medium text-foreground transition-colors hover:border-brand-primary hover:text-brand-primary"
          >
            <Compass size={14} className="text-brand-primary" />
            <span>{copy.tabsOpportunities}</span>
          </a>
        </div>
      </nav>

      {/* Path 1: purchasing entity strategic sourcing */}
      <section id="purchasing-entities" className="scroll-mt-36 container-site py-12 md:py-16">
        <div>
          <SectionHeading
            eyebrow={copy.tabsBuyer}
            title={copy.principlesTitle}
            intro={copy.principlesIntro}
            className="max-w-none"
            titleClassName="md:text-[32px] lg:whitespace-nowrap lg:text-[36px]"
          />
          <div className="mt-7 grid gap-4 border-y border-border py-5 sm:grid-cols-3">
            {copy.principles.map((principle) => (
              <article key={principle.title} className="border-l-2 border-brand-gold pl-3">
                <h3 className="text-base font-semibold text-foreground">{principle.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{principle.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="mt-1 text-xl font-semibold text-foreground md:text-2xl">{copy.processTitle}</h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">{copy.processIntro}</p>
          </div>
          <ol className="grid gap-x-7 gap-y-6 sm:grid-cols-2 xl:grid-cols-4">
            {copy.steps.map((step) => (
              <li key={step.step} className="relative min-w-0 border-l border-brand-primary/25 pl-5">
                <span className="absolute -left-[13px] top-0 flex size-6 items-center justify-center rounded-full border-2 border-background bg-brand-primary text-[10px] font-bold text-brand-white ring-1 ring-brand-primary/25">
                  {step.step}
                </span>
                <h3 className="text-base font-semibold leading-snug text-foreground">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-brand-gold">{copy.benefitsTitle}</h3>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {copy.benefits.map((benefit) => (
              <li key={benefit.title} className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-primary" aria-hidden="true" />
                <div>
                  <p className="text-base font-semibold text-foreground">{benefit.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{benefit.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Section 2: For Manufacturers & Licensed Distributors */}
      <PhotoScrollSection
        id="manufacturers-distributors"
        image="/site/hero-port.jpg"
        visualKey="procurement.portals"
        overlayClassName="bg-brand-white/92"
        className="scroll-mt-36 py-12 md:py-16"
      >
        <div className="container-site">
          <SectionHeading
            eyebrow={copy.supplierEyebrow}
            title={copy.supplierTitle}
            intro={copy.supplierIntro}
          />

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_17rem] lg:items-start">
            <ol className="grid gap-x-8 gap-y-7 sm:grid-cols-2 xl:grid-cols-3">
              {copy.considerations.map((item, idx) => {
                const icons = [Compass, FileCheck2, Handshake, FileText, Truck];
                const Icon = icons[idx] ?? ShieldCheck;
                return (
                  <li key={item.title} className="relative min-w-0 border-l border-brand-primary/30 pl-6">
                    <span className="absolute -left-[16px] top-0 flex size-8 items-center justify-center rounded-full bg-brand-primary text-brand-white ring-4 ring-brand-white/80">
                      <Icon size={15} aria-hidden="true" />
                    </span>
                    <p className="text-[10px] font-bold tracking-[0.16em] text-brand-gold">0{idx + 1}</p>
                    <h3 className="mt-1 text-base font-semibold leading-snug text-foreground">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </li>
                );
              })}
            </ol>

            {/* In-country support CTA */}
            <div className="flex flex-col justify-between rounded-md border border-brand-primary/30 bg-brand-primary p-5 text-brand-white">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-brass-light">
                  {copy.coordinationEyebrow}
                </p>
                <h3 className="mt-2 text-lg font-bold text-brand-white">{copy.coordinationTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-white/85">
                  {copy.coordinationText}
                </p>
              </div>
              <ButtonLink href="/contact" variant="light" className="mt-6" arrow>
                {copy.ctaButton}
              </ButtonLink>
            </div>
          </div>
        </div>
      </PhotoScrollSection>

      {/* Section 3: Selected Opportunities & Portals */}
      <section id="browse-opportunities" className="scroll-mt-36 container-site py-12 md:py-16">
        <SectionHeading
          eyebrow={copy.opportunitiesEyebrow}
          title={copy.opportunitiesTitle}
          intro={copy.opportunitiesIntro}
        />
        <div className="mt-8">
          <ProcurementResourceCarousel resources={resources} />
        </div>

        {/* Disclaimer / Notice */}
        <aside className="mt-8 text-sm text-charcoal">
          <h4 className="font-semibold text-foreground">{copy.aboutTitle}</h4>
          <p className="mt-2 text-muted-foreground leading-relaxed">{copy.aboutText1}</p>
          <p className="mt-2 text-muted-foreground leading-relaxed">{copy.aboutText2}</p>
        </aside>
      </section>
    </>
  );
}
