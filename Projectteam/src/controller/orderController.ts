import { Request, Response } from "express";
import { MainDAO } from "../dao/MainDAO";
import { Product } from "../entity/Product";


const dao = new MainDAO();

class orderController {

    public getAllOrders = async (req: Request, res: Response): Promise<void> => {
        try {
            const orders = await dao.getAllOrders();
            res.status(200).render("orders", { orders });
        } catch (error) {
            console.error("Error loading orders:", error);
            res.status(500).send("Error loading orders");
        }
    };

    public getOrdersByCustomer = async (req: Request, res: Response) => {
        try {
            const customerId = parseInt(req.params.customerId);
            if (isNaN(customerId)) {
                return res.status(400).json({ message: "Invalid customer ID" });
            }

            const customer = await dao.getCustomerById(customerId);
            if (!customer) {
                return res.status(404).json({ message: "Customer not found" });
            }

            const orders = await dao.getOrdersByCustomer(customerId);
            res.status(200).json(orders);

        } catch (err) {
            console.error("getOrdersByCustomer error:", err);
            res.status(500).json({ message: "Server error" });
        }
    };

    public getOrderById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const order = await dao.getOrderById(id);
            if (!order) return res.status(404).json({ message: "Order not found" });
            res.status(200).json(order);
        } catch (err) {
            console.error("getOrderById error:", err);
            res.status(500).json({ message: "Server error" });
        }
    };

    public createOrder = async (req: Request, res: Response) => {
        try {
            const { customerId, productIds, total } = req.body;

            const customer = await dao.getCustomerById(customerId);
            if (!customer) return res.status(400).json({ message: "Invalid customer ID" });

            const products = await Promise.all(
                (productIds || []).map((id: number) => dao.getProductById(id))
            );

            const validProducts = products.filter((p): p is Product => !!p);
            if (validProducts.length === 0)
                return res.status(400).json({ message: "No valid products found" });

            const newOrder = await dao.createOrder({
                date: new Date(),
                total,
                customer,
                products: validProducts,
            });

            res.status(201).json(newOrder);
        } catch (err) {
            console.error("createOrder error:", err);
            res.status(500).json({ message: "Server error" });
        }
    };

    public updateOrder = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const updated = await dao.updateOrder(id, req.body);
            if (!updated) return res.status(404).json({ message: "Order not found" });
            res.status(200).json(updated);
        } catch (err) {
            console.error("updateOrder error:", err);
            res.status(500).json({ message: "Server error" });
        }
    };
    public deleteOrder = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const deleted = await dao.deleteOrder(id);
            if (!deleted) return res.status(404).json({ message: "Order not found" });
            res.status(200).json({ message: "Order deleted successfully" });
        } catch (err) {
            console.error("deleteOrder error:", err);
            res.status(500).json({ message: "Server error" });
        }
    };

    public showAddOrderForm = async (req: Request, res: Response) => {
        try {
            const customers = await dao.getAllCustomers();
            const products = await dao.getAllProducts();
            res.status(200).render("admin/addOrder", { customers, products, message: null });
        } catch (error) {
            console.error("showAddOrderForm error:", error);
            res.status(500).json({ error: "Failed to display order form" });
        }
    };

    public handleAddOrderForm = async (req: Request, res: Response) => {
        try {
            const { customerId, productIds } = req.body;

            const customer = await dao.getCustomerById(Number(customerId));
            if (!customer) {
                return res.status(400).render("admin/addOrder", { message: "Invalid customer" });
            }

            const selectedProducts = await Promise.all(
                (Array.isArray(productIds) ? productIds : [productIds]).map((id: string) =>
                    dao.getProductById(Number(id))
                )
            );

            const products = selectedProducts.filter((p): p is Product => !!p);
            if (products.length === 0) {
                return res.status(400).render("admin/addOrder", { message: "No valid products selected" });
            }

            const total = products.reduce((sum, p) => sum + Number(p.price), 0);

            await dao.createOrder({
                date: new Date(),
                total,
                customer,
                products,
            });

            res.redirect("/admin");

        } catch (error) {
            console.error("handleAddOrderForm error:", error);
            res.status(500).render("admin/addOrder", { message: "Error adding order" });
        }
    };
}

export default new orderController();