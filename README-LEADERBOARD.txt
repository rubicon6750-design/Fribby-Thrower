FRIBBY THROWER — GLOBAL LEADERBOARD SETUP

The game includes the leaderboard UI, but a real global leaderboard needs your
own Supabase project. The game is not connected until you complete these steps.

1. Create a project at https://supabase.com/dashboard
2. In the Supabase dashboard, open Authentication > Sign In / Providers (the
   exact label may vary) and enable Anonymous Sign-Ins.
3. Open SQL Editor, create a new query, paste the contents of
   supabase-leaderboard-setup.sql, and run it.
4. Open Project Settings > API (or Connect). Copy the Project URL and the
   publishable key. Older projects may call the public key the anon key.
   NEVER use a secret key or service_role key in browser code.
5. Open script.js and find:
      const SUPABASE_URL = "PASTE_YOUR_SUPABASE_PROJECT_URL_HERE"
      const SUPABASE_PUBLISHABLE_KEY = "PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE"
   Replace the placeholder strings with your Project URL and publishable key.
6. Save script.js and reopen index.html. You need an internet connection.
7. Enter a player name and click Submit Score. Click Refresh Rankings to reload
   the top 100 scores.

WHAT THIS VERSION DOES
- Shows the top 100 players by their current Fribby balance.
- Uses an anonymous Supabase account per browser profile.
- Stores the chosen player name locally in that browser.
- Does not require email addresses or passwords.
- Keeps local autosave and JSON export/import.

IMPORTANT LIMITATIONS
- This is a starter leaderboard, not cheat-proof. A player can modify client-side
  JavaScript or send an inflated score for their own anonymous account. The
  row-level security policies stop users from editing another user's row, but
  they do not verify that a submitted score was honestly earned. A production
  anti-cheat design needs server-side score validation and abuse/rate limiting.
- Anonymous identities are tied to browser storage; clearing browser data or
  switching devices can create a new player identity unless account recovery is
  added.
- For testing, local HTML may work depending on browser privacy settings. If
  Supabase requests fail from file://, host the game on a static site such as
  GitHub Pages or another HTTPS host.
- Keep only the publishable/anon key in script.js. Never put a Supabase secret
  or service_role key in client-side code.

See Supabase's JavaScript and anonymous sign-in docs:
https://supabase.com/docs/reference/javascript/installing
https://supabase.com/docs/guides/auth/auth-anonymous
