import { Router } from "express";
import { loginUser, logoutUser, registerUser,refreshAcessToken } from "../controllers/user.controller";

import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";
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

router.route("/login").post(loginUser)
// secured routes 
router.route("/logout").post( verifyJWT ,logoutUser)

router.route("/refresh-token").post(refreshAcessToken)





export default router