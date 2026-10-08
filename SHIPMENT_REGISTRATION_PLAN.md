# Shipment Registration & Item Management System

## 🎯 Overview
Complete shipment registration system for customers to register items for shipping, with admin tracking and database optimization.

---

## 📦 Shipment Registration (Customer-Facing)

### Customer Registration Form - `/ship-now`
Users register items to ship with the following details:

**Sender Information**
- Full Name (required)
- Email (required, validated)
- Phone (required, formatted)
- Complete Address (street, city, state, country, postal code)

**Recipient Information**
- Full Name (required)
- Email (optional)
- Phone (required)
- Complete Address

**Item Details**
- Description (required, min 10 chars)
- Category (Documents, Electronics, Clothing, Food, etc.)
- Declared Value (required, max $1,000,000)
- Weight (kg/lbs, max 1000kg)
- Dimensions (Length × Width × Height)
- Quantity (integer)
- Fragile? (boolean checkbox)
- Special Handling Instructions (text)

**Shipping Options**
- Shipping Type (Express, Standard, Economy)
- Insurance Required (boolean)
- Signature Required (boolean)
- Preferred Shipping Date
- Delivery Preference

**Terms & Conditions**
- Accept Terms (required checkbox)
- Accept Liability (required checkbox)
- Newsletter Opt-in (optional)

---

## 💾 Database Schema

### Shipments Table
```sql
CREATE TABLE shipments (
  id UUID PRIMARY KEY,
  trackingNumber VARCHAR(50) UNIQUE NOT NULL,
  status ENUM('registered', 'confirmed', 'picked_up', 'in_transit', 'delivered', 'cancelled'),
  
  -- Sender
  senderName VARCHAR(255),
  senderEmail VARCHAR(255),
  senderPhone VARCHAR(20),
  senderAddress TEXT,
  senderCity VARCHAR(100),
  senderCountry VARCHAR(100),
  senderPostalCode VARCHAR(20),
  
  -- Recipient
  recipientName VARCHAR(255),
  recipientPhone VARCHAR(20),
  recipientAddress TEXT,
  recipientCity VARCHAR(100),
  recipientCountry VARCHAR(100),
  recipientPostalCode VARCHAR(20),
  
  -- Item Info
  itemDescription TEXT,
  itemCategory VARCHAR(100),
  itemValue DECIMAL(10, 2),
  itemWeight DECIMAL(8, 2),
  quantity INTEGER,
  isFragile BOOLEAN DEFAULT false,
  specialHandling TEXT,
  
  -- Shipping
  shippingType ENUM('express', 'standard', 'economy'),
  insuranceRequired BOOLEAN,
  signatureRequired BOOLEAN,
  estimatedCost DECIMAL(10, 2),
  
  -- Timestamps & Retention
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  deliveredAt TIMESTAMP,
  expiresAt TIMESTAMP (auto-delete after 1 year),
  isArchived BOOLEAN DEFAULT false,
  
  userId UUID,
  notes TEXT
);

CREATE INDEX idx_shipments_userId ON shipments(userId);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_trackingNumber ON shipments(trackingNumber);
CREATE INDEX idx_shipments_expiresAt ON shipments(expiresAt);
```

### Shipment Tracking Table
```sql
CREATE TABLE shipmentTracking (
  id UUID PRIMARY KEY,
  shipmentId UUID NOT NULL,
  status VARCHAR(100),
  location VARCHAR(255),
  timestamp TIMESTAMP DEFAULT NOW(),
  notes TEXT
);
```

---

## 🗑️ Database Optimization Strategy

### Data Retention Policy
- Active Shipments: Keep 2 years
- Completed: Keep 1 year then archive
- Cancelled: Keep 3 months
- Failed: Keep 1 month only

### Automatic Cleanup (Daily Cron Job)
```sql
-- Delete old cancelled shipments
DELETE FROM shipmentTracking 
WHERE shipmentId IN (
  SELECT id FROM shipments 
  WHERE status = 'cancelled' AND updatedAt < NOW() - INTERVAL '3 months'
);

DELETE FROM shipments 
WHERE status = 'cancelled' AND updatedAt < NOW() - INTERVAL '3 months';

-- Archive old completed shipments (move to archive table)
INSERT INTO shipments_archive 
SELECT * FROM shipments 
WHERE status = 'delivered' AND createdAt < NOW() - INTERVAL '1 year';

DELETE FROM shipments 
WHERE status = 'delivered' AND createdAt < NOW() - INTERVAL '1 year';
```

### Prevent DB Bloat
- ✅ No process logs stored in main DB
- ✅ Use external service for logs (Sentry, LogRocket)
- ✅ Keep only ERROR level logs in DB (1 month retention)
- ✅ Rotate logs daily, delete after 30 days
- ✅ Vacuum DB weekly
- ✅ Monitor DB size, alert if >80% capacity
- ✅ Archive old data to cold storage

### Query Optimization
```javascript
// ❌ BAD - Fetches all columns
const shipment = await db.shipment.findMany({ where: { userId } });

// ✅ GOOD - Only needed columns + pagination
const shipments = await db.shipment.findMany({
  where: { userId, isArchived: false },
  select: { id, trackingNumber, status, createdAt },
  take: 50,
  skip: (page - 1) * 50,
});
```

---

## 📱 Admin Dashboard for Shipments

### `/admin/shipments` - List View
- Paginated table with sorting/filtering
- Filter by: Status, Date Range, Country, Shipping Type
- Search by: Tracking #, Sender, Recipient, Email
- Bulk actions: Approve, Cancel, Export
- Quick actions: View, Edit, Delete

### `/admin/shipments/:id` - Detail View
- Complete shipment info (editable)
- Sender & recipient details
- Item breakdown
- Tracking history timeline
- Status update controls
- Refund/cancel options
- Print shipping label
- Internal notes section

---

## 🔌 API Endpoints

### Customer APIs
```
POST   /api/shipments/register         - Register shipment
GET    /api/shipments/track/:id        - Track by ID or tracking number
GET    /api/shipments/my               - User's shipments (paginated)
GET    /api/shipments/estimate         - Get shipping estimate
POST   /api/shipments/:id/cancel       - Cancel shipment
GET    /api/shipments/label/:id        - Get shipping label
```

### Admin APIs
```
GET    /api/admin/shipments            - List (with filters, pagination)
GET    /api/admin/shipments/:id        - Get details
PUT    /api/admin/shipments/:id        - Update shipment
DELETE /api/admin/shipments/:id        - Archive/delete
POST   /api/admin/shipments/:id/confirm - Confirm registration
PUT    /api/admin/shipments/:id/status - Update status
GET    /api/admin/shipments/stats      - Analytics
POST   /api/admin/cleanup              - Trigger cleanup job
```

---

## ✅ Validation Requirements

### Frontend (React Hook Form + Zod)
- Names: 2-255 characters
- Email: Valid email format
- Phone: +1234567890 format validation
- Weight: 0.1 to 1000 kg
- Value: $1 to $1,000,000
- Description: 10-1000 characters
- Address: Complete validation

### Backend
- Email verification
- Duplicate detection (same sender/recipient/time)
- Realistic weight/dimension checks
- Country/city geocoding validation
- XSS/SQL injection prevention

---

## 📊 Shipment Lifecycle

```
1. Registration → Pending approval
2. Confirmed → Tracking # generated
3. Picked Up → Collection from sender
4. In Transit → On the way
5. Delivered → Reached recipient
6. Archived → Auto-delete after 1 year
```

---

## 🚀 Implementation Order

1. ✅ Create shipment registration form
2. ✅ Build registration API endpoint
3. ✅ Create database schema
4. ✅ Admin shipment list view
5. ✅ Tracking functionality
6. ✅ Cleanup jobs setup
7. ✅ Analytics dashboard

---

## 📋 Database Space Optimization Checklist

- ✅ Auto-cleanup scheduled daily
- ✅ Archive old records after 1 year
- ✅ Proper indexing on query fields
- ✅ Pagination (max 50 results per query)
- ✅ Select only needed columns
- ✅ Separate external logging service
- ✅ Log rotation (daily, 30-day retention)
- ✅ Weekly DB vacuum
- ✅ Size monitoring with alerts
- ✅ Cold storage for archived data
- ✅ No process logs in main DB
- ✅ Compressed backups

---

This ensures the database stays lean, fast, and doesn't bloat from unnecessary data!
