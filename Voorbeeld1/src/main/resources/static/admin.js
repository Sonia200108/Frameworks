// CSRF-token uit Spring Security cookie halen
function getCsrfToken() {
    const name = "XSRF-TOKEN=";
    const decoded = decodeURIComponent(document.cookie);
    const parts = decoded.split(';');

    for (let c of parts) {
        c = c.trim();
        if (c.startsWith(name)) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

async function loadProducts() {
    const res = await fetch("/product");
    const products = await res.json();

    const div = document.getElementById("productList");
    div.innerHTML = "";

    products.forEach(p => {
        const item = document.createElement("div");
        item.innerHTML = `
            <p>
                <strong>${p.name}</strong><br>
                ${p.description}<br>
                Hoeveelheid: ${p.quantity} — Prijs: €${p.price}<br>

                <button onclick="deleteProduct(${p.id})">Verwijderen</button>
                <button onclick="editProduct(${p.id})">Aanpassen</button>
            </p>
            <hr>
        `;
        div.appendChild(item);
    });
}

document.getElementById("addForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const product = {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        quantity: Number(document.getElementById("quantity").value),
        price: Number(document.getElementById("price").value)
    };

    await fetch("/product", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": getCsrfToken()
        },
        body: JSON.stringify(product)
    });

    loadProducts();
});

async function deleteProduct(id) {
    await fetch(`/product/${id}`, {
        method: "DELETE",
        headers: {
            "X-XSRF-TOKEN": getCsrfToken()
        }
    });
    loadProducts();
}

async function editProduct(id) {
    const name = prompt("Nieuwe naam?");
    const description = prompt("Nieuwe omschrijving?");
    const quantity = prompt("Nieuwe hoeveelheid?");
    const price = prompt("Nieuwe prijs?");

    const updated = {
        id: id,
        name,
        description,
        quantity: Number(quantity),
        price: Number(price)
    };

    await fetch(`/product/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": getCsrfToken()
        },
        body: JSON.stringify(updated)
    });

    loadProducts();
}

window.onload = loadProducts;
