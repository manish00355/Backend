import { Router } from "express";
import { registerUser } from "../controllers/user.controller";

import { upload } from "../middlewares/multer.middleware";
const router = Router()
// file handling
router.route("/register").post(

    // middle ware -> multer
    upload.fields([
        {
            name:"avatar",
            maxCount :1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser

)
//router.route("/login").post(login)

export default router