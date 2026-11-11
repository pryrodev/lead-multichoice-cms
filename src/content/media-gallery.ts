export type MediaStory = {
  image: string;
  alt: Record<string, string>;
  category: Record<string, string>;
  title: Record<string, string>;
  description: Record<string, string>;
};

// Illustrative editorial imagery for the company's work areas, not project claims.
export const mediaStories: MediaStory[] = [
  {
    image: "/site/hero-port.jpg",
    alt: { en: "Cargo containers at a regional port", rw: "Ibikoresho bipakiye ku cyambu cyo mu karere", fr: "Conteneurs de marchandises dans un port régional", sw: "Makontena ya mizigo katika bandari ya kikanda" },
    category: { en: "Market access", rw: "Kwinjira ku isoko", fr: "Accès au marché", sw: "Ufikiaji wa soko" },
    title: { en: "Connecting markets across borders", rw: "Guhuza amasoko yambukiranya imipaka", fr: "Relier les marchés au-delà des frontières", sw: "Kuunganisha masoko kuvuka mipaka" },
    description: { en: "Local insight helps international suppliers understand Rwanda and the wider region.", rw: "Ubumenyi bw'imbere mu gihugu bufasha abatanga ibicuruzwa kumenya u Rwanda n'akarere.", fr: "Une connaissance locale aide les fournisseurs à comprendre le Rwanda et la région.", sw: "Uelewa wa ndani huwasaidia wasambazaji kuelewa Rwanda na eneo jirani." },
  },
  {
    image: "/site/meeting.jpg",
    alt: { en: "Business partners meeting around a table", rw: "Abafatanyabikorwa bari mu nama", fr: "Des partenaires commerciaux réunis", sw: "Washirika wa biashara katika mkutano" },
    category: { en: "Supplier engagement", rw: "Guhuza abatanga ibicuruzwa", fr: "Engagement des fournisseurs", sw: "Ushirikiano na wasambazaji" },
    title: { en: "Building the right introductions", rw: "Guhuza abafatanyabikorwa bakwiye", fr: "Créer les bonnes mises en relation", sw: "Kuanzisha miunganisho sahihi" },
    description: { en: "Structured conversations bring purchasing entities and credible suppliers together.", rw: "Ibiganiro biteguye neza bihuza inzego zigurira n'abatanga ibicuruzwa bizewe.", fr: "Des échanges structurés rapprochent acheteurs et fournisseurs fiables.", sw: "Mazungumzo yaliyopangwa huunganisha wanunuzi na wasambazaji wa kuaminika." },
  },
  {
    image: "/site/warehouse.jpg",
    alt: { en: "Warehouse team reviewing stored goods", rw: "Abakozi basuzuma ibicuruzwa mu bubiko", fr: "Une équipe vérifie des marchandises en entrepôt", sw: "Timu inakagua bidhaa zilizohifadhiwa" },
    category: { en: "Procurement coordination", rw: "Guhuza amasoko", fr: "Coordination des achats", sw: "Uratibu wa ununuzi" },
    title: { en: "Keeping procurement coordinated", rw: "Guhuza ibikorwa byo gutanga amasoko", fr: "Assurer la coordination des achats", sw: "Kuratibu shughuli za ununuzi" },
    description: { en: "Clear follow-up keeps requirements, suppliers and delivery teams aligned.", rw: "Gukurikirana neza bihuriza hamwe ibisabwa, abatanga ibicuruzwa n'abashinzwe kugeza.", fr: "Un suivi clair aligne les besoins, les fournisseurs et les équipes de livraison.", sw: "Ufuatiliaji wazi huoanisha mahitaji, wasambazaji na timu za usafirishaji." },
  },
  {
    image: "/site/healthcare.jpg",
    alt: { en: "Healthcare supplies prepared for distribution", rw: "Ibikoresho by'ubuvuzi biteguye gukwirakwizwa", fr: "Fournitures médicales prêtes à être distribuées", sw: "Vifaa vya afya vilivyoandaliwa kusambazwa" },
    category: { en: "Sector support", rw: "Gushyigikira inzego", fr: "Accompagnement sectoriel", sw: "Msaada wa sekta" },
    title: { en: "Supporting essential supply needs", rw: "Gushyigikira ibikenewe by'ingenzi", fr: "Répondre aux besoins essentiels en fournitures", sw: "Kusaidia mahitaji muhimu ya bidhaa" },
    description: { en: "Supplier search and coordination can support specialized needs, including healthcare.", rw: "Gushaka no guhuza abatanga ibicuruzwa bishobora gufasha ibyiciro byihariye nk'ubuvuzi.", fr: "La recherche et la coordination des fournisseurs répondent aussi aux besoins spécialisés, notamment médicaux.", sw: "Utafutaji na uratibu wa wasambazaji unaweza kusaidia mahitaji maalum, ikiwemo afya." },
  },
  {
    image: "/site/truck.jpg",
    alt: { en: "Truck transporting goods along a regional route", rw: "Ikamyo itwara ibicuruzwa mu karere", fr: "Un camion transporte des marchandises sur un axe régional", sw: "Lori linasafirisha bidhaa katika njia ya kikanda" },
    category: { en: "Logistics", rw: "Ubwikorezi", fr: "Logistique", sw: "Usafirishaji" },
    title: { en: "Coordinating the journey to delivery", rw: "Guhuza urugendo kugeza ku itangwa", fr: "Coordonner le parcours jusqu'à la livraison", sw: "Kuratibu safari hadi bidhaa zifikishwe" },
    description: { en: "In-country follow-up helps keep logistics and handover moving toward acceptance.", rw: "Gukurikirana ibikorwa mu gihugu bifasha ubwikorezi n'itangwa kugera ku kwakirwa.", fr: "Le suivi local aide la logistique et la remise à avancer jusqu'à l'acceptation.", sw: "Ufuatiliaji wa ndani husaidia usafirishaji na makabidhiano hadi bidhaa zikubaliwe." },
  },
];
