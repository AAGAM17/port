# Live Testimonials — Firebase Setup

Visitors submit testimonials directly on the site. They land in Firestore as
`approved: false` and are invisible to everyone. When you flip `approved` to
`true`, the testimonial appears on the site **in realtime** — every open
browser updates instantly, no redeploy.

Takes about 5 minutes. Free tier is far more than enough.

## 1. Create the Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project** (e.g. `aagam-portfolio`). Analytics: off.
2. In the project: **Build → Firestore Database → Create database** → Production mode → location `asia-south1` (Mumbai).
3. Project settings (gear icon) → **Your apps** → Web (`</>`) → register app (no hosting needed). Copy the config values.

## 2. Configure the site

Create `.env.local` (copy `.env.example`) and paste the values:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=aagam-portfolio.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=aagam-portfolio
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234:web:abcd
```

When deploying (Vercel etc.), add the same four variables in the project's
environment settings. These values are public by design — security comes from
the rules below, not from hiding the keys.

## 3. Security rules (required)

Firestore Database → **Rules** → replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /testimonials/{id} {
      // Anyone may read approved testimonials (queries must filter on approved == true)
      allow read: if resource.data.approved == true;

      // Anyone may submit — but only as unapproved, only with sane fields
      allow create: if request.resource.data.approved == false
        && request.resource.data.keys().hasOnly(['name', 'role', 'company', 'quote', 'approved', 'createdAt'])
        && request.resource.data.name is string && request.resource.data.name.size() > 0 && request.resource.data.name.size() <= 80
        && request.resource.data.role is string && request.resource.data.role.size() > 0 && request.resource.data.role.size() <= 80
        && request.resource.data.company is string && request.resource.data.company.size() <= 80
        && request.resource.data.quote is string && request.resource.data.quote.size() >= 20 && request.resource.data.quote.size() <= 600;

      // Nobody can edit or delete from the client — approval happens in the console
      allow update, delete: if false;
    }
  }
}
```

Publish. This means: visitors can only *create unapproved entries*; only you
(via the console, which bypasses rules) can approve, edit, or delete.

## 4. Approving a testimonial

Firestore Database → **Data** → `testimonials` collection → open the new
document → change `approved` from `false` to `true` → save.

It appears on the site the same second. To take one down, flip it back or
delete the document.
