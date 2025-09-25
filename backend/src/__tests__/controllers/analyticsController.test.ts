import { Request, Response } from "express";
import { AppDataSource } from "../../config/data-source";
import { Vehicle } from "../../entities/Vehicle";
import {
  vehiclesAdded,
  countByBrand,
  countByType,
  countByPriceRange
} from "../../controllers/analyticsController";

// Mock the data source
jest.mock("../../config/data-source");

describe("AnalyticsController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockQueryBuilder: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup response mock
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };

    // Create a fresh query builder mock
    mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
      getCount: jest.fn(),
    };

    // Mock the repository 
    const mockVehicleRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockVehicleRepository);
  });

  describe("vehiclesAdded", () => {
    it("should return vehicles added per day when no period specified", async () => {
      // Arrange
      const mockData = [
        { period: "2024-01-01", count: "5" },
        { period: "2024-01-02", count: "3" },
      ];

      mockRequest = {
        query: {},
      };

      mockQueryBuilder.getRawMany.mockResolvedValue(mockData);

      // Act
      await vehiclesAdded(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockQueryBuilder.select).toHaveBeenCalledWith("DATE(v.createdAt) as period");
      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith("COUNT(*)", "count");
      expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith("DATE(v.createdAt)");
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith("DATE(v.createdAt)", "ASC");
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    it("should return vehicles added per month when period=month", async () => {
      // Arrange
      const mockData = [
        { period: "1", count: "15" },
        { period: "2", count: "20" },
      ];

      mockRequest = {
        query: { period: "month" },
      };

      mockQueryBuilder.getRawMany.mockResolvedValue(mockData);

      // Act
      await vehiclesAdded(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockQueryBuilder.select).toHaveBeenCalledWith("MONTH(v.createdAt) as period");
      expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith("MONTH(v.createdAt)");
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith("MONTH(v.createdAt)", "ASC");
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    it("should return vehicles added per week when period=week", async () => {
      // Arrange
      const mockData = [
        { period: "1", count: "8" },
        { period: "2", count: "12" },
      ];

      mockRequest = {
        query: { period: "week" },
      };

      mockQueryBuilder.getRawMany.mockResolvedValue(mockData);

      // Act
      await vehiclesAdded(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockQueryBuilder.select).toHaveBeenCalledWith("WEEK(v.createdAt) as period");
      expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith("WEEK(v.createdAt)");
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      mockRequest = {
        query: { period: "month" },
      };

      mockQueryBuilder.getRawMany.mockRejectedValue(new Error("Database error"));

      // Act
      await vehiclesAdded(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("countByBrand", () => {
    it("should return vehicle count grouped by brand in descending order", async () => {
      // Arrange
      const mockData = [
        { brand: "Toyota", count: "25" },
        { brand: "Honda", count: "20" },
        { brand: "Ford", count: "15" },
      ];

      mockRequest = {};

      mockQueryBuilder.getRawMany.mockResolvedValue(mockData);

      // Act
      await countByBrand(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockQueryBuilder.select).toHaveBeenCalledWith("v.brand", "brand");
      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith("COUNT(*)", "count");
      expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith("v.brand");
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith("count", "DESC");
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    it("should handle empty results", async () => {
      // Arrange
      const mockData: any[] = [];

      mockRequest = {};

      mockQueryBuilder.getRawMany.mockResolvedValue(mockData);

      // Act
      await countByBrand(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });

    it("should handle database errors", async () => {
      // Arrange
      mockRequest = {};

      mockQueryBuilder.getRawMany.mockRejectedValue(new Error("Database error"));

      // Act
      await countByBrand(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("countByType", () => {
    it("should return vehicle count grouped by type in descending order", async () => {
      // Arrange
      const mockData = [
        { type: "SUV", count: "30" },
        { type: "Sedan", count: "25" },
        { type: "Truck", count: "10" },
      ];

      mockRequest = {};

      mockQueryBuilder.getRawMany.mockResolvedValue(mockData);

      // Act
      await countByType(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockQueryBuilder.select).toHaveBeenCalledWith("v.type", "type");
      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith("COUNT(*)", "count");
      expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith("v.type");
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith("count", "DESC");
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    it("should handle database errors", async () => {
      // Arrange
      mockRequest = {};

      mockQueryBuilder.getRawMany.mockRejectedValue(new Error("Database error"));

      // Act
      await countByType(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("countByPriceRange", () => {
    it("should return vehicle count for all price ranges", async () => {
      // Arrange
      mockRequest = {};

      // Mock getCount to return different values for each range
      mockQueryBuilder.getCount
        .mockResolvedValueOnce(5)  
        .mockResolvedValueOnce(10) 
        .mockResolvedValueOnce(8)   
        .mockResolvedValueOnce(3)  
        .mockResolvedValueOnce(1);

      // Act
      await countByPriceRange(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockQueryBuilder.where).toHaveBeenNthCalledWith(1, "v.price >= :min", { min: 0 });
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(1, "v.price <= :max", { max: 10000 });


      expect(mockResponse.json).toHaveBeenCalledWith([
        { label: "0-10000", count: 5 },
        { label: "10001-25000", count: 10 },
        { label: "25001-50000", count: 8 },
        { label: "50001-75000", count: 3 },
        { label: "75001-100000", count: 2 },
        { label: "100000+", count: 1 },
      ]);
    });

    it("should handle empty database", async () => {
      // Arrange
      mockRequest = {};

      mockQueryBuilder.getCount.mockResolvedValue(0);

      // Act
      await countByPriceRange(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith([
        { label: "0-10000", count: 0 },
        { label: "10001-25000", count: 0 },
        { label: "25001-50000", count: 0 },
        { label: "50001-75000", count: 0 },
        { label: "75001-100000", count: 0 },
        { label: "100000+", count: 0 },
      ]);
    });

    it("should handle database errors", async () => {
      // Arrange
      mockRequest = {};

      mockQueryBuilder.getCount.mockRejectedValue(new Error("Database error"));

      // Act
      await countByPriceRange(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: "Server error" });
    });

    it("should handle partial database errors gracefully", async () => {
      // Arrange
      mockRequest = {};

      mockQueryBuilder.getCount
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(10)
        .mockRejectedValueOnce(new Error("Database error"));

      // Act
      await countByPriceRange(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("Edge Cases", () => {
    it("should handle invalid period parameter gracefully", async () => {
      // Arrange
      const mockData = [{ period: "2024-01-01", count: "5" }];

      mockRequest = {
        query: { period: "invalid" },
      };

      mockQueryBuilder.getRawMany.mockResolvedValue(mockData);

      // Act
      await vehiclesAdded(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockQueryBuilder.select).toHaveBeenCalledWith("DATE(v.createdAt) as period");
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    it("should handle special characters in brand names", async () => {
      // Arrange
      const mockData = [
        { brand: "Mercedes-Benz", count: "12" },
        { brand: "Alfa Romeo", count: "8" },
      ];

      mockRequest = {};

      mockQueryBuilder.getRawMany.mockResolvedValue(mockData);

      // Act
      await countByBrand(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });
  });
});