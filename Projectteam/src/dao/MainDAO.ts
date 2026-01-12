import { AppDataSource } from '../data-source';
import { Admin } from '../entity/Admin';
import { Category } from '../entity/Category';
import { Customer } from '../entity/Customer';
import { Order } from '../entity/Order';
import { Product } from '../entity/Product';
import { Profile } from '../entity/Profile';
import { User } from '../entity/User';

export class MainDAO {
    private productRepository = AppDataSource.getRepository(Product);
    private categoryRepository = AppDataSource.getRepository(Category);
    private customerRepository = AppDataSource.getRepository(Customer);
    private orderRepository = AppDataSource.getRepository(Order);
    private adminRepository = AppDataSource.getRepository(Admin);
    private profileRepository = AppDataSource.getRepository(Profile);

    // Product methods DAO methods
    public async getAllProducts(): Promise<Product[]> {
        return await this.productRepository.find({ relations: ['category', 'orders'] });
    }

    public async getProductById(id: number): Promise<Product | null> {
        return await this.productRepository.findOne({
            where: { id },
            relations: ['category', 'orders'],
        });
    }

    public async getProductsByPriceRange(min: number, max: number): Promise<Product[]> {
        return await this.productRepository
            .createQueryBuilder("product")
            .where("product.price BETWEEN :min AND :max", { min, max })
            .getMany();
    }

    public async getProductsByCategory(categoryId: number): Promise<Product[]> {
        return await this.productRepository.find({
            where: { category: { id: categoryId } },
            relations: ['category', 'orders'],
        });
    }

    public async createProduct(productData: Partial<Product>): Promise<Product> {
        const product = this.productRepository.create(productData);
        return await this.productRepository.save(product);
    }

    public async updateProduct(id: number, data: Partial<Product>): Promise<Product | null> {
        await this.productRepository.update(id, data);
        return await this.getProductById(id);
    }

    public async createMultipleProducts(products: Partial<Product>[]): Promise<Product[]> {
        const newProducts = this.productRepository.create(products);
        return await this.productRepository.save(newProducts);
    }

    public async deleteProduct(id: number): Promise<boolean> {
        const result = await this.productRepository.delete(id);
        return result.affected !== 0;
    }

    // Category methods DAO methods

    public async getAllCategories(): Promise<Category[]> {
        return await this.categoryRepository.find({ relations: ['products'] });
    }
    public async getCategoryById(id: number): Promise<Category | null> {
        return await this.categoryRepository.findOne({
            where: { id },
            relations: ['products'],
        });
    }

    public async createCategory(categoryData: Partial<Category>): Promise<Category> {
        const category = this.categoryRepository.create(categoryData);
        return await this.categoryRepository.save(category);
    }

    public async updateCategory(id: number, data: Partial<Category>): Promise<Category | null> {
        await this.categoryRepository.update(id, data);
        return await this.getCategoryById(id);
    }

    public async deleteCategory(id: number): Promise<boolean> {
        const result = await this.categoryRepository.delete(id);
        return result.affected !== 0;
    }

    // Customer methods DAO methods
    public async getAllCustomers(): Promise<Customer[]> {
        return await this.customerRepository.find({ relations: ['orders', 'profile'] });
    }

    public async getCustomerById(id: number): Promise<Customer | null> {
        return await this.customerRepository.findOne({
            where: { id },
            relations: ['orders', 'profile'],
        });
    }
    public async createCustomer(customerData: Partial<Customer>): Promise<Customer> {
        const customer = new Customer();
        customer.name = customerData.name!;
        customer.email = customerData.email!;
        customer.isActive = true;
        if (customerData.profile) {
            customer.profile = customerData.profile;
        }

        return await this.customerRepository.save(customer);
    }
    public async updateCustomer(id: number, data: Partial<Customer>): Promise<Customer | null> {
        await this.customerRepository.update(id, data);
        return await this.getCustomerById(id);
    }

    public async deleteCustomer(id: number): Promise<boolean> {
        const result = await this.customerRepository.delete(id);
        return result.affected !== 0;
    }

    // Order methods DAO methods
    public async getAllOrders(): Promise<Order[]> {
        return await this.orderRepository.find({
            relations: ["customer", "products"],
        });
    }

    public async getOrderById(id: number): Promise<Order | null> {
        return await this.orderRepository.findOne({
            where: { id },
            relations: ["customer", "products"],
        });
    }

    public async createOrder(orderData: Partial<Order>): Promise<Order> {
        const order = this.orderRepository.create(orderData);
        return await this.orderRepository.save(order);
    }

    public async updateOrder(id: number, data: Partial<Order>): Promise<Order | null> {
        await this.orderRepository.update(id, data);
        return await this.getOrderById(id);
    }

    public async deleteOrder(id: number): Promise<boolean> {
        const result = await this.orderRepository.delete(id);
        return result.affected !== 0;
    }

    public async getOrdersByCustomer(customerId: number): Promise<Order[]> {
        return await this.orderRepository.find({
            where: { customer: { id: customerId } },
            relations: ["customer", "products"],
        });
    }
}