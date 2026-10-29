'use strict';

let authorized = false;
const input = () => document.getElementById('streamKey');
const status = message => { document.getElementById('configStatus').textContent = message; };

function makeKey() {
  const bytes = new Uint8Array(16);
  if (window.crypto?.getRandomValues) window.crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  return Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('');
}

function readSavedConfig() {
  try {
    const saved = window.Twitch?.ext?.configuration?.broadcaster;
    if (!saved?.content) return;
    const config = JSON.parse(saved.content);
    const key = String(config?.streamKey || '').trim();
    if (key) input().value = key;
    status(key ? 'Existing configuration loaded. Save again after changing the key.' : 'Generate a key and save it to Twitch.');
  } catch (_) { status('Generate a key and save it to Twitch.'); }
}

document.getElementById('generateKey').addEventListener('click', () => {
  input().value = makeKey();
  status('Key generated. Save it here, then paste the same key into Fribby Thrower.');
});

document.getElementById('configForm').addEventListener('submit', event => {
  event.preventDefault();
  const key = String(input().value || '').trim();
  if (!/^[a-zA-Z0-9_-]{8,80}$/.test(key)) {
    status('Use 8–80 letters, numbers, underscores, or hyphens.');
    return;
  }
  if (!authorized || !window.Twitch?.ext?.configuration?.set) {
    status('Twitch has not authorized this configuration page yet. Reload it and try again.');
    return;
  }
  try {
    window.Twitch.ext.configuration.set('broadcaster', '1', JSON.stringify({ streamKey: key }));
    status('Configuration saved. Now paste this exact key into Fribby Thrower → Settings → Twitch Extension Stats.');
  } catch (error) {
    status('Twitch could not save this configuration. Reload the extension settings and try again.');
    console.error('Fribby Twitch config save failed:', error);
  }
});

if (window.Twitch?.ext) {
  window.Twitch.ext.onAuthorized(() => {
    authorized = true;
    document.getElementById('saveConfig').disabled = false;
    status('Connected to Twitch. Generate a key, then save the configuration.');
  });
  window.Twitch.ext.configuration.onChanged(readSavedConfig);
} else {
  status('Open this page from the Twitch extension configuration screen.');
}
