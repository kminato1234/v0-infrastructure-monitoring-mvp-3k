# Infrastructure Monitoring MVP

A minimal, working MVP that shows an infrastructure monitoring dashboard and event drill-downs.

## Live
- https://v0-infrastructure-monitoring-mvp-ig.vercel.app/

## Implemented

- **Overview dashboard with KPIs (24h):** counters for **Anomalies**, **Faults**, and **Anchored On-chain**.  
- **Virtual City Map section:** region/asset names and a note to “click markers to filter events.”  
- **Recent Events list:** clickable cards from Overview jump to each **event detail** page.  
- **Event detail pages:** show asset name, event type (anomaly/fault), severity, time range/duration, asset type, description, and **Recent Measurements** (timestamped metrics).  
- **Basic navigation & build info:** header links (**Overview / Events**) and a **build timestamp**.
