import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import { MrkFeatureName, mrkFeatures } from "@/config/features";

export const requireFeature =
  (featureName: MrkFeatureName) =>
  (_req: Request, _res: Response, next: NextFunction) => {
    if (!mrkFeatures[featureName]) {
      return next(new AppError(404, "This feature is not available"));
    }

    next();
  };
