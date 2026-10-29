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

- Data access goes through `src/lib/api/service.ts` (currently in-memory sample data) and React Query hooks in `src/lib/api/hooks.ts`; components never fetch directly, so the backend can be swapped in one place.
- App shell (sidebar + profile) lives in `src/routes/__root.tsx`; each page wraps content in `PageShell` for the header and sidebar toggle.
