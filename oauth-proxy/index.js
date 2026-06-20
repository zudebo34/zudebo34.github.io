import express from 'express';
import { AuthorizationCode } from 'simple-oauth2';

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const SITE_URL = process.env.SITE_URL || 'https://zudebo34.github.io';
const PORT = process.env.PORT || 3000;

const app = express();

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET');
}

let client;
try {
  client = new AuthorizationCode({
    client: { id: CLIENT_ID || '', secret: CLIENT_SECRET || '' },
    auth: {
      tokenHost: 'https://github.com',
      tokenPath: '/login/oauth/access_token',
      authorizePath: '/login/oauth/authorize',
    },
  });
} catch (e) {
  console.error('Failed to create OAuth client:', e.message);
}

app.get('/', (req, res) => {
  res.send(`OK - CLIENT_ID: ${CLIENT_ID ? 'set' : 'MISSING'}, CLIENT_SECRET: ${CLIENT_SECRET ? 'set' : 'MISSING'}`);
});

app.get('/auth', (req, res) => {
  if (!client) return res.status(500).send('OAuth client not initialized');
  const authorizationUri = client.authorizeURL({
    redirect_uri: `${SITE_URL}/admin/`,
    scope: 'repo',
    state: req.query.state || '',
  });
  res.redirect(authorizationUri);
});

app.get('/callback', async (req, res) => {
  if (!client) return res.status(500).send('OAuth client not initialized');
  try {
    const result = await client.getToken({
      code: req.query.code,
      redirect_uri: `${SITE_URL}/admin/`,
    });
    res.redirect(`${SITE_URL}/admin/#access_token=${result.token.access_token}`);
  } catch (error) {
    res.status(500).send('Authentication failed');
  }
});

app.listen(PORT, () => {
  console.log(`OAuth proxy running on port ${PORT}`);
});
