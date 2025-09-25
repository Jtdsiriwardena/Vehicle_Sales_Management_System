import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Vehicle } from "../entities/Vehicle";
import { generateDescription } from "../services/openaiService";
import { generateDescription as openaiGenerateDescription } from "../services/openaiService";


const vehicleRepo = () => AppDataSource.getRepository(Vehicle);


//Create Vehicles
export const createVehicle = async (req: any, res: Response) => {
  try {
    const { type, brand, model, color, engineSize, year, price, description } = req.body;

    let images: string[] = [];
    if (req.files) images = (req.files as Express.Multer.File[]).map((f) => `/uploads/${f.filename}`);

    let desc = description;
    if (!desc) {
      desc = await generateDescription({ brand, model, year: year ? Number(year) : undefined, type, color, engineSize });
    }

    const repo = vehicleRepo();
    const vehicle = repo.create({
      type,
      brand,
      model,
      color,
      engineSize,
      year: year ? Number(year) : undefined,
      price: price ? Number(price) : 0,
      description: desc,
      images,
    });

    await repo.save(vehicle);
    res.status(201).json(vehicle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


//Get all Vehicles
export const getVehicles = async (req: Request, res: Response) => {
  try {
    const { brand, model, type, minPrice, maxPrice, year } = req.query;

    const qb = AppDataSource.getRepository(Vehicle).createQueryBuilder("v");

    if (brand) qb.andWhere("v.brand = :brand", { brand });
    if (model) qb.andWhere("v.model = :model", { model });
    if (type) qb.andWhere("v.type = :type", { type });
    if (year) qb.andWhere("v.year = :year", { year: Number(year) });
    if (minPrice) qb.andWhere("v.price >= :minPrice", { minPrice: Number(minPrice) });
    if (maxPrice) qb.andWhere("v.price <= :maxPrice", { maxPrice: Number(maxPrice) });

    qb.orderBy("v.createdAt", "DESC");

    const items = await qb.getMany();
    res.json({ data: items, total: items.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


//Get vehicles by ID
export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const repo = vehicleRepo();
    const v = await repo.findOneBy({ id });
    if (!v) return res.status(404).json({ message: "Not found" });
    res.json(v);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


//Update Vehicles
export const updateVehicle = async (req: any, res: Response) => {
  try {
    const id = Number(req.params.id);
    const repo = vehicleRepo();
    const existing = await repo.findOneBy({ id });
    if (!existing) return res.status(404).json({ message: "Not found" });

    const { type, brand, model, color, engineSize, year, price, description, regenerate, keepImages } = req.body;

    // Merge existing images with newly uploaded images
    let updatedImages: string[] = [];
    if (keepImages) {
      updatedImages = JSON.parse(keepImages);
    }
    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      const newFiles = (req.files as Express.Multer.File[]).map(f => `/uploads/${f.filename}`);
      updatedImages = [...updatedImages, ...newFiles];
    }
    existing.images = updatedImages;

    existing.type = type ?? existing.type;
    existing.brand = brand ?? existing.brand;
    existing.model = model ?? existing.model;
    existing.color = color ?? existing.color;
    existing.engineSize = engineSize ?? existing.engineSize;
    existing.year = year ? Number(year) : existing.year;
    existing.price = price ? Number(price) : existing.price;

    if (regenerate === "true") {
      existing.description = await generateDescription({
        brand: existing.brand,
        model: existing.model,
        year: existing.year,
        type: existing.type,
        color: existing.color,
        engineSize: existing.engineSize,
      });
    } else if (description) {
      existing.description = description;
    }

    await repo.save(existing);
    res.json(existing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


//Delete vehicles
export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const repo = vehicleRepo();
    const v = await repo.findOneBy({ id });
    if (!v) return res.status(404).json({ message: "Not found" });
    await repo.remove(v);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }


};


//Generate vehicle description
export const generateVehicleDescription = async (req: Request, res: Response) => {
  try {
    const { brand, model, type, color, engineSize, year } = req.body;

    if (!brand || !model) {
      return res.status(400).json({ message: "Brand and model are required" });
    }

    const description = await openaiGenerateDescription({ brand, model, type, color, engineSize, year });

    res.json({ description });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate description" });
  }
};
