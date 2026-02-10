# Migration: Service Packages to Solutions

## Overview
Consolidated two separate systems (`service_packages` and `solutions`) into a single unified `solutions` table for managing pricing and packages.

## Changes Made

### 1. Database Migration
**File:** `scripts/16-drop-service-packages.sql`

Dropped the `service_packages` table and all related policies. This table was redundant as the `solutions` table already handles pricing for:
- Prescription (Nam Dược) - 199,000 VND
- Acupoint (Khai Huyệt) - 299,000 VND  
- Symbol Number (Tượng Số) - 99,000 VND

### 2. Admin UI Changes
- **Deleted:** `/app/admin/services/page.tsx` (managed service_packages)
- **Updated:** Admin sidebar now points to `/admin/solutions` for package management
- **Kept:** `/app/admin/solutions/page.tsx` (manages solutions pricing)

### 3. Payment Modal Fix
**File:** `components/payment-modal.tsx`

Fixed incorrect package mapping:
```typescript
// Before (WRONG)
1: Nam Dược (199k)
2: Khai Huyệt (299k)
3: Tượng Số (99k)

// After (CORRECT)
1: Khai Huyệt (299k)
2: Nam Dược (199k)
3: Tượng Số (99k)
```

### 4. Files with service_packages References (Need Manual Review)
These files may need updates if they reference service_packages:
- `app/admin/orders/page.tsx` - Order history with package info
- `app/admin/payments/page.tsx` - Payment tracking
- `app/api/orders/create/route.ts` - Order creation API
- `app/checkout/[slug]/page.tsx` - Checkout flow
- `app/dashboard/page.tsx` - User dashboard
- `app/pricing/page.tsx` - Pricing display page

## Running the Migration

```bash
# Connect to your database and run:
psql $DATABASE_URL -f scripts/16-drop-service-packages.sql
```

## Testing Checklist

- [ ] Admin solutions page loads correctly
- [ ] Can update solution pricing
- [ ] Payment modal shows correct prices for each package
- [ ] Gói Tượng Số charges 99,000 VND (not 299,000)
- [ ] Gói Nam Dược charges 199,000 VND
- [ ] Gói Khai Huyệt charges 299,000 VND
- [ ] Orders page still functions (may need to update joins)
- [ ] Pricing page displays correct info

## Rollback Plan

If needed, re-create service_packages table from:
```
scripts/002_create_services_and_formulas.sql
```

## Notes

The `solutions` table is the single source of truth for pricing. Each solution has an `unlock_cost` field that determines the payment amount.
