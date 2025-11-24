let allProducts = [];

async function loadProducts() {
    const res = await fetch("/product");
    allProducts = await res.json();
    display(allProducts);
}

function display(list) {
    const div = document.getElementById("productList");
    div.innerHTML = "";

    list.forEach(p => {
        const item = document.createElement("p");
        item.innerHTML = `
            <strong>${p.name}</strong><br>
            ${p.description}<br>
            Hoeveelheid: ${p.quantity} — Prijs: €${p.price}
            <hr>
        `;
        div.appendChild(item);
    });
}

function searchProducts() {
    const term = document.getElementById("search").value.toLowerCase();

    const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );

    display(filtered);
}

window.onload = loadProducts;
