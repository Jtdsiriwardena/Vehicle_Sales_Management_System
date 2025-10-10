import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Vehicle } from "../entities/Vehicle";

const vehicleRepo = () => AppDataSource.getRepository(Vehicle);

// Vehicles added per month
export const vehiclesAdded = async (req: Request, res: Response) => {
  try {
    const { period } = req.query;
    let groupBy: string;

    switch (period) {
      case "week":
        groupBy = "WEEK(v.createdAt)";
        break;
      case "month":
        groupBy = "MONTH(v.createdAt)";
        break;
      default:
        groupBy = "DATE(v.createdAt)";
    }

    const data = await vehicleRepo()
      .createQueryBuilder("v")
      .select(`${groupBy} as period`)
      .addSelect("COUNT(*)", "count")
      .groupBy(groupBy)
      .orderBy(groupBy, "ASC")
      .getRawMany();

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Total vehicle count by brand
export const countByBrand = async (req: Request, res: Response) => {
  try {
    const data = await vehicleRepo()
      .createQueryBuilder("v")
      .select("v.brand", "brand")
      .addSelect("COUNT(*)", "count")
      .groupBy("v.brand")
      .orderBy("count", "DESC")
      .getRawMany();

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Total vehicle count by type
export const countByType = async (req: Request, res: Response) => {
  try {
    const data = await vehicleRepo()
      .createQueryBuilder("v")
      .select("v.type", "type")
      .addSelect("COUNT(*)", "count")
      .addSelect("SUM(v.price)", "price")
      .groupBy("v.type")
      .orderBy("count", "DESC")
      .getRawMany();

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Vehicle count by price range
export const countByPriceRange = async (req: Request, res: Response) => {
  try {
    const ranges = [
      { label: "0-10000", min: 0, max: 10000 },
      { label: "10001-25000", min: 10001, max: 25000 },
      { label: "25001-50000", min: 25001, max: 50000 },
      { label: "50001-75000", min: 50001, max: 75000 },
      { label: "75001-100000", min: 75001, max: 100000 },
      { label: "100000+", min: 100001, max: Infinity },
    ];

    const repo = vehicleRepo();
    const counts: { label: string; count: number }[] = [];

    for (const r of ranges) {
      const count = await repo
        .createQueryBuilder("v")
        .where("v.price >= :min", { min: r.min })
        .andWhere(r.max !== Infinity ? "v.price <= :max" : "1=1", { max: r.max })
        .getCount();

      counts.push({ label: r.label, count });
    }

    res.json(counts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};