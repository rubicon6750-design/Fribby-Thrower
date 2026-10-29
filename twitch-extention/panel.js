'use strict';

const SUPABASE_URL = 'https://soofisuqqwszdhqxiqzw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_r68LSwAd5IFOdsI9sm31Gg_cx2-DmSe';
const STATS_TABLE = 'fribby_stream_stats';
let streamKey = '';
let pollTimer = null;
let polling = false;

const el = id => document.getElementById(id);

function formatAmount(value) {
  try {
    const normalized = String(value ?? '0');
    if (!/^\d+$/.test(normalized)) return '0';
    return BigInt(normalized).toLocaleString('en-US');
  } catch (_) { return '0'; }
}

function parseConfig() {
  try {
    const saved = window.Twitch?.ext?.configuration?.broadcaster;
    if (!saved?.content) return '';
    const config = JSON.parse(saved.content);
    const candidate = String(config?.streamKey || '').trim();
    return /^[a-zA-Z0-9_-]{8,80}$/.test(candidate) ? candidate : '';
  } catch (_) { return ''; }
}

function setStatus(message, ok = false) {
  el('status').textContent = message;
  el('liveDot').hidden = !ok;
}

async function pollStats() {
  if (polling || !streamKey) return;
  polling = true;
  try {
    const params = new URLSearchParams({
      select: 'fribbies,mega_fribbies,ascension_count,updated_at',
      stream_key: `eq.${streamKey}`,
      limit: '1'
    });
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${STATS_TABLE}?${params}`, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        Accept: 'application/json'
      },
      cache: 'no-store'
    });
    if (!response.ok) throw new Error(`Stats API returned ${response.status}`);
    const rows = await response.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      setStatus('No game stats have arrived yet. Open Fribby Thrower and connect the same Stream Link Key in Settings.');
      el('updated').textContent = '';
      return;
    }
    const data = rows[0];
    el('fribbies').textContent = formatAmount(data.fribbies);
    el('megaFribbies').textContent = formatAmount(data.mega_fribbies);
    el('ascensions').textContent = formatAmount(data.ascension_count);
    const stamp = data.updated_at ? new Date(data.updated_at) : null;
    el('updated').textContent = stamp && !Number.isNaN(stamp.getTime())
      ? `Last update: ${stamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })}`
      : '';
    setStatus('Stats are connected.', true);
  } catch (error) {
    setStatus('Unable to read stats. Check the Supabase table setup and the Twitch URL Fetching allowlist.');
    console.error('Fribby Twitch panel:', error);
  } finally {
    polling = false;
  }
}

function applyConfig() {
  const nextKey = parseConfig();
  if (!nextKey) {
    streamKey = '';
    if (pollTimer !== null) window.clearInterval(pollTimer);
    pollTimer = null;
    el('fribbies').textContent = '—';
    el('megaFribbies').textContent = '—';
    el('ascensions').textContent = '—';
    el('updated').textContent = '';
    setStatus('The broadcaster needs to save a Stream Link Key in the extension configuration.');
    return;
  }
  if (streamKey === nextKey && pollTimer !== null) { pollStats(); return; }
  streamKey = nextKey;
  if (pollTimer !== null) window.clearInterval(pollTimer);
  pollStats();
  pollTimer = window.setInterval(pollStats, 3000);
}

if (window.Twitch?.ext) {
  window.Twitch.ext.onAuthorized(() => {});
  window.Twitch.ext.configuration.onChanged(applyConfig);
} else {
  setStatus('Open this page from Twitch to load the broadcaster configuration.');
}
