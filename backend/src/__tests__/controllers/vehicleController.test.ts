import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Vehicle } from '../../entities/Vehicle';
import { generateDescription } from '../../services/openaiService';
import * as vehicleController from '../../controllers/vehicleController';

describe('VehicleController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockVehicleRepository: any;

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
    mockVehicleRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockVehicleRepository);
  });

  //Create vehicle
  describe('createVehicle', () => {
    it('should create a vehicle with AI-generated description when no description provided', async () => {
      // Arrange
      const mockVehicleData = {
        type: 'Car',
        brand: 'Toyota',
        model: 'Camry',
        color: 'Red',
        engineSize: '2.5L',
        year: 2023,
        price: 25000,
      };

      const mockGeneratedDescription = 'A reliable and efficient sedan perfect for family use.';
      const mockVehicle = { id: 1, ...mockVehicleData, description: mockGeneratedDescription, images: [] };

      mockRequest = {
        body: mockVehicleData,
        files: [],
      };

      mockVehicleRepository.create.mockReturnValue(mockVehicle);
      mockVehicleRepository.save.mockResolvedValue(mockVehicle);
      (generateDescription as jest.Mock).mockResolvedValue(mockGeneratedDescription);

      // Act
      await vehicleController.createVehicle(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(generateDescription).toHaveBeenCalledWith({
        brand: 'Toyota',
        model: 'Camry',
        year: 2023,
        type: 'Car',
        color: 'Red',
        engineSize: '2.5L',
      });
      expect(mockVehicleRepository.create).toHaveBeenCalledWith({
        ...mockVehicleData,
        description: mockGeneratedDescription,
        images: [],
        year: 2023,
        price: 25000,
      });
      expect(mockVehicleRepository.save).toHaveBeenCalledWith(mockVehicle);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockVehicle);
    });

    it('should create a vehicle with provided description', async () => {
      // Arrange
      const mockVehicleData = {
        type: 'Car',
        brand: 'Toyota',
        model: 'Camry',
        color: 'Red',
        engineSize: '2.5L',
        year: 2023,
        price: 25000,
        description: 'Custom description',
      };

      const mockVehicle = { id: 1, ...mockVehicleData, images: [] };

      mockRequest = {
        body: mockVehicleData,
        files: [],
      };

      mockVehicleRepository.create.mockReturnValue(mockVehicle);
      mockVehicleRepository.save.mockResolvedValue(mockVehicle);

      // Act
      await vehicleController.createVehicle(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(generateDescription).not.toHaveBeenCalled();
  
      expect(mockVehicleRepository.create).toHaveBeenCalledWith({
        ...mockVehicleData,
        images: []
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockVehicle);
    });

    it('should handle file uploads correctly', async () => {
      // Arrange
      const mockVehicleData = {
        type: 'Car',
        brand: 'Toyota',
        model: 'Camry',
        color: 'Red',
        engineSize: '2.5L',
        year: 2023,
        price: 25000,
      };

      const mockFiles = [
        { filename: 'image1.jpg' },
        { filename: 'image2.jpg' },
      ] as Express.Multer.File[];

      const mockVehicle = { 
        id: 1, 
        ...mockVehicleData, 
        description: 'AI description',
        images: ['/uploads/image1.jpg', '/uploads/image2.jpg'] 
      };

      mockRequest = {
        body: mockVehicleData,
        files: mockFiles,
      };

      mockVehicleRepository.create.mockReturnValue(mockVehicle);
      mockVehicleRepository.save.mockResolvedValue(mockVehicle);
      (generateDescription as jest.Mock).mockResolvedValue('AI description');

      // Act
      await vehicleController.createVehicle(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockVehicleRepository.create).toHaveBeenCalledWith({
        ...mockVehicleData,
        description: 'AI description',
        images: ['/uploads/image1.jpg', '/uploads/image2.jpg'],
        year: 2023,
        price: 25000,
      });
    });

    it('should handle server errors', async () => {
      // Arrange
      mockRequest = {
        body: {
          type: 'Car',
          brand: 'Toyota',
          model: 'Camry',
        },
        files: [],
      };

      mockVehicleRepository.create.mockImplementation(() => {
        throw new Error('Database error');
      });

      // Act
      await vehicleController.createVehicle(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });


  //Get vehicle
  describe('getVehicles', () => {
    it('should return paginated vehicles without filters', async () => {
      // Arrange
      const mockVehicles = [
        { id: 1, brand: 'Toyota', model: 'Camry', price: 25000 },
        { id: 2, brand: 'Honda', model: 'Civic', price: 22000 },
      ];

      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockVehicles, 2]),
      };

      mockVehicleRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      mockRequest = {
        query: { page: '1', limit: '10' },
      };

      // Act
      await vehicleController.getVehicles(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('v.createdAt', 'DESC');
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith({
        data: mockVehicles,
        total: 2,
        page: 1,
        limit: 10,
      });
    });

    it('should apply filters correctly', async () => {
      // Arrange
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      mockVehicleRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      mockRequest = {
        query: {
          brand: 'Toyota',
          model: 'Camry',
          type: 'Car',
          minPrice: '20000',
          maxPrice: '30000',
          year: '2023',
        },
      };

      // Act
      await vehicleController.getVehicles(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('v.brand = :brand', { brand: 'Toyota' });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('v.model = :model', { model: 'Camry' });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('v.type = :type', { type: 'Car' });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('v.year = :year', { year: 2023 });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('v.price >= :minPrice', { minPrice: 20000 });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('v.price <= :maxPrice', { maxPrice: 30000 });
    });

    it('should handle invalid page and limit parameters', async () => {
      // Arrange
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      mockVehicleRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      mockRequest = {
        query: { page: '-1', limit: '200' },
      };

      // Act
      await vehicleController.getVehicles(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(100);
    });
  });

  //Get vehicles by ID
  describe('getVehicleById', () => {
    it('should return vehicle when found', async () => {
      // Arrange
      const mockVehicle = { id: 1, brand: 'Toyota', model: 'Camry' };

      mockRequest = {
        params: { id: '1' },
      };

      mockVehicleRepository.findOneBy.mockResolvedValue(mockVehicle);

      // Act
      await vehicleController.getVehicleById(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockVehicleRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockJson).toHaveBeenCalledWith(mockVehicle);
    });

    it('should return 404 when vehicle not found', async () => {
      // Arrange
      mockRequest = {
        params: { id: '999' },
      };

      mockVehicleRepository.findOneBy.mockResolvedValue(null);

      // Act
      await vehicleController.getVehicleById(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Not found' });
    });

    it('should handle invalid ID', async () => {
      // Arrange
      mockRequest = {
        params: { id: 'invalid' },
      };

      // Act
      await vehicleController.getVehicleById(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Not found' });
    });
  });


  //Update vehicle
  describe('updateVehicle', () => {
    it('should update vehicle with new description', async () => {
      // Arrange
      const existingVehicle = {
        id: 1,
        brand: 'Toyota',
        model: 'Camry',
        type: 'Car',
        color: 'Blue',
        engineSize: '2.0L',
        year: 2022,
        price: 23000,
        description: 'Old description',
        images: ['/uploads/old.jpg'],
      };

      const updateData = {
        brand: 'Toyota',
        model: 'Camry',
        type: 'Sedan',
        color: 'Red',
        description: 'New description',
      };

      mockRequest = {
        params: { id: '1' },
        body: updateData,
        files: [],
      };

      mockVehicleRepository.findOneBy.mockResolvedValue(existingVehicle);
      mockVehicleRepository.save.mockResolvedValue({ ...existingVehicle, ...updateData });

      // Act
      await vehicleController.updateVehicle(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockVehicleRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockVehicleRepository.save).toHaveBeenCalledWith({
        ...existingVehicle,
        ...updateData,
        type: 'Sedan',
        color: 'Red',
        description: 'New description',
      });
      expect(mockJson).toHaveBeenCalledWith(expect.objectContaining(updateData));
    });

    it('should regenerate description when regenerate=true', async () => {
      // Arrange
      const existingVehicle = {
        id: 1,
        brand: 'Toyota',
        model: 'Camry',
        type: 'Car',
        color: 'Blue',
        engineSize: '2.0L',
        year: 2022,
        price: 23000,
        description: 'Old description',
        images: [],
      };

      const mockGeneratedDescription = 'AI generated description';

      mockRequest = {
        params: { id: '1' },
        body: { regenerate: 'true', brand: 'Toyota', model: 'Camry' },
        files: [],
      };

      mockVehicleRepository.findOneBy.mockResolvedValue(existingVehicle);
      mockVehicleRepository.save.mockResolvedValue(existingVehicle);
      (generateDescription as jest.Mock).mockResolvedValue(mockGeneratedDescription);

      // Act
      await vehicleController.updateVehicle(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(generateDescription).toHaveBeenCalledWith({
        brand: 'Toyota',
        model: 'Camry',
        year: 2022,
        type: 'Car',
        color: 'Blue',
        engineSize: '2.0L',
      });
      expect(mockVehicleRepository.save).toHaveBeenCalledWith({
        ...existingVehicle,
        description: mockGeneratedDescription,
      });
    });

    it('should handle image updates correctly', async () => {
      // Arrange
      const existingVehicle = {
        id: 1,
        brand: 'Toyota',
        model: 'Camry',
        images: ['/uploads/old1.jpg', '/uploads/old2.jpg'],
      };

      const newFiles = [
        { filename: 'new1.jpg' },
        { filename: 'new2.jpg' },
      ] as Express.Multer.File[];

      mockRequest = {
        params: { id: '1' },
        body: { 
          keepImages: JSON.stringify(['/uploads/old1.jpg']),
          brand: 'Toyota',
          model: 'Camry',
        },
        files: newFiles,
      };

      mockVehicleRepository.findOneBy.mockResolvedValue(existingVehicle);
      mockVehicleRepository.save.mockResolvedValue(existingVehicle);

      // Act
      await vehicleController.updateVehicle(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockVehicleRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          images: ['/uploads/old1.jpg', '/uploads/new1.jpg', '/uploads/new2.jpg'],
        })
      );
    });

    it('should return 404 when vehicle not found', async () => {
      // Arrange
      mockRequest = {
        params: { id: '999' },
        body: { brand: 'Toyota' },
      };

      mockVehicleRepository.findOneBy.mockResolvedValue(null);

      // Act
      await vehicleController.updateVehicle(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Not found' });
    });
  });


  //Delete vehicle
  describe('deleteVehicle', () => {
    it('should delete existing vehicle', async () => {
      // Arrange
      const mockVehicle = { id: 1, brand: 'Toyota', model: 'Camry' };

      mockRequest = {
        params: { id: '1' },
      };

      mockVehicleRepository.findOneBy.mockResolvedValue(mockVehicle);
      mockVehicleRepository.remove.mockResolvedValue(mockVehicle);

      // Act
      await vehicleController.deleteVehicle(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockVehicleRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockVehicleRepository.remove).toHaveBeenCalledWith(mockVehicle);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Deleted' });
    });

    it('should return 404 when vehicle not found', async () => {
      // Arrange
      mockRequest = {
        params: { id: '999' },
      };

      mockVehicleRepository.findOneBy.mockResolvedValue(null);

      // Act
      await vehicleController.deleteVehicle(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Not found' });
    });
  });


  //Generate vehicle description
  describe('generateVehicleDescription', () => {
    it('should generate description successfully', async () => {
      // Arrange
      const mockDescription = 'A reliable and efficient vehicle.';
      const requestData = {
        brand: 'Toyota',
        model: 'Camry',
        type: 'Sedan',
        color: 'Red',
        engineSize: '2.5L',
        year: 2023,
      };

      mockRequest = {
        body: requestData,
      };

      (generateDescription as jest.Mock).mockResolvedValue(mockDescription);

      // Act
      await vehicleController.generateVehicleDescription(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(generateDescription).toHaveBeenCalledWith(requestData);
      expect(mockJson).toHaveBeenCalledWith({ description: mockDescription });
    });

    it('should return 400 when brand or model is missing', async () => {
      // Arrange
      mockRequest = {
        body: { model: 'Camry' },
      };

      // Act
      await vehicleController.generateVehicleDescription(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Brand and model are required' });
      expect(generateDescription).not.toHaveBeenCalled();
    });

    it('should handle AI service errors', async () => {
      // Arrange
      mockRequest = {
        body: { brand: 'Toyota', model: 'Camry' },
      };

      (generateDescription as jest.Mock).mockRejectedValue(new Error('AI service error'));

      // Act
      await vehicleController.generateVehicleDescription(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Failed to generate description' });
    });
  });
});