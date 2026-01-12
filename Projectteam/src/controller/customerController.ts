import { Request, Response } from "express";
import { MainDAO } from "../dao/MainDAO";
import { Profile } from "../entity/Profile";

const dao = new MainDAO();

class customerController {
    public showAllCustomers = async (req: Request, res: Response): Promise<void> => {
        try {
            const customers = await dao.getAllCustomers();
            res.status(200).render("customers", { customers });
        } catch (error) {
            console.error("Error fetching customers:", error);
            res.status(500).json({ error: "Failed to fetch customers" });
        }
    };

    public getCustomerById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const customer = await dao.getCustomerById(id);
            if (!customer) return res.status(404).json({ message: "Customer not found" });
            res.json(customer);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    };

    public createCustomer = async (req: Request, res: Response) => {
        try {
            const { name, email, address, phone } = req.body;
            const profile = new Profile();
            profile.address = address;
            profile.phone = phone;

            const newCustomer = await dao.createCustomer({ name, email, profile });
            res.status(201).json(newCustomer);
        } catch (err) {
            console.error("createCustomer error:", err);
            res.status(500).json({ message: "Server error" });
        }
    };

    public updateCustomer = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const updated = await dao.updateCustomer(id, req.body);
            if (!updated) return res.status(404).json({ message: "Customer not found" });
            res.status(200).json(updated);
        } catch (err) {
            console.error("updateCustomer error:", err);
            res.status(500).json({ message: "Server error" });
        }
    };

    public deleteCustomer = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const deleted = await dao.deleteCustomer(id);
            if (!deleted) return res.status(404).json({ message: "Customer not found" });
            res.status(200).json({ message: "Customer deleted successfully" });
        } catch (err) {
            console.error("deleteCustomer error:", err);
            res.status(500).json({ message: "Server error" });
        }
    };

    public showAddCustomerForm = async (req: Request, res: Response): Promise<void> => {
        try {
            res.status(200).render("admin/addCustomer", {});
        } catch (error) {
            res.status(500).json({ error: 'Failed to display page' });
        }
    };

    public handleAddCustomerForm = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, address, phone } = req.body;

            if (!name || !email || !address || !phone) {
                return res.status(400).render("admin/addCustomer", { message: "Fill in all fields" });
            }

            const profile = new Profile();
            profile.address = address;
            profile.phone = phone;

            const newCustomer = await dao.createCustomer({
                name,
                email,
                profile,
            });

            console.log("New customer added:", newCustomer);
            res.redirect("/admin");

        } catch (error) {
            console.error("handleAddCustomerForm error:", error);
            res.status(500).render("admin/addCustomer", { message: "Error adding customer" });
        }
    }

}

export default new customerController();