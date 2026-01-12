import { Request, Response } from "express";
import { MainDAO } from "../dao/MainDAO";
import { AppDataSource } from "../data-source";
import { Category } from "../entity/Category";

const dao = new MainDAO();

class ProductController {

  public getAllProducts = async (req: Request, res: Response) => {
    try {
      const products = await dao.getAllProducts();
      res.status(200).render("products", { products });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };

  public getProductById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const product = await dao.getProductById(id);
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };

  public createProduct = async (req: Request, res: Response) => {
    try {
      const newProduct = await dao.createProduct(req.body);
      res.status(201).json(newProduct);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };

  public updateProduct = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await dao.updateProduct(id, req.body);
      if (!updated) return res.status(404).json({ message: "Product not found" });
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };

  public getProductsByPriceRange = async (req: Request, res: Response) => {
    try {
      const min = parseFloat(req.query.min as string);
      const max = parseFloat(req.query.max as string);

      if (isNaN(min) || isNaN(max)) {
        return res.status(400).json({ message: "Use valid min and max parameters, e.g., ?min=10&max=50" });
      }

      const results = await dao.getProductsByPriceRange(min, max);
      res.json(results);
    } catch (err) {
      console.error("getProductsByPriceRange error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };

  public deleteProduct = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await dao.deleteProduct(id);
      if (!deleted) return res.status(404).json({ message: "Product not found" });
      res.status(204).send();
    }
    catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };

  public createMultipleProducts = async (req: Request, res: Response) => {
    try {
      let productsData: any[] = req.body.products;

      if (!Array.isArray(productsData) || productsData.length === 0) {
        return res.status(400).render("admin/addProduct", { message: "No products entered" });
      }

      productsData = productsData.map(p => ({
        name: p.name,
        price: parseFloat(p.price),
        stock: parseInt(p.stock),
        category: p.categoryId ? { id: parseInt(p.categoryId) } : undefined,
      }));

      await dao.createMultipleProducts(productsData);

      res.redirect("/admin");
    } catch (err) {
      console.error("createMultipleProducts error:", err);
      res.status(500).render("admin/addProduct", { message: "Error adding products" });
    }
  };


  public showAddProductForm = async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await AppDataSource.getRepository(Category).find();
      res.status(200).render("admin/addProduct", { string: "", categories });
    } catch (error) {
      console.error("Error loading form:", error);
      res.status(500).send("Error loading form.");
    }
  };

  public handleAddProductForm = async (req: Request, res: Response): Promise<void> => {
    try {
      const categoryRepo = AppDataSource.getRepository(Category);
      let productsData: any[] = req.body.products;

      if (!Array.isArray(productsData) || productsData.length === 0) {
        const categories = await categoryRepo.find();
        return res
          .status(400)
          .render("admin/addProduct", { message: "No products entered", categories });
      }

      const formattedProducts: any[] = [];

      for (const p of productsData) {
        const { name, price, stock, categoryId } = p;

        if (!name || !price || !stock || !categoryId) {
          const categories = await categoryRepo.find();
          return res
            .status(400)
            .render("admin/addProduct", { message: "Fill in all fields", categories });
        }

        const category = await categoryRepo.findOneBy({ id: Number(categoryId) });
        if (!category) {
          const categories = await categoryRepo.find();
          return res
            .status(400)
            .render("admin/addProduct", { message: "Category not found", categories });
        }

        formattedProducts.push({
          name,
          price: parseFloat(price),
          stock: parseInt(stock),
          category,
        });
      }

      await dao.createMultipleProducts(formattedProducts);

      res.redirect("/admin");
    } catch (error) {
      console.error("createMultipleProducts error:", error);
      const categoryRepo = AppDataSource.getRepository(Category);
      const categories = await categoryRepo.find();
      res.status(500).render("admin/addProduct", { message: "Error adding products", categories });
    }
  };

  public getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const products = await dao.getProductsByCategory(categoryId);

      if (!products.length) {
        return res.status(404).render("productsByCategory", {
          message: "No products found for this category",
          categoryName: "Unknown",
          products: [],
        });
      }

      const categoryName = products[0].category?.name || "Unknown";
      res.status(200).render("productsByCategory", { products, categoryName });
    } catch (error) {
      console.error("Error fetching products by category:", error);
      res.status(500).json({ error: "Failed to fetch products by category" });
    }
  };

}


export default new ProductController();