import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from 'react-oidc-context';

const clientId = process.env.GATSBY_COGNITO_CLIENT_ID || '';
const logoutUri = process.env.GATSBY_COGNITO_LOGOUT_URI || process.env.GATSBY_COGNITO_REDIRECT_URI || '';
const cognitoDomain = process.env.GATSBY_COGNITO_DOMAIN || '';

export default function AuthPage() {
  const auth = useAuth();

  const signOutRedirect = () => {
    if (!clientId || !logoutUri || !cognitoDomain) return;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  return (
    <Layout title='Auth Test'>
      <div className='space-y-6'>
        <section className='card'>
          <h1 className='text-2xl font-semibold mb-2'>Cognito OIDC test</h1>
          <p className='text-slate-700'>
            Use this page to confirm your Cognito user pool app client and redirect URLs are working before wiring Decap CMS.
          </p>
        </section>

        {!clientId || !logoutUri || !cognitoDomain ? (
          <section className='card'>
            <h2 className='text-lg font-semibold mb-2'>Missing configuration</h2>
            <p className='text-slate-700'>
              Set <code>GATSBY_COGNITO_CLIENT_ID</code>, <code>GATSBY_COGNITO_DOMAIN</code>, and <code>GATSBY_COGNITO_REDIRECT_URI</code> (or
              <code> GATSBY_COGNITO_LOGOUT_URI</code>) to enable sign-in.
            </p>
          </section>
        ) : null}

        <section className='card'>
          {auth.isLoading ? <div>Loading...</div> : null}
          {auth.error ? <div>Encountering error... {auth.error.message}</div> : null}

          {auth.isAuthenticated ? (
            <div className='space-y-3'>
              <div>Hello: {auth.user?.profile?.email}</div>
              <div className='text-xs text-slate-500 break-all'>ID Token: {auth.user?.id_token}</div>
              <div className='text-xs text-slate-500 break-all'>Access Token: {auth.user?.access_token}</div>
              <div className='text-xs text-slate-500 break-all'>Refresh Token: {auth.user?.refresh_token}</div>
              <button className='inline-flex items-center rounded-full bg-emerald-600 text-white px-4 py-2 text-sm font-semibold' onClick={() => auth.removeUser()}>
                Sign out (local)
              </button>
            </div>
          ) : (
            <div className='flex flex-wrap gap-3'>
              <button className='inline-flex items-center rounded-full bg-emerald-600 text-white px-4 py-2 text-sm font-semibold' onClick={() => auth.signinRedirect()}>
                Sign in
              </button>
              <button className='inline-flex items-center rounded-full border border-emerald-600 text-emerald-700 px-4 py-2 text-sm font-semibold' onClick={signOutRedirect}>
                Sign out (Cognito)
              </button>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
