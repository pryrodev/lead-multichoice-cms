import type { Language } from "./messages";

// Business copy is keyed by its English source string so existing content data stays easy to edit.
const rw: Record<string, string> = {
  Connecting: "Guhuza",
  "Global Business": "Ubucuruzi Mpuzamahanga",
  to: "ku",
  "Rwanda.": "u Rwanda.",
  "Explore Our Services": "Reba Serivisi Zacu",
  Headquarters: "Icyicaro",
  "Who We Are": "Turi Bande",
  "Learn More About Us": "Menya Ibindi ku Kigo Cyacu",
  "What We Do": "Ibyo Dukora",
  "All services": "Serivisi zose",
  "Read more": "Soma ibindi",
  "Sectors We Support": "Inzego Dukorera",
  "Procurement Resources": "Amakuru ku Masoko",
  "Stay connected to procurement opportunities.": "Komeza gukurikirana amahirwe y'amasoko.",
  "Why Work With Us": "Impamvu Mwakorana Natwe",
  "Local understanding. Professional coordination. Lasting relationships.":
    "Gusobanukirwa aho dukorera. Guhuza ibikorwa kinyamwuga. Ubufatanye burambye.",
  "Trade Facilitation | Procurement | Logistics": "Korohereza Ubucuruzi | Amasoko | Ubwikorezi",
  "Your local partner for selling to buyers in Rwanda — representation, procurement and delivery, handled.":
    "Umufatanyabikorwa wawe wo mu karere mu kugurisha ku baguzi bo mu Rwanda—guhagararirwa, amasoko no kugeza ibicuruzwa, tubigufashamo.",
  "Serving Rwanda and the wider East African region.":
    "Dukorera mu Rwanda no mu karere kagari ka Afurika y'Iburasirazuba.",
  "Rwanda-Based Expertise": "Ubumenyi bushingiye ku Rwanda",
  "Regional Business Coordination": "Guhuza ubucuruzi mu karere",
  "Procurement & Supply Chain Support": "Amasoko n'uruhererekane rw'ibicuruzwa",
  "Long-Term Business Partnerships": "Ubufatanye burambye mu bucuruzi",
  "Your local partner in Rwanda.": "Umufatanyabikorwa wawe wo mu Rwanda.",
  "Based in Kigali since 2015. We connect international suppliers with Rwandan buyers and manage the engagement from first introduction to after-sales.":
    "Dufite icyicaro i Kigali kuva mu 2015. Duhuza abatanga ibicuruzwa mpuzamahanga n'abaguzi bo mu Rwanda, tugakurikirana ubufatanye kuva ku ntangiriro kugeza kuri serivisi zitangwa nyuma yo kugurisha.",
  "The principles behind every engagement.": "Amahame ayobora buri bufatanye.",
  "Connecting businesses. Coordinating opportunity. Building trust.":
    "Guhuza ibigo. Guhuza amahirwe. Kubaka icyizere.",
  "A Rwanda-based partner for international business.":
    "Umufatanyabikorwa mu bucuruzi mpuzamahanga ufite icyicaro mu Rwanda.",
  "Registered in 2015 in Remera, Kigali. We connect international manufacturers and suppliers with buyers in Rwanda and East Africa, and coordinate everything in between.":
    "Twiyandikishije mu 2015 i Remera, Kigali. Duhuza abakora n'abatanga ibicuruzwa mpuzamahanga n'abaguzi bo mu Rwanda no muri Afurika y'Iburasirazuba, kandi tugahuza ibikorwa byose hagati yabo.",
  "Connect international businesses with opportunity in Rwanda — ethically and reliably.":
    "Guhuza ibigo mpuzamahanga n'amahirwe yo mu Rwanda mu buryo bw'inyangamugayo kandi bwizewe.",
  "Be East Africa's most trusted market-access partner.":
    "Kuba umufatanyabikorwa wizewe kurusha abandi mu gufasha kwinjira ku masoko ya Afurika y'Iburasirazuba.",
  "Five stages from first contact to lasting relationship.":
    "Ibyiciro bitanu kuva ku itumanaho rya mbere kugeza ku bufatanye burambye.",
  "Five services. One local point of coordination.":
    "Serivisi eshanu. Umufatanyabikorwa umwe wo mu karere uhuza ibikorwa.",
  "From first opportunity to after-sales — one partner.":
    "Kuva ku mahirwe ya mbere kugeza kuri serivisi za nyuma—umufatanyabikorwa umwe.",
  "We coordinate, source and represent — across five sectors.":
    "Duhuza ibikorwa, tugashaka ibicuruzwa kandi tugahagararira abafatanyabikorwa mu nzego eshanu.",
  "Find current tenders on Rwanda's official portals.":
    "Shaka amatangazo y'amasoko ariho ku mbuga zemewe zo mu Rwanda.",
  "From first contact to repeat business.":
    "Kuva ku itumanaho rya mbere kugeza ku bucuruzi bukomeza.",
  "Market Access & Trade Facilitation": "Kwinjira ku Isoko no Korohereza Ubucuruzi",
  "Find opportunities, meet the right buyers and enter Rwanda with local representation.":
    "Shaka amahirwe, uhure n'abaguzi bakwiye kandi winjire ku isoko ry'u Rwanda uhagarariwe n'umufatanyabikorwa waho.",
  "Market intelligence and opportunity identification.":
    "Amakuru y'isoko no kumenya amahirwe ahari.",
  "Tender and procurement opportunity monitoring.":
    "Gukurikirana amasoko n'amahirwe yo gutanga ibicuruzwa.",
  "Introductions between international suppliers and local buyers.":
    "Guhuza abatanga ibicuruzwa mpuzamahanga n'abaguzi bo mu karere.",
  "Market-entry guidance and local representation.":
    "Kuyobora abashaka kwinjira ku isoko no kubahagararira mu karere.",
  "Procurement & Supply Chain Coordination": "Guhuza Amasoko n'Uruhererekane rw'Ibicuruzwa",
  "Source suppliers, manage procurement and follow every order through to delivery.":
    "Shaka abatanga ibicuruzwa, huza ibikorwa by'amasoko kandi ukurikirane buri cyatumijwe kugeza gishyikirijwe.",
  "Sourcing advisory.": "Inama ku gushaka ibicuruzwa n'ababitanga.",
  "Supplier identification.": "Kumenya abatanga ibicuruzwa bakwiye.",
  "Procurement coordination.": "Guhuza ibikorwa by'amasoko.",
  "Commercial communication and negotiation support.":
    "Gufasha mu itumanaho ry'ubucuruzi no mu biganiro.",
  "Logistics, Distribution & Trade Compliance Support":
    "Ubwikorezi, Ikwirakwizwa n'Iyubahirizwa ry'Amabwiriza y'Ubucuruzi",
  "Track shipments, coordinate customs and documents, and confirm final delivery.":
    "Kurikirana imizigo, huza ibijyanye na gasutamo n'inyandiko, kandi wemeze ko yagejejwe aho igomba kujya.",
  "Approvals remain with the relevant authorities.":
    "Ibyemezo bitangwa n'inzego zibifitiye ububasha.",
  "Local and regional transportation coordination.": "Guhuza ubwikorezi mu gihugu no mu karere.",
  "Shipment and transit tracking.": "Gukurikirana imizigo n'urugendo rwayo.",
  "Customs-clearance coordination through appropriate channels.":
    "Guhuza iyinjira n'isohoka rya gasutamo binyuze mu nzira zemewe.",
  "Import documentation coordination.": "Guhuza inyandiko zikenewe mu gutumiza ibicuruzwa.",
  "Project Coordination & Implementation Support":
    "Guhuza Imishinga no Gufasha mu Iyishyirwa mu Bikorwa",
  "Plan, monitor and report on projects so milestones are met.":
    "Tegura, kurikirana kandi utange raporo ku mishinga kugira ngo ibyiciro byayo bigerweho.",
  "Project planning and resource coordination.": "Gutegura imishinga no guhuza umutungo ikenera.",
  "Budget, milestone and timeline monitoring.":
    "Gukurikirana ingengo y'imari, ibyiciro n'ingengabihe.",
  "Stakeholder communication.": "Kumenyesha abafatanyabikorwa amakuru.",
  "Delivery and implementation tracking.": "Gukurikirana ishyikirizwa n'ishyirwa mu bikorwa.",
  "After-Sales & Lifecycle Support":
    "Serivisi Nyuma yo Kugurisha no Gufasha mu Buzima bw'Igicuruzwa",
  "Handle warranty, maintenance and post-delivery issues after the sale.":
    "Guhuza ibijyanye na garanti, kubungabunga no gukemura ibibazo nyuma yo kugeza igicuruzwa ku mukiriya.",
  "Warranty coordination.": "Guhuza ibijyanye na garanti.",
  "Maintenance and technical support arrangements.":
    "Gutegura serivisi zo kubungabunga no gufasha mu bya tekiniki.",
  "Customer and manufacturer liaison.": "Guhuza abakiriya n'abakora ibicuruzwa.",
  "Invoice and payment-status follow-up.": "Gukurikirana inyemezabwishyu n'uko ubwishyu buhagaze.",
  "Pharmaceuticals & Healthcare": "Imiti na Serivisi z'Ubuzima",
  "Medical supply chains, sourcing and local requirements.":
    "Uruhererekane rw'ibikoresho by'ubuvuzi, kubishaka no kuzuza ibisabwa mu karere.",
  "Supply-chain coordination": "Guhuza uruhererekane rw'ibicuruzwa",
  "Sourcing advisory": "Inama ku gushaka ibicuruzwa",
  "Supplier engagement": "Guhuza n'abatanga ibicuruzwa",
  "Local requirement coordination": "Guhuza ibisabwa byo mu karere",
  "Energy & Electrical Systems": "Ingufu n'Ibikoresho by'Amashanyarazi",
  "Sourcing and delivery of electrical and energy equipment.":
    "Gushaka no kugeza ibikoresho by'amashanyarazi n'ingufu aho bikenewe.",
  "Equipment sourcing": "Gushaka ibikoresho",
  "Delivery coordination": "Guhuza ishyikirizwa ry'ibicuruzwa",
  "Stakeholder engagement": "Guhuza abafatanyabikorwa",
  "Logistics support": "Gufasha mu bwikorezi",
  "General Supplies & IT Equipment": "Ibikoresho Rusange n'Ibya Ikoranabuhanga",
  "Equipment supply, delivery and after-sales support.":
    "Gutanga ibikoresho, kubigeza aho bikenewe no gutanga serivisi nyuma yo kubigurisha.",
  "Supply arrangements": "Gutunganya itangwa ry'ibicuruzwa",
  "Delivery follow-up": "Gukurikirana ishyikirizwa",
  "After-sales coordination": "Guhuza serivisi zitangwa nyuma yo kugurisha",
  "Logistics & Trade": "Ubwikorezi n'Ubucuruzi",
  "Shipment tracking, customs liaison and final delivery.":
    "Gukurikirana imizigo, kuvugana na gasutamo no kugeza ibicuruzwa aho bigomba kujya.",
  "Shipment tracking": "Gukurikirana imizigo",
  "Logistics provider coordination": "Guhuza abatanga serivisi z'ubwikorezi",
  "Customs-process liaison": "Guhuza ibikorwa bya gasutamo",
  "Final delivery follow-up": "Gukurikirana ishyikirizwa rya nyuma",
  "Projects & Systems Implementation": "Imishinga no Gushyira Sisitemu mu Bikorwa",
  "Implementation monitoring and stakeholder updates.":
    "Gukurikirana ishyirwa mu bikorwa no kugeza amakuru ku bafatanyabikorwa.",
  "Project coordination": "Guhuza imishinga",
  "Implementation monitoring": "Gukurikirana ishyirwa mu bikorwa",
  "Progress updates": "Amakuru ajyanye n'aho ibikorwa bigeze",
  "We do what we say.": "Dukora ibyo twiyemeje.",
  "Ethical, transparent representation.":
    "Kuhagararira abandi mu buryo bw'inyangamugayo kandi buboneye.",
  "Consistent from first contact to after-sales.":
    "Dukorana ubudahwema kuva ku itumanaho rya mbere kugeza kuri serivisi za nyuma.",
  "International standards, clear communication.":
    "Dukurikiza amahame mpuzamahanga kandi tugashyikirana neza.",
  "Clear owners, documented follow-up.": "Inshingano zisobanutse no gukurikirana byanditse.",
  "Relationships built to last.": "Twubaka ubufatanye burambye.",
  "We know Rwanda's market and its buyers.": "Tuzi isoko ry'u Rwanda n'abaguzi barikoreramo.",
  "Ethical representation that protects your reputation.":
    "Kuhagararirwa mu buryo bw'inyangamugayo burinda izina ryawe.",
  "One local contact for everything.": "Umuntu umwe wo mu karere uhuza ibikorwa byose.",
  "We know the local rules and who to talk to.":
    "Tuzi amabwiriza yo mu karere n'inzego dukwiye kuvugana na zo.",
  "Every party aligned and informed.":
    "Abafatanyabikorwa bose bahuzwa kandi bakamenyeshwa amakuru.",
  "We follow through to completion.": "Dukurikirana ibikorwa kugeza birangiye.",
  "Find buyers and opportunities.": "Shaka abaguzi n'amahirwe y'ubucuruzi.",
  "Make introductions and open talks.": "Huza abafatanyabikorwa kandi utangize ibiganiro.",
  "Align documents, logistics and delivery.": "Huza inyandiko, ubwikorezi n'ishyikirizwa.",
  "Track milestones and open issues.": "Kurikirana ibyiciro by'ingenzi n'ibibazo bitarakemuka.",
  "Support after-sales and repeat business.": "Fasha nyuma yo kugurisha no mu bucuruzi bukomeza.",
};

const fr: Record<string, string> = {
  Connecting: "Connecter",
  "Global Business": "les entreprises du monde",
  to: "au",
  "Rwanda.": "Rwanda.",
  "Explore Our Services": "Découvrir nos services",
  Headquarters: "Siège",
  "Who We Are": "Qui sommes-nous ?",
  "Learn More About Us": "En savoir plus sur nous",
  "What We Do": "Nos activités",
  "All services": "Tous les services",
  "Read more": "En savoir plus",
  "Sectors We Support": "Secteurs accompagnés",
  "Procurement Resources": "Ressources sur les achats",
  "Stay connected to procurement opportunities.": "Restez informé des opportunités d’achat.",
  "Why Work With Us": "Pourquoi travailler avec nous",
  "Local understanding. Professional coordination. Lasting relationships.":
    "Connaissance locale. Coordination professionnelle. Relations durables.",
  "Trade Facilitation | Procurement | Logistics": "Facilitation des échanges | Achats | Logistique",
  "Your local partner for selling to buyers in Rwanda — representation, procurement and delivery, handled.":
    "Votre partenaire local pour vendre aux acheteurs rwandais : représentation, achats et livraison coordonnés.",
  "Serving Rwanda and the wider East African region.":
    "Au service du Rwanda et de l’ensemble de l’Afrique de l’Est.",
  "Rwanda-Based Expertise": "Expertise basée au Rwanda",
  "Regional Business Coordination": "Coordination commerciale régionale",
  "Procurement & Supply Chain Support": "Appui aux achats et à la chaîne d’approvisionnement",
  "Long-Term Business Partnerships": "Partenariats commerciaux durables",
  "Your local partner in Rwanda.": "Votre partenaire local au Rwanda.",
  "Based in Kigali since 2015. We connect international suppliers with Rwandan buyers and manage the engagement from first introduction to after-sales.":
    "Établis à Kigali depuis 2015, nous mettons en relation les fournisseurs internationaux et les acheteurs rwandais, puis coordonnons la collaboration du premier contact au service après-vente.",
  "The principles behind every engagement.": "Les principes qui guident chaque collaboration.",
  "Connecting businesses. Coordinating opportunity. Building trust.":
    "Relier les entreprises. Coordonner les opportunités. Bâtir la confiance.",
  "A Rwanda-based partner for international business.":
    "Un partenaire basé au Rwanda pour les entreprises internationales.",
  "Registered in 2015 in Remera, Kigali. We connect international manufacturers and suppliers with buyers in Rwanda and East Africa, and coordinate everything in between.":
    "Créée en 2015 à Remera, Kigali, notre entreprise met en relation les fabricants et fournisseurs internationaux avec les acheteurs du Rwanda et d’Afrique de l’Est, et coordonne les étapes intermédiaires.",
  "Connect international businesses with opportunity in Rwanda — ethically and reliably.":
    "Relier les entreprises internationales aux opportunités au Rwanda, avec éthique et fiabilité.",
  "Be East Africa's most trusted market-access partner.":
    "Devenir le partenaire d’accès au marché le plus fiable d’Afrique de l’Est.",
  "Five stages from first contact to lasting relationship.":
    "Cinq étapes, du premier contact à une relation durable.",
  "Five services. One local point of coordination.":
    "Cinq services. Un interlocuteur local pour la coordination.",
  "From first opportunity to after-sales — one partner.":
    "De la première opportunité au service après-vente : un seul partenaire.",
  "We coordinate, source and represent — across five sectors.":
    "Nous coordonnons, recherchons et représentons nos partenaires dans cinq secteurs.",
  "Find current tenders on Rwanda's official portals.":
    "Consultez les appels d’offres en cours sur les portails officiels rwandais.",
  "From first contact to repeat business.": "Du premier contact aux collaborations renouvelées.",
  "Market Access & Trade Facilitation": "Accès au marché et facilitation des échanges",
  "Find opportunities, meet the right buyers and enter Rwanda with local representation.":
    "Repérez des opportunités, rencontrez les bons acheteurs et développez-vous au Rwanda avec une représentation locale.",
  "Market intelligence and opportunity identification.":
    "Veille de marché et identification des opportunités.",
  "Tender and procurement opportunity monitoring.":
    "Suivi des appels d’offres et des opportunités d’achat.",
  "Introductions between international suppliers and local buyers.":
    "Mise en relation de fournisseurs internationaux avec des acheteurs locaux.",
  "Market-entry guidance and local representation.":
    "Conseil à l’entrée sur le marché et représentation locale.",
  "Procurement & Supply Chain Coordination":
    "Coordination des achats et de la chaîne d’approvisionnement",
  "Source suppliers, manage procurement and follow every order through to delivery.":
    "Identifiez des fournisseurs, coordonnez les achats et suivez chaque commande jusqu’à sa livraison.",
  "Sourcing advisory.": "Conseil en approvisionnement.",
  "Supplier identification.": "Identification de fournisseurs.",
  "Procurement coordination.": "Coordination des achats.",
  "Commercial communication and negotiation support.":
    "Appui aux échanges commerciaux et aux négociations.",
  "Logistics, Distribution & Trade Compliance Support":
    "Appui à la logistique, à la distribution et à la conformité commerciale",
  "Track shipments, coordinate customs and documents, and confirm final delivery.":
    "Suivez les expéditions, coordonnez les formalités douanières et les documents, puis confirmez la livraison finale.",
  "Approvals remain with the relevant authorities.":
    "Les autorisations relèvent des autorités compétentes.",
  "Local and regional transportation coordination.": "Coordination du transport local et régional.",
  "Shipment and transit tracking.": "Suivi des expéditions et du transit.",
  "Customs-clearance coordination through appropriate channels.":
    "Coordination du dédouanement par les voies appropriées.",
  "Import documentation coordination.": "Coordination des documents d’importation.",
  "Project Coordination & Implementation Support":
    "Coordination de projets et appui à la mise en œuvre",
  "Plan, monitor and report on projects so milestones are met.":
    "Planifiez, suivez et documentez les projets afin de respecter les étapes clés.",
  "Project planning and resource coordination.":
    "Planification des projets et coordination des ressources.",
  "Budget, milestone and timeline monitoring.": "Suivi des budgets, des étapes et des calendriers.",
  "Stakeholder communication.": "Communication avec les parties prenantes.",
  "Delivery and implementation tracking.": "Suivi de la livraison et de la mise en œuvre.",
  "After-Sales & Lifecycle Support": "Service après-vente et accompagnement du cycle de vie",
  "Handle warranty, maintenance and post-delivery issues after the sale.":
    "Coordonnez les garanties, la maintenance et les questions après livraison.",
  "Warranty coordination.": "Coordination des garanties.",
  "Maintenance and technical support arrangements.":
    "Organisation de la maintenance et du support technique.",
  "Customer and manufacturer liaison.": "Liaison entre clients et fabricants.",
  "Invoice and payment-status follow-up.": "Suivi des factures et de l’état des paiements.",
  "Pharmaceuticals & Healthcare": "Pharmaceutique et santé",
  "Medical supply chains, sourcing and local requirements.":
    "Chaînes d’approvisionnement médicales, achats et exigences locales.",
  "Supply-chain coordination": "Coordination de la chaîne d’approvisionnement",
  "Sourcing advisory": "Conseil en approvisionnement",
  "Supplier engagement": "Relations fournisseurs",
  "Local requirement coordination": "Coordination des exigences locales",
  "Energy & Electrical Systems": "Énergie et systèmes électriques",
  "Sourcing and delivery of electrical and energy equipment.":
    "Approvisionnement et livraison d’équipements électriques et énergétiques.",
  "Equipment sourcing": "Approvisionnement en équipements",
  "Delivery coordination": "Coordination des livraisons",
  "Stakeholder engagement": "Relations avec les parties prenantes",
  "Logistics support": "Appui logistique",
  "General Supplies & IT Equipment": "Fournitures générales et équipements informatiques",
  "Equipment supply, delivery and after-sales support.":
    "Fourniture et livraison d’équipements, avec un appui après-vente.",
  "Supply arrangements": "Organisation des approvisionnements",
  "Delivery follow-up": "Suivi des livraisons",
  "After-sales coordination": "Coordination du service après-vente",
  "Logistics & Trade": "Logistique et commerce",
  "Shipment tracking, customs liaison and final delivery.":
    "Suivi des expéditions, liaison douanière et livraison finale.",
  "Shipment tracking": "Suivi des expéditions",
  "Logistics provider coordination": "Coordination des prestataires logistiques",
  "Customs-process liaison": "Liaison pour les formalités douanières",
  "Final delivery follow-up": "Suivi de la livraison finale",
  "Projects & Systems Implementation": "Projets et mise en œuvre de systèmes",
  "Implementation monitoring and stakeholder updates.":
    "Suivi de la mise en œuvre et information des parties prenantes.",
  "Project coordination": "Coordination de projets",
  "Implementation monitoring": "Suivi de la mise en œuvre",
  "Progress updates": "Points d’avancement",
  "We do what we say.": "Nous tenons nos engagements.",
  "Ethical, transparent representation.": "Une représentation éthique et transparente.",
  "Consistent from first contact to after-sales.":
    "Un accompagnement constant, du premier contact au service après-vente.",
  "International standards, clear communication.":
    "Des normes internationales et une communication claire.",
  "Clear owners, documented follow-up.": "Des responsabilités claires et un suivi documenté.",
  "Relationships built to last.": "Des relations conçues pour durer.",
  "We know Rwanda's market and its buyers.":
    "Nous connaissons le marché rwandais et ses acheteurs.",
  "Ethical representation that protects your reputation.":
    "Une représentation éthique qui protège votre réputation.",
  "One local contact for everything.": "Un interlocuteur local pour coordonner l’ensemble.",
  "We know the local rules and who to talk to.":
    "Nous connaissons les règles locales et les bons interlocuteurs.",
  "Every party aligned and informed.": "Chaque partie est coordonnée et informée.",
  "We follow through to completion.": "Nous assurons le suivi jusqu’à l’aboutissement.",
  "Find buyers and opportunities.": "Identifier des acheteurs et des opportunités.",
  "Make introductions and open talks.": "Mettre les parties en relation et ouvrir le dialogue.",
  "Align documents, logistics and delivery.":
    "Coordonner les documents, la logistique et la livraison.",
  "Track milestones and open issues.": "Suivre les étapes clés et les points en suspens.",
  "Support after-sales and repeat business.":
    "Accompagner l’après-vente et les collaborations futures.",
};

const sw: Record<string, string> = {
  Connecting: "Kuunganisha",
  "Global Business": "Biashara za Kimataifa",
  to: "na",
  "Rwanda.": "Rwanda.",
  "Explore Our Services": "Angalia Huduma Zetu",
  Headquarters: "Makao Makuu",
  "Who We Are": "Sisi ni Nani",
  "Learn More About Us": "Jifunze Zaidi Kutuhusu",
  "What We Do": "Tunachofanya",
  "All services": "Huduma zote",
  "Read more": "Soma zaidi",
  "Sectors We Support": "Sekta Tunazosaidia",
  "Procurement Resources": "Rasilimali za Ununuzi",
  "Stay connected to procurement opportunities.": "Endelea kufuatilia fursa za ununuzi.",
  "Why Work With Us": "Kwa Nini Ushirikiane Nasi",
  "Local understanding. Professional coordination. Lasting relationships.":
    "Uelewa wa ndani. Uratibu wa kitaalamu. Mahusiano ya kudumu.",
  "Trade Facilitation | Procurement | Logistics": "Uwezeshaji wa Biashara | Ununuzi | Usafirishaji",
  "Your local partner for selling to buyers in Rwanda — representation, procurement and delivery, handled.":
    "Mshirika wako wa ndani wa kufanya biashara na wanunuzi nchini Rwanda—uwakilishi, ununuzi na uwasilishaji vinaratibiwa.",
  "Serving Rwanda and the wider East African region.":
    "Tunahudumia Rwanda na eneo pana la Afrika Mashariki.",
  "Rwanda-Based Expertise": "Utaalamu wa Rwanda",
  "Regional Business Coordination": "Uratibu wa Biashara Kikanda",
  "Procurement & Supply Chain Support": "Msaada wa Ununuzi na Mnyororo wa Ugavi",
  "Long-Term Business Partnerships": "Ushirikiano wa Biashara wa Muda Mrefu",
  "Your local partner in Rwanda.": "Mshirika wako wa ndani nchini Rwanda.",
  "Based in Kigali since 2015. We connect international suppliers with Rwandan buyers and manage the engagement from first introduction to after-sales.":
    "Tangu 2015, tukiwa Kigali, tunaunganisha wasambazaji wa kimataifa na wanunuzi wa Rwanda na kuratibu ushirikiano kuanzia utambulisho wa kwanza hadi huduma baada ya mauzo.",
  "The principles behind every engagement.": "Kanuni zinazoongoza kila ushirikiano.",
  "Connecting businesses. Coordinating opportunity. Building trust.":
    "Kuunganisha biashara. Kuratibu fursa. Kujenga uaminifu.",
  "A Rwanda-based partner for international business.":
    "Mshirika wa biashara za kimataifa aliye nchini Rwanda.",
  "Registered in 2015 in Remera, Kigali. We connect international manufacturers and suppliers with buyers in Rwanda and East Africa, and coordinate everything in between.":
    "Tulisajiliwa mwaka 2015 Remera, Kigali. Tunaunganisha watengenezaji na wasambazaji wa kimataifa na wanunuzi nchini Rwanda na Afrika Mashariki, na kuratibu hatua zote zinazohusika.",
  "Connect international businesses with opportunity in Rwanda — ethically and reliably.":
    "Kuunganisha biashara za kimataifa na fursa nchini Rwanda kwa uadilifu na uaminifu.",
  "Be East Africa's most trusted market-access partner.":
    "Kuwa mshirika anayeaminika zaidi wa upatikanaji wa soko Afrika Mashariki.",
  "Five stages from first contact to lasting relationship.":
    "Hatua tano kutoka mawasiliano ya kwanza hadi uhusiano wa kudumu.",
  "Five services. One local point of coordination.":
    "Huduma tano. Mshirika mmoja wa ndani wa kuratibu.",
  "From first opportunity to after-sales — one partner.":
    "Kuanzia fursa ya kwanza hadi huduma baada ya mauzo—mshirika mmoja.",
  "We coordinate, source and represent — across five sectors.":
    "Tunaratibu, tunatafuta bidhaa na tunawakilisha washirika katika sekta tano.",
  "Find current tenders on Rwanda's official portals.":
    "Pata zabuni za sasa kwenye tovuti rasmi za Rwanda.",
  "From first contact to repeat business.":
    "Kuanzia mawasiliano ya kwanza hadi biashara zinazoendelea.",
  "Market Access & Trade Facilitation": "Upatikanaji wa Soko na Uwezeshaji wa Biashara",
  "Find opportunities, meet the right buyers and enter Rwanda with local representation.":
    "Tambua fursa, kutana na wanunuzi wanaofaa na ingia katika soko la Rwanda kwa uwakilishi wa ndani.",
  "Market intelligence and opportunity identification.": "Uchambuzi wa soko na utambuzi wa fursa.",
  "Tender and procurement opportunity monitoring.": "Ufuatiliaji wa zabuni na fursa za ununuzi.",
  "Introductions between international suppliers and local buyers.":
    "Kuunganisha wasambazaji wa kimataifa na wanunuzi wa ndani.",
  "Market-entry guidance and local representation.":
    "Mwongozo wa kuingia sokoni na uwakilishi wa ndani.",
  "Procurement & Supply Chain Coordination": "Uratibu wa Ununuzi na Mnyororo wa Ugavi",
  "Source suppliers, manage procurement and follow every order through to delivery.":
    "Tafuta wasambazaji, ratibu ununuzi na fuatilia kila oda hadi ifikishwe.",
  "Sourcing advisory.": "Ushauri wa kutafuta bidhaa na wasambazaji.",
  "Supplier identification.": "Utambuzi wa wasambazaji.",
  "Procurement coordination.": "Uratibu wa ununuzi.",
  "Commercial communication and negotiation support.":
    "Msaada wa mawasiliano ya kibiashara na mazungumzo.",
  "Logistics, Distribution & Trade Compliance Support":
    "Msaada wa Usafirishaji, Usambazaji na Uzingatiaji wa Biashara",
  "Track shipments, coordinate customs and documents, and confirm final delivery.":
    "Fuatilia mizigo, ratibu taratibu za forodha na nyaraka, kisha thibitisha uwasilishaji wa mwisho.",
  "Approvals remain with the relevant authorities.": "Idhini hutolewa na mamlaka husika.",
  "Local and regional transportation coordination.": "Uratibu wa usafirishaji wa ndani na kikanda.",
  "Shipment and transit tracking.": "Ufuatiliaji wa mizigo na safari yake.",
  "Customs-clearance coordination through appropriate channels.":
    "Uratibu wa uondoaji wa mizigo forodhani kupitia njia zinazofaa.",
  "Import documentation coordination.": "Uratibu wa nyaraka za uagizaji.",
  "Project Coordination & Implementation Support": "Uratibu wa Miradi na Msaada wa Utekelezaji",
  "Plan, monitor and report on projects so milestones are met.":
    "Panga, fuatilia na toa taarifa za miradi ili hatua muhimu zikamilike kwa wakati.",
  "Project planning and resource coordination.": "Upangaji wa miradi na uratibu wa rasilimali.",
  "Budget, milestone and timeline monitoring.": "Ufuatiliaji wa bajeti, hatua muhimu na ratiba.",
  "Stakeholder communication.": "Mawasiliano na wadau.",
  "Delivery and implementation tracking.": "Ufuatiliaji wa uwasilishaji na utekelezaji.",
  "After-Sales & Lifecycle Support": "Huduma baada ya Mauzo na Usaidizi wa Mzunguko wa Bidhaa",
  "Handle warranty, maintenance and post-delivery issues after the sale.":
    "Ratibu dhamana, matengenezo na masuala yanayojitokeza baada ya bidhaa kuwasilishwa.",
  "Warranty coordination.": "Uratibu wa dhamana.",
  "Maintenance and technical support arrangements.":
    "Mipango ya matengenezo na msaada wa kiufundi.",
  "Customer and manufacturer liaison.": "Uhusiano kati ya wateja na watengenezaji.",
  "Invoice and payment-status follow-up.": "Ufuatiliaji wa ankara na hali ya malipo.",
  "Pharmaceuticals & Healthcare": "Dawa na Huduma za Afya",
  "Medical supply chains, sourcing and local requirements.":
    "Minyororo ya ugavi wa vifaa vya afya, utafutaji na mahitaji ya ndani.",
  "Supply-chain coordination": "Uratibu wa mnyororo wa ugavi",
  "Sourcing advisory": "Ushauri wa utafutaji wa bidhaa",
  "Supplier engagement": "Ushirikiano na wasambazaji",
  "Local requirement coordination": "Uratibu wa mahitaji ya ndani",
  "Energy & Electrical Systems": "Nishati na Mifumo ya Umeme",
  "Sourcing and delivery of electrical and energy equipment.":
    "Utafutaji na uwasilishaji wa vifaa vya umeme na nishati.",
  "Equipment sourcing": "Utafutaji wa vifaa",
  "Delivery coordination": "Uratibu wa uwasilishaji",
  "Stakeholder engagement": "Ushirikiano na wadau",
  "Logistics support": "Msaada wa usafirishaji",
  "General Supplies & IT Equipment": "Vifaa vya Jumla na Teknolojia ya Habari",
  "Equipment supply, delivery and after-sales support.":
    "Ugavi na uwasilishaji wa vifaa pamoja na huduma baada ya mauzo.",
  "Supply arrangements": "Mipango ya ugavi",
  "Delivery follow-up": "Ufuatiliaji wa uwasilishaji",
  "After-sales coordination": "Uratibu wa huduma baada ya mauzo",
  "Logistics & Trade": "Usafirishaji na Biashara",
  "Shipment tracking, customs liaison and final delivery.":
    "Ufuatiliaji wa mizigo, mawasiliano ya forodha na uwasilishaji wa mwisho.",
  "Shipment tracking": "Ufuatiliaji wa mizigo",
  "Logistics provider coordination": "Uratibu wa watoa huduma za usafirishaji",
  "Customs-process liaison": "Mawasiliano kuhusu taratibu za forodha",
  "Final delivery follow-up": "Ufuatiliaji wa uwasilishaji wa mwisho",
  "Projects & Systems Implementation": "Miradi na Utekelezaji wa Mifumo",
  "Implementation monitoring and stakeholder updates.":
    "Ufuatiliaji wa utekelezaji na taarifa kwa wadau.",
  "Project coordination": "Uratibu wa miradi",
  "Implementation monitoring": "Ufuatiliaji wa utekelezaji",
  "Progress updates": "Taarifa za maendeleo",
  "We do what we say.": "Tunatimiza tunachoahidi.",
  "Ethical, transparent representation.": "Uwakilishi wa kimaadili na wazi.",
  "Consistent from first contact to after-sales.":
    "Huduma thabiti kuanzia mawasiliano ya kwanza hadi baada ya mauzo.",
  "International standards, clear communication.":
    "Viwango vya kimataifa na mawasiliano yaliyo wazi.",
  "Clear owners, documented follow-up.": "Majukumu yaliyo wazi na ufuatiliaji ulioandikwa.",
  "Relationships built to last.": "Mahusiano yanayojengwa kudumu.",
  "We know Rwanda's market and its buyers.": "Tunaifahamu soko la Rwanda na wanunuzi wake.",
  "Ethical representation that protects your reputation.":
    "Uwakilishi wa kimaadili unaolinda sifa yako.",
  "One local contact for everything.": "Mawasiliano mmoja wa ndani kwa uratibu wa kila kitu.",
  "We know the local rules and who to talk to.":
    "Tunajua sheria za ndani na watu sahihi wa kuwasiliana nao.",
  "Every party aligned and informed.": "Kila mhusika anarifiwa na kuratibiwa.",
  "We follow through to completion.": "Tunafuatilia hadi kazi ikamilike.",
  "Find buyers and opportunities.": "Tafuta wanunuzi na fursa.",
  "Make introductions and open talks.": "Unganisha wahusika na anzisha mazungumzo.",
  "Align documents, logistics and delivery.": "Ratibu nyaraka, usafirishaji na uwasilishaji.",
  "Track milestones and open issues.": "Fuatilia hatua muhimu na masuala ambayo hayajatatuliwa.",
  "Support after-sales and repeat business.":
    "Saidia huduma baada ya mauzo na biashara zinazoendelea.",
};

Object.assign(rw, {
  "Lead Multichoice": "Lead Multichoice",
  "is a private limited company registered in 2015 with the Rwanda Development Board (RDB). Our headquarters are in Remera, Kigali, Rwanda.": "ni ikigo cyigenga gifite uburyozwe bugarukira ku migabane cyanditswe mu 2015 mu Rwego rw'Igihugu rw'Iterambere (RDB). Icyicaro cyacu kiri i Remera, Kigali, mu Rwanda.",
  to: "mu",
  "Rwanda.": "Rwanda.",
  "Trusted local representation. Accountable coordination.":
    "Guhagararirwa n'umufatanyabikorwa wo mu karere. Guhuza ibikorwa mu buryo buboneye.",
  "Coordinating the transaction, not duplicating it.":
    "Guhuza ibikorwa by'ubucuruzi aho kubisubiramo.",
  "You keep your contracts. We connect the parties and keep things moving.":
    "Amasezerano muyagumana. Twebwe duhuza abafatanyabikorwa kandi tugakomeza ibikorwa.",
  "Experience that connects business, trade and digital transformation.":
    "Uburambe buhuza ubucuruzi, amasoko n'impinduka mu ikoranabuhanga.",
  "Stay connected to procurement opportunities.": "Komeza gukurikirana amahirwe y'amasoko.",
  "Find current tenders and requirements on official portals.":
    "Shaka amasoko n'ibisabwa biriho ku mbuga zemewe.",
  "The role of external procurement portals": "Uruhare rw'imbuga zo hanze zigaragaza amasoko",
  "Official portals publish procurement notices, tender documents, deadlines and participation requirements. They are owned and operated by their respective institutions, and all submissions, evaluations and award decisions are handled through them.":
    "Imbuga zemewe zitangaza amasoko, inyandiko zayo, igihe ntarengwa n'ibisabwa kugira ngo uyitabire. Zicungwa n'inzego zazo, kandi inyandiko zitangwa, isuzuma n'ibyemezo by'abatsindiye amasoko bikorwa binyuze kuri izo nzego.",
  "LEAD MULTICHOICE is not affiliated with or the owner of either portal, and this website is not connected to them. We cannot guarantee tender awards, approve bids or issue procurement decisions. Always rely on the official source for current information.":
    "LEAD MULTICHOICE ntifitanye isano n'izo mbuga kandi ntizifite; n'uru rubuga ntiruzigenzura. Ntidushobora kwemeza uzatsinda isoko, kwemeza inyandiko z'ipiganwa cyangwa gufata ibyemezo by'amasoko. Buri gihe reba amakuru agezweho ku rubuga rwemewe.",
  "Coordination support": "Gufasha guhuza ibikorwa",
  "Need help acting on an opportunity?": "Ukeneye ubufasha bwo gukurikirana amahirwe?",
  "Suppliers and institutional buyers can contact LEAD MULTICHOICE to discuss appropriate coordination support, from supplier introductions to logistics and delivery follow-up.":
    "Abatanga ibicuruzwa n'inzego z'abaguzi bashobora kuvugana na LEAD MULTICHOICE bakaganira ku bufasha bukwiye bwo guhuza ibikorwa, kuva ku guhuza abatanga ibicuruzwa kugeza ku bwikorezi no gukurikirana ishyikirizwa.",
});
Object.assign(fr, {
  "Lead Multichoice": "Lead Multichoice",
  "is a private limited company registered in 2015 with the Rwanda Development Board (RDB). Our headquarters are in Remera, Kigali, Rwanda.": "est une société privée à responsabilité limitée, enregistrée en 2015 auprès du Rwanda Development Board (RDB). Son siège se trouve à Remera, Kigali, au Rwanda.",
  "Trusted local representation. Accountable coordination.":
    "Une représentation locale fiable. Une coordination responsable.",
  "Coordinating the transaction, not duplicating it.":
    "Coordonner la transaction sans la reproduire.",
  "You keep your contracts. We connect the parties and keep things moving.":
    "Vous conservez vos contrats. Nous mettons les parties en relation et faisons avancer les démarches.",
  "Experience that connects business, trade and digital transformation.":
    "Une expérience qui relie les affaires, le commerce et la transformation numérique.",
  "Stay connected to procurement opportunities.": "Restez informé des opportunités d’achat.",
  "Find current tenders and requirements on official portals.":
    "Consultez les appels d’offres et exigences en vigueur sur les portails officiels.",
  "The role of external procurement portals": "Rôle des portails d’achat externes",
  "Official portals publish procurement notices, tender documents, deadlines and participation requirements. They are owned and operated by their respective institutions, and all submissions, evaluations and award decisions are handled through them.":
    "Les portails officiels publient les avis d’achat, les dossiers d’appel d’offres, les échéances et les conditions de participation. Ils sont gérés par leurs institutions respectives, qui traitent les soumissions, évaluations et décisions d’attribution.",
  "LEAD MULTICHOICE is not affiliated with or the owner of either portal, and this website is not connected to them. We cannot guarantee tender awards, approve bids or issue procurement decisions. Always rely on the official source for current information.":
    "LEAD MULTICHOICE n’est affiliée à aucun de ces portails et ne les possède pas. Ce site n’y est pas non plus rattaché. Nous ne pouvons garantir l’attribution d’un marché, approuver une offre ni prendre de décision d’achat. Consultez toujours la source officielle pour obtenir les informations à jour.",
  "Coordination support": "Appui à la coordination",
  "Need help acting on an opportunity?": "Besoin d’aide pour donner suite à une opportunité ?",
  "Suppliers and institutional buyers can contact LEAD MULTICHOICE to discuss appropriate coordination support, from supplier introductions to logistics and delivery follow-up.":
    "Les fournisseurs et acheteurs institutionnels peuvent contacter LEAD MULTICHOICE pour discuter d’un appui adapté, de la mise en relation avec des fournisseurs au suivi logistique et à la livraison.",
});
Object.assign(sw, {
  "Lead Multichoice": "Lead Multichoice",
  "is a private limited company registered in 2015 with the Rwanda Development Board (RDB). Our headquarters are in Remera, Kigali, Rwanda.": "ni kampuni binafsi yenye dhima ndogo iliyosajiliwa mwaka 2015 katika Bodi ya Maendeleo ya Rwanda (RDB). Makao yake makuu yako Remera, Kigali, Rwanda.",
  "Trusted local representation. Accountable coordination.":
    "Uwakilishi wa ndani unaotegemewa. Uratibu wenye uwajibikaji.",
  "Coordinating the transaction, not duplicating it.": "Kuratibu shughuli bila kuzirudia.",
  "You keep your contracts. We connect the parties and keep things moving.":
    "Unabaki na mikataba yako. Tunaunganisha wahusika na kuendeleza shughuli.",
  "Experience that connects business, trade and digital transformation.":
    "Uzoefu unaounganisha biashara, masoko na mageuzi ya kidijitali.",
  "Stay connected to procurement opportunities.": "Endelea kufuatilia fursa za ununuzi.",
  "Find current tenders and requirements on official portals.":
    "Pata zabuni na masharti ya sasa kwenye tovuti rasmi.",
  "The role of external procurement portals": "Jukumu la tovuti za ununuzi za nje",
  "Official portals publish procurement notices, tender documents, deadlines and participation requirements. They are owned and operated by their respective institutions, and all submissions, evaluations and award decisions are handled through them.":
    "Tovuti rasmi huchapisha matangazo ya ununuzi, nyaraka za zabuni, tarehe za mwisho na masharti ya kushiriki. Taasisi husika huzimiliki na kuziendesha, na hushughulikia uwasilishaji, tathmini na maamuzi ya tuzo kupitia tovuti hizo.",
  "LEAD MULTICHOICE is not affiliated with or the owner of either portal, and this website is not connected to them. We cannot guarantee tender awards, approve bids or issue procurement decisions. Always rely on the official source for current information.":
    "LEAD MULTICHOICE haihusiani na wala haimiliki tovuti hizo, na tovuti hii haijaunganishwa nazo. Hatuwezi kuhakikisha ushindi wa zabuni, kuidhinisha zabuni au kutoa maamuzi ya ununuzi. Tumia chanzo rasmi kupata taarifa za sasa.",
  "Coordination support": "Msaada wa uratibu",
  "Need help acting on an opportunity?": "Unahitaji msaada wa kufuatilia fursa?",
  "Suppliers and institutional buyers can contact LEAD MULTICHOICE to discuss appropriate coordination support, from supplier introductions to logistics and delivery follow-up.":
    "Wasambazaji na wanunuzi wa taasisi wanaweza kuwasiliana na LEAD MULTICHOICE kujadili msaada unaofaa wa uratibu, kuanzia kuwaunganisha na wasambazaji hadi kufuatilia usafirishaji na uwasilishaji.",
});

Object.assign(rw, {
  "Let's move your business into Rwanda.": "Tugufashe guteza imbere ubucuruzi bwawe mu Rwanda.",
  "Manufacturer, Distributor — Let's connect for business in Rwanda and beyond.":
    "Abakora ibicuruzwa, ababikwirakwiza — duhurire ku bucuruzi mu Rwanda no hanze yarwo.",
  "Week 1": "Icyumweru cya 1",
  "Week 2–4": "Ibyumweru 2–4",
  Order: "Igihe cyo gutumiza",
  Delivery: "Igihe cyo kugeza",
  Ongoing: "Bikomeje",
  "Market scan": "Gusesengura isoko",
  "Buyer meetings": "Guhura n'abaguzi",
  "Docs · Customs · Freight": "Inyandiko · Gasutamo · Ubwikorezi",
  "Milestone reports": "Raporo z'ibyiciro",
  "After-sales · Reorders": "Serivisi za nyuma · Kongera gutumiza",
  "Trusted local representation. Accountable coordination.":
    "Guhagararirwa n'umufatanyabikorwa wo mu karere. Guhuza ibikorwa mu buryo buboneye.",
  "Experience that connects business, trade and digital transformation.":
    "Uburambe buhuza ubucuruzi, amasoko n'impinduka mu ikoranabuhanga.",
  "18+ years in trade facilitation, procurement, supply chain, logistics and digital transformation.":
    "Afite uburambe bw'imyaka irenga 18 mu korohereza ubucuruzi, amasoko, uruhererekane rw'ibicuruzwa, ubwikorezi n'ikoranabuhanga.",
  "Former roles at Bralirwa PLC and Ericsson (Rwanda, Uganda, Kenya), and supply chain lead for the Shisha Kibondo programme with Rwanda's Ministry of Health and RBC.":
    "Yakoze muri Bralirwa PLC na Ericsson mu Rwanda, Uganda na Kenya, anaba umuyobozi w'uruhererekane rw'ibicuruzwa muri gahunda ya Shisha Kibondo ku bufatanye na Minisiteri y'Ubuzima y'u Rwanda na RBC.",
  "Now Enterprise Digitalisation Manager at Cenfri. MSc Procurement & Supply Chain Management, MCILT and CIPS member.":
    "Ubu ni Umuyobozi ushinzwe Ikoranabuhanga mu Bigo muri Cenfri. Afite impamyabumenyi y'icyiciro cya kabiri cya kaminuza mu Masoko n'Uruhererekane rw'Ibicuruzwa, ni MCILT kandi ari muri CIPS.",
});
Object.assign(fr, {
  "Let's move your business into Rwanda.": "Développons votre activité au Rwanda.",
  "Manufacturer, Distributor — Let's connect for business in Rwanda and beyond.":
    "Fabricants, distributeurs — échangeons pour développer les affaires au Rwanda et au-delà.",
  "Week 1": "Semaine 1",
  "Week 2–4": "Semaines 2 à 4",
  Order: "Commande",
  Delivery: "Livraison",
  Ongoing: "En continu",
  "Market scan": "Analyse du marché",
  "Buyer meetings": "Rencontres avec les acheteurs",
  "Docs · Customs · Freight": "Documents · Douanes · Fret",
  "Milestone reports": "Rapports d’étape",
  "After-sales · Reorders": "Après-vente · Réapprovisionnements",
  "Trusted local representation. Accountable coordination.":
    "Une représentation locale fiable. Une coordination responsable.",
  "Experience that connects business, trade and digital transformation.":
    "Une expérience qui relie les affaires, le commerce et la transformation numérique.",
  "18+ years in trade facilitation, procurement, supply chain, logistics and digital transformation.":
    "Plus de 18 ans d’expérience en facilitation des échanges, achats, chaîne d’approvisionnement, logistique et transformation numérique.",
  "Former roles at Bralirwa PLC and Ericsson (Rwanda, Uganda, Kenya), and supply chain lead for the Shisha Kibondo programme with Rwanda's Ministry of Health and RBC.":
    "Il a travaillé chez Bralirwa PLC et Ericsson au Rwanda, en Ouganda et au Kenya, puis dirigé la chaîne d’approvisionnement du programme Shisha Kibondo avec le ministère rwandais de la Santé et le RBC.",
  "Now Enterprise Digitalisation Manager at Cenfri. MSc Procurement & Supply Chain Management, MCILT and CIPS member.":
    "Il est aujourd’hui responsable de la numérisation des entreprises chez Cenfri. Il est titulaire d’un master en achats et chaîne d’approvisionnement, membre MCILT et membre du CIPS.",
});
Object.assign(sw, {
  "Let's move your business into Rwanda.": "Tusaidie kukuza biashara yako nchini Rwanda.",
  "Manufacturer, Distributor — Let's connect for business in Rwanda and beyond.":
    "Watengenezaji, wasambazaji — tuungane kwa biashara nchini Rwanda na kwingineko.",
  "Week 1": "Wiki ya 1",
  "Week 2–4": "Wiki ya 2–4",
  Order: "Agizo",
  Delivery: "Uwasilishaji",
  Ongoing: "Inaendelea",
  "Market scan": "Uchambuzi wa soko",
  "Buyer meetings": "Mikutano na wanunuzi",
  "Docs · Customs · Freight": "Nyaraka · Forodha · Usafirishaji",
  "Milestone reports": "Ripoti za hatua muhimu",
  "After-sales · Reorders": "Huduma baada ya mauzo · Oda mpya",
  "Trusted local representation. Accountable coordination.":
    "Uwakilishi wa ndani unaotegemewa. Uratibu wenye uwajibikaji.",
  "Experience that connects business, trade and digital transformation.":
    "Uzoefu unaounganisha biashara, masoko na mageuzi ya kidijitali.",
  "18+ years in trade facilitation, procurement, supply chain, logistics and digital transformation.":
    "Zaidi ya miaka 18 ya uzoefu katika uwezeshaji wa biashara, ununuzi, mnyororo wa ugavi, usafirishaji na mageuzi ya kidijitali.",
  "Former roles at Bralirwa PLC and Ericsson (Rwanda, Uganda, Kenya), and supply chain lead for the Shisha Kibondo programme with Rwanda's Ministry of Health and RBC.":
    "Aliwahi kufanya kazi Bralirwa PLC na Ericsson nchini Rwanda, Uganda na Kenya, na kuongoza mnyororo wa ugavi wa mpango wa Shisha Kibondo pamoja na Wizara ya Afya ya Rwanda na RBC.",
  "Now Enterprise Digitalisation Manager at Cenfri. MSc Procurement & Supply Chain Management, MCILT and CIPS member.":
    "Kwa sasa ni Meneja wa Uwekaji wa Kidijitali wa Biashara Cenfri. Ana shahada ya uzamili ya ununuzi na mnyororo wa ugavi, ni MCILT na mwanachama wa CIPS.",
});

Object.assign(rw, {
  "Rwanda-based trade facilitation, business representation, procurement coordination and supply chain support, connecting international business to Rwanda and the wider East African region.":
    "Gufasha korohereza ubucuruzi, guhagararira ibigo, guhuza amasoko n'uruhererekane rw'ibicuruzwa, bihuza ubucuruzi mpuzamahanga n'u Rwanda ndetse n'akarere kagari ka Afurika y'Iburasirazuba.",
  "Medical and healthcare supply tenders.": "Amasoko ajyanye n'ibikoresho by'ubuvuzi n'ubuzima.",
  "Rwanda's official government tenders portal.": "Urubuga rwemewe rwa Leta y'u Rwanda rw'amasoko.",
  "Visit RMS Tenders": "Reba Amasoko ya RMS",
  "Visit UMUCYO Portal": "Sura Urubuga rwa UMUCYO",
  "Trade facilitation": "Korohereza ubucuruzi",
  Procurement: "Amasoko",
  "Supply chain management": "Imicungire y'uruhererekane rw'ibicuruzwa",
  "Logistics & customs": "Ubwikorezi na gasutamo",
  "Strategic sourcing": "Gushaka ibicuruzwa mu buryo bufite ingamba",
  "Regional trade": "Ubucuruzi mu karere",
  "Stakeholder engagement": "Guhuza abafatanyabikorwa",
  "Digital transformation": "Impinduka mu ikoranabuhanga",
  "MSc Procurement & Supply Chain Management":
    "Impamyabumenyi y'icyiciro cya kabiri: Amasoko n'Uruhererekane rw'Ibicuruzwa",
  "CIPS member": "Umunyamuryango wa CIPS",
  MCILT: "MCILT",
});
Object.assign(fr, {
  "Rwanda-based trade facilitation, business representation, procurement coordination and supply chain support, connecting international business to Rwanda and the wider East African region.":
    "Facilitation des échanges, représentation commerciale, coordination des achats et de la chaîne d’approvisionnement pour relier les entreprises internationales au Rwanda et à l’ensemble de l’Afrique de l’Est.",
  "Medical and healthcare supply tenders.":
    "Appels d’offres pour les fournitures médicales et de santé.",
  "Rwanda's official government tenders portal.":
    "Portail officiel des marchés publics du gouvernement rwandais.",
  "Visit RMS Tenders": "Voir les appels d’offres RMS",
  "Visit UMUCYO Portal": "Visiter le portail UMUCYO",
  "Trade facilitation": "Facilitation des échanges",
  Procurement: "Achats",
  "Supply chain management": "Gestion de la chaîne d’approvisionnement",
  "Logistics & customs": "Logistique et douanes",
  "Strategic sourcing": "Approvisionnement stratégique",
  "Regional trade": "Commerce régional",
  "Stakeholder engagement": "Relations avec les parties prenantes",
  "Digital transformation": "Transformation numérique",
  "MSc Procurement & Supply Chain Management": "Master en achats et chaîne d’approvisionnement",
  "CIPS member": "Membre du CIPS",
  MCILT: "MCILT",
});
Object.assign(sw, {
  "Rwanda-based trade facilitation, business representation, procurement coordination and supply chain support, connecting international business to Rwanda and the wider East African region.":
    "Uwezeshaji wa biashara, uwakilishi wa kampuni, uratibu wa ununuzi na mnyororo wa ugavi unaounganisha biashara za kimataifa na Rwanda pamoja na Afrika Mashariki.",
  "Medical and healthcare supply tenders.": "Zabuni za vifaa vya matibabu na huduma za afya.",
  "Rwanda's official government tenders portal.": "Tovuti rasmi ya zabuni za serikali ya Rwanda.",
  "Visit RMS Tenders": "Angalia Zabuni za RMS",
  "Visit UMUCYO Portal": "Tembelea Tovuti ya UMUCYO",
  "Trade facilitation": "Uwezeshaji wa biashara",
  Procurement: "Ununuzi",
  "Supply chain management": "Usimamizi wa mnyororo wa ugavi",
  "Logistics & customs": "Usafirishaji na forodha",
  "Strategic sourcing": "Utafutaji wa kimkakati",
  "Regional trade": "Biashara ya kikanda",
  "Stakeholder engagement": "Ushirikiano na wadau",
  "Digital transformation": "Mageuzi ya kidijitali",
  "MSc Procurement & Supply Chain Management": "Shahada ya uzamili ya Ununuzi na Mnyororo wa Ugavi",
  "CIPS member": "Mwanachama wa CIPS",
  MCILT: "MCILT",
});

Object.assign(rw, {
  "Client portal": "Urubuga rw'Abakiriya",
  "Your partnership with us, in one place.": "Ubufatanye bwanyu natwe, ahantu hamwe.",
  "Keep your company details up to date and stay in touch with our team in Kigali.":
    "Komeza amakuru y'ikigo cyawe ari mashya kandi uvugane n'ikipe yacu i Kigali.",
  "Create your account": "Fungura konti yawe",
  "Reset your password": "Hindura ijambo ry'ibanga",
  "Welcome back": "Urakaza neza",
  "Full name": "Amazina yose",
  Company: "Ikigo",
  Phone: "Telefoni",
  Email: "Imeyili",
  Password: "Ijambo ry'ibanga",
  "Please wait…": "Tegereza…",
  "Create account": "Fungura konti",
  "Send reset link": "Ohereza umurongo wo guhindura ijambo ry'ibanga",
  "Sign in": "Injira",
  or: "cyangwa",
  "Continue with Google": "Komeza ukoresheje Google",
  "Forgot password?": "Wibagiwe ijambo ry'ibanga?",
  "New here?": "Ni ubwa mbere hano?",
  "Create an account": "Fungura konti",
  "Already have an account?": "Usanzwe ufite konti?",
  "← Back to website": "← Subira ku rubuga",
  "Check your email to confirm your account, then sign in.":
    "Reba imeyili yawe wemeze konti, hanyuma winjire.",
  "If that email has an account, a reset link is on its way.":
    "Niba iyo imeyili ifite konti, umurongo wo guhindura ijambo ry'ibanga urimo koherezwa.",
  "Google sign-in failed. Please try again.":
    "Kwinjira ukoresheje Google ntibyagenze. Ongera ugerageze.",
  "Enter your full name": "Andika amazina yawe yose",
  "Enter a valid email": "Andika imeyili yemewe",
  "Use at least 8 characters": "Koresha inyuguti nibura 8",
  "Set a new password": "Shyiraho ijambo ry'ibanga rishya",
  "New password": "Ijambo ry'ibanga rishya",
  "Save password": "Bika ijambo ry'ibanga",
  "Client dashboard": "Urubuga rw'Umukiriya",
  Hello: "Muraho",
  "Admin area": "Igice cy'Ubuyobozi",
  "Sign out": "Sohoka",
  "Your details": "Amakuru yawe",
  "Save details": "Bika amakuru",
  "Next steps": "Intambwe zikurikira",
  "Discuss a new opportunity →": "Ganira natwe ku mahirwe mashya →",
  "Browse tender portals →": "Reba imbuga z'amasoko →",
  "See our services →": "Reba serivisi zacu →",
  "Could not save. Please try again.": "Ntibyabashije kubikwa. Ongera ugerageze.",
  "Saved.": "Byabitswe.",
  "Team access only": "Abakozi b'ikigo gusa",
  "This area is for the LEAD MULTICHOICE team.": "Iki gice kigenewe ikipe ya LEAD MULTICHOICE.",
  "Go to your dashboard →": "Jya ku rubuga rwawe →",
  Admin: "Ubuyobozi",
  "Registered clients": "Abakiriya biyandikishije",
  account: "konti",
  accounts: "konti",
  Name: "Izina",
  Joined: "Yiyandikishije",
  "No clients yet.": "Nta mukiriya uraboneka.",
  "Loading…": "Birimo gutegurwa…",
});
Object.assign(fr, {
  "Client portal": "Espace client",
  "Your partnership with us, in one place.": "Votre partenariat avec nous, au même endroit.",
  "Keep your company details up to date and stay in touch with our team in Kigali.":
    "Tenez à jour les informations de votre entreprise et restez en contact avec notre équipe à Kigali.",
  "Create your account": "Créer votre compte",
  "Reset your password": "Réinitialiser votre mot de passe",
  "Welcome back": "Bon retour",
  "Full name": "Nom complet",
  Company: "Entreprise",
  Phone: "Téléphone",
  Email: "E-mail",
  Password: "Mot de passe",
  "Please wait…": "Veuillez patienter…",
  "Create account": "Créer un compte",
  "Send reset link": "Envoyer le lien de réinitialisation",
  "Sign in": "Se connecter",
  or: "ou",
  "Continue with Google": "Continuer avec Google",
  "Forgot password?": "Mot de passe oublié ?",
  "New here?": "Nouveau ici ?",
  "Create an account": "Créer un compte",
  "Already have an account?": "Vous avez déjà un compte ?",
  "← Back to website": "← Retour au site",
  "Check your email to confirm your account, then sign in.":
    "Consultez votre e-mail pour confirmer votre compte, puis connectez-vous.",
  "If that email has an account, a reset link is on its way.":
    "Si un compte est associé à cette adresse, un lien de réinitialisation vous sera envoyé.",
  "Google sign-in failed. Please try again.":
    "La connexion avec Google a échoué. Veuillez réessayer.",
  "Enter your full name": "Saisissez votre nom complet",
  "Enter a valid email": "Saisissez une adresse e-mail valide",
  "Use at least 8 characters": "Utilisez au moins 8 caractères",
  "Set a new password": "Définir un nouveau mot de passe",
  "New password": "Nouveau mot de passe",
  "Save password": "Enregistrer le mot de passe",
  "Client dashboard": "Espace client",
  Hello: "Bonjour",
  "Admin area": "Espace administration",
  "Sign out": "Se déconnecter",
  "Your details": "Vos informations",
  "Save details": "Enregistrer les informations",
  "Next steps": "Prochaines étapes",
  "Discuss a new opportunity →": "Parler d’une nouvelle opportunité →",
  "Browse tender portals →": "Consulter les portails d’appels d’offres →",
  "See our services →": "Voir nos services →",
  "Could not save. Please try again.": "Enregistrement impossible. Veuillez réessayer.",
  "Saved.": "Enregistré.",
  "Team access only": "Réservé à l’équipe",
  "This area is for the LEAD MULTICHOICE team.":
    "Cet espace est réservé à l’équipe de LEAD MULTICHOICE.",
  "Go to your dashboard →": "Accéder à votre espace →",
  Admin: "Administration",
  "Registered clients": "Clients inscrits",
  account: "compte",
  accounts: "comptes",
  Name: "Nom",
  Joined: "Inscription",
  "No clients yet.": "Aucun client pour le moment.",
  "Loading…": "Chargement…",
});
Object.assign(sw, {
  "Client portal": "Tovuti ya Mteja",
  "Your partnership with us, in one place.": "Ushirikiano wako nasi, sehemu moja.",
  "Keep your company details up to date and stay in touch with our team in Kigali.":
    "Sasisha taarifa za kampuni yako na uwasiliane na timu yetu Kigali.",
  "Create your account": "Fungua akaunti yako",
  "Reset your password": "Weka upya nenosiri lako",
  "Welcome back": "Karibu tena",
  "Full name": "Majina kamili",
  Company: "Kampuni",
  Phone: "Simu",
  Email: "Barua pepe",
  Password: "Nenosiri",
  "Please wait…": "Tafadhali subiri…",
  "Create account": "Fungua akaunti",
  "Send reset link": "Tuma kiungo cha kuweka upya",
  "Sign in": "Ingia",
  or: "au",
  "Continue with Google": "Endelea kupitia Google",
  "Forgot password?": "Umesahau nenosiri?",
  "New here?": "Mgeni hapa?",
  "Create an account": "Fungua akaunti",
  "Already have an account?": "Tayari una akaunti?",
  "← Back to website": "← Rudi kwenye tovuti",
  "Check your email to confirm your account, then sign in.":
    "Angalia barua pepe yako ili kuthibitisha akaunti, kisha uingie.",
  "If that email has an account, a reset link is on its way.":
    "Ikiwa barua pepe hiyo ina akaunti, kiungo cha kuweka upya nenosiri kinatumwa.",
  "Google sign-in failed. Please try again.":
    "Kuingia kwa Google kumeshindikana. Tafadhali jaribu tena.",
  "Enter your full name": "Weka majina yako kamili",
  "Enter a valid email": "Weka barua pepe sahihi",
  "Use at least 8 characters": "Tumia angalau herufi 8",
  "Set a new password": "Weka nenosiri jipya",
  "New password": "Nenosiri jipya",
  "Save password": "Hifadhi nenosiri",
  "Client dashboard": "Dashibodi ya Mteja",
  Hello: "Habari",
  "Admin area": "Sehemu ya Usimamizi",
  "Sign out": "Toka",
  "Your details": "Taarifa zako",
  "Save details": "Hifadhi taarifa",
  "Next steps": "Hatua zinazofuata",
  "Discuss a new opportunity →": "Jadili fursa mpya →",
  "Browse tender portals →": "Angalia tovuti za zabuni →",
  "See our services →": "Tazama huduma zetu →",
  "Could not save. Please try again.": "Haikuweza kuhifadhiwa. Tafadhali jaribu tena.",
  "Saved.": "Imehifadhiwa.",
  "Team access only": "Timu pekee ndiyo inayoruhusiwa",
  "This area is for the LEAD MULTICHOICE team.": "Sehemu hii ni ya timu ya LEAD MULTICHOICE.",
  "Go to your dashboard →": "Nenda kwenye dashibodi yako →",
  Admin: "Usimamizi",
  "Registered clients": "Wateja waliosajiliwa",
  account: "akaunti",
  accounts: "akaunti",
  Name: "Jina",
  Joined: "Alijiunga",
  "No clients yet.": "Bado hakuna wateja.",
  "Loading…": "Inapakia…",
});

Object.assign(rw, {
  "Market Access | Supplier Engagement | Trade Facilitation":
    "Kwinjira ku Isoko | Guhuza Abatanga Ibicuruzwa | Korohereza Ubucuruzi",
  "Connecting Rwanda's buyers with trusted global suppliers.":
    "Guhuza abaguzi bo mu Rwanda n'abatanga ibicuruzwa mpuzamahanga bizewe.",
  "We bridge Rwanda's purchasing market and the global supply ecosystem, helping buyers and international suppliers find each other and coordinate with confidence.":
    "Duhuza isoko ry'abaguzi bo mu Rwanda n'abatanga ibicuruzwa ku rwego mpuzamahanga, tugafasha impande zombi kumenyana no guhuza ibikorwa zifite icyizere.",
  "I am an international supplier": "Ndi utanga ibicuruzwa mpuzamahanga",
  "I represent a purchasing entity": "Mpagarariye ikigo kigura ibicuruzwa",
  "Local knowledge. Global connections.": "Ubumenyi bwo mu karere. Ubufatanye mpuzamahanga.",
  "Supporting commercial engagement in Rwanda and the region.":
    "Dufasha mu bufatanye bw'ubucuruzi mu Rwanda no mu karere.",
  "The opportunity": "Amahirwe ahari",
  "Official procurement portal": "Urubuga rwemewe rw'amasoko",
  "Bridging the information and access gap.": "Kuzuza icyuho cy'amakuru no kubona amasoko.",
  "For international suppliers": "Ku batanga ibicuruzwa mpuzamahanga",
  "Understand Rwanda's procurement environment, identify relevant opportunities and reach purchasing entities through local representation.":
    "Sobanukirwa n'uburyo amasoko akorwa mu Rwanda, umenye amahirwe ahari kandi ugere ku bigo bigura ibicuruzwa ubinyujije ku bahagarariye ibikorwa mu karere.",
  "For Rwanda's purchasing entities": "Ku bigo byo mu Rwanda bigura ibicuruzwa",
  "Expand access to credible manufacturers, authorised distributors and specialised service providers around the world.":
    "Bona uburyo bwagutse bwo kugera ku bakora ibicuruzwa bizewe, ababikwirakwiza babifitiye uburenganzira n'abatanga serivisi zihariye ku isi.",
  "Our role": "Uruhare rwacu",
  "From supplier identification to coordinated delivery.":
    "Kuva ku kumenya abatanga ibicuruzwa kugeza ku ishyikirizwa rihujwe neza.",
  "We structure the connection, facilitate engagement and keep the work moving across the parties involved.":
    "Dutunganya uko impande zihuzwa, tukorohereza imikoranire kandi tugakurikirana ibikorwa by'ababigizemo uruhare.",
  Identify: "Kumenya",
  Verify: "Gusuzuma",
  Connect: "Guhuza",
  Coordinate: "Guhuza ibikorwa",
  "Find relevant buyers, suppliers and sourcing opportunities.":
    "Shaka abaguzi, abatanga ibicuruzwa n'amahirwe yo gushaka ibikenewe.",
  "Support due diligence and confirm the right points of contact.":
    "Fasha mu igenzura no kwemeza abantu bakwiye kuvugana.",
  "Facilitate direct conversations between the parties.":
    "Korohereza ibiganiro bitaziguye hagati y'impande.",
  "Help align procurement, logistics and delivery follow-up.":
    "Fasha guhuza amasoko, ubwikorezi no gukurikirana ishyikirizwa.",
  "What we do": "Ibyo dukora",
  "Local coordination across the supply journey.":
    "Guhuza ibikorwa mu rugendo rw'itangwa ry'ibicuruzwa.",
  "Explore all services": "Reba serivisi zose",
  "The value we work toward": "Ibyiza tugamije",
  "More efficient sourcing. Stronger supply partnerships.":
    "Gushaka ibicuruzwa neza kurushaho. Ubufatanye bukomeye mu itangwa ry'ibicuruzwa.",
  "More informed sourcing decisions":
    "Ibyemezo byo gushaka ibicuruzwa bishingiye ku makuru ahagije",
  "Access to credible supplier options": "Kubona abatanga ibicuruzwa bizewe",
  "Reliable supply coordination": "Guhuza itangwa ry'ibicuruzwa mu buryo bwizewe",
  "Long-term commercial partnerships": "Ubufatanye burambye mu bucuruzi",
  "Start a conversation": "Tangira ikiganiro",
});

Object.assign(fr, {
  "Market Access | Supplier Engagement | Trade Facilitation":
    "Accès au marché | Relations fournisseurs | Facilitation des échanges",
  "Connecting Rwanda's buyers with trusted global suppliers.":
    "Relier les acheteurs rwandais à des fournisseurs internationaux fiables.",
  "We bridge Rwanda's purchasing market and the global supply ecosystem, helping buyers and international suppliers find each other and coordinate with confidence.":
    "Nous faisons le lien entre le marché des achats rwandais et l'offre mondiale, afin que les acheteurs et fournisseurs internationaux se trouvent et coordonnent leurs échanges en confiance.",
  "I am an international supplier": "Je suis un fournisseur international",
  "I represent a purchasing entity": "Je représente un organisme acheteur",
  "Local knowledge. Global connections.": "Expertise locale. Connexions internationales.",
  "Supporting commercial engagement in Rwanda and the region.":
    "Nous accompagnons les relations commerciales au Rwanda et dans la région.",
  "The opportunity": "L'opportunité",
  "Official procurement portal": "Portail officiel des marchés publics",
  "Bridging the information and access gap.":
    "Combler le manque d'information et d'accès au marché.",
  "For international suppliers": "Pour les fournisseurs internationaux",
  "Understand Rwanda's procurement environment, identify relevant opportunities and reach purchasing entities through local representation.":
    "Comprendre les achats au Rwanda, repérer les possibilités pertinentes et accéder aux acheteurs grâce à une représentation locale.",
  "For Rwanda's purchasing entities": "Pour les organismes acheteurs rwandais",
  "Expand access to credible manufacturers, authorised distributors and specialised service providers around the world.":
    "Élargir l'accès aux fabricants fiables, aux distributeurs agréés et aux prestataires spécialisés dans le monde entier.",
  "Our role": "Notre rôle",
  "From supplier identification to coordinated delivery.":
    "De l'identification des fournisseurs à la coordination de la livraison.",
  "We structure the connection, facilitate engagement and keep the work moving across the parties involved.":
    "Nous organisons la mise en relation, facilitons les échanges et coordonnons l'avancement entre les parties concernées.",
  Identify: "Identifier",
  Verify: "Vérifier",
  Connect: "Relier",
  Coordinate: "Coordonner",
  "Find relevant buyers, suppliers and sourcing opportunities.":
    "Repérer les acheteurs, fournisseurs et possibilités d'approvisionnement pertinents.",
  "Support due diligence and confirm the right points of contact.":
    "Appuyer les vérifications et confirmer les bons interlocuteurs.",
  "Facilitate direct conversations between the parties.":
    "Faciliter les échanges directs entre les parties.",
  "Help align procurement, logistics and delivery follow-up.":
    "Coordonner les achats, la logistique et le suivi des livraisons.",
  "What we do": "Nos activités",
  "Local coordination across the supply journey.":
    "Une coordination locale à chaque étape de l'approvisionnement.",
  "Explore all services": "Découvrir tous les services",
  "The value we work toward": "Les résultats visés",
  "More efficient sourcing. Stronger supply partnerships.":
    "Des achats plus efficaces. Des partenariats d'approvisionnement plus solides.",
  "More informed sourcing decisions": "Des décisions d'approvisionnement mieux éclairées",
  "Access to credible supplier options": "L'accès à des fournisseurs fiables",
  "Reliable supply coordination": "Une coordination fiable des approvisionnements",
  "Long-term commercial partnerships": "Des partenariats commerciaux durables",
  "Start a conversation": "Engageons la conversation",
});

Object.assign(sw, {
  "Market Access | Supplier Engagement | Trade Facilitation":
    "Upatikanaji wa Soko | Ushirikiano na Wasambazaji | Uwezeshaji wa Biashara",
  "Connecting Rwanda's buyers with trusted global suppliers.":
    "Kuunganisha wanunuzi wa Rwanda na wasambazaji wa kimataifa wanaoaminika.",
  "We bridge Rwanda's purchasing market and the global supply ecosystem, helping buyers and international suppliers find each other and coordinate with confidence.":
    "Tunaunganisha soko la ununuzi la Rwanda na mtandao wa ugavi wa kimataifa, tukiwasaidia wanunuzi na wasambazaji kupata kila mmoja na kuratibu shughuli kwa uhakika.",
  "I am an international supplier": "Mimi ni msambazaji wa kimataifa",
  "I represent a purchasing entity": "Ninawakilisha taasisi ya ununuzi",
  "Local knowledge. Global connections.": "Uelewa wa ndani. Miunganisho ya kimataifa.",
  "Supporting commercial engagement in Rwanda and the region.":
    "Tunaunga mkono ushirikiano wa kibiashara nchini Rwanda na katika ukanda huu.",
  "The opportunity": "Fursa iliyopo",
  "Official procurement portal": "Tovuti rasmi ya zabuni",
  "Bridging the information and access gap.": "Kuziba pengo la taarifa na upatikanaji wa soko.",
  "For international suppliers": "Kwa wasambazaji wa kimataifa",
  "Understand Rwanda's procurement environment, identify relevant opportunities and reach purchasing entities through local representation.":
    "Elewa mazingira ya ununuzi nchini Rwanda, tambua fursa husika na ufikie taasisi za ununuzi kupitia uwakilishi wa ndani.",
  "For Rwanda's purchasing entities": "Kwa taasisi za ununuzi za Rwanda",
  "Expand access to credible manufacturers, authorised distributors and specialised service providers around the world.":
    "Panua upatikanaji wa wazalishaji wanaoaminika, wasambazaji walioidhinishwa na watoa huduma maalumu duniani.",
  "Our role": "Jukumu letu",
  "From supplier identification to coordinated delivery.":
    "Kuanzia kutambua wasambazaji hadi kuratibu uwasilishaji.",
  "We structure the connection, facilitate engagement and keep the work moving across the parties involved.":
    "Tunapanga muunganisho, tunawezesha mawasiliano na kuratibu maendeleo ya kazi kati ya wahusika.",
  Identify: "Tambua",
  Verify: "Thibitisha",
  Connect: "Unganisha",
  Coordinate: "Ratibu",
  "Find relevant buyers, suppliers and sourcing opportunities.":
    "Tafuta wanunuzi, wasambazaji na fursa zinazofaa za ununuzi.",
  "Support due diligence and confirm the right points of contact.":
    "Saidia ukaguzi wa kina na uthibitishe watu sahihi wa mawasiliano.",
  "Facilitate direct conversations between the parties.":
    "Wezesha mazungumzo ya moja kwa moja kati ya wahusika.",
  "Help align procurement, logistics and delivery follow-up.":
    "Saidia kuratibu ununuzi, usafirishaji na ufuatiliaji wa uwasilishaji.",
  "What we do": "Tunachofanya",
  "Local coordination across the supply journey.": "Uratibu wa ndani katika safari nzima ya ugavi.",
  "Explore all services": "Angalia huduma zote",
  "The value we work toward": "Thamani tunayolenga",
  "More efficient sourcing. Stronger supply partnerships.":
    "Ununuzi wenye ufanisi zaidi. Ushirikiano imara wa ugavi.",
  "More informed sourcing decisions": "Maamuzi ya ununuzi yenye taarifa zaidi",
  "Access to credible supplier options": "Upatikanaji wa wasambazaji wanaoaminika",
  "Reliable supply coordination": "Uratibu wa ugavi unaotegemewa",
  "Long-term commercial partnerships": "Ushirikiano wa kibiashara wa muda mrefu",
  "Start a conversation": "Anza mazungumzo",
});

Object.assign(rw, {
  "Follow your requests, engagement progress and the latest updates from our team.":
    "Kurikirana ubusabe bwawe, aho ubufatanye bugeze n'amakuru mashya atangwa n'ikipe yacu.",
  "Viewing dashboard as": "Urimo kureba iyi dashibodi nka",
  "Purchasing entity": "Ikigo kigura ibicuruzwa",
  "International supplier": "Utanga ibicuruzwa mpuzamahanga",
  "Submit a sourcing request": "Ohereza ubusabe bwo gushaka ibicuruzwa",
  "Discuss a supplier opportunity": "Ganira ku mahirwe yo gutanga ibicuruzwa",
  "Open requests": "Ubusabe bugikurikiranwa",
  "Needs your response": "Haracyategerejwe igisubizo cyawe",
  "Active engagements": "Ubufatanye burimo gukorwa",
  Completed: "Byarangiye",
  "Relevant opportunities": "Amahirwe akureba",
  Introductions: "Imenyekanisha ry'abafatanyabikorwa",
  "Current engagement": "Ubufatanye buri gukurikiranwa",
  "Irrigation pump request": "Ubusabe bw'amapompe yo kuhira imyaka",
  "20 water pumps for a district irrigation project":
    "Amapompe y'amazi 20 yo kuhira imyaka mu karere",
  "Supplier identification": "Kumenya abatanga ibicuruzwa",
  "Today, 09:15": "Uyu munsi, 09:15",
  "Today, 10:30": "Uyu munsi, 10:30",
  Today: "Uyu munsi",
  Yesterday: "Ejo",
  "Current stage": "Icyiciro kiriho",
  "Last updated": "Amakuru aheruka kuvugururwa",
  "Engagement progress": "Aho ubufatanye bugeze",
  "Request received": "Ubusabe bwakiriwe",
  "After-sales support": "Ubufasha nyuma yo kugurisha",
  "Daily activity": "Ibikorwa bya buri munsi",
  "Request updates": "Amakuru mashya ku busabe",
  "Supplier asked to confirm pump capacity":
    "Umutanga ibicuruzwa yasabwe kwemeza ubushobozi bw'ipompe",
  "We are checking technical fit against your requirement.":
    "Turimo kugenzura niba ibisabwa bya tekiniki bihuye n'ibyo ukeneye.",
  "Yesterday, 14:40": "Ejo, 14:40",
  "Yesterday, 15:10": "Ejo, 15:10",
  "Product specifications matched with two suppliers":
    "Ibisabwa ku bicuruzwa byahujwe n'ababitanga babiri",
  "Supplier credentials are being reviewed before an introduction.":
    "Inyandiko z'umutanga ibicuruzwa zirimo kugenzurwa mbere yo kubahuza.",
  "Delivery location and target date confirmed":
    "Aho ibicuruzwa bizashyikirizwa n'itariki biteganyijwe byemejwe",
  "The request is ready for supplier identification.":
    "Ubusabe bwiteguye ko hashakwa abatanga ibicuruzwa.",
  "29 Oct": "29 Ukwakira",
  "30 Oct": "30 Ukwakira",
  "The LEAD MULTICHOICE team started the initial requirements review.":
    "Ikipe ya LEAD MULTICHOICE yatangiye gusuzuma ibisabwa.",
  "Updated by LEAD MULTICHOICE team": "Byavuguruwe n'ikipe ya LEAD MULTICHOICE",
  "Ask about this update": "Baza ibijyanye n'aya makuru",
  "Your next step": "Intambwe ikurikira",
  "Confirm the required pump capacity": "Emeza ubushobozi bw'ipompe bukenewe",
  "Your response will help us confirm supplier fit.":
    "Igisubizo cyawe kizadufasha kwemeza ko umutanga ibicuruzwa akwiye.",
  "Water pump supply opportunity": "Amahirwe yo gutanga amapompe y'amazi",
  "District irrigation project · Rwanda": "Umushinga wo kuhira imyaka mu karere · u Rwanda",
  "Supplier review": "Isuzuma ry'umutanga ibicuruzwa",
  "Authorization letter requested": "Hasabwe ibaruwa y'uburenganzira",
  "Please share the current document so the review can continue.":
    "Sangiza inyandiko igezweho kugira ngo isuzuma rikomeze.",
  "Your product range matched a buyer requirement":
    "Ibicuruzwa byawe bihuye n'ibyo umuguzi akeneye",
  "The buyer is sourcing pumps for an irrigation project in Rwanda.":
    "Umuguzi arashaka amapompe yo kuhira imyaka mu mushinga wo mu Rwanda.",
  "Company profile reviewed": "Umwirondoro w'ikigo wasuzumwe",
  "The team is checking product and authorization information.":
    "Ikipe irimo kugenzura amakuru y'ibicuruzwa n'uburenganzira bwo kubitanga.",
  "Supplier enquiry received": "Ubusabe bw'umutanga ibicuruzwa bwakiriwe",
  "Your request to explore the Rwandan market is under review.":
    "Ubusabe bwawe bwo kwinjira ku isoko ry'u Rwanda burimo gusuzumwa.",
  "Share your current manufacturer authorization letter":
    "Sangiza ibaruwa igezweho iguha uburenganzira bwo guhagararira uruganda",
  "This helps us complete the supplier verification review.":
    "Ibi bizadufasha kurangiza igenzura ry'umutanga ibicuruzwa.",
  "Contact your coordinator": "Vugana n'uguhuza ibikorwa byawe",
  "Your account details": "Amakuru ya konti yawe",
});

Object.assign(fr, {
  "Follow your requests, engagement progress and the latest updates from our team.":
    "Suivez vos demandes, l'avancement de vos échanges et les dernières informations de notre équipe.",
  "Viewing dashboard as": "Tableau de bord affiché pour",
  "Purchasing entity": "Organisme acheteur",
  "International supplier": "Fournisseur international",
  "Submit a sourcing request": "Soumettre une demande d'approvisionnement",
  "Discuss a supplier opportunity": "Parler d'une opportunité fournisseur",
  "Open requests": "Demandes en cours",
  "Needs your response": "Votre réponse est attendue",
  "Active engagements": "Échanges actifs",
  Completed: "Terminés",
  "Relevant opportunities": "Opportunités pertinentes",
  Introductions: "Mises en relation",
  "Current engagement": "Échange en cours",
  "Irrigation pump request": "Demande de pompes d'irrigation",
  "20 water pumps for a district irrigation project":
    "20 pompes à eau pour un projet d'irrigation de district",
  "Supplier identification": "Recherche de fournisseurs",
  "Today, 09:15": "Aujourd'hui, 09:15",
  "Today, 10:30": "Aujourd'hui, 10:30",
  Today: "Aujourd'hui",
  Yesterday: "Hier",
  "Current stage": "Étape actuelle",
  "Last updated": "Dernière mise à jour",
  "Engagement progress": "Avancement de l'échange",
  "Request received": "Demande reçue",
  "After-sales support": "Suivi après-vente",
  "Daily activity": "Activité quotidienne",
  "Request updates": "Mises à jour de la demande",
  "Supplier asked to confirm pump capacity":
    "Le fournisseur doit confirmer la capacité de la pompe",
  "We are checking technical fit against your requirement.":
    "Nous vérifions l'adéquation technique avec votre besoin.",
  "Yesterday, 14:40": "Hier, 14:40",
  "Yesterday, 15:10": "Hier, 15:10",
  "Product specifications matched with two suppliers":
    "Les spécifications correspondent à celles de deux fournisseurs",
  "Supplier credentials are being reviewed before an introduction.":
    "Les justificatifs du fournisseur sont examinés avant la mise en relation.",
  "Delivery location and target date confirmed":
    "Le lieu et la date de livraison souhaitée sont confirmés",
  "The request is ready for supplier identification.":
    "La demande est prête pour la recherche de fournisseurs.",
  "29 Oct": "29 oct.",
  "30 Oct": "30 oct.",
  "The LEAD MULTICHOICE team started the initial requirements review.":
    "L'équipe de LEAD MULTICHOICE a commencé l'examen initial des besoins.",
  "Updated by LEAD MULTICHOICE team": "Mis à jour par l'équipe de LEAD MULTICHOICE",
  "Ask about this update": "Poser une question sur cette mise à jour",
  "Your next step": "Votre prochaine étape",
  "Confirm the required pump capacity": "Confirmer la capacité de pompe requise",
  "Your response will help us confirm supplier fit.":
    "Votre réponse nous aidera à confirmer l'adéquation du fournisseur.",
  "Water pump supply opportunity": "Opportunité de fourniture de pompes à eau",
  "District irrigation project · Rwanda": "Projet d'irrigation de district · Rwanda",
  "Supplier review": "Examen du fournisseur",
  "Authorization letter requested": "Lettre d'autorisation demandée",
  "Please share the current document so the review can continue.":
    "Veuillez transmettre le document à jour pour poursuivre l'examen.",
  "Your product range matched a buyer requirement":
    "Votre gamme correspond au besoin d'un acheteur",
  "The buyer is sourcing pumps for an irrigation project in Rwanda.":
    "L'acheteur recherche des pompes pour un projet d'irrigation au Rwanda.",
  "Company profile reviewed": "Profil de l'entreprise examiné",
  "The team is checking product and authorization information.":
    "L'équipe vérifie les informations sur les produits et les autorisations.",
  "Supplier enquiry received": "Demande du fournisseur reçue",
  "Your request to explore the Rwandan market is under review.":
    "Votre demande d'accès au marché rwandais est en cours d'examen.",
  "Share your current manufacturer authorization letter":
    "Transmettre votre lettre d'autorisation du fabricant à jour",
  "This helps us complete the supplier verification review.":
    "Cela nous aidera à terminer la vérification du fournisseur.",
  "Contact your coordinator": "Contacter votre coordinateur",
  "Your account details": "Informations de votre compte",
});

Object.assign(sw, {
  "Follow your requests, engagement progress and the latest updates from our team.":
    "Fuatilia maombi yako, maendeleo ya ushirikiano na taarifa za hivi karibuni kutoka kwa timu yetu.",
  "Viewing dashboard as": "Unaangalia dashibodi kama",
  "Purchasing entity": "Taasisi ya ununuzi",
  "International supplier": "Msambazaji wa kimataifa",
  "Submit a sourcing request": "Wasilisha ombi la kutafuta bidhaa",
  "Discuss a supplier opportunity": "Jadili fursa ya usambazaji",
  "Open requests": "Maombi yanayoendelea",
  "Needs your response": "Jibu lako linahitajika",
  "Active engagements": "Ushirikiano unaoendelea",
  Completed: "Yaliyokamilika",
  "Relevant opportunities": "Fursa zinazokufaa",
  Introductions: "Utambulisho kati ya wahusika",
  "Current engagement": "Ushirikiano wa sasa",
  "Irrigation pump request": "Ombi la pampu za umwagiliaji",
  "20 water pumps for a district irrigation project":
    "Pampu 20 za maji kwa mradi wa umwagiliaji wa wilaya",
  "Supplier identification": "Kutambua wasambazaji",
  "Today, 09:15": "Leo, 09:15",
  "Today, 10:30": "Leo, 10:30",
  Today: "Leo",
  Yesterday: "Jana",
  "Current stage": "Hatua ya sasa",
  "Last updated": "Ilisasishwa mwisho",
  "Engagement progress": "Maendeleo ya ushirikiano",
  "Request received": "Ombi limepokelewa",
  "After-sales support": "Huduma baada ya mauzo",
  "Daily activity": "Shughuli za kila siku",
  "Request updates": "Taarifa za ombi",
  "Supplier asked to confirm pump capacity": "Msambazaji ameombwa kuthibitisha uwezo wa pampu",
  "We are checking technical fit against your requirement.":
    "Tunathibitisha kama vipimo vya kiufundi vinafaa kwa mahitaji yako.",
  "Yesterday, 14:40": "Jana, 14:40",
  "Yesterday, 15:10": "Jana, 15:10",
  "Product specifications matched with two suppliers":
    "Vipimo vya bidhaa vimeendana na wasambazaji wawili",
  "Supplier credentials are being reviewed before an introduction.":
    "Hati za msambazaji zinakaguliwa kabla ya kuwaunganisha wahusika.",
  "Delivery location and target date confirmed":
    "Mahali pa kuwasilisha na tarehe inayolengwa vimethibitishwa",
  "The request is ready for supplier identification.": "Ombi liko tayari kwa kutambua wasambazaji.",
  "29 Oct": "29 Okt",
  "30 Oct": "30 Okt",
  "The LEAD MULTICHOICE team started the initial requirements review.":
    "Timu ya LEAD MULTICHOICE imeanza kupitia mahitaji ya awali.",
  "Updated by LEAD MULTICHOICE team": "Imesasishwa na timu ya LEAD MULTICHOICE",
  "Ask about this update": "Uliza kuhusu taarifa hii",
  "Your next step": "Hatua yako inayofuata",
  "Confirm the required pump capacity": "Thibitisha uwezo wa pampu unaohitajika",
  "Your response will help us confirm supplier fit.":
    "Jibu lako litatusaidia kuthibitisha kama msambazaji anafaa.",
  "Water pump supply opportunity": "Fursa ya kusambaza pampu za maji",
  "District irrigation project · Rwanda": "Mradi wa umwagiliaji wa wilaya · Rwanda",
  "Supplier review": "Ukaguzi wa msambazaji",
  "Authorization letter requested": "Barua ya idhini imeombwa",
  "Please share the current document so the review can continue.":
    "Tafadhali tuma hati ya sasa ili ukaguzi uendelee.",
  "Your product range matched a buyer requirement": "Bidhaa zako zinaendana na hitaji la mnunuzi",
  "The buyer is sourcing pumps for an irrigation project in Rwanda.":
    "Mnunuzi anatafuta pampu kwa mradi wa umwagiliaji nchini Rwanda.",
  "Company profile reviewed": "Wasifu wa kampuni umekaguliwa",
  "The team is checking product and authorization information.":
    "Timu inakagua taarifa za bidhaa na idhini.",
  "Supplier enquiry received": "Ombi la msambazaji limepokelewa",
  "Your request to explore the Rwandan market is under review.":
    "Ombi lako la kutafuta fursa katika soko la Rwanda linakaguliwa.",
  "Share your current manufacturer authorization letter":
    "Tuma barua yako ya sasa ya idhini kutoka kwa mtengenezaji",
  "This helps us complete the supplier verification review.":
    "Hii itatusaidia kukamilisha ukaguzi wa uthibitisho wa msambazaji.",
  "Contact your coordinator": "Wasiliana na mratibu wako",
  "Your account details": "Taarifa za akaunti yako",
});

Object.assign(rw, {
  "Your Local Partner. Your Regional Advantage.": "Umufatanyabikorwa wawe wo mu karere. Inyungu yawe mu karere kose.",
  "About LEAD MULTICHOICE": "Ibyerekeye LEAD MULTICHOICE",
  "A Rwanda-based bridge between buyers and global supply.": "Ikigo gihuza abaguzi bo mu Rwanda n'abatanga ibicuruzwa mpuzamahanga.",
  "Based in Rwanda, LEAD MULTICHOICE connects local purchasing entities with credible international manufacturers and distributors, coordinating supplier verification, representation and procurement follow-through.": "LEAD MULTICHOICE ifite icyicaro mu Rwanda ihuza inzego zigura n'abakora n'abacuruzi mpuzamahanga bizewe, igahuza igenzura ry'abatanga ibicuruzwa, ubuhagararizi n'ibikorwa by'amasoko.",
  "Rwanda market access": "Kwinjira ku isoko ry'u Rwanda",
  "Local support from supplier search through delivery.": "Ubufasha bwo mu karere kuva ku gushaka uwatanga ibicuruzwa kugeza ku kubigeza aho bikenewe.",
  "Featured contracts & tenders": "Amasezerano n'amasoko by'ingenzi",
  "Browse current notices on Rwanda's official procurement portals. Check the source for complete documents and deadlines.": "Reba amatangazo agezweho ku mbuga zemewe z'amasoko mu Rwanda. Genzura inyandiko n'igihe ntarengwa ku rubuga rwatangaje isoko.",
  "Browse live notices on Rwanda's official procurement portals. Check the source for complete documents and deadlines.": "Reba amatangazo ariho ku mbuga zemewe z'amasoko mu Rwanda. Genzura inyandiko n'igihe ntarengwa ku rubuga rwatangaje isoko.",
  "Partner with Us": "Dufatanye",
  "Explore Opportunities": "Shakisha amahirwe",
  "Contact Us": "Twandikire",
});
Object.assign(fr, {
  "Your Local Partner. Your Regional Advantage.": "Votre partenaire local. Votre avantage régional.",
  "About LEAD MULTICHOICE": "À propos de LEAD MULTICHOICE",
  "A Rwanda-based bridge between buyers and global supply.": "Un lien établi au Rwanda entre les acheteurs et les fournisseurs internationaux.",
  "Based in Rwanda, LEAD MULTICHOICE connects local purchasing entities with credible international manufacturers and distributors, coordinating supplier verification, representation and procurement follow-through.": "Établie au Rwanda, LEAD MULTICHOICE met en relation les acheteurs locaux avec des fabricants et distributeurs internationaux fiables et coordonne la vérification des fournisseurs, la représentation et le suivi des achats.",
  "Rwanda market access": "Accès au marché rwandais",
  "Local support from supplier search through delivery.": "Un accompagnement local, de la recherche de fournisseurs jusqu'à la livraison.",
  "Featured contracts & tenders": "Marchés et appels d'offres à découvrir",
  "Browse current notices on Rwanda's official procurement portals. Check the source for complete documents and deadlines.": "Consultez les avis publiés sur les portails officiels d'achat du Rwanda. Vérifiez les documents et les échéances auprès de la source.",
  "Browse live notices on Rwanda's official procurement portals. Check the source for complete documents and deadlines.": "Consultez les avis en cours sur les portails officiels d'achat du Rwanda. Vérifiez les documents et les échéances auprès de la source.",
  "Partner with Us": "Devenir partenaire",
  "Explore Opportunities": "Explorer les opportunités",
  "Contact Us": "Nous contacter",
});
Object.assign(sw, {
  "Your Local Partner. Your Regional Advantage.": "Mshirika wako wa ndani. Faida yako ya kikanda.",
  "About LEAD MULTICHOICE": "Kuhusu LEAD MULTICHOICE",
  "A Rwanda-based bridge between buyers and global supply.": "Kiungo chenye makao Rwanda kati ya wanunuzi na wasambazaji wa kimataifa.",
  "Based in Rwanda, LEAD MULTICHOICE connects local purchasing entities with credible international manufacturers and distributors, coordinating supplier verification, representation and procurement follow-through.": "LEAD MULTICHOICE yenye makao Rwanda inaunganisha taasisi za ununuzi za ndani na watengenezaji na wasambazaji wa kimataifa wanaoaminika, na kuratibu uhakiki wa wasambazaji, uwakilishi na ufuatiliaji wa ununuzi.",
  "Rwanda market access": "Upatikanaji wa soko la Rwanda",
  "Local support from supplier search through delivery.": "Msaada wa ndani kuanzia kutafuta msambazaji hadi kufuatilia uwasilishaji.",
  "Featured contracts & tenders": "Mikataba na zabuni muhimu",
  "Browse current notices on Rwanda's official procurement portals. Check the source for complete documents and deadlines.": "Angalia matangazo ya sasa kwenye tovuti rasmi za ununuzi za Rwanda. Hakiki nyaraka na tarehe za mwisho kwenye chanzo husika.",
  "Browse live notices on Rwanda's official procurement portals. Check the source for complete documents and deadlines.": "Angalia matangazo yaliyopo kwenye tovuti rasmi za ununuzi za Rwanda. Hakiki nyaraka na tarehe za mwisho kwenye chanzo husika.",
  "Partner with Us": "Shirikiana nasi",
  "Explore Opportunities": "Chunguza fursa",
  "Contact Us": "Wasiliana nasi",
});

Object.assign(rw, {
  "Connecting International Business to Rwanda Through Trust, Integrity and Local Expertise.": "Guhuza ubucuruzi mpuzamahanga n'u Rwanda binyuze mu cyizere, ubunyangamugayo n'ubumenyi bw'aho dukorera.",
  "We specialize in trade facilitation and business representation, connecting international manufacturers, authorized distributors and suppliers with purchasing entities, institutions and commercial organizations in Rwanda and the wider East African region.": "Dufasha korohereza ubucuruzi no guhagararira ibigo, duhuza abakora ibicuruzwa, ababikwirakwiza babifitiye uburenganzira n'ababitanga mpuzamahanga n'inzego z'amasoko, ibigo n'imiryango y'ubucuruzi mu Rwanda no mu karere kagari ka Afurika y'Iburasirazuba.",
  "We identify business opportunities, facilitate introductions, coordinate communication, support procurement processes and help parties navigate local operating requirements. Our team provides a coordinated local point of contact from market intelligence and opportunity identification through procurement coordination, regulatory liaison, delivery monitoring and post-delivery support.": "Tumenya amahirwe y'ubucuruzi, tugahuza abafatanyabikorwa, tugahuza itumanaho, tugafasha mu masoko no gusobanurira impande zifitanye ubufatanye ibisabwa mu mikorere yo mu karere. Itsinda ryacu rihuza ibikorwa kuva ku makuru y'isoko no kumenya amahirwe kugeza ku guhuza amasoko, kuvugana n'inzego zibishinzwe, gukurikirana ishyikirizwa no gutanga ubufasha nyuma yo kugeza ibicuruzwa.",
  "Our agency model is built on transparency and clearly defined responsibilities. Buyers and sellers enter into their own commercial agreements and manage their contractual and payment obligations directly, unless otherwise agreed. We support the relationship through coordination, communication, follow-up and operational assistance within the agreed scope of engagement.": "Uburyo bwacu bwo guhagararira abandi bushingiye ku mucyo no ku nshingano zisobanutse. Abaguzi n'abagurisha bagirana amasezerano y'ubucuruzi kandi buri ruhande rukubahiriza mu buryo butaziguye inshingano zarwo z'amasezerano n'iz'ubwishyu, keretse habaye andi masezerano. Dufasha ubwo bufatanye mu guhuza ibikorwa, itumanaho, gukurikirana no gutanga ubufasha mu mikorere nk'uko byumvikanyweho.",
  "Our objective is to build trusted business relationships, simplify cross-border trade, and support efficient, compliant and reliable delivery of goods and services.": "Intego yacu ni ukubaka umubano w'ubucuruzi wizewe, koroshya ubucuruzi bwambukiranya imipaka no gufasha kugeza ibicuruzwa na serivisi mu buryo bunoze, bukurikije amategeko kandi bwizewe.",
  "To connect international businesses with opportunities in Rwanda through trusted trade facilitation, ethical business representation, reliable coordination and professional local support.": "Guhuza ibigo mpuzamahanga n'amahirwe yo mu Rwanda binyuze mu korohereza ubucuruzi byizewe, guhagararira ibigo mu buryo bw'indangagaciro, guhuza ibikorwa mu buryo bwizewe no gutanga ubufasha bw'umwuga bwo mu karere.",
  "To become a trusted and respected regional partner for international manufacturers, distributors and businesses seeking dependable market access, compliant trade facilitation and effective supply-chain coordination in Rwanda and the wider East African region.": "Kuba umufatanyabikorwa w'akarere wizewe kandi wubahwa ku bakora ibicuruzwa mpuzamahanga, ababikwirakwiza n'ibigo bishaka kugera ku masoko mu buryo bwizewe, koroherezwa ubucuruzi bukurikije amategeko no guhuza uruhererekane rw'ibicuruzwa mu Rwanda no mu karere kagari ka Afurika y'Iburasirazuba.",
  "Our Core Values": "Indangagaciro Zacu",
  "We build confidence through transparent engagement, responsible conduct and consistent follow-through.": "Duteza imbere icyizere binyuze mu bufatanye buboneye, imyitwarire iboneye no gukurikirana ibyo twiyemeje.",
  "We uphold honesty, ethical practices, fairness and respect for commercial agreements.": "Dukurikiza ukuri, imyitwarire myiza, ubutabera no kubaha amasezerano y'ubucuruzi.",
  "We strive to deliver timely communication, dependable coordination and consistent operational support.": "Duharanira gutanga amakuru ku gihe, guhuza ibikorwa mu buryo bwizewe no gutanga ubufasha buhoraho.",
  "We approach every engagement with competence, respect, discretion and a commitment to quality.": "Dukora buri bufatanye dushingiye ku bumenyi, icyubahiro, ibanga n'ubwitange ku bwiza.",
  "We promote clear responsibilities, accurate reporting and proactive follow-up on agreed commitments.": "Dushyiraho inshingano zisobanutse, dutanga amakuru nyayo kandi tugakurikirana ibyo twemeranyijeho.",
  "We foster long-term relationships based on mutual respect, shared objectives and sustainable business value.": "Twubaka umubano w'igihe kirekire ushingiye ku kubahana, intego dusangiye n'agaciro karambye mu bucuruzi.",
});

Object.assign(fr, {
  "Connecting International Business to Rwanda Through Trust, Integrity and Local Expertise.": "Relier les entreprises internationales au Rwanda grâce à la confiance, à l'intégrité et à l'expertise locale.",
  "We specialize in trade facilitation and business representation, connecting international manufacturers, authorized distributors and suppliers with purchasing entities, institutions and commercial organizations in Rwanda and the wider East African region.": "Nous sommes spécialisés dans la facilitation des échanges et la représentation commerciale. Nous mettons en relation les fabricants, distributeurs agréés et fournisseurs internationaux avec les entités acheteuses, institutions et organisations commerciales du Rwanda et de l'ensemble de l'Afrique de l'Est.",
  "We identify business opportunities, facilitate introductions, coordinate communication, support procurement processes and help parties navigate local operating requirements. Our team provides a coordinated local point of contact from market intelligence and opportunity identification through procurement coordination, regulatory liaison, delivery monitoring and post-delivery support.": "Nous repérons les opportunités commerciales, facilitons les mises en relation, coordonnons les échanges, appuyons les processus d'achat et aidons les parties à comprendre les exigences opérationnelles locales. Notre équipe assure un point de contact local coordonné, de l'analyse du marché et du repérage des opportunités jusqu'à la coordination des achats, la liaison avec les autorités, le suivi des livraisons et l'assistance après livraison.",
  "Our agency model is built on transparency and clearly defined responsibilities. Buyers and sellers enter into their own commercial agreements and manage their contractual and payment obligations directly, unless otherwise agreed. We support the relationship through coordination, communication, follow-up and operational assistance within the agreed scope of engagement.": "Notre modèle d'agence repose sur la transparence et des responsabilités clairement définies. Sauf accord contraire, acheteurs et vendeurs concluent leurs propres contrats commerciaux et gèrent directement leurs obligations contractuelles et de paiement. Nous accompagnons la relation par la coordination, la communication, le suivi et l'assistance opérationnelle prévus dans le cadre convenu.",
  "Our objective is to build trusted business relationships, simplify cross-border trade, and support efficient, compliant and reliable delivery of goods and services.": "Notre objectif est de bâtir des relations commerciales de confiance, de simplifier les échanges transfrontaliers et de contribuer à la livraison efficace, conforme et fiable de biens et de services.",
  "To connect international businesses with opportunities in Rwanda through trusted trade facilitation, ethical business representation, reliable coordination and professional local support.": "Relier les entreprises internationales aux opportunités au Rwanda grâce à une facilitation des échanges de confiance, une représentation commerciale éthique, une coordination fiable et un accompagnement local professionnel.",
  "To become a trusted and respected regional partner for international manufacturers, distributors and businesses seeking dependable market access, compliant trade facilitation and effective supply-chain coordination in Rwanda and the wider East African region.": "Devenir un partenaire régional reconnu et de confiance pour les fabricants, distributeurs et entreprises internationaux recherchant un accès fiable au marché, une facilitation des échanges conforme et une coordination efficace de la chaîne d'approvisionnement au Rwanda et dans l'ensemble de l'Afrique de l'Est.",
  "Our Core Values": "Nos valeurs fondamentales",
  "We build confidence through transparent engagement, responsible conduct and consistent follow-through.": "Nous inspirons confiance par des relations transparentes, une conduite responsable et un suivi constant de nos engagements.",
  "We uphold honesty, ethical practices, fairness and respect for commercial agreements.": "Nous défendons l'honnêteté, l'éthique, l'équité et le respect des accords commerciaux.",
  "We strive to deliver timely communication, dependable coordination and consistent operational support.": "Nous nous efforçons d'assurer une communication rapide, une coordination fiable et un soutien opérationnel constant.",
  "We approach every engagement with competence, respect, discretion and a commitment to quality.": "Nous abordons chaque mission avec compétence, respect, discrétion et exigence de qualité.",
  "We promote clear responsibilities, accurate reporting and proactive follow-up on agreed commitments.": "Nous favorisons des responsabilités claires, des comptes rendus exacts et le suivi proactif des engagements convenus.",
  "We foster long-term relationships based on mutual respect, shared objectives and sustainable business value.": "Nous cultivons des relations durables fondées sur le respect mutuel, des objectifs communs et une valeur commerciale pérenne.",
});

Object.assign(sw, {
  "Connecting International Business to Rwanda Through Trust, Integrity and Local Expertise.": "Kuunganisha biashara za kimataifa na Rwanda kupitia uaminifu, uadilifu na utaalamu wa ndani.",
  "We specialize in trade facilitation and business representation, connecting international manufacturers, authorized distributors and suppliers with purchasing entities, institutions and commercial organizations in Rwanda and the wider East African region.": "Tuna utaalamu katika kurahisisha biashara na uwakilishi wa kampuni, tukiunganisha watengenezaji, wasambazaji walioidhinishwa na wauzaji wa kimataifa na taasisi za ununuzi, taasisi na mashirika ya kibiashara nchini Rwanda na Afrika Mashariki.",
  "We identify business opportunities, facilitate introductions, coordinate communication, support procurement processes and help parties navigate local operating requirements. Our team provides a coordinated local point of contact from market intelligence and opportunity identification through procurement coordination, regulatory liaison, delivery monitoring and post-delivery support.": "Tunatambua fursa za biashara, tunawezesha utambulisho wa washirika, kuratibu mawasiliano na kusaidia michakato ya ununuzi na uelewa wa mahitaji ya ndani. Timu yetu hutoa kituo cha mawasiliano cha ndani kilichoratibiwa, kuanzia taarifa za soko na utambuzi wa fursa hadi uratibu wa ununuzi, mawasiliano na mamlaka, ufuatiliaji wa uwasilishaji na msaada baada ya bidhaa kufikishwa.",
  "Our agency model is built on transparency and clearly defined responsibilities. Buyers and sellers enter into their own commercial agreements and manage their contractual and payment obligations directly, unless otherwise agreed. We support the relationship through coordination, communication, follow-up and operational assistance within the agreed scope of engagement.": "Mfumo wetu wa uwakala unategemea uwazi na majukumu yaliyofafanuliwa wazi. Isipokuwa ikikubaliwa vinginevyo, wanunuzi na wauzaji huingia katika mikataba yao ya kibiashara na kusimamia moja kwa moja wajibu wao wa kimkataba na malipo. Tunaunga mkono uhusiano huo kwa uratibu, mawasiliano, ufuatiliaji na msaada wa kiutendaji ndani ya wigo uliokubaliwa.",
  "Our objective is to build trusted business relationships, simplify cross-border trade, and support efficient, compliant and reliable delivery of goods and services.": "Lengo letu ni kujenga mahusiano ya biashara yenye uaminifu, kurahisisha biashara za kuvuka mipaka na kusaidia uwasilishaji bora, unaozingatia sheria na unaotegemewa wa bidhaa na huduma.",
  "To connect international businesses with opportunities in Rwanda through trusted trade facilitation, ethical business representation, reliable coordination and professional local support.": "Kuunganisha biashara za kimataifa na fursa nchini Rwanda kupitia urahisishaji wa biashara unaoaminika, uwakilishi wa kimaadili, uratibu unaotegemewa na msaada wa kitaalamu wa ndani.",
  "To become a trusted and respected regional partner for international manufacturers, distributors and businesses seeking dependable market access, compliant trade facilitation and effective supply-chain coordination in Rwanda and the wider East African region.": "Kuwa mshirika wa kikanda anayeaminika na kuheshimiwa kwa watengenezaji, wasambazaji na biashara za kimataifa zinazotafuta ufikiaji wa soko unaotegemewa, urahisishaji wa biashara unaozingatia sheria na uratibu bora wa mnyororo wa ugavi nchini Rwanda na Afrika Mashariki.",
  "Our Core Values": "Maadili Yetu ya Msingi",
  "We build confidence through transparent engagement, responsible conduct and consistent follow-through.": "Tunajenga imani kupitia ushirikiano ulio wazi, mwenendo wenye uwajibikaji na ufuatiliaji wa ahadi kwa uthabiti.",
  "We uphold honesty, ethical practices, fairness and respect for commercial agreements.": "Tunazingatia uaminifu, maadili, haki na heshima kwa mikataba ya kibiashara.",
  "We strive to deliver timely communication, dependable coordination and consistent operational support.": "Tunajitahidi kutoa mawasiliano kwa wakati, uratibu unaotegemewa na msaada thabiti wa kiutendaji.",
  "We approach every engagement with competence, respect, discretion and a commitment to quality.": "Tunashughulikia kila kazi kwa umahiri, heshima, busara na kujitolea kwa ubora.",
  "We promote clear responsibilities, accurate reporting and proactive follow-up on agreed commitments.": "Tunaendeleza majukumu yaliyo wazi, taarifa sahihi na ufuatiliaji wa mapema wa ahadi zilizokubaliwa.",
  "We foster long-term relationships based on mutual respect, shared objectives and sustainable business value.": "Tunajenga mahusiano ya muda mrefu yanayotegemea heshima ya pande zote, malengo ya pamoja na thamani endelevu ya biashara.",
});

const copy: Partial<Record<Language, Record<string, string>>> = { rw, fr, sw };
export const siteCopySourceTexts = [...new Set([...Object.keys(rw), ...Object.keys(fr), ...Object.keys(sw)])];
export function translateSiteCopy(language: Language, text: string) {
  return language === "en" ? text : (copy[language]?.[text] ?? text);
}
