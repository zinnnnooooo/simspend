import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/firebase/config';
import { PROFILE_STORAGE_KEY, defaultProfile } from '@/pages/EditProfile';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  setGuestMode: (guest: boolean) => void;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(() => {
    return localStorage.getItem('simspend_guest') === 'true';
  });

  const setGuestMode = (guest: boolean) => {
    setIsGuest(guest);
    if (guest) {
      localStorage.setItem('simspend_guest', 'true');
    } else {
      localStorage.removeItem('simspend_guest');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        // Firebase Auth 상태 복원 및 로컬 스토리지 동기화
        const profileData = {
          name: firebaseUser.displayName || '사용자',
          email: firebaseUser.email || '',
          bgColor: '#FFE8B8',
          avatarType: firebaseUser.photoURL ? 'image' as const : 'default' as const,
          avatarValue: firebaseUser.photoURL || 'default',
        };
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
        window.dispatchEvent(new Event('simspend_profile_updated'));
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      // Clear guest mode on successful login
      setGuestMode(false);
      
      const profileData = {
        name: firebaseUser.displayName || '사용자',
        email: firebaseUser.email || '',
        bgColor: '#FFE8B8',
        avatarType: firebaseUser.photoURL ? 'image' as const : 'default' as const,
        avatarValue: firebaseUser.photoURL || 'default',
      };
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
      window.dispatchEvent(new Event('simspend_profile_updated'));
      
      return firebaseUser;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setGuestMode(false);
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(defaultProfile));
      window.dispatchEvent(new Event('simspend_profile_updated'));
    } catch (error) {
      console.error('Sign-Out Error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isGuest, setGuestMode, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
