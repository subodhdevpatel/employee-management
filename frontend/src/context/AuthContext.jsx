import { createContext, useContext, useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_ME } from '../graphql/queries';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const [getMe] = useLazyQuery(GET_ME, {
        onCompleted: (data) => {
            setUser(data.me);
            setLoading(false);
        },
        onError: () => {
            logout();
            setLoading(false);
        }
    });

    useEffect(() => {
        if (token) {
            getMe();
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const isAdmin = () => user?.role === 'admin';
    const isEmployee = () => user?.role === 'employee';

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            isAdmin,
            isEmployee,
            loading,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};
