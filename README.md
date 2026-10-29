# TradeFlow Operations Hub

Build the first version of the LEAD MULTICHOICE Ltd Business Operations and Trade Facilitation System dashboard based on the attached product requirements and dashboard references.

Use the supported React stack, shadcn/ui library, Sonner for notifications, and React Query (TanStack Query). No raw fetch calls inside components or pages; encapsulate all data fetching and mutations in dedicated API/service modules and custom React Query hooks.

Implement:
1. Executive KPI metric ribbon (Active tenders, pipeline value in USD/RWF, pending clearances, items needing management attention).
2. 5-Stage Trade Facilitation & Opportunity pipeline (Connect/Identification, Supplier-Buyer Introductions, Tender Bidding, Procurement/Logistics, Delivery & After-sales).
3. Active engagements view with folder/card tabs showing responsible internal owner, milestones, and approaching deadlines.
4. Procurement & tender tracking data table with filtering, status badges, links to external official portals, and detail inspection.
5. Logistics tracking panel for regional corridor shipments and customs clearance milestones.
6. Dated activity log and audit feed for blockers, updates, and next actions.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9953419c-24f2-4594-80d6-92d4bc7eabf3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
