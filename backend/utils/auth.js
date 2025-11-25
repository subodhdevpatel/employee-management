import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

export const getUserFromToken = async (token) => {
    if (!token) return null;

    try {
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id).select('-password');
        return user;
    } catch (error) {
        return null;
    }
};

export const requireAuth = (user) => {
    if (!user) {
        throw new Error('Authentication required');
    }
    return user;
};

export const requireAdmin = (user) => {
    requireAuth(user);
    if (user.role !== 'admin') {
        throw new Error('Admin access required');
    }
    return user;
};

export const hasPermission = (user, requiredRole) => {
    if (!user) return false;
    if (requiredRole === 'admin') return user.role === 'admin';
    return true;
};
