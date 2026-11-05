<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- This is a Next.js App Router project. Add routes under `app/` and shared UI under `src/`.
- Data access goes through `src/lib/api/service.ts` and React Query hooks in `src/lib/api/hooks.ts`; pages and components never fetch directly.
- The client app shell and query provider live in `src/app-providers.tsx`; page headers and content layout use `src/components/layout/page.tsx`.
- Keep shadcn/ui primitives in `src/components/ui/`. Use Sonner for notifications and React Query mutations for changes.
