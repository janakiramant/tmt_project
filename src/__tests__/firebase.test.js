import { signInWithGoogle, logout } from '../lib/firebase';
import { vi } from 'vitest';

// Mock Firebase
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn()
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn().mockResolvedValue({ user: { uid: '123', displayName: 'Test User' } }),
  signOut: vi.fn().mockResolvedValue(),
  onAuthStateChanged: vi.fn()
}));

describe('Firebase Auth Integration', () => {
  it('signs in with google successfully', async () => {
    const user = await signInWithGoogle();
    expect(user.uid).toBe('123');
    expect(user.displayName).toBe('Test User');
  });

  it('logs out successfully', async () => {
    await expect(logout()).resolves.toBeUndefined();
  });
});
