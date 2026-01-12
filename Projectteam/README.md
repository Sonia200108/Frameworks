# Team24 Project– Frameworks voor Serverapplicaties
## Projectoverzicht

Dit project is een Node.js + Express webapplicatie ontwikkeld als groepsproject voor het vak Frameworks voor serverapplicaties. De applicatie simuleert een kleine webshop waarin producten, categorieën, klanten en orders beheerd worden via een combinatie van:
- RESTful API-endpoints
- Dynamische Pug-views voor weergave
- Een relationele database beheerd via TypeORM

## Team

Team: Team24

Leden: Jens en Sonia

## Installatie & opstart

### Op de UGent-VM 

Alles is volledig geconfigureerd:

- Node.js, npm en TypeORM zijn geïnstalleerd  
- De MySQL-database is aanwezig en voorzien van de juiste gebruikersrechten  
- data-source.ts zijn ingesteld voor gebruik op de VM 
  
Voer enkel de volgende commando’s uit:

```bash
npm install
npm run seed
npm start
```


### Installatie (lokaal)
Instalatie

```bash
npm install
```

Databaseconfiguratie
Maak lokaal een MySQL-database aan en voer het volgende uit in MySQL Workbench of CLI:

```sql
CREATE DATABASE frameworks_db;
CREATE USER 'team24'@'localhost' IDENTIFIED BY 'team24';
GRANT ALL PRIVILEGES ON team24.* TO 'team24'@'localhost';
FLUSH PRIVILEGES;
```

De connectie-instellingen in data-source.ts moeten overeenkomen met:

```ts
type: "mysql",
host: "localhost",
port: 3306,
username: "team24",
password: "team24",
database: "frameworks_db",
```

Seed uitvoeren (dummydata toevoegen)

```bash
npm run seed
```
Start de server
```bash
npm start
```

Open dan http://localhost:3000 in je browser.

## Architectuur & lagen
De app is opgebouwd volgens een gescheiden lagenstructuur:

- Entity-laag: definieert de databanktabellen met TypeORM (User, Customer, Admin, Product, Order, Category, Profile).

- DAO-laag (MainDAO): bevat alle logica voor databanktoegang (CRUD-operaties, query’s met filters zoals price range of categorie).

- Controller-laag: handelt HTTP-verzoeken af en roept DAO-methodes aan.

- Route-laag: koppelt Express-routes aan de juiste controllerfuncties.

- View-laag (Pug): rendert de dynamische HTML-pagina’s zoals index, products, admin, customers.

## API endpoints

### Home & Admin

| Methode | Route  | Beschrijving                                                                               |
| ------- | ------ | ------------------------------------------------------------------------------------------ |
| GET     | /      | Toont de homepagina.                                                                       |
| GET     | /admin | Toont het admin-dashboard met beheeropties voor producten, klanten, categorieën en orders. |

---

### Product Routes

| Methode | Route                             | Beschrijving                                                         |
| ------- | --------------------------------- | -------------------------------------------------------------------- |
| GET     | /admin/products/add               | Toont het formulier om een nieuw product toe te voegen.              |
| POST    | /admin/products/submitFormProduct | Verwerkt het formulier voor het toevoegen van een product.           |
| POST    | /products/multiple                | Laat toe om meerdere producten tegelijk toe te voegen (bulk insert). |
| GET     | /products                         | Haalt alle producten.                                                |
| GET     | /products/price                   | Haalt producten op binnen een opgegeven prijsrange.                  |
| GET     | /products/:id                     | Haalt één specifiek product op via ID.                               |
| POST    | /products                         | Maakt een nieuw product aan.                                         |
| PUT     | /products/:id                     | Wijzigt een bestaand product.                                        |
| DELETE  | /products/:id                     | Verwijdert een product op basis van ID.                              |
| GET     | /products/category/:categoryId    | Haalt alle producten op binnen een specifieke categorie.             |

---

### Category Routes

| Methode | Route                                | Beschrijving                                                 |
| ------- | ------------------------------------ | ------------------------------------------------------------ |
| GET     | /admin/categories/add                | Toont het formulier om een nieuwe categorie toe te voegen.   |
| POST    | /admin/categories/submitFormCategory | Verwerkt het formulier voor het toevoegen van een categorie. |
| GET     | /categories                          | Haalt alle categorieën op.                                   |
| GET     | /categories/:id                      | Haalt één specifieke categorie op via ID.                    |
| POST    | /categories                          | Maakt een nieuwe categorie aan.                              |
| PUT     | /categories/:id                      | Wijzigt een bestaande categorie.                             |
| DELETE  | /categories/:id                      | Verwijdert een categorie.                                    |

---

### Customer Routes

| Methode | Route                               | Beschrijving                                             |
| ------- | ----------------------------------- | -------------------------------------------------------- |
| GET     | /admin/customers/add                | Toont het formulier om een nieuwe klant toe te voegen.   |
| POST    | /admin/customers/submitFormCustomer | Verwerkt het formulier voor het toevoegen van een klant. |
| GET     | /customers                          | Toont of retourneert een lijst van alle klanten.         |
| GET     | /customers/:id                      | Haalt gegevens op van één specifieke klant.              |
| POST    | /customers                          | Maakt een nieuwe klant aan.                              |
| PUT     | /customers/:id                      | Wijzigt een bestaande klant.                             |
| DELETE  | /customers/:id                      | Verwijdert een klant.                                    |

---

### Order Routes

| Methode | Route                         | Beschrijving                                                      |
| ------- | ----------------------------- | ----------------------------------------------------------------- |
| GET     | /admin/orders/add             | Toont het formulier om een nieuwe order toe te voegen.            |
| POST    | /admin/orders/submitFormOrder | Verwerkt het formulier voor het toevoegen van een order.          |
| GET     | /orders                       | Haalt alle orders op.                                             |
| GET     | /orders/:id                   | Haalt één specifieke order op via ID.                             |
| POST    | /orders                       | Maakt een nieuwe order aan.                                       |
| PUT     | /orders/:id                   | Wijzigt een bestaande order.                                      |
| DELETE  | /orders/:id                   | Verwijdert een order.                                             |
| GET     | /customers/:id/orders         | Haalt alle orders op die gekoppeld zijn aan een specifieke klant. |

---

### Socket Route

| Methode | Route   | Beschrijving                                                                        |
| ------- | ------- | ----------------------------------------------------------------------------------- |
| GET     | /socket | Rendert de socket-view die real-time updates toont (aantal producten in de winkel). |


## Datalaag – Overzicht & Vereisten

### DAO-object
De klasse MainDAO werkt als centrale toegangspoort tot de database.  
Ze bevat methoden om objecten op te vragen, toe te voegen, aan te passen en te verwijderen.

### Relaties

| Type  | Entiteiten         | Beschrijving                                                                                  | Cascade        |
| ----- | ------------------ | --------------------------------------------------------------------------------------------- | -------------- |
| 1 - 1 | Customer - Profile | Eén klant heeft één profiel                                                                   | Met cascade    |
| 1 - n | Customer - Order   | Eén klant kan meerdere bestellingen plaatsen                                                  | Zonder cascade |
| n - n | Order - Product    | Een bestelling bevat meerdere producten en een product kan in meerdere bestellingen voorkomen | Zonder cascade |

---

### Overerving
De klassen Admin en Customer erven van de abstracte basisklasse User.

### Object toevoegen

De DAO ondersteunt het toevoegen van één object via bijvoorbeeld:
```ts
public createProduct = async (req: Request, res: Response) => {
    try {
      const newProduct = await dao.createProduct(req.body);
      res.status(201).json(newProduct);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
};
```

### Verzameling van objecten toevoegen

Met createMultipleProducts() kan in één bewerking een hele reeks producten worden toegevoegd:

```ts

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
```

### Objecten opvragen (lazy & non-lazy)

#### Niet-lazy
De meeste DAO-methoden laden hun relaties onmiddellijk mee via het relations-attribuut van TypeORM.  
Bijvoorbeeld:
```ts
public async getAllProducts(): Promise<Product[]> {
  return await this.productRepository.find({ relations: ['category', 'orders'] });
}
```
De gerelateerde categorieën en orders van elk product worden direct mee opgehaald.

#### Lazy

In de Customer-entiteit is de relatie met orders gedefinieerd als lazy, door het gebruik van een Promise<Order[]>.
Hierdoor worden de orders pas opgehaald wanneer ze effectief worden opgevraagd.

```ts
@OneToMany(() => Order, (order) => order.customer)
orders!: Promise<Order[]>;
```
Dit betekent dat customer.orders een Promise teruggeeft en de bijhorende bestellingen pas uit de database worden geladen wanneer je .then() of await gebruikt.

### Opvraging met parameters
De methode getProductsByPriceRange(min, max) gebruikt queryparameters:
```ts
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
```
### Objecten aanpassen
Bijvoorbeeld via updateProduct() kan je bestaande records wijzigen:
```ts
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
```
