import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { login } from '../../controllers/authController';
import { User } from '../../entities/User';


describe('AuthController - login', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockUserRepository: { findOneBy: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup response mock
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };

    // Setup repository mock
    mockUserRepository = {
      findOneBy: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockUserRepository);
  });


  //Successful login
  describe('Successful login', () => {
    it('should return a JWT token when credentials are valid', async () => {
      // Arrange
      const mockUser: Partial<User> = {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
        role: 'user',
      };

      mockRequest = {
        body: {
          username: 'testuser',
          password: 'password123',
        },
      };

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mock-jwt-token');

      // Act
      await login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        username: 'testuser',
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: 1,
          username: 'testuser',
          role: 'user',
        },
        'test-secret',
        { expiresIn: '8h' }
      );
      expect(mockResponse.json).toHaveBeenCalledWith({ token: 'mock-jwt-token' });
    });
  });


  //Validation errors in login
  describe('Validation errors', () => {
    it('should return 400 when username is missing', async () => {
      // Arrange
      mockRequest = {
        body: {
          password: 'password123',
        },
      };

      // Act
      await login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Missing fields' });
      expect(mockUserRepository.findOneBy).not.toHaveBeenCalled();
    });

    it('should return 400 when password is missing', async () => {
      // Arrange
      mockRequest = {
        body: {
          username: 'testuser',
        },
      };

      // Act
      await login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Missing fields' });
      expect(mockUserRepository.findOneBy).not.toHaveBeenCalled();
    });

    it('should return 400 when both username and password are missing', async () => {
      // Arrange
      mockRequest = {
        body: {},
      };

      // Act
      await login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Missing fields' });
      expect(mockUserRepository.findOneBy).not.toHaveBeenCalled();
    });
  });


  //Authentication errors in login
  describe('Authentication errors', () => {
    it('should return 401 when user is not found', async () => {
      // Arrange
      mockRequest = {
        body: {
          username: 'nonexistent',
          password: 'password123',
        },
      };

      mockUserRepository.findOneBy.mockResolvedValue(null);

      // Act
      await login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        username: 'nonexistent',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Invalid credentials' });
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return 401 when password is invalid', async () => {
      // Arrange
      const mockUser: Partial<User> = {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
        role: 'user',
      };

      mockRequest = {
        body: {
          username: 'testuser',
          password: 'wrongpassword',
        },
      };

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act
      await login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        username: 'testuser',
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Invalid credentials' });
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });

  //server errors in login
  describe('Server errors', () => {
    it('should return 500 when database query fails', async () => {
      // Arrange
      mockRequest = {
        body: {
          username: 'testuser',
          password: 'password123',
        },
      };

      mockUserRepository.findOneBy.mockRejectedValue(new Error('Database error'));

      // Act
      await login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Server error' });
    });

    it('should return 500 when bcrypt comparison fails', async () => {
      // Arrange
      const mockUser: Partial<User> = {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
        role: 'user',
      };

      mockRequest = {
        body: {
          username: 'testuser',
          password: 'password123',
        },
      };

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockRejectedValue(new Error('Bcrypt error'));

      // Act
      await login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  //JWT configuration
  describe('JWT configuration', () => {
    it('should use fallback secret when JWT_SECRET is not set', async () => {
      // Arrange
      const originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;

      const mockUser: Partial<User> = {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
        role: 'user',
      };

      mockRequest = {
        body: {
          username: 'testuser',
          password: 'password123',
        },
      };

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mock-jwt-token');

      // Act
      await login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.any(Object),
        'secret',
        { expiresIn: '8h' }
      );

      // Restore original secret
      process.env.JWT_SECRET = originalSecret;
    });
  });
});