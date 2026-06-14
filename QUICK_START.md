# ⚡ QUICK START - 15 Minutes to Live App

## For Non-Technical People

This guide is **simple and visual**. Follow each step exactly.

---

## PART 1: Create Your Database (5 min)

### Step 1: Sign Up for Supabase
1. Go to **www.supabase.com**
2. Click big blue "Start your project" button
3. Click "Continue with GitHub" (or use email)
4. Create an account if needed
5. Create a new project:
   - Name: `tour-pool`
   - Password: Create something like `TourPool@2025`
   - Region: Select `Europe (Ireland)`
6. Wait 2-3 minutes for it to set up

### Step 2: Create Tables
1. In Supabase, left sidebar, click **SQL Editor**
2. Click **"+ New Query"** (blue button)
3. Copy everything from the SQL script below
4. Paste it into the editor
5. Click the **"Play" button** (right side) to run it
6. Wait for success message ✓

```sql
-- Copy and paste this entire block

CREATE TABLE participants (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  riders BIGINT[] NOT NULL,
  yellow_jersey BIGINT,
  polka_dots_jersey BIGINT,
  green_jersey BIGINT,
  team_classification TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE daily_results (
  id BIGSERIAL PRIMARY KEY,
  stage INTEGER NOT NULL UNIQUE,
  top_10_riders BIGINT[] NOT NULL,
  yellow_jersey BIGINT,
  polka_dots_jersey BIGINT,
  green_jersey BIGINT,
  team_classification TEXT,
  created_at TIMESTAMP DEFAULT now()
);

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on participants"
ON participants FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public select on participants"
ON participants FOR SELECT
USING (true);

CREATE POLICY "Allow public select on daily_results"
ON daily_results FOR SELECT
USING (true);

CREATE POLICY "Allow public insert/update on daily_results"
ON daily_results FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update on daily_results"
ON daily_results FOR UPDATE
USING (true);
```

---

## PART 2: Get Your Secret Keys (2 min)

1. In Supabase left sidebar, click **Settings**
2. Click **API**
3. You'll see two important values:
   - **Project URL** - copy this (looks like: `https://xxxxx.supabase.co`)
   - **anon public** - copy this (long random string)

Save these somewhere safe (notepad, email to yourself)

---

## PART 3: Deploy to the Web (5 min)

### Option A: Use Vercel (Easiest!)

1. Go to **www.vercel.com**
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Create GitHub account if needed (takes 1 minute)
4. After signing in to Vercel, click **"Add New..."** → **"Project"**
5. Choose **"Clone Template"**
6. Search for: `create-react-app`
7. Click **"Create"**
8. In the dialog, add these Environment Variables:
   ```
   REACT_APP_SUPABASE_URL = [paste your Project URL]
   REACT_APP_SUPABASE_ANON_KEY = [paste your anon key]
   REACT_APP_ADMIN_PASSWORD = [choose password like: Tour2025!]
   ```
9. Click **"Deploy"**
10. Wait 2 minutes... Done! 🎉

Your app is now live at the URL shown (like `your-app.vercel.app`)

### Option B: Use Replit (Alternative)

1. Go to **www.replit.com**
2. Click **"Create"**
3. Select **"React"**
4. Wait for it to load
5. In the left panel, find `.env` file
6. Add your three environment variables
7. In top right, click **"Run"**
8. Your app opens in the browser preview

---

## PART 4: Share with Family

1. Copy your app URL (from Vercel or Replit)
2. Send to family in WhatsApp/email
3. Everyone opens the link on their phone or computer
4. They click **"Submit Your Top 10"**
5. They fill in their predictions
6. Done! ✅

---

## PART 5: Enter Daily Results (After Each Stage)

1. Open the app
2. Click **"Admin Panel"**
3. Enter admin password (the one you created)
4. Select stage number (1, 2, 3... etc)
5. Search and click the 10 riders who finished in top 10
6. Select jersey wearers
7. Enter leading team name
8. Click **"Save Stage Results"**
9. Everyone's standings update automatically! 📊

---

## Common Questions

**Q: Where do I find my Supabase keys?**
A: Supabase → Settings → API (top left menu)

**Q: I forgot my admin password**
A: Go to Vercel settings → Environment Variables → edit REACT_APP_ADMIN_PASSWORD

**Q: Can I edit someone's top 10 if they made a mistake?**
A: Yes! Email me or edit it directly in Supabase (Table Editor → participants)

**Q: Can I export standings to PDF?**
A: Yes! In the app, click "View Standings" then "Export as PDF"

**Q: How many stages are there?**
A: 21 stages in the Tour de France

---

## That's It!

Your app is ready to use. Total time: ~20 minutes

Any questions? The DEPLOYMENT_GUIDE.md has more details.

Enjoy the pool! 🚴🏆
