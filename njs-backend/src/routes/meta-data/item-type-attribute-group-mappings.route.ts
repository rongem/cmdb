import express from "express";

import { getItemTypeAttributeMappings } from "../../controllers/meta-data/item-type.controller";

const router = express.Router();

router.get("/", getItemTypeAttributeMappings);

export default router;
