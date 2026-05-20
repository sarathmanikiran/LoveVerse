# Security Spec

## Data Invariants
1. Proposals cannot be created without a valid `creatorId` that matches the authenticated user.
2. Proposals are immutable regarding their `creatorId` and `createdAt`.
3. Proposals can be read by anyone (to allow the partner to view it via the shareable link without logging in).
4. Proposals can only be deleted or updated by their owner.

## The "Dirty Dozen" Payloads
1. Create proposal missing `creatorId` - DENY
2. Create proposal with mismatched `creatorId` vs auth UID - DENY
3. Create proposal with missing `partnerName` - DENY
4. Create proposal missing required schema fields - DENY
5. Update `creatorId` to someone else - DENY
6. Update `createdAt` after creation - DENY
7. Inject 1.5MB string into `partnerName` - DENY
8. Create proposal as unauthenticated user - DENY
9. Update proposal belonging to another user - DENY
10. Delete proposal belonging to another user - DENY
11. Add a non-schema "ghost" field during update - DENY
12. Read proposal (Unauthenticated) - ALLOW

## The Test Runner
See `firestore.rules.test.ts` for the implementation.
