"use client";

import { MediaCoverflow } from "@/components/site/MediaCoverflow";
import { PageHero } from "@/components/site/ui";
import { useI18n } from "@/i18n/I18nProvider";

const pageCopy = {
  en: {
    eyebrow: "Media",
    title: "Stories from the work behind trade.",
    intro: "Explore the markets, people and supply journeys connected through our work in Rwanda and the region.",
    alt: "Freight containers at a port",
  },
  rw: {
    eyebrow: "Amashusho",
    title: "Inkuru z'ibikorwa by'ubucuruzi.",
    intro: "Menya amasoko, abantu n'ingendo z'ibicuruzwa bihuzwa n'ibikorwa byacu mu Rwanda no mu karere.",
    alt: "Ibikoresho bipakiye ku cyambu",
  },
  fr: {
    eyebrow: "Médias",
    title: "Des récits au cœur des échanges.",
    intro: "Découvrez les marchés, les acteurs et les parcours d'approvisionnement liés à nos activités au Rwanda et dans la région.",
    alt: "Conteneurs de marchandises dans un port",
  },
  sw: {
    eyebrow: "Media",
    title: "Hadithi za kazi inayowezesha biashara.",
    intro: "Gundua masoko, watu na safari za bidhaa zinazounganishwa kupitia kazi yetu nchini Rwanda na eneo jirani.",
    alt: "Makontena ya mizigo bandarini",
  },
} as const;

export default function MediaPage() {
  const { language } = useI18n();
  const copy = pageCopy[language];

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={<span className="block max-w-4xl text-balance">{copy.title}</span>}
        intro={copy.intro}
        introClassName="max-w-3xl"
        image="/site/hero-port.jpg"
        alt={copy.alt}
      />
      <MediaCoverflow />
    </>
  );
}
