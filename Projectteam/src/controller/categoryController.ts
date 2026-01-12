import { Request, Response } from "express";
import { MainDAO } from "../dao/MainDAO";


const dao = new MainDAO();

class CategoryController {

    public getAllCategories = async (req: Request, res: Response) => {
        try {
            const categories = await dao.getAllCategories();
            res.status(200).json(categories);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }  
    };

    public getCategoryById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const category = await dao.getCategoryById(id);
            if (!category) return res.status(404).json({ message: "Category not found" });
            res.json(category);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    };

    public createCategory = async (req: Request, res: Response) => {
        try {
            const newCategory = await dao.createCategory(req.body);
            res.status(201).json(newCategory);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    };

    public updateCategory = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const updated = await dao.updateCategory(id, req.body);
            if (!updated) return res.status(404).json({ message: "Category not found" });
            res.json(updated);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    };

    public deleteCategory = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const deleted = await dao.deleteCategory(id);
            if (!deleted) return res.status(404).json({ message: "Category not found" });
            res.status(204).send();
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    };

    public showAddCategoryForm = async (req: Request, res: Response): Promise<void> => {
        try {
            res.status(200).render("admin/addCategory", {});
        } catch (error) {
            res.status(500).json({ error: 'Failed to display page' });
        } 
    };

    public handleAddCategoryForm = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name } = req.body;
            await dao.createCategory({ name });
            res.status(302).redirect("/admin");
        } catch (error) {
            res.status(500).json({ error: 'Failed to add category' });
        }
    };

}

export default new CategoryController();