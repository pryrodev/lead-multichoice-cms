"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowLeftIcon, ArrowRightIcon, Building2, Mail, Phone, UserRound, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stepper, StepperDescription, StepperIndicator, StepperItem, StepperSeparator, StepperTitle } from "@/components/ui/stepper";
import { usePortalLogin, usePortalRegister } from "@/features/client-portal/hooks";

export function PortalAuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<"buyer" | "supplier">("buyer");
  const [formError, setFormError] = useState<string | null>(null);
  const [formNotice, setFormNotice] = useState<string | null>(null);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [registration, setRegistration] = useState({ name: "", organization: "", phone: "", email: "", password: "" });
  const formRef = useRef<HTMLFormElement>(null);
  const login = usePortalLogin();
  const register = usePortalRegister();
  const pending = login.isPending || register.isPending;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFormNotice(null);
    const form = new FormData(event.currentTarget);
    const email = mode === "register" ? registration.email.trim() : String(form.get("email") ?? "").trim();
    const password = mode === "register" ? registration.password : String(form.get("password") ?? "");
    try {
      const { user } = mode === "login"
        ? await login.mutateAsync({ email, password })
        : await register.mutateAsync({
            email,
            password,
            name: registration.name.trim(),
            organization: registration.organization.trim(),
            phone: registration.phone.trim(),
            role,
          });
      toast.success(mode === "login" ? "Signed in" : "Account created");
      router.replace(user.role === "admin" ? "/admin" : user.role === "staff" ? "/admin/client-requests" : "/portal");
    } catch (error) {
      setFormError(mode === "login"
        ? "We couldn’t sign you in. Check your email and password, then try again."
        : error instanceof Error ? error.message : "We couldn’t create your account. Please try again.");
    }
  }

  return (
    <section className="portal-auth-view photo-parallax relative isolate flex h-full min-h-0 items-center overflow-hidden bg-brand-primary py-3 md:py-6">
      <div className="photo-parallax-window" aria-hidden="true">
        <Image src="/site/hero-port.jpg" alt="" fill priority sizes="100vw" className="photo-parallax-image" />
      </div>
      <div className="photo-parallax-shade absolute inset-0 -z-10" aria-hidden="true" />

      <div className="container-site relative z-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <section className="hidden text-background lg:block" aria-labelledby="portal-heading">
          <p className="eyebrow mb-4 text-brass-light">Client portal</p>
          <h1 id="portal-heading" className="font-display text-4xl font-bold leading-tight text-background xl:text-[44px]">
            Your partnership with us, in one place.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-background/80">
            Sign in to manage your company details and follow request updates, or track a request with its reference.
          </p>
          <Button asChild variant="outline" className="mt-6 h-12 w-full justify-center rounded-sm border-brand-gold bg-brand-gold text-base font-semibold text-charcoal hover:bg-brand-gold/90 hover:text-charcoal">
            <Link href="/track">Track a request <ArrowRightIcon data-icon="inline-end" /></Link>
          </Button>
        </section>

        <Card className="mx-auto w-full max-w-md gap-0 rounded-[4px] border-0 bg-background p-7 md:p-9">
          <CardHeader className="gap-0 p-0">
            <CardTitle className="font-display text-[28px] leading-tight text-primary">
              {mode === "login" ? "Welcome back" : registrationStep === 1 ? "Create your account" : "Login details"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-6">
            {mode === "register" && <Stepper value={registrationStep} className="mb-5 items-start">
              <StepperItem step={1} className="flex-1 items-start">
                <div className="flex flex-col items-center gap-1 text-center"><StepperIndicator /><StepperTitle className="text-xs">Your details</StepperTitle><StepperDescription className="hidden sm:block">About you</StepperDescription></div>
                <StepperSeparator className="mt-4" />
              </StepperItem>
              <StepperItem step={2} className="items-start">
                <div className="flex flex-col items-center gap-1 text-center"><StepperIndicator /><StepperTitle className="text-xs">Sign-in</StepperTitle><StepperDescription className="hidden sm:block">Email and password</StepperDescription></div>
              </StepperItem>
            </Stepper>}
            <form ref={formRef} onSubmit={submit} onChange={() => { setFormError(null); setFormNotice(null); }} className="flex flex-col gap-4">
              {mode === "register" && registrationStep === 1 && <>
                <div className="flex flex-col gap-2"><Label htmlFor="name">Full name</Label><div className="relative"><UserRound aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="name" name="name" autoComplete="name" required minLength={2} maxLength={160} placeholder="Your name" value={registration.name} onChange={(event) => setRegistration((current) => ({ ...current, name: event.target.value }))} className="pl-10" /></div></div>
                <div className="flex flex-col gap-2"><Label htmlFor="organization">Company or organization</Label><div className="relative"><Building2 aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="organization" name="organization" autoComplete="organization" required minLength={2} maxLength={200} placeholder="Organization name" value={registration.organization} onChange={(event) => setRegistration((current) => ({ ...current, organization: event.target.value }))} className="pl-10" /></div></div>
                <div className="flex flex-col gap-2"><Label htmlFor="phone">Phone number <span className="font-normal text-muted-foreground">(optional)</span></Label><div className="relative"><Phone aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="phone" name="phone" autoComplete="tel" maxLength={40} placeholder="+250 788 312 338" value={registration.phone} onChange={(event) => setRegistration((current) => ({ ...current, phone: event.target.value }))} className="pl-10" /></div></div>
                <div className="flex flex-col gap-2"><Label htmlFor="role">I am a</Label><Select value={role} onValueChange={(value: "buyer" | "supplier") => setRole(value)}><SelectTrigger id="role"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="buyer">Buyer or purchasing organization</SelectItem><SelectItem value="supplier">Manufacturer or supplier</SelectItem></SelectContent></Select></div>
                <Button type="button" className="mt-1 h-11 w-full rounded-[4px] font-semibold" onClick={() => {
                  if (formRef.current?.reportValidity()) {
                    setFormError(null);
                    setRegistrationStep(2);
                  }
                }}>Continue <ArrowRightIcon data-icon="inline-end" /></Button>
              </>}
              {(mode === "login" || registrationStep === 2) && <>
                <div className="flex flex-col gap-2"><Label htmlFor="email">Email</Label><div className={`relative ${formError ? "animate-login-error-shake" : ""}`}><Mail aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input key={mode} id="email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="name@company.com" value={mode === "register" ? registration.email : undefined} onChange={mode === "register" ? (event) => setRegistration((current) => ({ ...current, email: event.target.value })) : undefined} aria-invalid={Boolean(formError)} aria-describedby={formError ? "portal-login-error" : undefined} className={`h-12 rounded-[4px] pl-10 focus-visible:ring-primary ${formError ? "border-destructive focus-visible:ring-destructive" : "border-primary/15"}`} /></div></div>
                <div className="flex flex-col gap-2"><Label htmlFor="password">Password</Label><div className={`relative ${formError ? "animate-login-error-shake" : ""}`}><LockKeyhole aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input key={mode} id="password" name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={mode === "login" ? 1 : 10} maxLength={128} placeholder={mode === "login" ? "Enter your password" : "At least 10 characters"} value={mode === "register" ? registration.password : undefined} onChange={mode === "register" ? (event) => setRegistration((current) => ({ ...current, password: event.target.value })) : undefined} aria-invalid={Boolean(formError)} aria-describedby={formError ? "portal-login-error" : undefined} className={`h-12 rounded-[4px] pl-10 focus-visible:ring-primary ${formError ? "border-destructive focus-visible:ring-destructive" : "border-primary/15"}`} /></div>{mode === "register" && <p className="text-xs text-muted-foreground">Use at least 10 characters.</p>}</div>
                <div className="flex gap-2">
                  {mode === "register" && <Button type="button" variant="outline" className="h-11 flex-1 rounded-[4px]" onClick={() => { setFormError(null); setRegistrationStep(1); }}><ArrowLeftIcon data-icon="inline-start" />Back</Button>}
                  <Button type="submit" className="h-11 flex-1 rounded-[4px] font-semibold" disabled={pending}>{pending ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</Button>
                </div>
              </>}
            </form>
            {formError && <p id="portal-login-error" role="alert" className="mt-3 flex items-start gap-2 rounded-md border border-destructive/25 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"><AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />{formError}</p>}
            {formNotice && <p role="status" className="mt-3 text-center text-sm text-muted-foreground">{formNotice}</p>}
            {mode === "login" && <>
              <div className="mt-5 text-center">
                <Button type="button" variant="link" className="h-auto p-0 font-semibold text-primary" onClick={() => { setFormError(null); setFormNotice("Password reset is not available yet. Please contact our team for help."); }}>Forgot password?</Button>
              </div>
            </>}
            <div className="mt-3 space-y-3 text-center text-sm text-muted-foreground">
              <p>{mode === "login" ? "New here?" : "Already have an account?"}{" "}<button type="button" className="font-semibold text-primary hover:underline" onClick={() => { setMode(mode === "login" ? "register" : "login"); setRegistrationStep(1); setFormError(null); setFormNotice(null); }}>{mode === "login" ? "Create an account" : "Sign in"}</button></p>
              {mode === "login" && <Link href="/track" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline lg:hidden">Track a request <ArrowRightIcon className="size-3.5" aria-hidden="true" /></Link>}
              <Link href="/" className="inline-flex items-center gap-1 hover:text-primary"><ArrowLeft className="size-3.5" aria-hidden="true" />Back to website</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
