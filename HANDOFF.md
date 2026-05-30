# Candera — Site Owner Guide

Welcome! This guide covers everything you need to update and manage your site independently.

---

## Your two tools for managing the site

| What you're updating                                                               | Where to do it                                  |
| ---------------------------------------------------------------------------------- | ----------------------------------------------- |
| **Products** (names, prices, descriptions, photos)                                 | Your **Etsy shop** — changes sync automatically |
| **Everything else** (headlines, testimonials, about page, care tips, social links) | The **Content Editor** at `yoursite.com/admin`  |

---

## 1. Updating Products

All product content is pulled directly from your Etsy listings. To update a product:

1. Log into [Etsy](https://www.etsy.com) and go to your shop
2. Edit the listing (title, description, price, photos)
3. Changes appear on your site within a few minutes automatically

> If Etsy is unreachable or you have no active listings, the site shows a built-in fallback collection so visitors always see something.

---

## 2. Updating Site Content (Content Editor)

### First-time setup

Your developer will set up a GitHub account for you and give you access to the repository. Once you have a GitHub account:

1. Go to `yoursite.com/admin`
2. Click **"Login with GitHub"**
3. Authorize the app
4. You'll land in the content editor

### What you can edit

**Home Page**

- Hero tag, headline, and batch subheading (e.g. "Batch 015 now curing")
- Collection section headline and description
- Inner Circle call-to-action copy
- Testimonials — add, edit, or remove any review

**About Page**

- Methodology headline and description
- The 4-step process (each step title and description)
- Founder story paragraphs and photo
- FAQ items — add, edit, or remove any question and answer

**Ritual Page**

- Philosophy headline and paragraphs
- Candle care tips (title and body for each)
- Wax & materials description paragraphs

**Site Settings**

- Footer tagline
- Instagram, Etsy, and website URLs
- Copyright year and studio name

### How to save changes

1. Open the content editor and pick the section to edit (e.g. "Home Page")
2. Edit any field — text boxes update immediately as you type
3. Click **Save** in the top right
4. Your change is committed to the site automatically
5. Vercel rebuilds and deploys — changes go live in about 60–90 seconds

---

## 3. Common tasks — quick reference

| Task                        | Where in the editor                 |
| --------------------------- | ----------------------------------- |
| Update batch number in hero | Home Page → Hero Subheading         |
| Add a new testimonial       | Home Page → Testimonials → Add Item |
| Change the Instagram link   | Site Settings → Instagram URL       |
| Update the Etsy shop link   | Site Settings → Etsy Shop URL       |
| Add a new FAQ answer        | About Page → FAQ Items → Add Item   |
| Update founder photo        | About Page → Founder Photo          |
| Edit candle care tips       | Ritual Page → Candle Care Tips      |

---

## 4. Updating the Hero & About Images

Product images are managed through Etsy. The two editorial photos (home hero, about page) are stored in the repository under `public/images/`. To replace them, give your developer the new photos and they'll swap them in.

---

## 5. What requires a developer

These items are built into the site's code and aren't in the content editor:

- **Quiz questions and matching logic** — changing quiz options can break product matching
- **Navigation links** — page names and routes
- **New pages** — adding a new section to the site
- **Hero and about images** — require a file swap in the repository

---

## 6. One-time developer setup (for the developer, not the client)

To enable the `/admin` login on the live site:

1. Go to [GitHub → Settings → Developer settings → OAuth Apps](https://github.com/settings/developers) and create a new OAuth App:
   - **Homepage URL:** `https://yoursite.vercel.app`
   - **Authorization callback URL:** `https://yoursite.vercel.app/api/auth/callback`
   - Copy the **Client ID** and **Client Secret**

2. In Vercel → Settings → Environment Variables, add:

   ```
   GITHUB_OAUTH_CLIENT_ID      (the Client ID from step 1)
   GITHUB_OAUTH_CLIENT_SECRET  (the Client Secret from step 1)
   ```

3. Update `public/admin/config.yml` → `base_url` to match the actual Vercel URL

4. Redeploy — the `/admin` route will be live

5. Give the client a GitHub account with **write access** to the `ohdaveed/candera-frontend` repository (Collaborator access is sufficient)
