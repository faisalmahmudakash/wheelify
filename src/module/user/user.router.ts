import express from "express"
import { userCollection } from "./user.controller";
import auth from "../../middleware/auth";


const router = express.Router();


router.get("/", auth("admin"), userCollection.getAllUser);
router.put("/:id", auth("admin", "customer"), userCollection.updatedUser);
router.delete("/:id", auth("admin"), userCollection.deleteUser);


export const userRoute = router;