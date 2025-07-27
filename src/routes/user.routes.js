import { Router } from "express";
import { loginUser, logoutUser, registerUser,refreshAcessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, getUserChannelProfile } from "../controllers/user.controller";

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

router.route("/change-password").post(verifyJWT,changeCurrentPassword)

router.route("/current-user").get(verifyJWT,getCurrentUser)

router.route("/update-profile").patch(verifyJWT,updateAccountDetails)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateAccountDetails)

router.route("/cover-image").patch(verifyJWT,upload.single("/coverImage"),updateUserAvatar)

// params 

router.route("/c/:username").get(verifyJWT,getUserChannelProfile)

router.route("/history").get(verifyJWT,getWatchHistory)

export default router