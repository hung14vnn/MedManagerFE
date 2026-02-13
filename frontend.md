# Database Schema Changes - UI Developer Guide

## 🎯 Overview
This document outlines the major database schema changes for the MedManager API. The new structure supports ingredient-based drug management, enhanced interaction mechanisms, and search analytics.

---

## 🚨 **BREAKING CHANGES - Drug Model Restructure**

### ❌ **Removed Properties from Drug Model**
The following properties have been **completely removed**:
- `activeIngredient` - Now handled via ingredients relationship
- `brandName` - Replaced by `name`
- `pharmacologicalGroup`
- `indications`
- `contraindications`
- `dosageAdults`
- `dosageChildren`
- `dosageHepaticImpairment`
- `dosageRenalImpairment`
- `adverseEffects`
- `pregnancyPrecautions`
- `breastfeedingPrecautions`
- `otherPrecautions`

### ✅ **New Simplified Drug Model**
```json
{
  "id": 1,
  "code": "PARA500TAB",
  "name": "Paracetamol 500mg Tablet",
  "status": "Active",
  "dosageFormId": 1,
  "dosageForm": {
    "id": 1,
    "code": "TAB",
    "name": "Tablet"
  },
  "routeId": 1,
  "route": {
    "id": 1,
    "code": "PO",
    "name": "Oral"
  },
  "drugIngredients": [
    {
      "id": 1,
      "ingredient": {
        "id": 1,
        "code": "PARA",
        "name": "Paracetamol"
      },
      "strength": "500",
      "unit": "mg"
    }
  ],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-08T00:00:00Z"
}
```

**Status Enum Values**: `"Active"`, `"Inactive"`, `"Deprecated"`

---

## 📊 New Database Structure

### 1. **Ingredient Management** (New Feature)

#### **Ingredients Table**
- **Purpose**: Store active pharmaceutical ingredients separately from drug products
- **Fields**:
  - `id` (int): Primary key
  - `code` (string): Unique ingredient code
  - `name` (string): Ingredient name
  - `created_at`, `updated_at` (datetime): Timestamps

#### **Drug-Ingredient Relationship** (Many-to-Many)
- **Table**: `drug_ingredients`
- **Purpose**: Links drugs to their active ingredients (a drug can have multiple ingredients)
- **Fields**:
  - `id` (int): Primary key
  - `drug_id` (int): Foreign key to Drugs
  - `ingredient_id` (int): Foreign key to Ingredients
  - `strength` (string, optional): e.g., "500mg"
  - `unit` (string, optional): e.g., "mg", "ml"
  - `created_at` (datetime)

**UI Impact**:
- Drug forms should support selecting multiple ingredients
- Display ingredient list with strengths for each drug
- Search can now be performed by ingredient name or code

---

### 2. **Dosage Form & Route** (New Reference Tables)

#### **Dosage Forms Table**
- **Purpose**: Standardized list of drug forms (tablet, capsule, injection, etc.)
- **Fields**:
  - `id` (int): Primary key
  - `code` (string): Unique form code
  - `name` (string): Form name (e.g., "Tablet", "Capsule", "Injection")
  - `created_at`, `updated_at` (datetime)

#### **Route Information Table**
- **Purpose**: Administration routes (oral, IV, topical, etc.)
- **Fields**:
  - `id` (int): Primary key
  - `code` (string): Unique route code
  - `name` (string): Route name (e.g., "Oral", "Intravenous", "Topical")
  - `created_at`, `updated_at` (datetime)

**Updated Drug Model**:
```json
{
  "id": 1,
  "brandName": "Paracetamol 500mg",
  "activeIngredient": "Paracetamol",
  "status": "active",  // NEW: "active", "inactive", "deprecated"
  "dosageFormId": 1,   // NEW: Foreign key
  "dosageForm": {      // NEW: Populated object
    "id": 1,
    "code": "TAB",
    "name": "Tablet"
  },
  "routeId": 1,        // NEW: Foreign key
  "route": {           // NEW: Populated object
    "id": 1,
    "code": "PO",
    "name": "Oral"
  },
  "drugIngredients": [ // NEW: Array of ingredients
    {
      "ingredientId": 1,
      "ingredient": {
        "id": 1,
        "code": "PARA",
        "name": "Paracetamol"
      },
      "strength": "500",
      "unit": "mg"
    }
  ],
  // ... other existing fields
}
```

**UI Impact**:
- Add dropdowns for dosage form and route selection
- Forms should populate from `/api/dosageforms` and `/api/routes` endpoints
- Display dosage form and route in drug cards/lists

---

### 3. **Mechanism of Action** (Enhanced Feature)

#### **Mechanism Information Table**
- **Purpose**: Store pharmacological mechanisms
- **Fields**:
  - `id` (int): Primary key
  - `code` (string): Unique mechanism code
  - `name` (string): Mechanism description
  - `created_at`, `updated_at` (datetime)

#### **Ingredient-Mechanism Relationship**
- **Table**: `ingredient_mechanisms`
- **Purpose**: Link ingredients to their mechanisms of action
- **Fields**:
  - `id`, `ingredient_id`, `mechanism_id`, `created_at`

#### **Interaction-Mechanism Relationship**
- **Table**: `interaction_mechanisms`
- **Purpose**: Link drug interactions to specific mechanisms
- **Fields**:
  - `id`, `interaction_id`, `mechanism_id`
  - `mechanism_type` (string): "pharmacodynamic" or "pharmacokinetic"
  - `interaction_text` (string): Specific interaction description
  - `created_at`

**UI Impact**:
- Display mechanism of action for each drug (derived from ingredients)
- Show interaction mechanisms in interaction details
- Filter interactions by mechanism type

---

### 4. **Search Logging & Analytics** (New Feature)

#### **Search Logs Table**
- **Purpose**: Track all search queries for analytics
- **Fields**:
  - `id` (int): Primary key
  - `user_id` (string, nullable): User who performed the search
  - `search_query` (string): The search term
  - `entity_type` (string): "drug", "ingredient", "disease", "interaction"
  - `result_count` (int): Number of results returned
  - `found_results` (bool): Whether any results were found
  - `ip_address` (string, nullable): User's IP address
  - `user_agent` (string, nullable): Browser/client info
  - `searched_at` (datetime): Timestamp

**New API Endpoints**:
```
GET /api/searchanalytics/recent?count=50
GET /api/searchanalytics/popular?entityType=drug&days=7&top=10
GET /api/searchanalytics/stats?days=30
GET /api/searchanalytics/user/{userId}?count=50
```

**UI Impact**:
- Admin dashboard should show search analytics
- Display popular searches, search trends
- Show zero-result searches to improve search functionality
- Track user search patterns

---

## 🔄 Updated API Response Formats

### Drug Response (New Structure)
```json
{
  "id": 1,
  "code": "PARA500TAB",
  "name": "Paracetamol 500mg Tablet",
  "status": "Active",
  "dosageForm": {
    "id": 1,
    "code": "TAB",
    "name": "Tablet"
  },
  "route": {
    "id": 1,
    "code": "PO",
    "name": "Oral"
  },
  "drugIngredients": [
    {
      "id": 1,
      "ingredient": {
        "id": 1,
        "code": "PARA",
        "name": "Paracetamol"
      },
      "strength": "500",
      "unit": "mg"
    }
  ],
  "references": [
    {
      "id": 1,
      "title": "Drug Reference",
      "authors": "Author Name",
      "source": "Journal Name",
      "url": "https://example.com",
      "publicationDate": "2024-01-01T00:00:00Z",
      "doi": "10.1234/example"
    }
  ],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-08T00:00:00Z"
}
```

### Drug Search Response (Simplified)
```json
{
  "id": 1,
  "code": "PARA500TAB",
  "name": "Paracetamol 500mg Tablet",
  "status": "Active",
  "dosageForm": "Tablet",
  "route": "Oral"
}
```

### Interaction Response (Expanded)
```json
{
  "id": 1,
  "drug1": { /* drug object */ },
  "drug2": { /* drug object */ },
  "severity": "severe",
  "mechanism": "...",
  "clinicalEffects": "...",
  "managementRecommendations": "...",
  "interactionMechanisms": [
    {
      "mechanism": {
        "id": 1,
        "code": "CYP3A4",
        "name": "CYP3A4 Inhibition"
      },
      "mechanismType": "pharmacokinetic",
      "interactionText": "Drug A inhibits metabolism of Drug B"
    }
  ]
}
```

### Search Analytics Response
```json
{
  "period": "Last 7 days",
  "entityType": "drug",
  "top": 10,
  "searches": [
    {
      "query": "paracetamol",
      "count": 145
    },
    {
      "query": "aspirin",
      "count": 98
    }
  ]
}
```

---

## 🎨 UI/UX Recommendations

### 1. **Drug Management Forms**
- ✅ Add multi-select for ingredients with strength/unit inputs
- ✅ Add dropdown for dosage form (populated from `/api/dosageforms`)
- ✅ Add dropdown for route (populated from `/api/routes`)
- ✅ Add status dropdown (Active/Inactive/Deprecated)
- ✅ Show visual indicator for drug status (badge/color)
- ❌ Remove all old fields: indications, contraindications, dosage fields, adverse effects, precautions

**Example Form Fields**:
```
Code: [text input] *required
Name: [text input] *required
Status: [dropdown: Active/Inactive/Deprecated] *required
Dosage Form: [dropdown from API]
Route: [dropdown from API]

Ingredients:
  [Ingredient Select] [Strength] [Unit] [Remove]
  [+ Add Ingredient]
```

### 2. **Search Interface**
- ✅ Add entity type filter (Drugs, Ingredients, Diseases, Interactions)
- ✅ Implement search autocomplete based on popular searches
- ✅ Show "Did you mean?" suggestions for zero-result searches
- ✅ Display search history for logged-in users
- ✅ Search by drug code or name
- ✅ Search by ingredient name

### 3. **Drug Display Cards**
```
┌────────────────────────────────────┐
│ Paracetamol 500mg Tablet  [Active]│
│ Code: PARA500TAB                   │
│                                    │
│ 📋 Form: Tablet                    │
│ 💉 Route: Oral                     │
│                                    │
│ Ingredients:                       │
│  • Paracetamol - 500mg            │
│                                    │
│ Created: 2024-01-01                │
└────────────────────────────────────┘
```

- ✅ Show dosage form icon/badge
- ✅ Display route of administration
- ✅ List all active ingredients with strengths
- ✅ Show status badge with color coding:
  - 🟢 Active (green)
  - 🟡 Inactive (yellow)
  - 🔴 Deprecated (red)
- ❌ Remove display of old fields (indications, contraindications, etc.)

### 4. **Interaction Details**
- ✅ Group mechanisms by type (pharmacokinetic vs pharmacodynamic)
- ✅ Show mechanism codes for technical users
- ✅ Visual diagram for interaction mechanisms
- ✅ Display drugs by code and name (not activeIngredient/brandName)

### 5. **Admin Dashboard - Search Analytics**
- ✅ Chart showing search trends over time
- ✅ Table of popular searches by entity type
- ✅ List of zero-result searches (to improve database)
- ✅ User search patterns
- ✅ Export analytics to CSV

**Dashboard Layout**:
```
┌──────────────────────────────────────────┐
│ Search Analytics Dashboard               │
├──────────────────────────────────────────┤
│                                          │
│ Total Searches: 1,542  Users: 245       │
│ Avg Results: 4.2       Success: 92%     │
│                                          │
│ ┌────────────────────────────────────┐ │
│ │  Search Volume (Last 30 Days)      │ │
│ │  [Line Chart]                      │ │
│ └────────────────────────────────────┘ │
│                                          │
│ Popular Searches:                        │
│ 1. paracetamol (145)                    │
│ 2. aspirin (98)                         │
│ 3. ibuprofen (87)                       │
│                                          │
│ By Entity Type:                          │
│ Drugs:        892 (57.85%)              │
│ Ingredients:  345 (22.37%)              │
│ Diseases:     205 (13.30%)              │
└──────────────────────────────────────────┘
```

---

## 🔌 New API Endpoints (Implemented)

### Ingredients API
```
GET    /api/ingredients?page=1&pageSize=50  - List all ingredients (paginated)
POST   /api/ingredients                     - Create ingredient (Admin)
GET    /api/ingredients/{id}                - Get ingredient details
PUT    /api/ingredients/{id}                - Update ingredient (Admin)
DELETE /api/ingredients/{id}                - Delete ingredient (Admin)
GET    /api/ingredients/search?q=...        - Search ingredients
```

**Response Example** (GET /api/ingredients/{id}):
```json
{
  "id": 1,
  "code": "PARA",
  "name": "Paracetamol",
  "drugIngredients": [
    {
      "drugId": 1,
      "drug": { /* simplified drug object */ },
      "strength": "500",
      "unit": "mg"
    }
  ],
  "ingredientMechanisms": [
    {
      "mechanism": {
        "id": 1,
        "code": "COX2_INH",
        "name": "COX-2 Inhibition"
      }
    }
  ],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-08T00:00:00Z"
}
```

### Dosage Forms API
```
GET    /api/dosageforms              - List all dosage forms
POST   /api/dosageforms              - Create form (Admin)
GET    /api/dosageforms/{id}         - Get form details
PUT    /api/dosageforms/{id}         - Update form (Admin)
DELETE /api/dosageforms/{id}         - Delete form (Admin)
```

**Response Example** (GET /api/dosageforms):
```json
[
  {
    "id": 1,
    "code": "TAB",
    "name": "Tablet",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  {
    "id": 2,
    "code": "CAP",
    "name": "Capsule",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

### Routes API
```
GET    /api/routes                   - List all routes
POST   /api/routes                   - Create route (Admin)
GET    /api/routes/{id}              - Get route details
PUT    /api/routes/{id}              - Update route (Admin)
DELETE /api/routes/{id}              - Delete route (Admin)
```

**Response Example** (GET /api/routes):
```json
[
  {
    "id": 1,
    "code": "PO",
    "name": "Oral",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  {
    "id": 2,
    "code": "IV",
    "name": "Intravenous",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

### Mechanisms API
```
GET    /api/mechanisms               - List all mechanisms
POST   /api/mechanisms               - Create mechanism (Admin)
GET    /api/mechanisms/{id}          - Get mechanism details
PUT    /api/mechanisms/{id}          - Update mechanism (Admin)
DELETE /api/mechanisms/{id}          - Delete mechanism (Admin)
```

**Response Example** (GET /api/mechanisms):
```json
[
  {
    "id": 1,
    "code": "CYP3A4_INH",
    "name": "CYP3A4 Inhibition",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

### Search Analytics (Admin Only) ✅ Implemented
```
GET    /api/searchanalytics/recent?count=50           - Recent searches
GET    /api/searchanalytics/popular?entityType=Drug&days=7&top=10  - Popular searches
GET    /api/searchanalytics/stats?days=30             - Search statistics
GET    /api/searchanalytics/user/{userId}?count=50    - User search history
```

**Response Example** (GET /api/searchanalytics/popular):
```json
{
  "period": "Last 7 days",
  "entityType": "Drug",
  "top": 10,
  "searches": [
    {
      "query": "paracetamol",
      "count": 145
    },
    {
      "query": "aspirin",
      "count": 98
    }
  ]
}
```

**Response Example** (GET /api/searchanalytics/stats):
```json
{
  "period": "Last 30 days",
  "totalSearches": 1542,
  "byEntityType": [
    {
      "entityType": "Drug",
      "count": 892,
      "percentage": 57.85
    },
    {
      "entityType": "Ingredient",
      "count": 345,
      "percentage": 22.37
    }
  ]
}
```

---

## 🔄 Updated Drug API

### Create Drug Request
```http
POST /api/drugs
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "code": "PARA500TAB",
  "name": "Paracetamol 500mg Tablet",
  "status": "Active",
  "dosageFormId": 1,
  "routeId": 1,
  "ingredients": [
    {
      "ingredientId": 1,
      "strength": "500",
      "unit": "mg"
    }
  ]
}
```

### Update Drug Request
```http
PUT /api/drugs/{id}
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "code": "PARA500TAB",
  "name": "Paracetamol 500mg Tablet",
  "status": "Active",
  "dosageFormId": 1,
  "routeId": 1,
  "ingredients": [
    {
      "ingredientId": 1,
      "strength": "500",
      "unit": "mg"
    }
  ]
}
```

### Get Drug Details
```http
GET /api/drugs/{id}

Response: {
  "id": 1,
  "code": "PARA500TAB",
  "name": "Paracetamol 500mg Tablet",
  "status": "Active",
  "dosageForm": { "id": 1, "code": "TAB", "name": "Tablet" },
  "route": { "id": 1, "code": "PO", "name": "Oral" },
  "ingredients": [
    {
      "id": 1,
      "ingredient": { "id": 1, "code": "PARA", "name": "Paracetamol" },
      "strength": "500",
      "unit": "mg"
    }
  ],
  "references": [],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-08T00:00:00Z"
}
```

### Search Drugs
```http
GET /api/drugs/search?q=paracetamol

Response: [
  {
    "id": 1,
    "code": "PARA500TAB",
    "name": "Paracetamol 500mg Tablet",
    "status": "Active",
    "dosageForm": "Tablet",
    "route": "Oral"
  }
]
```

---

## ?? Search Logging Integration

**Automatic Logging**:
All search endpoints should automatically log searches. The backend handles this, but UI should be aware:

1. Every search request is logged
2. Logs include: query, entity type, result count, user, timestamp
3. Anonymous searches are logged without user ID
4. IP address and user agent are captured

**UI Considerations**:
- Show loading states appropriately
- Don't worry about search logging failures (non-blocking)
- Display search suggestions based on popular searches
- Show user's recent searches in search bar

---

## 🚀 Migration Steps for Frontend

### Step 1: Update Data Models/Interfaces
```typescript
// OLD - REMOVE THESE
interface OldDrug {
  activeIngredient: string;
  brandName: string;
  pharmacologicalGroup?: string;
  indications?: string;
  // ... many other fields
}

// NEW - USE THIS
interface Drug {
  id: number;
  code: string;
  name: string;
  status: "Active" | "Inactive" | "Deprecated";
  dosageFormId?: number;
  dosageForm?: DosageForm;
  routeId?: number;
  route?: RouteInformation;
  drugIngredients: DrugIngredient[];
  references: Reference[];
  createdAt: string;
  updatedAt: string;
}

interface DrugIngredient {
  id: number;
  ingredient: Ingredient;
  strength?: string;
  unit?: string;
}

interface Ingredient {
  id: number;
  code: string;
  name: string;
}

interface DosageForm {
  id: number;
  code: string;
  name: string;
}

interface RouteInformation {
  id: number;
  code: string;
  name: string;
}
```

### Step 2: Update API Calls
```typescript
// Update all drug-related API calls
const createDrug = async (drugData) => {
  return await fetch('/api/drugs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      code: drugData.code,
      name: drugData.name,
      status: drugData.status,
      dosageFormId: drugData.dosageFormId,
      routeId: drugData.routeId,
      ingredients: drugData.ingredients // Array of {ingredientId, strength, unit}
    })
  });
};

// Load reference data for dropdowns
const loadReferenceData = async () => {
  const [dosageForms, routes, ingredients] = await Promise.all([
    fetch('/api/dosageforms').then(r => r.json()),
    fetch('/api/routes').then(r => r.json()),
    fetch('/api/ingredients?pageSize=1000').then(r => r.json())
  ]);

  return { dosageForms, routes, ingredients: ingredients.data };
};
```

### Step 3: Update Forms
- Remove all old field inputs (indications, contraindications, dosage fields, etc.)
- Add new required fields: code, name, status
- Add dropdowns for dosageForm and route
- Add multi-select ingredient component with strength/unit inputs
- Update validation rules

### Step 4: Update Display Components
- Replace `drug.brandName` with `drug.name`
- Replace `drug.activeIngredient` with `drug.drugIngredients.map(...)`
- Add status badge display
- Add dosage form and route display
- Remove displays for removed fields

### Step 5: Test Everything
- [ ] Drug creation works with new structure
- [ ] Drug editing works
- [ ] Drug display shows correctly
- [ ] Search works by code and name
- [ ] Ingredient search works
- [ ] Status filtering works
- [ ] Admin analytics dashboard loads

---

## 💡 Best Practices

### For Drug Management
- **Code**: Use a consistent naming convention (e.g., INGREDIENTDOSEFORM)
- **Name**: Use descriptive names (e.g., "Paracetamol 500mg Tablet")
- **Status**: 
  - **Active**: Currently available and prescribed
  - **Inactive**: Temporarily unavailable
  - **Deprecated**: No longer in use, kept for historical records
- **Ingredients**: Always include at least one ingredient with strength and unit

### For Search
- Implement debouncing (300ms delay) to reduce API calls
- Show loading indicators during search
- Handle zero results gracefully with suggestions
- Cache popular searches for autocomplete
- Log searches automatically (handled by backend)

### For Ingredients
- Always validate strength + unit together (both required if one is filled)
- Support multiple ingredients per drug
- Allow searching drugs by ingredient name or code
- Display mechanism of action from ingredient relationships

### For Forms
- Pre-load reference data (dosage forms, routes, ingredients) on component mount
- Validate required fields: code, name, status
- Provide clear error messages
- Use dropdowns for status, dosageForm, and route
- Use searchable multi-select for ingredients

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Property 'activeIngredient' does not exist"
**Cause**: Using old property names  
**Solution**: Replace with new structure
```typescript
// OLD
drug.activeIngredient

// NEW
drug.drugIngredients.map(di => di.ingredient.name).join(', ')
```

### Issue 2: "Property 'brandName' does not exist"
**Cause**: Using old property name  
**Solution**: Use `drug.name` instead

### Issue 3: Cannot create drug - validation errors
**Cause**: Missing required fields  
**Solution**: Ensure request includes: `code`, `name`, `status`, and at least one ingredient

### Issue 4: Dropdowns are empty
**Cause**: Reference data not loaded  
**Solution**: Load `/api/dosageforms`, `/api/routes`, `/api/ingredients` before rendering form

---

## 🔐 Authorization

### Public Endpoints
- `GET /api/drugs/*`, `/api/ingredients/*`, `/api/dosageforms`, `/api/routes`, `/api/mechanisms`

### Admin Required
- `POST`, `PUT`, `DELETE` on `/api/drugs/*`, `/api/ingredients/*`, `/api/dosageforms/*`, `/api/routes/*`, `/api/mechanisms/*`

### SuperAdmin Only
- `GET /api/searchanalytics/*`

---

## 📞 Support

- **API Documentation**: http://your-api/swagger
- **Repository**: https://github.com/hung14vnn/MedManagerApi
- **Additional Docs**: `FRONTEND_INTEGRATION_GUIDE.md`, `SEARCH_MONITORING_GUIDE.md`, `QUICK_START.md`

---

**Last Updated**: January 2024  
**API Version**: 2.0  
**Breaking Changes**: YES - Complete Drug model restructure  
**Migration Required**: YES
