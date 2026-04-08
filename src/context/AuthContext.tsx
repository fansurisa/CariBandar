import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface User {
  id: string;
  email: string;
  full_name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSubscribed: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, full_name: string) => Promise<void>;
  logout: () => void;
  subscribe: () => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "caribandar_auth";

function readStorage(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AuthState;
  } catch {
    /* corrupted — fall through to default */
  }
  return { user: null, isAuthenticated: false, isAdmin: false, isSubscribed: false };
}

function writeStorage(state: AuthState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clearStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

/** Simple mock id generator */
function mockId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(readStorage);

  /* Persist every state change */
  useEffect(() => {
    if (state.isAuthenticated) {
      writeStorage(state);
    } else {
      clearStorage();
    }
  }, [state]);

  /* ---- actions --------------------------------------------------- */

  const login = async (email: string, _password: string): Promise<void> => {
    // Mock: any email/password combo succeeds
    const admin = email.toLowerCase().includes("admin");
    const user: User = {
      id: mockId(),
      email,
      full_name: admin ? "Admin User" : email.split("@")[0],
    };

    setState({
      user,
      isAuthenticated: true,
      isAdmin: admin,
      isSubscribed: false,
    });
  };

  const signup = async (
    email: string,
    _password: string,
    full_name: string,
  ): Promise<void> => {
    const admin = email.toLowerCase().includes("admin");
    const user: User = { id: mockId(), email, full_name };

    setState({
      user,
      isAuthenticated: true,
      isAdmin: admin,
      isSubscribed: false,
    });
  };

  const logout = () => {
    setState({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isSubscribed: false,
    });
  };

  const subscribe = () => {
    setState((prev) => ({ ...prev, isSubscribed: true }));
  };

  /* ---- render ---------------------------------------------------- */

  return (
    <AuthContext.Provider
      value={{ ...state, login, signup, logout, subscribe }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
