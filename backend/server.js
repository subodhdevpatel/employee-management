import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './schema/resolvers.js';
import { getUserFromToken } from './utils/auth.js';
import { createEmployeeLoader, createEmployeesByDepartmentLoader } from './utils/dataloader.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
})
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });

mongoose.connection.on('error', err => {
    console.error('MongoDB error:', err);
});

const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => {
        console.error('GraphQL Error:', error);
        return {
            message: error.message,
            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
            path: error.path
        };
    },
    introspection: true,
    playground: true
});

await server.start();

// Parse CORS origins from environment variable
const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:5173'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());

app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
        const token = req.headers.authorization?.replace('Bearer ', '') || '';
        const user = await getUserFromToken(token);

        return {
            user,
            employeeLoader: createEmployeeLoader(),
            employeesByDepartmentLoader: createEmployeesByDepartmentLoader()
        };
    }
}));

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/graphql`);
    console.log(`Health check at http://localhost:${PORT}/health`);
});
