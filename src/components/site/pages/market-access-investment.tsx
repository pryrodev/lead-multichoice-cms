"use client";

import { Globe2, Handshake, Search, Truck, Users, ClipboardCheck } from "lucide-react";
import { ButtonLink, PageHero, SectionHeading } from "@/components/site/ui";
import { useI18n } from "@/i18n/I18nProvider";
import { PhotoScrollSection } from "@/components/site/PhotoScrollSection";

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
  supportSubintro: string;
  support: { title: string; text: string }[];
  deliveryTitle: string;
  deliveryText: string;
  tagline: string;
  contact: string;
};

const content: Record<string, MarketAccessContent> & { en: MarketAccessContent } = {
  en: {
    eyebrow: "Market Access",
    heroTitle: "Rwanda: Your Gateway to Regional and Continental Opportunities",
    heroIntro:
      "Rwanda offers international manufacturers, authorised distributors and suppliers a strategic platform for accessing growing markets across East and Central Africa and the wider African continent.",
    marketsTitle: "Regional & Continental Market Opportunities",
    marketsIntro:
      "Through its membership in regional and continental trade frameworks, Rwanda provides opportunities to engage with a regional consumer market of approximately:",
    markets: [
      {
        name: "East African Community (EAC)",
        population: "353.8 million",
        text: "people across the East African Community (EAC).",
      },
      {
        name: "COMESA",
        population: "583 million",
        text: "people across the Common Market for Eastern and Southern Africa (COMESA).",
      },
      {
        name: "African Continental Free Trade Area (AfCFTA)",
        population: "1.55 billion",
        text: "people across the African Continental Free Trade Area (AfCFTA), which Rwanda actively supports through its participation in the progressive implementation of continental trade integration.",
      },
    ],
    neighborTitle: "Commercial & Geographic Links with Eastern DRC",
    neighborText:
      "Rwanda also has important commercial and geographic links with eastern Democratic Republic of Congo (DRC), a significant neighbouring market with substantial demand and business opportunities.",
    supportTitle: "How Lead Multichoice Supports Market Access",
    supportIntro:
      "Lead Multichoice Ltd bridges the gap between international supply opportunities and local market demand. We help manufacturers, authorised distributors and specialised suppliers understand the Rwandan business environment, identify opportunities and establish the local relationships needed to access the market.",
    supportSubintro: "Our support includes:",
    support: [
      {
        title: "Market Intelligence and Opportunity Identification",
        text: "Identifying sector-specific opportunities, procurement requirements, investment prospects and potential demand across Rwanda and the region.",
      },
      {
        title: "Market Entry and Local Representation",
        text: "Facilitating introductions, local business representation and engagement with relevant public- and private-sector purchasing entities.",
      },
      {
        title: "Supplier and Distributor Engagement",
        text: "Connecting international manufacturers, authorised distributors and specialised service providers with prospective local buyers and business partners.",
      },
      {
        title: "Procurement and Supply Chain Coordination",
        text: "Supporting sourcing, procurement processes, logistics coordination and engagement with relevant stakeholders.",
      },
      {
        title: "Contract and Project Delivery Support",
        text: "Coordinating local implementation, delivery monitoring, stakeholder engagement and post-delivery support to help translate opportunities into successful outcomes.",
      },
    ],
    deliveryTitle: "From Market Opportunity to Successful Delivery",
    deliveryText:
      "Our approach goes beyond making introductions. We provide the local market understanding, coordination and operational support that help international businesses navigate Rwanda's commercial environment, build credible partnerships and pursue opportunities across the region.",
    tagline: "Lead Multichoice Ltd – Your Local Partner. Your Regional Advantage.",
    contact: "Discuss a business opportunity",
  },
  rw: {
    eyebrow: "Kwinjira ku Isoko",
    heroTitle: "U Rwanda: Irembo rigana ku mahirwe yo mu karere no ku mugabane",
    heroIntro:
      "U Rwanda ruha abakora ibicuruzwa mpuzamahanga, abacuruzi babiherewe uburenganzira n'ababitanga urubuga rw'ingenzi rwo kugera ku masoko akura yo muri Afurika y'Iburasirazuba, Hagati no ku mugabane wose.",
    marketsTitle: "Amahirwe y'Isoko mu Karere no ku Mugabane",
    marketsIntro:
      "Binyuze mu bunyamuryango mu masezerano y'ubucuruzi yo mu karere no ku mugabane, u Rwanda rutanga amahirwe yo gukorana n'isoko ry'abakiriya ringana hafi na:",
    markets: [
      {
        name: "Umuryango wa Afurika y'Iburasirazuba (EAC)",
        population: "Miliyoni 353.8",
        text: "z'abaturage bo mu Muryango wa Afurika y'Iburasirazuba (EAC).",
      },
      {
        name: "COMESA",
        population: "Miliyoni 583",
        text: "z'abaturage bo mu Isoko Rusange rya Afurika y'Iburasirazuba n'Amajyepfo (COMESA).",
      },
      {
        name: "Isoko Rusange rya Afurika (AfCFTA)",
        population: "Miliyari 1.55",
        text: "z'abaturage bo mu Isoko Rusange rya Afurika (AfCFTA), u Rwanda rushyigikira binyuze mu ruhare rwarwo mu bikorwa byo kwihuza mu bucuruzi ku mugabane.",
      },
    ],
    neighborTitle: "Umubano w'Ubucuruzi n'Ubwitegereze n'Iburasirazuba bwa Kongo (DRC)",
    neighborText:
      "U Rwanda kandi rufite imikoranire ikomeye y'ubucuruzi n'iy'ubumenyi bw'isi n'iburasirazuba bwa Repubulika Iharanira Demokarasi ya Kongo (DRC), isoko ry'abaturanyi rifite ibyifuzo byinshi n'amahirwe akomeye y'ubucuruzi.",
    supportTitle: "Uko Lead Multichoice Ifasha Kwinjira ku Isoko",
    supportIntro:
      "Lead Multichoice Ltd ihuza icyuho kiri hagati y'amahirwe yo gutanga ibicuruzwa mpuzamahanga n'ibikenewe ku isoko ry'imbere mu gihugu. Dufasha abakora ibicuruzwa, ababikwirakwiza babiherewe uburenganzira n'abatanga serivisi zihariye gusobanukirwa ibidukikije by'ubucuruzi mu Rwanda, kumenya amahirwe no kubaka umubano wo mu gihugu ukenewe kugira ngo binjire ku isoko.",
    supportSubintro: "Ubufasha bwacu bukubiyemo:",
    support: [
      {
        title: "Amakuru y'Isoko no Kumenya Amahirwe",
        text: "Kumenya amahirwe yihariye mu nzego, ibisabwa mu masoko, amahirwe y'ishoramari n'ibikenewe mu Rwanda no mu karere.",
      },
      {
        title: "Kwinjira ku Isoko no Guhagararirwa mu Gihugu",
        text: "Gufasha mu kumenyekanisha, guhagararira ubucuruzi mu gihugu no gukorana n'inzego z'abaguzi zaba iza leta n'iz'abikorera.",
      },
      {
        title: "Gukorana n'Abatanga Ibicuruzwa n'Ababikwirakwiza",
        text: "Guhuza abakora ibicuruzwa mpuzamahanga, ababikwirakwiza babiherewe uburenganzira n'abatanga serivisi zihariye n'abaguzi n'abafatanyabikorwa bo mu karere.",
      },
      {
        title: "Guhuza Amasoko n'Uruhererekane rw'Ibicuruzwa",
        text: "Gushyigikira gushaka ibicuruzwa, imigendekere y'amasoko, guhuza ubwikorezi no gukorana n'abafatanyabikorwa bireba.",
      },
      {
        title: "Gufasha mu Masezerano no Gutanga Imishinga",
        text: "Guhuza ishyirwa mu bikorwa mu gihugu, gukurikirana ibyagejejwe ku bakiriya, gukorana n'abafatanyabikorwa no gutanga ubufasha nyuma yo gutanga ibicuruzwa kugira ngo amahirwe abyazwe umusaruro ufatika.",
      },
    ],
    deliveryTitle: "Kuva ku Mahirwe y'Isoko Kugeza ku Musaruro Ufatika",
    deliveryText:
      "Uburyo dukoramo burenga kumenyekanisha gusa. Dutanga ubumenyi bw'isoko ry'imbere mu gihugu, guhuza ibikorwa n'ubufasha mu mikorere bifasha ubucuruzi mpuzamahanga kumenya imikorere y'ubucuruzi mu Rwanda, kubaka ubufatanye bwizewe no gukurikirana amahirwe mu karere kose.",
    tagline: "Lead Multichoice Ltd – Umufatanyabikorwa Wawe wo mu Karere. Inyungu Zawe mu Karere.",
    contact: "Ganira natwe ku mahirwe y'ubucuruzi",
  },
  fr: {
    eyebrow: "Accès au marché",
    heroTitle: "Le Rwanda : votre porte d'accès aux opportunités régionales et continentales",
    heroIntro:
      "Le Rwanda offre aux fabricants internationaux, distributeurs agréés et fournisseurs une plateforme stratégique pour accéder aux marchés en pleine croissance d'Afrique de l'Est, d'Afrique centrale et du continent africain.",
    marketsTitle: "Opportunités sur les marchés régionaux et continentaux",
    marketsIntro:
      "Grâce à son adhésion aux cadres commerciaux régionaux et continentaux, le Rwanda offre des opportunités d'accès à un marché de consommation régional d'environ :",
    markets: [
      {
        name: "Communauté d'Afrique de l'Est (EAC)",
        population: "353,8 millions",
        text: "d'habitants au sein de la Communauté d'Afrique de l'Est (EAC).",
      },
      {
        name: "COMESA",
        population: "583 millions",
        text: "d'habitants au sein du Marché commun de l'Afrique orientale et australe (COMESA).",
      },
      {
        name: "Zone de libre-échange continentale africaine (ZLECAf)",
        population: "1,55 milliard",
        text: "d'habitants au sein de la Zone de libre-échange continentale africaine (ZLECAf), que le Rwanda soutient activement par sa participation à la mise en œuvre progressive de l'intégration commerciale continentale.",
      },
    ],
    neighborTitle: "Liens commerciaux et géographiques avec l'est de la RDC",
    neighborText:
      "Le Rwanda possède également d'importants liens commerciaux et géographiques avec l'est de la République démocratique du Congo (RDC), un marché voisin stratégique doté d'une forte demande et de nombreuses opportunités commerciales.",
    supportTitle: "Comment Lead Multichoice facilite l'accès au marché",
    supportIntro:
      "Lead Multichoice Ltd fait le pont entre les opportunités d'approvisionnement internationales et la demande du marché local. Nous aidons les fabricants, distributeurs agréés et fournisseurs spécialisés à comprendre l'environnement commercial rwandais, à identifier les opportunités et à établir les relations locales nécessaires pour pénétrer le marché.",
    supportSubintro: "Notre accompagnement comprend :",
    support: [
      {
        title: "Intelligence de marché et identification des opportunités",
        text: "Identifier les opportunités sectorielles, les exigences en matière de marchés publics, les perspectives d'investissement et la demande potentielle au Rwanda et dans la région.",
      },
      {
        title: "Accès au marché et représentation locale",
        text: "Faciliter les mises en relation, la représentation commerciale locale et le dialogue avec les entités adjudicatrices publiques et privées.",
      },
      {
        title: "Engagement auprès des fournisseurs et distributeurs",
        text: "Mettre en relation fabricants internationaux, distributeurs agréés et prestataires spécialisés avec des acheteurs et partenaires commerciaux locaux.",
      },
      {
        title: "Coordination des achats et de la chaîne logistique",
        text: "Accompagner le sourcing, les processus de passation des marchés, la coordination logistique et la liaison avec les parties prenantes.",
      },
      {
        title: "Appui contractuel et suivi d'exécution des projets",
        text: "Coordonner la mise en œuvre locale, le suivi des livraisons, l'engagement des parties prenantes et l'assistance après livraison pour transformer les opportunités en réussites concrètes.",
      },
    ],
    deliveryTitle: "De l'opportunité de marché à la concrétisation réussie",
    deliveryText:
      "Notre approche va bien au-delà de la simple mise en relation. Nous apportons la compréhension du marché local, la coordination et le soutien opérationnel qui aident les entreprises internationales à naviguer dans l'environnement commercial rwandais, à bâtir des partenariats crédibles et à saisir les opportunités dans toute la région.",
    tagline: "Lead Multichoice Ltd – Votre partenaire local. Votre avantage régional.",
    contact: "Discuter d'une opportunité d'affaires",
  },
  sw: {
    eyebrow: "Upatikanaji wa Soko",
    heroTitle: "Rwanda: Lango lako la fursa za kikanda na bara zima",
    heroIntro:
      "Rwanda huwapa watengenezaji wa kimataifa, wasambazaji walioidhinishwa na wauzaji jukwaa la kimkakati la kufikia masoko yanayokua Afrika Mashariki, Afrika ya Kati na bara zima la Afrika.",
    marketsTitle: "Fursa za Masoko ya Kikanda na Bara",
    marketsIntro:
      "Kupitia uanachama wake katika mifumo ya biashara ya kikanda na bara, Rwanda inatoa fursa za kushiriki katika soko la watumiaji la takriban:",
    markets: [
      {
        name: "Jumuiya ya Afrika Mashariki (EAC)",
        population: "milioni 353.8",
        text: "ya watu kote katika Jumuiya ya Afrika Mashariki (EAC).",
      },
      {
        name: "COMESA",
        population: "milioni 583",
        text: "ya watu kote katika Soko la Pamoja la Mashariki na Kusini mwa Afrika (COMESA).",
      },
      {
        name: "Eneo Huru la Biashara la Bara la Afrika (AfCFTA)",
        population: "bilioni 1.55",
        text: "ya watu kote katika Eneo Huru la Biashara la Bara la Afrika (AfCFTA), ambalo Rwanda inaliunga mkono kikamilifu kupitia ushiriki wake katika utekelezaji endelevu wa ushirikiano wa kibiashara barani.",
      },
    ],
    neighborTitle: "Mawasiliano ya Kibiashara na Kijiografia na Mashariki mwa DRC",
    neighborText:
      "Rwanda pia ina uhusiano muhimu wa kibiashara na kijiografia na mashariki mwa Jamhuri ya Kidemokrasia ya Kongo (DRC), soko jirani lenye mahitaji makubwa na fursa tele za kibiashara.",
    supportTitle: "Jinsi Lead Multichoice Inavyosaidia Upatikanaji wa Soko",
    supportIntro:
      "Lead Multichoice Ltd huziba pengo kati ya fursa za ugavi wa kimataifa na mahitaji ya soko la ndani. Tunawasaidia watengenezaji, wasambazaji walioidhinishwa na watoa huduma maalum kuelewa mazingira ya biashara ya Rwanda, kutambua fursa na kuanzisha mahusiano ya ndani yanayohitajika kuingia sokoni.",
    supportSubintro: "Usaidizi wetu unajumuisha:",
    support: [
      {
        title: "Uchambuzi wa Soko na Utambuzi wa Fursa",
        text: "Kutambua fursa mahususi za kisekta, mahitaji ya ununuzi, fursa za uwekezaji na mahitaji yanayowezekana nchini Rwanda na katika kanda nzima.",
      },
      {
        title: "Kuingia Sokoni na Uwakilishi wa Ndani",
        text: "Kuwezesha utambulisho, uwakilishi wa biashara wa ndani na ushirikiano na taasisi husika za ununuzi za umma na za kibinafsi.",
      },
      {
        title: "Ushirikiano na Watengenezaji na Wasambazaji",
        text: "Kuunganisha watengenezaji wa kimataifa, wasambazaji walioidhinishwa na watoa huduma maalum na wanunuzi watarajiwa na washirika wa kibiashara wa ndani.",
      },
      {
        title: "Uratibu wa Ununuzi na Mnyororo wa Ugavi",
        text: "Kusaidia michakato ya ununuzi, upatikanaji wa bidhaa, uratibu wa vifaa na usafirishaji na ushirikiano na wadau husika.",
      },
      {
        title: "Msaada wa Mikataba na Utekelezaji wa Miradi",
        text: "Kuratibu utekelezaji wa ndani, ufuatiliaji wa uwasilishaji, ushirikishwaji wa wadau na msaada wa baada ya uwasilishaji kusaidia kugeuza fursa kuwa mafanikio halisi.",
      },
    ],
    deliveryTitle: "Kutoka Fursa ya Soko hadi Uwasilishaji Wenye Mafanikio",
    deliveryText:
      "Mtazamo wetu unaenda mbali zaidi ya kuanzisha tu utambulisho. Tunatoa uelewa wa soko la ndani, uratibu na msaada wa kiutendaji unaosaidia biashara za kimataifa kuelewa mazingira ya kibiashara ya Rwanda, kujenga ushirikiano wa kuaminika na kufuata fursa katika ukanda wote.",
    tagline: "Lead Multichoice Ltd – Mshirika Wako wa Ndani. Faida Yako ya Kikanda.",
    contact: "Jadili fursa ya kibiashara",
  },
  zh: {
    eyebrow: "市场准入",
    heroTitle: "卢旺达：您通往区域与大陆商机的门户",
    heroIntro:
      "卢旺达为国际制造商、授权分销商和供应商提供了一个战略平台，便于进入东非、中非乃至整个非洲大陆不断增长的市场。",
    marketsTitle: "区域与大陆市场机遇",
    marketsIntro:
      "通过加入区域和大陆贸易框架，卢旺达提供了进入庞大区域消费市场的良机，覆盖约：",
    markets: [
      {
        name: "东非共同体 (EAC)",
        population: "3.538 亿",
        text: "人口覆盖整个东非共同体 (EAC) 市场。",
      },
      {
        name: "东南非共同市场 (COMESA)",
        population: "5.83 亿",
        text: "人口覆盖整个东南非共同市场 (COMESA)。",
      },
      {
        name: "非洲大陆自由贸易区 (AfCFTA)",
        population: "15.5 亿",
        text: "人口覆盖整个非洲大陆自由贸易区 (AfCFTA)，卢旺达通过积极参与大陆贸易一体化的渐进实施全力支持该自贸区。",
      },
    ],
    neighborTitle: "与刚果（金）东部的商贸与地理纽带",
    neighborText:
      "卢旺达还与刚果民主共和国（DRC）东部保持着重要的商贸与地理纽带，这是一个拥有庞大需求和商机的核心邻国市场。",
    supportTitle: "Lead Multichoice 如何赋能市场准入",
    supportIntro:
      "Lead Multichoice Ltd 架起了国际供应机会与本地市场需求之间的桥梁。我们帮助制造商、授权分销商和专业供应商了解卢旺达的营商环境，发掘商业机会，并建立进入市场所需的本地合作关系。",
    supportSubintro: "我们的支持包括：",
    support: [
      {
        title: "市场情报与机遇发掘",
        text: "识别卢旺达及周边区域的特定行业商机、采购需求、投资前景和潜在市场需求。",
      },
      {
        title: "市场准入与本地代理",
        text: "促成商务引荐、提供本地商业代表，并与相关的公共和私营采购实体展开深入对接。",
      },
      {
        title: "供应商与分销商对接",
        text: "将国际制造商、授权分销商和专业服务提供商与当地潜在买家和商业伙伴紧密连接。",
      },
      {
        title: "采购与供应链协同",
        text: "支持货源寻源、采购流程、物流协调以及与相关利益攸关方的统筹协作。",
      },
      {
        title: "合同与项目履约支持",
        text: "协调本地项目落地、交付监控、利益攸关方联络和交付后支持，助力商机成功转化为实质性成果。",
      },
    ],
    deliveryTitle: "从市场机遇走向成功落地",
    deliveryText:
      "我们的服务远不止于商务引荐。我们提供深入的本地市场洞察、全方位协调和运营支持，帮助国际企业把握卢旺达的商业环境，建立可靠的合作关系，并在整个区域开拓发展良机。",
    tagline: "Lead Multichoice Ltd – 您的本地合作伙伴，您的区域竞争优势。",
    contact: "洽谈商业合作机会",
  },
  de: {
    eyebrow: "Marktzugang",
    heroTitle: "Ruanda: Ihr Tor zu regionalen und kontinentalen Chancen",
    heroIntro:
      "Ruanda bietet internationalen Herstellern, autorisierten Vertriebspartnern und Lieferanten eine strategische Plattform für den Zugang zu wachsenden Märkten in Ost- und Zentralafrika sowie auf dem gesamten afrikanischen Kontinent.",
    marketsTitle: "Regionale und kontinentale Marktchancen",
    marketsIntro:
      "Durch seine Mitgliedschaft in regionalen und kontinentalen Handelsrahmen bietet Ruanda Möglichkeiten zur Erschließung eines regionalen Verbrauchermarktes von ca.:",
    markets: [
      {
        name: "Ostafrikanische Gemeinschaft (EAC)",
        population: "353,8 Millionen",
        text: "Menschen in der Ostafrikanischen Gemeinschaft (EAC).",
      },
      {
        name: "COMESA",
        population: "583 Millionen",
        text: "Menschen im Gemeinsamen Markt für das östliche und südliche Afrika (COMESA).",
      },
      {
        name: "Afrikanische Kontinentale Freihandelszone (AfCFTA)",
        population: "1,55 Milliarden",
        text: "Menschen in der Afrikanischen Kontinentalen Freihandelszone (AfCFTA), die Ruanda durch die aktive Teilnahme an der schrittweisen Umsetzung der kontinentalen Handelsintegration unterstützt.",
      },
    ],
    neighborTitle: "Wirtschaftliche und geografische Verbindungen zur östlichen DR Kongo",
    neighborText:
      "Ruanda verfügt zudem über wichtige wirtschaftliche und geografische Verbindungen zum Osten der Demokratischen Republik Kongo (DRK), einem bedeutenden Nachbarmarkt mit beträchtlicher Nachfrage und Geschäftschancen.",
    supportTitle: "Wie Lead Multichoice den Marktzugang unterstützt",
    supportIntro:
      "Lead Multichoice Ltd schließt die Lücke zwischen internationalen Lieferangeboten und lokaler Marktnachfrage. Wir helfen Herstellern, autorisierten Händlern und spezialisierten Lieferanten, das ruandische Geschäftsumfeld zu verstehen, Chancen zu identifizieren und die für den Marktzugang erforderlichen lokalen Beziehungen aufzubauen.",
    supportSubintro: "Unsere Unterstützung umfasst:",
    support: [
      {
        title: "Marktanalysen und Chancenerkennung",
        text: "Identifizierung branchenspezifischer Chancen, Beschaffungsanforderungen, Investitionsaussichten und potenzieller Nachfrage in Ruanda und der Region.",
      },
      {
        title: "Markteintritt und lokale Vertretung",
        text: "Erleichterung von Kontakten, lokaler Geschäftsvertretung und Zusammenarbeit mit relevanten öffentlichen und privaten Beschaffungsstellen.",
      },
      {
        title: "Lieferanten- und Händlereinbindung",
        text: "Verbindung internationaler Hersteller, autorisierter Händler und spezialisierter Dienstleister mit potenziellen lokalen Käufern und Geschäftspartnern.",
      },
      {
        title: "Beschaffungs- und Lieferkettenkoordination",
        text: "Unterstützung bei Beschaffung, Vergabeverfahren, Logistikkoordination und Abstimmung mit relevanten Stakeholdern.",
      },
      {
        title: "Vertrags- und Projektabwicklungsunterstützung",
        text: "Koordination der lokalen Umsetzung, Lieferüberwachung, Stakeholder-Einbindung und After-Delivery-Support zur erfolgreichen Verwirklichung von Chancen.",
      },
    ],
    deliveryTitle: "Von der Marktchance zur erfolgreichen Abwicklung",
    deliveryText:
      "Unser Ansatz geht über reine Vermittlungen hinaus. Wir bieten das lokale Marktverständnis, die Koordination und die operative Unterstützung, die internationalen Unternehmen dabei helfen, sich im Geschäftsumfeld Ruandas zurechtzufinden, verlässliche Partnerschaften aufzubauen und Chancen in der gesamten Region zu nutzen.",
    tagline: "Lead Multichoice Ltd – Ihr lokaler Partner. Ihr regionaler Vorteil.",
    contact: "Geschäftsmöglichkeit besprechen",
  },
  ar: {
    eyebrow: "الوصول إلى السوق",
    heroTitle: "رواندا: بوابتك إلى الفرص الإقليمية والقارية",
    heroIntro:
      "توفر رواندا للمصنعين الدوليين والموزعين المعتمدين والموردين منصة استراتيجية للوصول إلى الأسواق المتنامية عبر شرق ووسط أفريقيا والقارة الأفريقية عموماً.",
    marketsTitle: "فرص الأسواق الإقليمية والقارية",
    marketsIntro:
      "من خلال عضويتها في أطر التجارة الإقليمية والقارية، تتيح رواندا فرصاً للتواصل مع سوق استهلاكي إقليمي يضم حوالي:",
    markets: [
      {
        name: "مجموعة شرق أفريقيا (EAC)",
        population: "353.8 مليون",
        text: "نسمة عبر مجموعة شرق أفريقيا (EAC).",
      },
      {
        name: "الكوميسا (COMESA)",
        population: "583 مليون",
        text: "نسمة عبر السوق المشتركة لشرق وجنوب أفريقيا (COMESA).",
      },
      {
        name: "منطقة التجارة الحرة القارية الأفريقية (AfCFTA)",
        population: "1.55 مليار",
        text: "نسمة عبر منطقة التجارة الحرة القارية الأفريقية (AfCFTA)، والتي تدعمها رواندا بنشاط من خلال مشاركتها في التنفيذ التدريجي للتكامل التجاري القاري.",
      },
    ],
    neighborTitle: "روابط تجارية وجغرافية مع شرق جمهورية الكونغو الديمقراطية",
    neighborText:
      "تمتلك رواندا أيضاً روابط تجارية وجغرافية هامة مع شرق جمهورية الكونغو الديمقراطية (DRC)، وهي سوق مجاورة استراتيجية تشهد طلباً كبيراً وفرصاً تجارية واعدة.",
    supportTitle: "كيف تدعم Lead Multichoice الوصول إلى السوق",
    supportIntro:
      "تسد Lead Multichoice Ltd الفجوة بين فرص التوريد الدولية والطلب في السوق المحلي. نساعد المصنعين والموزعين المعتمدين والموردين المتخصصين على فهم بيئة الأعمال الرواندية، وتحديد الفرص، وإقامة العلاقات المحلية اللازمة للوصول إلى السوق.",
    supportSubintro: "يشمل دعمنا ما يلي:",
    support: [
      {
        title: "معلومات السوق وتحديد الفرص",
        text: "تحديد الفرص الخاصة بكل قطاع، ومتطلبات المشتريات، وآفاق الاستثمار والطلب المحتمل في رواندا والمنطقة.",
      },
      {
        title: "دخول السوق والتمثيل المحلي",
        text: "تسهيل التعريف التجاري، والتمثيل المحلي للأعمال، والتواصل مع جهات الشراء المعنية في القطاعين العام والخاص.",
      },
      {
        title: "التواصل مع الموردين والموزعين",
        text: "ربط المصنعين الدوليين والموزعين المعتمدين ومقدمي الخدمات المتخصصة مع المشترين والشركاء التجاريين المحليين المحتملين.",
      },
      {
        title: "تنسيق المشتريات وسلسلة التوريد",
        text: "دعم عمليات التوريد، وإجراءات المشتريات، والتنسيق اللوجستي، والتواصل مع أصحاب المصلحة المعنيين.",
      },
      {
        title: "دعم العقود وتنفيذ المشاريع",
        text: "تنسيق التنفيذ المحلي، ومراقبة التسليم، وإشراك أصحاب المصلحة، ودعم ما بعد التسليم للمساعدة في تحويل الفرص إلى نجاحات ملموسة.",
      },
    ],
    deliveryTitle: "من فرصة السوق إلى الإنجاز الناجح",
    deliveryText:
      "يتجاوز نهجنا مجرد تقديم التعريفات المبدئية. نحن نوفر الفهم العميق للسوق المحلي والتنسيق والدعم التشغيلي الذي يساعد الشركات الدولية على التكيف مع بيئة رواندا التجارية، وبناء شراكات موثوقة، واغتنام الفرص في جميع أنحاء المنطقة.",
    tagline: "Lead Multichoice Ltd – شريكك المحلي. ميزتك الإقليمية.",
    contact: "ناقش فرصة تجارية",
  },
};

const supportIcons = [Search, Users, Handshake, Truck, ClipboardCheck];

export default function MarketAccessInvestment() {
  const { language } = useI18n();
  const copy = content[language] ?? content["en"];

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
            <article
              key={market.name}
              className="rounded border border-border bg-background p-6 md:p-7 shadow-xs hover:border-brand-primary/40 transition-colors"
            >
              <Globe2 className="text-brand-primary" size={23} aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold">{market.name}</h3>
              <p className="mt-5 font-display text-3xl font-bold text-brand-primary">
                {market.population}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{market.text}</p>
            </article>
          ))}
        </div>
        <aside className="mt-6 rounded border-l-4 border-brass bg-warm p-5 md:p-6 shadow-xs">
          <h3 className="font-semibold text-foreground">{copy.neighborTitle}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.neighborText}</p>
        </aside>
      </section>

      <PhotoScrollSection
        image="/site/meeting.jpg"
        visualKey="marketAccess.support"
        overlayClassName="bg-brand-white/88"
        className="bg-warm py-12 md:py-16"
      >
        <div className="container-site">
          <SectionHeading title={copy.supportTitle} intro={copy.supportIntro} />
          {copy.supportSubintro && (
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-brass">
              {copy.supportSubintro}
            </p>
          )}
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {copy.support.map((item, index) => {
              const Icon = supportIcons[index] ?? Search;
              return (
                <article
                  key={item.title}
                  className="rounded border border-border bg-background p-6 shadow-xs hover:border-brand-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="text-brand-primary" size={23} aria-hidden="true" />
                    <span className="font-display text-sm font-bold tabular-nums text-brass">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </PhotoScrollSection>

      <section className="container-site grid gap-6 py-12 md:grid-cols-[1fr_auto] md:items-center md:py-16">
        <div>
          <p className="eyebrow mb-3 text-brass font-semibold">{copy.tagline}</p>
          <h2 className="text-[28px] md:text-[38px] font-bold text-foreground">{copy.deliveryTitle}</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
            {copy.deliveryText}
          </p>
        </div>
        <ButtonLink href="/contact#business-enquiry" variant="primary" arrow className="shrink-0">
          {copy.contact}
        </ButtonLink>
      </section>
    </>
  );
}
