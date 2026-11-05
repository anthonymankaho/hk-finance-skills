---
name: hk-finance-skills
description: Hong Kong finance and accounting procedures for AI assistants, covering HKFRS/HKAS, tax, audit, close, reconciliation, and analysis.
metadata:
  version: 1.1.0
  jurisdiction: Hong Kong
---

# HK Finance Skills

This repository contains reusable finance procedures. Each topic lives in one root-level `<topic>/SKILL.md` file. Agents and applications should select the relevant file for a task rather than copy its accounting rules into prompts or company repositories.

## Skill inventory

| Area | Skills |
| --- | --- |
| Financial reporting | `financial-analysis`, `statement-preparation`, `budget-forecast`, `hkfrs-18`, `monthly-report-review` |
| Accounting operations | `journal-entry`, `automated-reconciliation`, `close-management`, `inventory-costing`, `fixed-asset-accounting`, `corporate-consolidation`, `revenue-recognition`, `lease-accounting`, `ecl-computation` |
| Hong Kong tax | `profits-tax`, `salaries-tax`, `deferred-tax`, `tax-planning` |
| Audit and risk | `internal-audit`, `audit-checklist`, `risk-assessment` |
| Cash and liquidity | `treasury-management`, `working-capital-analysis` |

## Source hierarchy

1. For Hong Kong accounting requirements, check current HKICPA pronouncements and guidance. For tax requirements, check current Inland Revenue Department material and the Inland Revenue Ordinance.
2. Use the relevant skill as a working procedure and summary. A skill is not the issued standard or a substitute for checking its effective date and scope.
3. Use the company's chart of accounts, policies, source records, and approval process for company-specific conclusions. Report missing facts and unresolved differences.

## Application integration

`runtime/skill-context.mjs` selects up to two root-level skills from a user's topic and supplies bounded excerpts to the local MPL, GPL, and EIC Qwen relays. The relays keep company context separate and preserve their own read-only and credential rules. The question never becomes a file path. No private company records belong in this public repository.

For HKFRS 18, use `hkfrs-18/SKILL.md` and its linked HKICPA source. Check whether the entity has elected early application before treating the standard as applicable to a period before 2027.

When a skill changes, review the change, update the local repository copy used by the relays, and restart the relay if `runtime/skill-context.mjs` changed. Skill text is read for each matching question.
