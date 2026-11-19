"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Compass,
  Factory,
  FileCheck2,
  FileText,
  Handshake,
  ShieldCheck,
  Truck,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { ProcurementResource } from "@/lib/cms/procurement-resources";
import { procurementModels } from "@/content/site";
import { ButtonLink, SectionHeading } from "@/components/site/ui";
import { ProcurementResourceCarousel } from "@/components/site/ProcurementResourceCarousel";
import { useI18n } from "@/i18n/I18nProvider";
import { useSiteVisuals } from "@/components/site/SiteVisualsProvider";

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
    processTitle: "Guide to the Procurement Sourcing Process",
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
        text: "Map target sectors, buyers, and product requirements.",
      },
      {
        title: "Confirm product approvals and compliance",
        text: "Confirm applicable standards, registrations, and import approvals.",
      },
      {
        title: "Establish local representation",
        text: "Build local relationships for buyer engagement and follow-up.",
      },
      {
        title: "Prepare for procurement and tendering",
        text: "Check eligibility, required documents, bid securities, and key terms.",
      },
      {
        title: "Plan delivery and ongoing support",
        text: "Plan freight, customs, delivery, and after-sales support.",
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
    processTitle: "Guide du processus d'approvisionnement",
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
    processTitle: "Mwongozo wa mchakato wa ununuzi",
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
    processTitle: "采购流程指南",
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
    processTitle: "Leitfaden für den Beschaffungsprozess",
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
    processTitle: "دليل عملية التوريد والمشتريات",
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

const defaultSoundLabel = { unmute: "Unmute audio", mute: "Mute audio" };
const audioLabels: Record<string, { unmute: string; mute: string }> = {
  en: defaultSoundLabel,
  fr: { unmute: "Activer le son", mute: "Couper le son" },
  sw: { unmute: "Washa sauti", mute: "Zima sauti" },
  zh: { unmute: "开启声音", mute: "静音" },
  de: { unmute: "Ton einschalten", mute: "Ton ausschalten" },
  ar: { unmute: "تشغيل الصوت", mute: "كتم الصوت" },
};

export default function Procurement({ resources }: { resources: ProcurementResource[] }) {
  const { language, tc } = useI18n();
  const visuals = useSiteVisuals();
  const copy = content[language] ?? content.en;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleAudio = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const soundLabel = audioLabels[language] ?? defaultSoundLabel;
  const heroVideo = visuals["procurement.heroVideo"];
  const heroImage = visuals["procurement.hero"];

  return (
    <div className="w-full">
      <section className="group relative isolate flex min-h-[520px] items-center overflow-hidden border-b border-border bg-brand-primary text-brand-white md:min-h-[60vh] lg:min-h-[65vh]">
        {/* Background video on one side */}
        <div className="pointer-events-none absolute inset-y-0 w-full overflow-hidden ltr:right-0 rtl:left-0 lg:w-1/2">
          <Image src={heroImage} alt="" fill unoptimized sizes="50vw" className="object-cover" />
          {heroVideo && (
            <video
              ref={videoRef}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
              poster={heroImage}
              className="absolute inset-0 size-full object-cover"
            >
              <source src={heroVideo} />
            </video>
          )}
          {/* Subtle gradient blends — just enough to blend into the left */}
          <div className="absolute inset-0 hidden bg-gradient-to-r from-brand-primary via-brand-primary/5 to-transparent ltr:block rtl:hidden" />
          <div className="absolute inset-0 hidden bg-gradient-to-l from-brand-primary via-brand-primary/5 to-transparent rtl:block ltr:hidden" />
          <div className="absolute inset-0 bg-brand-primary/35 lg:hidden" />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-brand-primary/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand-primary/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="container-site relative z-10 py-16 md:py-24">
          <div className="max-w-xl">
            <p className="eyebrow mb-4 flex items-center gap-3 text-brand-gold">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              {copy.eyebrow}
            </p>
            <h1 className="font-display text-[clamp(1.75rem,2.8vw,2.5rem)] font-bold leading-tight tracking-tight text-brand-white">
              {copy.heroTitle}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-brand-white/85 sm:text-lg">
              {copy.heroIntro}
            </p>
          </div>
        </div>

        {/* Audio toggle — bottom-right, visible on hover */}
        {heroVideo && <button
          type="button"
          onClick={toggleAudio}
          className="pointer-events-auto absolute bottom-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/20 bg-brand-primary/75 px-4 py-2 text-xs font-semibold text-brand-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-brand-primary group-hover:opacity-100 ltr:right-4 rtl:left-4"
          aria-label={isMuted ? soundLabel.unmute : soundLabel.mute}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-brand-gold" />}
          <span>{isMuted ? soundLabel.unmute : soundLabel.mute}</span>
        </button>}
      </section>

      <Tabs defaultValue="buyers" className="w-full">
        <nav aria-label="Page sections" className="sticky top-[84px] z-30 border-b border-border bg-background/95 backdrop-blur">
          <TabsList className="container-site flex h-auto w-full flex-nowrap items-center justify-center gap-2 overflow-x-auto bg-transparent py-2">
            <TabsTrigger value="buyers" className="shrink-0 gap-1.5 whitespace-nowrap rounded-md px-3 py-2 sm:px-4">
              <Users size={14} aria-hidden="true" />
              <span>{copy.tabsBuyer}</span>
            </TabsTrigger>
            <TabsTrigger value="suppliers" className="shrink-0 gap-1.5 whitespace-nowrap rounded-md px-3 py-2 sm:px-4">
              <Factory size={14} aria-hidden="true" />
              <span>{copy.tabsSupplier}</span>
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="shrink-0 gap-1.5 whitespace-nowrap rounded-md px-3 py-2 sm:px-4">
              <Compass size={14} aria-hidden="true" />
              <span>{copy.tabsOpportunities}</span>
            </TabsTrigger>
          </TabsList>
        </nav>

      <TabsContent value="buyers" className="mt-0">
      <section id="purchasing-entities" className="container-site flex flex-col gap-5 py-6 md:gap-8 md:py-10">
        <div>
          <SectionHeading
            eyebrow={copy.principlesEyebrow}
            title={copy.principlesTitle}
            className="max-w-none"
            titleClassName="text-[clamp(1.35rem,2.5vw,2rem)]"
          />
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{copy.principlesIntro}</p>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3">
            {copy.principles.map((principle) => (
              <article key={principle.title} className="min-w-0 border-l-2 border-brand-gold bg-surface/70 px-2 py-2 sm:px-3 sm:py-2.5">
                <h3 className="text-xs font-semibold leading-tight text-foreground sm:text-sm">{principle.title}</h3>
                <p className="mt-1 hidden line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:block sm:text-sm">{principle.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">{tc("Procurement models")}</h3>
          <div className="mt-2 grid grid-cols-2 gap-2 xl:grid-cols-4">
            {procurementModels.map((model) => (
              <article key={model.id} className="min-w-0 border-t-2 border-brand-primary/50 bg-background px-3 py-2.5">
                <h4 className="font-display text-sm font-semibold text-foreground sm:text-base">{tc(model.name)}</h4>
                <p className="mt-1 hidden line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:block sm:text-sm">{tc(model.description)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      </TabsContent>

      {/* Section 2: For Manufacturers & Licensed Distributors */}
      <TabsContent value="suppliers" className="mt-0">
        <section id="manufacturers-distributors" className="container-site flex flex-col gap-4 py-6 md:gap-6 md:py-10">
          <SectionHeading
            eyebrow={copy.supplierEyebrow}
            title={copy.supplierTitle}
            titleClassName="text-[clamp(1.35rem,2.5vw,2rem)]"
          />

          <div className="flex items-center justify-between gap-4">
            <p className="hidden max-w-3xl text-sm text-muted-foreground lg:block">{copy.supplierIntro}</p>
            <ButtonLink href="/contact" variant="primary" className="hidden shrink-0 sm:inline-flex" arrow>
              {copy.ctaButton}
            </ButtonLink>
          </div>
          <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {copy.considerations.map((item, idx) => {
              const icons = [Compass, FileCheck2, Handshake, FileText, Truck];
              const Icon = icons[idx] ?? ShieldCheck;
              return (
                <li key={item.title} className="flex min-w-0 items-start gap-3 border-l-2 border-brand-gold bg-surface/70 p-2.5 lg:min-h-40 lg:flex-col lg:p-3">
                  <span className="flex size-8 shrink-0 items-center justify-center bg-brand-primary text-brand-white">
                    <Icon size={15} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold tabular-nums text-brand-primary">0{idx + 1}</p>
                    <h3 className="mt-0.5 text-sm font-semibold leading-snug text-foreground">{item.title}</h3>
                    <p className="mt-1 hidden line-clamp-3 text-xs leading-relaxed text-muted-foreground lg:block">{item.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </TabsContent>

      {/* Section 3: Selected Opportunities & Portals */}
      <TabsContent value="opportunities" className="mt-0">
      <section id="browse-opportunities" className="container-site flex flex-col gap-4 py-6 md:gap-6 md:py-10">
        <SectionHeading
          eyebrow={copy.opportunitiesEyebrow}
          title={copy.opportunitiesTitle}
          titleClassName="text-[clamp(1.35rem,2.5vw,2rem)]"
        />
        <div>
          <ProcurementResourceCarousel resources={resources} compact />
        </div>

        <aside className="text-xs text-muted-foreground">
          <p>{copy.aboutText2}</p>
        </aside>
      </section>
      </TabsContent>
      </Tabs>
    </div>
  );
}
