const productsContainer =
    document.getElementById("products-container");

let allProducts = [];

const whatsappNumber =
    "918433286987";


// ========================================
// LOAD PRODUCTS
// ========================================

async function loadProducts() {

    productsContainer.innerHTML =
        `<p class="loading">Loading products...</p>`;

    const { data, error } =
        await supabaseClient
            .from("product")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    if (error) {

        console.error(
            "Product loading error:",
            error
        );

        productsContainer.innerHTML =
            `<p class="no-products">
                Unable to load products.
            </p>`;

        return;
    }

    console.log(
        "Products:",
        data
    );

    allProducts = data || [];

    // URL se category check karo
    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    const category =
        urlParams.get("category");

    if (category) {

        filterByCategory(category);

    } else {

        displayProducts(allProducts);

    }
}


// ========================================
// DISPLAY PRODUCTS
// ========================================

function displayProducts(products) {

    if (products.length === 0) {

        productsContainer.innerHTML =
            `<p class="no-products">
                No products available yet.
            </p>`;

        return;
    }

    productsContainer.innerHTML = "";


    products.forEach(product => {

        const card =
            document.createElement("div");

        card.className =
            "product-card";


        // IMAGE

        let imageHTML = `
            <div class="no-image">
                No Image
            </div>
        `;

        if (product.image_url) {

            imageHTML = `
                <img
                    src="${product.image_url}"
                    alt="${product.name}"
                >
            `;
        }


        // STOCK

        const stock =
            Number(product.stock) || 0;

        let stockHTML = "";

        let orderButtonHTML = "";


        if (stock > 0) {

            stockHTML = `
                <div class="product-stock in-stock">
                    ● ${stock} In Stock
                </div>
            `;


            const message =
                `Hello, I want to order this product:%0A%0A` +
                `Product: ${product.name}%0A` +
                `Price: ₹${product.price}%0A` +
                `Size: ${product.sizes || "Not specified"}`;


            orderButtonHTML = `
                <a
                    href="https://wa.me/${whatsappNumber}?text=${message}"
                    target="_blank"
                    class="order-btn"
                >
                    Order on WhatsApp
                </a>
            `;

        } else {

            stockHTML = `
                <div class="product-stock out-of-stock">
                    ● Out of Stock
                </div>
            `;


            orderButtonHTML = `
                <button
                    class="order-btn disabled-order"
                    disabled
                >
                    Out of Stock
                </button>
            `;
        }


        // CARD

        card.innerHTML = `

            <div class="product-image">

                ${imageHTML}

            </div>


            <div class="product-info">

                <div class="product-category">
                    ${product.category || ""}
                </div>


                <h3 class="product-name">
                    ${product.name}
                </h3>


                <div class="product-price">
                    ₹${product.price}
                </div>


                <div class="product-size">
                    Sizes:
                    ${product.sizes || "Available on request"}
                </div>


                ${stockHTML}


                <div class="product-buttons">

                    <a
                        href="product.html?id=${product.id}"
                        class="view-btn"
                    >
                        View Details
                    </a>


                    ${orderButtonHTML}

                </div>

            </div>

        `;


        productsContainer.appendChild(card);

    });
}


// ========================================
// CATEGORY FILTER
// ========================================

function filterByCategory(category) {

    let filteredProducts = [];


    if (category === "all") {

        filteredProducts =
            allProducts;

    } else {

        filteredProducts =
            allProducts.filter(product => {

                const productCategory =
                    (product.category || "")
                        .toLowerCase()
                        .trim();

                const selectedCategory =
                    category
                        .toLowerCase()
                        .trim();


                // T-Shirt
                if (
                    selectedCategory === "tshirt"
                ) {

                    return (
                        productCategory === "t-shirt" ||
                        productCategory === "t-shirts" ||
                        productCategory === "tshirt" ||
                        productCategory === "tshirts"
                    );
                }


                // Lower
                if (
                    selectedCategory === "lower"
                ) {

                    return (
                        productCategory === "lower" ||
                        productCategory === "lowers"
                    );
                }


                // Shorts
                if (
                    selectedCategory === "shorts"
                ) {

                    return (
                        productCategory === "short" ||
                        productCategory === "shorts"
                    );
                }


                // Custom
                if (
                    selectedCategory === "custom"
                ) {

                    return (
                        productCategory === "custom" ||
                        productCategory === "custom wear"
                    );
                }


                return (
                    productCategory ===
                    selectedCategory
                );

            });
    }


    displayProducts(
        filteredProducts
    );


    // Active button

    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    filterButtons.forEach(button => {

        button.classList.remove(
            "active"
        );


        const buttonCategory =
            button.dataset.category;


        if (
            buttonCategory === category
        ) {

            button.classList.add(
                "active"
            );

        }

    });

}


// ========================================
// FILTER BUTTONS
// ========================================

const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );


filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const category =
                button.dataset.category;


            // URL update

            if (
                category === "all"
            ) {

                window.history.replaceState(
                    {},
                    "",
                    "products.html"
                );

            } else {

                window.history.replaceState(
                    {},
                    "",
                    `products.html?category=${category}`
                );

            }


            filterByCategory(
                category
            );

        }
    );

});


// ========================================
// START
// ========================================

loadProducts();