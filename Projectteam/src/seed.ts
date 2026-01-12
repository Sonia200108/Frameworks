import { AppDataSource } from "./data-source";
import { Category } from "./entity/Category";
import { Product } from "./entity/Product";
import { Customer } from "./entity/Customer";
import { Profile } from "./entity/Profile";
import { Order } from "./entity/Order";

AppDataSource.initialize()
    .then(async () => {
        console.log("✅ Database connected. Seeding data...");

        const Electronics = new Category();
        Electronics.name = "Electronics";

        const Furniture = new Category();
        Furniture.name = "Furniture";

        await AppDataSource.manager.save([Electronics, Furniture]);

        const monitor = new Product();
        monitor.name = "Monitor";
        monitor.price = 199.99;
        monitor.stock = 25;
        monitor.category = Electronics;

        const mouse = new Product();
        mouse.name = "Mouse";
        mouse.price = 1.50;
        mouse.stock = 100;
        mouse.category = Electronics;

        const desk = new Product();
        desk.name = "Desk";
        desk.price = 7.50;
        desk.stock = 40;
        desk.category = Furniture;

        await AppDataSource.manager.save([monitor, mouse, desk]);

        const profile1 = new Profile();
        profile1.address = "Main Street 1";
        profile1.phone = "0495 12 34 56";

        const customer1 = new Customer();
        customer1.name = "Alice";
        customer1.email = "alice@mail.com";
        customer1.isActive = true;
        customer1.profile = profile1;
        await AppDataSource.manager.save(customer1);

        const profile2 = new Profile();
        profile2.address = "Parklaan 22";
        profile2.phone = "0477 98 76 54";

        const customer2 = new Customer();
        customer2.name = "Bob";
        customer2.email = "bob@mail.com";
        customer2.isActive = true;
        customer2.profile = profile2;
        await AppDataSource.manager.save(customer2);

        const order1 = new Order();
        order1.date = new Date();
        order1.total = monitor.price + mouse.price;
        order1.customer = customer1;
        order1.products = [monitor, mouse];
        await AppDataSource.manager.save(order1);

        console.log("Dummy data successfully inserted!");
        process.exit();
    })
    .catch((err) => {
        console.error("Error seeding data:", err);
        process.exit(1);
    });
