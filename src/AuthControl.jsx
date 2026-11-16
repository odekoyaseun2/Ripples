import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  display: 'grid',
  placeItems: 'center',
  padding: '1rem',
  background: 'rgba(10, 15, 25, 0.68)',
};

const dialogStyle = {
  width: 'min(100%, 440px)',
  padding: '2rem',
  borderRadius: '20px',
  background: '#fff',
  color: '#202534',
  boxShadow: '0 24px 80px rgba(0,0,0,.25)',
};

function friendlyError(error) {
  const messages = {
    'auth/email-already-in-use': 'An account already exists for this email. Try signing in instead.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/invalid-credential': 'Email or password is incorrect.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'auth/weak-password': 'Choose a stronger password with at least 6 characters.',
    'auth/network-request-failed': 'Network error. Check your connection and try again.',
  };
  return messages[error.code] || 'Authentication failed. Please try again.';
}

export default function AuthControl() {
  const [host, setHost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  // Mount the React-owned auth button where the existing header action appears.
  useEffect(() => {
    const existingButton = document.querySelector('.topbar .primary-btn.small');
    if (!existingButton?.parentElement) return undefined;

    const mount = document.createElement('span');
    existingButton.parentElement.insertBefore(mount, existingButton);
    existingButton.hidden = true;
    setHost(mount);

    return () => {
      existingButton.hidden = false;
      mount.remove();
    };
  }, []);

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, (user) => setCurrentUser(user));
  }, []);

  const closeDialog = () => {
    setOpen(false);
    setError('');
    setNotice('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');

    try {
      if (mode === 'signup') {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (name.trim()) await updateProfile(credential.user, { displayName: name.trim() });
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      setPassword('');
      closeDialog();
    } catch (authError) {
      setError(friendlyError(authError));
    } finally {
      setBusy(false);
    }
  };

  const handlePasswordReset = async () => {
    setError('');
    setNotice('');
    if (!email.trim()) {
      setError('Enter your email address first, then choose Forgot password.');
      return;
    }

    setBusy(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setNotice('Password reset email sent. Check your inbox.');
    } catch (authError) {
      setError(friendlyError(authError));
    } finally {
      setBusy(false);
    }
  };

  const handleButtonClick = async () => {
    if (currentUser) {
      setError('');
      try {
        await signOut(auth);
      } catch (authError) {
        setError(friendlyError(authError));
      }
      return;
    }
    setMode('signin');
    setOpen(true);
  };

  const button = host && createPortal(
    <button className="primary-btn small" type="button" onClick={handleButtonClick}>
      {currentUser ? `Sign out${currentUser.displayName ? ` (${currentUser.displayName})` : ''}` : 'Login / Sign Up'}
    </button>,
    host
  );

  const dialog = open && createPortal(
    <div style={overlayStyle} onMouseDown={(event) => event.target === event.currentTarget && closeDialog()}>
      <section role="dialog" aria-modal="true" aria-labelledby="auth-title" style={dialogStyle}>
        <button type="button" onClick={closeDialog} aria-label="Close" style={{ float: 'right', border: 0, background: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>×</button>
        <p style={{ margin: '0 0 .4rem', color: '#7357db', fontWeight: 700 }}>Ripples account</p>
        <h2 id="auth-title" style={{ margin: '0 0 1rem' }}>{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h2>

        {!isFirebaseConfigured && (
          <p role="alert" style={{ padding: '.8rem', borderRadius: '8px', background: '#fff3cd', color: '#664d03' }}>
            Firebase is not configured yet. Add the VITE_FIREBASE_* values in your local .env file and Netlify environment variables.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label style={{ display: 'block', marginBottom: '.9rem' }}>
              Name
              <input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required style={inputStyle} />
            </label>
          )}
          <label style={{ display: 'block', marginBottom: '.9rem' }}>
            Email
            <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required style={inputStyle} />
          </label>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>
            Password
            <input type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required style={inputStyle} />
          </label>

          {mode === 'signin' && (
            <button type="button" onClick={handlePasswordReset} disabled={busy || !isFirebaseConfigured} style={textButtonStyle}>Forgot password?</button>
          )}
          {error && <p role="alert" style={{ color: '#b42318' }}>{error}</p>}
          {notice && <p role="status" style={{ color: '#16794b' }}>{notice}</p>}

          <button type="submit" disabled={busy || !isFirebaseConfigured} className="primary-btn full-width" style={{ marginTop: '1rem' }}>
            {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p style={{ margin: '1rem 0 0', textAlign: 'center' }}>
          {mode === 'signup' ? 'Already have an account? ' : 'New to Ripples? '}
          <button type="button" onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(''); setNotice(''); }} style={textButtonStyle}>
            {mode === 'signup' ? 'Sign in' : 'Create account'}
          </button>
        </p>
      </section>
    </div>,
    document.body
  );

  return <>{button}{dialog}</>;
}

const inputStyle = {
  display: 'block',
  boxSizing: 'border-box',
  width: '100%',
  marginTop: '.35rem',
  padding: '.75rem',
  border: '1px solid #d5d9e2',
  borderRadius: '8px',
  font: 'inherit',
};

const textButtonStyle = {
  padding: 0,
  border: 0,
  background: 'none',
  color: '#6246c7',
  font: 'inherit',
  fontWeight: 600,
  cursor: 'pointer',
};
