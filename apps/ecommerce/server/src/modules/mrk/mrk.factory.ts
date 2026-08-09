import { MrkController } from "./mrk.controller";
import { MrkRepository } from "./mrk.repository";
import { MrkService } from "./mrk.service";

export const makeMrkController = () => {
  const repository = new MrkRepository();
  const service = new MrkService(repository);
  return new MrkController(service);
};
