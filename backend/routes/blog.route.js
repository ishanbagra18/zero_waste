import { isAuthenticated } from "../middleware/AuthUser.js";
import express from "express";
import { createBlog,deleteBlog,getAllBlogs,getSingleBlog,getMyBlogs,toggleLikeBlog,addCommentToBlog } from "../controller/blog.controller.js";


const router = express.Router();

router.post("/createblog" , isAuthenticated , createBlog);
router.get("/getallblogs" ,isAuthenticated, getAllBlogs);
router.delete("/delete/:id", isAuthenticated, deleteBlog);
router.get("/single-blog/:id", isAuthenticated, getSingleBlog);
router.get("/my-blog", isAuthenticated, getMyBlogs);
router.post("/like/:id", isAuthenticated, toggleLikeBlog);
router.post("/comment/:id", isAuthenticated, addCommentToBlog);



export default router;





