import { useAuth } from './AuthContext';

export function LoginScreen() {
  const { signIn } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'oklch(98% 0.008 80)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Jost', sans-serif",
      color: 'oklch(24% 0.015 80)',
      gap: 32,
      padding: 24,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: "'Caveat', cursive",
          fontSize: 52,
          fontWeight: 600,
          color: 'oklch(22% 0.02 80)',
          lineHeight: 1.1,
          marginBottom: 10,
        }}>
          Wedding Guest List
        </div>
        <div style={{ fontSize: 16, color: 'oklch(48% 0.015 80)', fontStyle: 'italic' }}>
          Sign in to access your shared list
        </div>
      </div>

      <button
        onClick={signIn}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '13px 24px',
          background: '#fff',
          border: '1.5px solid oklch(82% 0.01 80)',
          borderRadius: 10,
          fontSize: 15,
          fontFamily: "'Jost', sans-serif",
          fontWeight: 500,
          color: 'oklch(24% 0.015 80)',
          cursor: 'pointer',
          boxShadow: '0 1px 4px oklch(0% 0 0 / 0.08)',
          transition: 'box-shadow 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 10px oklch(0% 0 0 / 0.14)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px oklch(0% 0 0 / 0.08)')}
      >
        <GoogleIcon />
        Sign in with Google
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
    </svg>
  );
}
