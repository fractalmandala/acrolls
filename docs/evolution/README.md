# Product evolution log

This directory tracks **how conversations and working sessions evolve the Acrolls product and its
specs**. It is the connective tissue between an informal discussion and the formal artifacts the
repo already keeps:

| Artifact | What it holds | Where |
| --- | --- | --- |
| Session ledger | Chronological record of each working session: what was discussed, decided, and shipped | [`sessions.md`](./sessions.md) |
| Proposals board | Live status of every idea/decision, from raw proposal to shipped | [`proposals.md`](./proposals.md) |
| ADRs | Accepted architectural decisions, one per file | [`../adr/`](../adr/) |
| PRODUCT.md | Numbered product behaviors (the contract) | [`../../PRODUCT.md`](../../PRODUCT.md) |
| Specs | Approved implementation specs | [`../*-spec.md`](../) |

## How it flows

```text
conversation / session
        │
        ▼
  sessions.md entry ──────────────► proposals.md row (status = proposed)
   (what happened)                          │
                                            │ decision made
                                            ▼
                                   status = accepted / building
                                            │
                          ┌─────────────────┼──────────────────┐
                          ▼                 ▼                  ▼
                   ADR (architectural)  PRODUCT.md behavior   spec / docs update
                          │                 │                  │
                          └─────────────────┴──────────────────┘
                                            │ implemented + verified
                                            ▼
                                     status = shipped
```

A proposal does **not** need every downstream artifact — a small CSS token might only touch a
spec and a behavior; an architectural change earns an ADR. The board's `Result` column records
which artifacts a decision actually produced.

## Statuses

| Status | Meaning |
| --- | --- |
| `proposed` | Raised in a session; not yet committed to build |
| `clarified` | A question was answered; no product change needed |
| `accepted` | Decided to build; not yet implemented |
| `building` | Implementation in progress |
| `shipped` | Implemented and verified in the repo |
| `deferred` | Parked with a reason |
| `dropped` | Decided against |

## Workflow (per session)

1. Add a dated entry to [`sessions.md`](./sessions.md): focus, decisions, artifacts touched, follow-ups.
2. For each decision, add or update its row in [`proposals.md`](./proposals.md).
3. When a decision is architectural, write an ADR from [`../adr/template.md`](../adr/template.md)
   and link it from the board.
4. When it changes the product contract, add/adjust a numbered behavior in `PRODUCT.md` and note
   the behavior number on the board.
5. When implemented, flip the board status to `shipped` and record the verifying evidence
   (files, checks) in the session entry.

Keep entries terse and factual. Superseded decisions stay in place — the history is the point.
