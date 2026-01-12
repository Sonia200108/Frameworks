import { Router } from "express";
import ProductController from "../controller/productController";
import CategoryController from "../controller/categoryController";
import CustomerController from "../controller/customerController";
import OrderController from "../controller/orderController";
import indexController from "../controller/indexController";

export const router = Router();

// Home + Admin
router.get("/", indexController.getIndexPage);
router.get("/admin", indexController.getAdminPage);

// Admin Product Form Routes
router.get("/admin/products/add", ProductController.showAddProductForm);
router.post("/admin/products/submitFormProduct", ProductController.handleAddProductForm);
router.post("/products/multiple", ProductController.createMultipleProducts);

router.get("/admin/categories/add", CategoryController.showAddCategoryForm);
router.post("/admin/categories/submitFormCategory", CategoryController.handleAddCategoryForm);

router.get("/admin/customers/add", CustomerController.showAddCustomerForm);
router.post("/admin/customers/submitFormCustomer", CustomerController.handleAddCustomerForm);

router.get("/admin/orders/add", OrderController.showAddOrderForm);
router.post("/admin/orders/submitFormOrder", OrderController.handleAddOrderForm);

// API Routes
router.get("/products", ProductController.getAllProducts);
router.get("/products/price", ProductController.getProductsByPriceRange);
router.get("/products/:id", ProductController.getProductById);
router.post("/products", ProductController.createProduct);
router.put("/products/:id", ProductController.updateProduct);
router.delete("/products/:id", ProductController.deleteProduct);
router.get("/products/category/:categoryId", ProductController.getProductsByCategory);

router.get("/categories", CategoryController.getAllCategories);
router.get("/categories/:id", CategoryController.getCategoryById);
router.post("/categories", CategoryController.createCategory);
router.put("/categories/:id", CategoryController.updateCategory);
router.delete("/categories/:id", CategoryController.deleteCategory);

router.get("/customers", CustomerController.showAllCustomers);
router.get("/customers/:id", CustomerController.getCustomerById);
router.post("/customers", CustomerController.createCustomer);
router.put("/customers/:id", CustomerController.updateCustomer);
router.delete("/customers/:id", CustomerController.deleteCustomer);

router.get("/orders", OrderController.getAllOrders);
router.get("/orders/:id", OrderController.getOrderById);
router.post("/orders", OrderController.createOrder);
router.put("/orders/:id", OrderController.updateOrder);
router.delete("/orders/:id", OrderController.deleteOrder);
router.get("/customers/:id/orders", OrderController.getOrdersByCustomer);

//socket route
router.get('/socket', (req, res) => {
    res.render('socket', { title: 'Product Count' });
});
