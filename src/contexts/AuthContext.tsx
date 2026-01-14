import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  balance: number;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  decreaseBalance: () => void;
  isAuthenticated: boolean;
}

// Demo users database
const DEMO_USERS = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    name: "Admin User",
    email: "admin@example.com",
    balance: 100,
  },
  {
    id: "2",
    username: "demo",
    password: "demo123",
    name: "Demo User",
    email: "demo@example.com",
    balance: 50,
  },
  {
    id: "3",
    username: "user",
    password: "user123",
    name: "Test User",
    email: "test@example.com",
    balance: 25,
  },
];

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const foundUser = DEMO_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      // Check for saved balance
      const savedBalance = localStorage.getItem(`balance_${foundUser.id}`);
      const userToSet = {
        ...userWithoutPassword,
        balance: savedBalance ? parseInt(savedBalance) : foundUser.balance,
      };
      setUser(userToSet);
      localStorage.setItem("currentUser", JSON.stringify(userToSet));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const decreaseBalance = () => {
    if (user && user.balance > 0) {
      const newBalance = user.balance - 1;
      const updatedUser = { ...user, balance: newBalance };
      setUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      localStorage.setItem(`balance_${user.id}`, newBalance.toString());
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        decreaseBalance,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
