const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;
const LINKEDIN_LOGIN_REDIRECT_URI = process.env.LINKEDIN_LOGIN_REDIRECT_URI || process.env.LINKEDIN_REDIRECT_URI;

/**
 * Generate LinkedIn OAuth URL for verification (existing users)
 */
export function getLinkedInAuthUrl(state) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: LINKEDIN_REDIRECT_URI,
    state: state,
    scope: "openid profile email",
  });

  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}

/**
 * Generate LinkedIn OAuth URL for login/register
 */
export function getLinkedInLoginAuthUrl(state) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: LINKEDIN_LOGIN_REDIRECT_URI,
    state: state,
    scope: "openid profile email",
  });

  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(code, isLogin = false) {
  const redirectUri = isLogin ? LINKEDIN_LOGIN_REDIRECT_URI : LINKEDIN_REDIRECT_URI;

  const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error_description || "Failed to exchange code");
  }

  return data.access_token;
}

/**
 * Get LinkedIn user profile
 */
export async function getLinkedInProfile(accessToken) {
  const res = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch LinkedIn profile");
  }

  return res.json();
}
