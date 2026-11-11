import { languages, type Language } from "@/i18n/messages";

export type InsightArticle = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  body: string;
  image: string;
  imageAlt: string;
};

const insightSource: Record<string, InsightArticle[]> = {
  en: [
    { slug: "market-context", category: "Market access", title: "Start with a clear view of the market", summary: "Understand who buys, what they source and how local introductions can help.", body: "Before approaching a new market, suppliers need context: buyer priorities, relevant procurement channels and the right local contacts. Structured market research and representation can turn broad interest into focused conversations.", image: "/site/hero-port.jpg", imageAlt: "Cargo ship carrying containers through a port" },
    { slug: "supplier-readiness", category: "Supplier readiness", title: "Verification makes introductions more useful", summary: "Clear capabilities, credentials and requirements help both sides prepare for a conversation.", body: "A well-prepared supplier profile records identity, product range, relevant authorizations and the ability to meet a request. Buyers can compare offers using consistent information, while suppliers know what to clarify before the next step.", image: "/site/warehouse.jpg", imageAlt: "Warehouse operations and logistics" },
    { slug: "delivery-coordination", category: "Supply coordination", title: "Keep procurement moving after a decision", summary: "Documents, shipment details and delivery updates still need coordination after supplier selection.", body: "Once a procurement decision is made, several parties may need to coordinate documentation, order confirmations, logistics and delivery follow-up. Clear owners and progress updates help surface delays early and keep the engagement visible.", image: "/site/hero-port.jpg", imageAlt: "Freight moving through an international port" },
  ],
  rw: [
    { slug: "market-context", category: "Kwinjira ku isoko", title: "Tangira usobanukiwe neza isoko", summary: "Menya abagura, ibyo bashaka n'uko kubahuza n'abafatanyabikorwa bo mu Rwanda byafasha.", body: "Mbere yo kwinjira ku isoko rishya, abatanga ibicuruzwa bakeneye amakuru ku byo abaguzi bashyira imbere, inzira z'amasoko n'abo bahamagara mu karere. Ubushakashatsi n'ubuhagararizi buteguye bishobora guhindura inyungu rusange ibiganiro bifite intego.", image: "/site/hero-port.jpg", imageAlt: "Ubwato butwaye kontineri mu cyambu" },
    { slug: "supplier-readiness", category: "Gutegura abatanga ibicuruzwa", title: "Kugenzura amakuru bituma guhuza bigira umumaro", summary: "Kugaragaza ubushobozi, ibyangombwa n'ibisabwa bifasha impande zombi kwitegura ibiganiro.", body: "Umwirondoro wateguwe neza ugaragaza uwatanga ibicuruzwa, ibyo atanga, impushya zibishinzwe n'ubushobozi bwo kuzuza ibisabwa. Abaguzi bagereranya amakuru amwe, naho abatanga ibicuruzwa bakamenya ibyo bagomba gusobanura mbere y'intambwe ikurikira.", image: "/site/warehouse.jpg", imageAlt: "Ibikorwa byo mu bubiko no mu gutwara ibicuruzwa" },
    { slug: "delivery-coordination", category: "Guhuza uruhererekane rw'ibicuruzwa", title: "Komeza guhuza ibikorwa nyuma y'icyemezo", summary: "Inyandiko, amakuru y'imizigo n'uko ishyikirizwa rihagaze biracyasaba guhuza ibikorwa.", body: "Icyemezo cyo kugura kimaze gufatwa, impande zitandukanye zishobora gukenera guhuza inyandiko, kwemeza itegeko, gutwara ibicuruzwa no gukurikirana ishyikirizwa. Kugena ababishinzwe no gusangira amakuru ku iterambere bifasha kumenya hakiri kare ibishobora gutinza ibikorwa.", image: "/site/hero-port.jpg", imageAlt: "Ibicuruzwa bitwarwa mu cyambu mpuzamahanga" },
  ],
  fr: [
    { slug: "market-context", category: "AccÃ¨s au marchÃ©", title: "Commencer par bien comprendre le marchÃ©", summary: "Identifiez les acheteurs, leurs besoins et l'apport de mises en relation locales.", body: "Avant d'aborder un nouveau marchÃ©, les fournisseurs doivent comprendre les prioritÃ©s des acheteurs, les circuits d'approvisionnement pertinents et les bons interlocuteurs locaux. Une Ã©tude de marchÃ© structurÃ©e et une reprÃ©sentation locale peuvent transformer un intÃ©rÃªt gÃ©nÃ©ral en Ã©changes ciblÃ©s.", image: "/site/hero-port.jpg", imageAlt: "Navire de marchandises transportant des conteneurs dans un port" },
    { slug: "supplier-readiness", category: "PrÃ©paration des fournisseurs", title: "La vÃ©rification rend les mises en relation plus utiles", summary: "Des capacitÃ©s, justificatifs et besoins clairs aident chacun Ã  prÃ©parer l'Ã©change.", body: "Un profil fournisseur bien prÃ©parÃ© prÃ©cise l'identitÃ©, la gamme de produits, les autorisations pertinentes et la capacitÃ© Ã  rÃ©pondre Ã  un besoin. Les acheteurs peuvent comparer des informations cohÃ©rentes et les fournisseurs savent quels points prÃ©ciser avant l'Ã©tape suivante.", image: "/site/warehouse.jpg", imageAlt: "ActivitÃ©s d'entrepÃ´t et logistique" },
    { slug: "delivery-coordination", category: "Coordination des approvisionnements", title: "Poursuivre la coordination aprÃ¨s la dÃ©cision", summary: "Les documents, expÃ©ditions et confirmations de livraison restent Ã  coordonner aprÃ¨s le choix du fournisseur.", body: "AprÃ¨s une dÃ©cision d'achat, plusieurs parties peuvent devoir coordonner les documents, la confirmation de commande, la logistique et le suivi de livraison. Des responsabilitÃ©s claires et des nouvelles rÃ©guliÃ¨res aident Ã  repÃ©rer tÃ´t les retards et Ã  suivre l'engagement.", image: "/site/hero-port.jpg", imageAlt: "Fret en cours de transit dans un port international" },
  ],
  sw: [
    { slug: "market-context", category: "Upatikanaji wa soko", title: "Anza kwa kulielewa soko vizuri", summary: "Fahamu wanunuzi, wanachohitaji na jinsi utambulisho wa ndani unavyoweza kusaidia.", body: "Kabla ya kuingia katika soko jipya, wasambazaji wanahitaji kuelewa vipaumbele vya wanunuzi, njia husika za ununuzi na mawasiliano sahihi ya ndani. Utafiti wa soko na uwakilishi uliopangwa unaweza kubadilisha nia ya jumla kuwa mazungumzo yenye mwelekeo.", image: "/site/hero-port.jpg", imageAlt: "Meli ya mizigo yenye makontena bandarini" },
    { slug: "supplier-readiness", category: "Maandalizi ya wasambazaji", title: "Uhakiki hufanya utambulisho uwe na manufaa zaidi", summary: "Uwezo, nyaraka na mahitaji yaliyo wazi huwasaidia wote kujiandaa kwa mazungumzo.", body: "Wasifu mzuri wa msambazaji huonyesha utambulisho, bidhaa, vibali husika na uwezo wa kutimiza ombi. Wanunuzi wanaweza kulinganisha taarifa kwa uwiano, na wasambazaji hutambua mambo ya kufafanua kabla ya hatua inayofuata.", image: "/site/warehouse.jpg", imageAlt: "Shughuli za ghala na usafirishaji" },
    { slug: "delivery-coordination", category: "Uratibu wa ugavi", title: "Endelea kuratibu baada ya uamuzi", summary: "Nyaraka, taarifa za shehena na uthibitisho wa uwasilishaji bado huhitaji uratibu baada ya kuchagua msambazaji.", body: "Baada ya uamuzi wa ununuzi, wahusika kadhaa wanaweza kuhitaji kuratibu nyaraka, uthibitisho wa oda, usafirishaji na ufuatiliaji wa uwasilishaji. Wajibu ulio wazi na taarifa za maendeleo husaidia kuona ucheleweshaji mapema na kufuatilia kazi.", image: "/site/hero-port.jpg", imageAlt: "Mizigo ikisafirishwa kupitia bandari ya kimataifa" },
  ],
};
export const insights = Object.fromEntries(
  languages.map((language) => [language, insightSource[language] ?? insightSource["en"] ?? []]),
) as Record<Language, InsightArticle[]>;

const insightUiSource: Record<string, { eyebrow: string; title: string; intro: string; read: string; all: string }> = {
  en: { eyebrow: "Blog", title: "Practical notes on trade and sourcing", intro: "Ideas to help buyers and international suppliers work together with clarity.", read: "Read article", all: "View all articles" },
  rw: { eyebrow: "Blogu", title: "Inama ngiro ku bucuruzi no gushaka ibicuruzwa", intro: "Ibitekerezo bifasha abaguzi n'abatanga ibicuruzwa mpuzamahanga gukorana bisobanutse.", read: "Soma inkuru", all: "Reba inkuru zose" },
  fr: { eyebrow: "Blog", title: "Rep\u00e8res pratiques sur le commerce et l'approvisionnement", intro: "Des id\u00e9es pour aider acheteurs et fournisseurs internationaux \u00e0 collaborer clairement.", read: "Lire l'article", all: "Voir tous les articles" },
  sw: { eyebrow: "Blogu", title: "Mawazo ya vitendo kuhusu biashara na ununuzi", intro: "Mawazo ya kuwasaidia wanunuzi na wasambazaji wa kimataifa kushirikiana kwa uwazi.", read: "Soma makala", all: "Tazama makala zote" },
};
export const insightUi = Object.fromEntries(
  languages.map((language) => [language, insightUiSource[language] ?? insightUiSource["en"]]),
) as Record<Language, { eyebrow: string; title: string; intro: string; read: string; all: string }>;

const partnerTickerLabelSource: Record<string, string> = {
  en: "Partners",
  rw: "Abafatanyabikorwa",
  fr: "Partenaires",
  sw: "Washirika",
};
export const partnerTickerLabels = Object.fromEntries(
  languages.map((language) => [language, partnerTickerLabelSource[language] ?? partnerTickerLabelSource["en"]]),
) as Record<Language, string>;

