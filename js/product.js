// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");


// ========================================
// LOAD PRODUCT
// ========================================

async function loadProduct() {

    if (!productId) {
        document.getElementById("loading").innerHTML =
            "<h2>Product not found</h2>";
        return;
    }


    const { data, error } =
        await supabaseClient
            .from("product")
            .select("*")
            .eq("id", productId)
            .single();


    if (error) {

        console.error(error);

        document.getElementById("loading").innerHTML =
            "<h2>Unable to load product</h2>";

        return;
    }


    // Hide loading
    document.getElementById("loading").style.display = "none";

    // Show product
    document.getElementById("product-details").style.display = "grid";


    // ========================================
    // PRODUCT IMAGE
    // ========================================

    const image =
        document.getElementById("product-image");

    if (data.image_url) {

        image.src = data.image_url;

    } else {

        image.style.display = "none";

    }


    // ========================================
    // PRODUCT INFORMATION
    // ========================================

    document.getElementById("product-name").textContent =
        data.name || "Product";

    document.getElementById("product-category").textContent =
        data.category || "";

    document.getElementById("product-price").textContent =
        data.price || "0";

    document.getElementById("product-sizes").textContent =
        data.sizes || "Not specified";

    document.getElementById("product-description").textContent =
        data.description || "No description available.";


    // ========================================
    // STOCK STATUS
    // ========================================

    const stockElement =
        document.getElementById("product-stock");

    const orderButton =
        document.getElementById("whatsapp-order");

    const stock =
        Number(data.stock) || 0;


    if (stock > 0) {

        stockElement.textContent =
            `${stock} — In Stock`;

        stockElement.className =
            "stock-available";

    } else {

        stockElement.textContent =
            "Out of Stock";

        stockElement.className =
            "stock-unavailable";

        orderButton.style.display =
            "none";

    }


    // ========================================
    // WHATSAPP ORDER
    // ========================================

    const whatsappNumber =
        "91XXXXXXXXXX";


    const message =
        `Hello, I want to order this product:%0A%0A` +
        `Product: ${data.name}%0A` +
        `Price: ₹${data.price}%0A` +
        `Size: ${data.sizes || "Not specified"}`;


    orderButton.href =
        `https://wa.me/${whatsappNumber}?text=${message}`;
}


// ========================================
// START
// ========================================

loadProduct();