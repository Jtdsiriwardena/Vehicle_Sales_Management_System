import { jest } from '@jest/globals';

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

// Mock data source
jest.mock('../config/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    })),
  },
}));

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

// Mock jwt
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

// Mock openaiService
jest.mock('../services/openaiService', () => ({
  generateDescription: jest.fn(),
}));

// test environment variables
process.env.JWT_SECRET = 'test-secret';

// Mock console.error
const originalConsoleError = console.error;
console.error = jest.fn();

afterAll(() => {
  console.error = originalConsoleError;
});