import express from "express";
import msg from "../modules/userModificationModule.js"

const router = express.Router();

router.get("/", (req, res) =>{

    res.send(msg());
})



export default router;
