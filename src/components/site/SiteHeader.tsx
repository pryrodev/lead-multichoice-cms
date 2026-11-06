"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, Mail, MapPin, Menu, MessageCircle, Phone, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { company, headerNavigation, nav } from "@/content/site";
import { Logo } from "./Logo";
import { ButtonLink } from "./ui";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { LanguageSelect } from "./LanguageSelect";
import { useI18n } from "@/i18n/I18nProvider";
import type { MessageKey } from "@/i18n/messages";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

const navKeys: Record<(typeof nav)[number]["to"], MessageKey> = {
  "/": "nav.home",
  "/about": "nav.about",
  "/market-access-investment": "nav.marketAccessInvestment",
  "/services": "nav.services",
  "/industries": "nav.industries",
  "/why-us": "nav.whyUs",
  "/leadership": "nav.leadership",
  "/procurement-opportunities": "nav.procurement",
  "/blog": "nav.blog",
  "/contact": "nav.contact",
};
const getNavItem = (to: (typeof nav)[number]["to"]) => nav.find((item) => item.to === to)!;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();

  const cancelHoverClose = () => {
    if (hoverCloseTimer.current !== null) {
      clearTimeout(hoverCloseTimer.current);
      hoverCloseTimer.current = null;
    }
  };
  const openDropdownOnHover = (label: string) => {
    cancelHoverClose();
    setOpenDropdown(label);
  };
  const closeDropdownAfterHover = (label: string) => {
    cancelHoverClose();
    hoverCloseTimer.current = setTimeout(() => {
      setOpenDropdown((current) => (current === label ? null : current));
      hoverCloseTimer.current = null;
    }, 180);
  };

  useEffect(() => () => cancelHoverClose(), []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1280 && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = "";
    };
  }, [open]);


  return (
    <>
      <div className="sticky top-0 z-[60] bg-brand-primary text-brand-white">
        <div className="container-site flex min-h-7 flex-wrap items-center justify-between gap-x-5 gap-y-1 py-1 text-[11px] font-medium tracking-wide sm:text-xs">
          <address className="flex items-center gap-2 not-italic">
            <MapPin size={13} strokeWidth={2.2} aria-hidden="true" />
            <span>{company.location}</span>
          </address>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {company.email && (
              <a
                href={`mailto:${company.email}`}
                className="inline-flex items-center gap-1.5 hover:underline"
              >
                <Mail size={13} aria-hidden="true" />
                {company.email}
              </a>
            )}
            <a
              href={company.whatsapp}
              target="_blank"
              rel="noreferrer"
              aria-label="Chat with us on WhatsApp"
              title="WhatsApp"
              className="inline-flex items-center hover:text-brand-white/80"
            >
              <Image src={"/whatsapp.svg"} width={14} height={14} alt="WhatsApp" />
            </a>
            <a
              href={`tel:${company.phoneTel}`}
              className="inline-flex items-center gap-1.5 hover:underline"
            >
              <Phone size={13} aria-hidden="true" />
              {company.phoneDisplay}
            </a>
            <span className="h-3.5 w-px bg-brand-white/30" aria-hidden="true" />
            <LanguageSelect compact />
          </div>
        </div>
      </div>
      <header
        id="top"
        className={`sticky top-7 z-50 transition-all duration-300 ${scrolled ? "border-b border-border bg-background/85 shadow-sm backdrop-blur-md" : "border-b border-transparent bg-background"}`}
      >
        <div className="container-site flex h-16 items-center justify-between gap-6">
          <Logo />
          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-2">
              {headerNavigation.map((item) => {
                if (item.type === "link") {
                  const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
                  return (
                    <li key={item.to} className="relative">
                      <Link href={item.to} aria-current={active ? "page" : undefined} className={`site-nav-link block whitespace-nowrap px-2 py-3 text-[14px] font-medium text-charcoal/80 ${active ? "text-brand-primary" : ""}`}>
                        {t(navKeys[item.to])}
                      </Link>
                      {active && (
                        <motion.span
                          layoutId="site-nav-active-indicator"
                          aria-hidden="true"
                          className="pointer-events-none absolute bottom-[0.35rem] left-2 right-2 h-0.5 rounded-full bg-brand-primary"
                          transition={reduceMotion ? { duration: 0.01 } : { type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                    </li>
                  );
                }

                const active = item.links.some((to) => pathname.startsWith(to));
                return (
                  <li
                    key={item.label}
                    onPointerEnter={(event) => event.pointerType === "mouse" && openDropdownOnHover(item.label)}
                    onPointerLeave={(event) => event.pointerType === "mouse" && closeDropdownAfterHover(item.label)}
                  >
                    <DropdownMenu
                      modal={false}
                      open={openDropdown === item.label}
                      onOpenChange={(nextOpen) => {
                        cancelHoverClose();
                        setOpenDropdown(nextOpen ? item.label : null);
                      }}
                    >
                      <DropdownMenuTrigger asChild>
                        <button type="button" aria-current={active ? "page" : undefined} className={`relative inline-flex h-10 items-center gap-1 whitespace-nowrap rounded-md px-2 text-[14px] font-medium text-charcoal/80 transition-colors hover:bg-surface hover:text-brand-primary focus-visible:outline-none data-[state=open]:bg-surface data-[state=open]:text-brand-primary [&[data-state=open]>svg]:rotate-180 ${active ? "text-brand-primary" : ""}`}>
                          {t(item.label)}
                          <ChevronDown className="size-3.5 transition-transform" aria-hidden="true" />
                          {active && <motion.span layoutId="site-nav-active-indicator" aria-hidden="true" className="pointer-events-none absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-brand-primary" />}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        side="bottom"
                        sideOffset={8}
                        collisionPadding={12}
                        onPointerEnter={cancelHoverClose}
                        onPointerLeave={() => closeDropdownAfterHover(item.label)}
                        className="w-64 max-w-[calc(100vw-1.5rem)]"
                      >
                        {item.links.map((to) => {
                          const child = getNavItem(to);
                          const childActive = pathname === to || pathname.startsWith(`${to}/`);
                          return (
                            <DropdownMenuItem key={to} asChild>
                              <Link href={to} aria-current={childActive ? "page" : undefined} className={`cursor-pointer px-3 py-2.5 ${childActive ? "bg-surface font-semibold text-brand-primary" : "text-charcoal"}`}>
                                {t(navKeys[child.to])}
                              </Link>
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <RainbowButton asChild className="header-join-button hidden sm:inline-flex">
              <Link href="/portal/login">
                {t("header.getStarted")}
              </Link>
            </RainbowButton>
            <ButtonLink
              href="/contact"
              className="cta-attention hidden whitespace-nowrap sm:inline-flex hover:brightness-105 hover:shadow-lg"
              arrow
            >
              {t("header.letsTalk")}
            </ButtonLink>
            <button
              type="button"
              className="relative z-[70] inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-brand-primary xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? t("header.closeMenu") : t("header.openMenu")}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>
      <MobilePortal>
        <AnimatePresence>
          {open && (
            <MobileNavigation
              onClose={() => setOpen(false)}
              pathname={pathname}
              signedIn={false}
              t={t}
            />
          )}
        </AnimatePresence>
      </MobilePortal>
    </>
  );
}

function MobilePortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
}

function MobileNavigation({
  onClose,
  pathname,
  signedIn,
  t,
}: {
  onClose: () => void;
  pathname: string;
  signedIn: boolean;
  t: (key: MessageKey) => string;
}) {
  return (
    <motion.div
      id="mobile-nav"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] overflow-y-auto bg-brand-primary text-background xl:hidden"
    >
      <div className="container-site flex h-[78px] items-center justify-between">
        <span className="font-display text-sm font-semibold tracking-[0.2em] text-brass-light">
          {t("header.menu")}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("header.closeMenu")}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-background/20 text-background"
        >
          <X size={20} />
        </button>
      </div>
      <nav aria-label="Mobile" className="container-site pb-10 pt-4">
        <Accordion type="single" collapsible className="border-t border-background/15">
          {headerNavigation.map((item, i) => {
            if (item.type === "link") {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.35 }}
                  className="border-b border-background/15"
                >
                  <Link
                    href={item.to}
                    onClick={onClose}
                    className={`group flex items-center justify-between py-4 font-display text-2xl font-semibold ${active ? "text-brass-light" : "text-background"}`}
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="text-xs tabular-nums text-background/50">0{i + 1}</span>
                      {t(navKeys[item.to])}
                    </span>
                    <ArrowUpRight size={20} className="opacity-50 transition-transform group-hover:translate-x-1" aria-hidden />
                  </Link>
                </motion.div>
              );
            }

            const active = item.links.some((to) => pathname.startsWith(to));
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.04, duration: 0.35 }}
              >
                <AccordionItem value={item.label} className="border-background/15">
                  <AccordionTrigger className={`py-4 font-display text-2xl font-semibold hover:no-underline [&>svg]:text-background/60 ${active ? "text-brass-light" : "text-background"}`}>
                    <span className="flex items-baseline gap-4">
                      <span className="text-xs tabular-nums text-background/50">0{i + 1}</span>
                      {t(item.label)}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-3 pl-9">
                    <ul className="space-y-1">
                      {item.links.map((to) => {
                        const child = getNavItem(to);
                        const childActive = pathname === to || pathname.startsWith(`${to}/`);
                        return (
                          <li key={to}>
                            <Link
                              href={to}
                              onClick={onClose}
                              aria-current={childActive ? "page" : undefined}
                              className={`block rounded py-2 text-base transition-colors hover:text-brass-light ${childActive ? "font-semibold text-brass-light" : "text-background/80"}`}
                            >
                              {t(navKeys[child.to])}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            );
          })}
        </Accordion>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 space-y-4"
        >
          <ButtonLink href="/contact" variant="light" className="w-full" onClick={onClose}>
            {t("header.discussOpportunity")}
          </ButtonLink>
          <ButtonLink
            href="/portal/login"
            variant="ghostLight"
            className="w-full"
            onClick={onClose}
          >
            {t("header.getStarted")}
          </ButtonLink>
          <a
            href={`tel:${company.phoneTel}`}
            className="block text-center text-sm text-background/70"
          >
            {company.phoneDisplay} · {company.location}
          </a>
        </motion.div>
      </nav>
    </motion.div>
  );
}
