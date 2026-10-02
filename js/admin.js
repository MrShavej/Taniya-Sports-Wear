// ========================================
// LOGIN
// ========================================

const loginForm =
    document.getElementById("login-form");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            const email =
                document.getElementById("email").value;


            const password =
                document.getElementById("password").value;


            const loginMessage =
                document.getElementById("login-message");


            loginMessage.textContent =
                "Logging in...";


            const { data, error } =
                await supabaseClient.auth.signInWithPassword({

                    email: email,
                    password: password

                });


            if (error) {

                console.error(error);

                loginMessage.textContent =
                    error.message;

                return;

            }


            console.log(
                "Login successful:",
                data
            );


            window.location.href =
                "dashboard.html";

        }
    );

}



// ========================================
// CHECK ADMIN LOGIN
// ========================================

async function checkLogin() {

    const { data } =
        await supabaseClient.auth.getSession();


    if (!data.session) {

        window.location.href =
            "login.html";

    }

}



// ========================================
// LOGOUT
// ========================================

const logoutBtn =
    document.getElementById("logout-btn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            await supabaseClient.auth.signOut();

            window.location.href =
                "login.html";

        }
    );

}



// ========================================
// PRODUCT FORM
// ========================================

const productForm =
    document.getElementById("product-form");


const productMessage =
    document.getElementById("product-message");



// ========================================
// ADD / UPDATE PRODUCT
// ========================================

if (productForm) {

    productForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            const editingId =
                productForm.dataset.editingId;


            const name =
                document.getElementById(
                    "product-name"
                ).value;


            const category =
                document.getElementById(
                    "product-category"
                ).value;


            const price =
                document.getElementById(
                    "product-price"
                ).value;


            const sizes =
                document.getElementById(
                    "product-sizes"
                ).value;


            const stock =
                document.getElementById(
                    "product-stock"
                ).value;


            const description =
                document.getElementById(
                    "product-description"
                ).value;


            // ========================================
            // IMAGE FILE
            // ========================================

            const imageInput =
                document.getElementById(
                    "product-image"
                );


            const imageFile =
                imageInput.files[0];


            let image_url = "";



            // ========================================
            // IF EDITING PRODUCT
            // KEEP OLD IMAGE
            // ========================================

            if (editingId) {

                const { data: oldProduct, error: oldProductError } =
                    await supabaseClient
                        .from("product")
                        .select("image_url")
                        .eq(
                            "id",
                            editingId
                        )
                        .single();


                if (oldProductError) {

                    console.error(
                        oldProductError
                    );

                    productMessage.textContent =
                        "Unable to load old product image.";

                    return;

                }


                image_url =
                    oldProduct.image_url || "";

            }



            // ========================================
            // UPLOAD NEW IMAGE
            // ========================================

            if (imageFile) {

                productMessage.textContent =
                    "Uploading image...";


                const fileExtension =
                    imageFile.name
                        .split(".")
                        .pop();


                const fileName =
                    `${Date.now()}-${Math.random()
                        .toString(36)
                        .substring(2)}.${fileExtension}`;


                const { error: uploadError } =
                    await supabaseClient.storage
                        .from("product-images")
                        .upload(
                            fileName,
                            imageFile
                        );


                if (uploadError) {

                    console.error(
                        "Image upload error:",
                        uploadError
                    );


                    productMessage.textContent =
                        "Image upload failed: " +
                        uploadError.message;

                    return;

                }


                // ========================================
                // GET PUBLIC IMAGE URL
                // ========================================

                const { data: publicUrlData } =
                    supabaseClient.storage
                        .from("product-images")
                        .getPublicUrl(
                            fileName
                        );


                image_url =
                    publicUrlData.publicUrl;


                console.log(
                    "Image URL:",
                    image_url
                );

            }



            // ========================================
            // UPDATE EXISTING PRODUCT
            // ========================================

            if (editingId) {

                productMessage.textContent =
                    "Updating product...";


                const { data, error } =
                    await supabaseClient
                        .from("product")
                        .update({

                            name: name,

                            category: category,

                            price: Number(price),

                            sizes: sizes,

                            stock: Number(stock),

                            image_url: image_url,

                            description: description

                        })
                        .eq(
                            "id",
                            editingId
                        )
                        .select();


                if (error) {

                    console.error(error);

                    productMessage.textContent =
                        "Error: " +
                        error.message;

                    return;

                }


                console.log(
                    "Product updated:",
                    data
                );


                productMessage.textContent =
                    "Product updated successfully!";


                productForm.reset();


                delete productForm.dataset.editingId;


                productForm.querySelector(
                    "button[type='submit']"
                ).textContent =
                    "Add Product";


                loadAdminProducts();


                return;

            }



            // ========================================
            // ADD NEW PRODUCT
            // ========================================

            productMessage.textContent =
                "Adding product...";


            const { data, error } =
                await supabaseClient
                    .from("product")
                    .insert([

                        {

                            name: name,

                            category: category,

                            price: Number(price),

                            sizes: sizes,

                            stock: Number(stock),

                            image_url: image_url,

                            description: description

                        }

                    ])
                    .select();


            if (error) {

                console.error(error);

                productMessage.textContent =
                    "Error: " +
                    error.message;

                return;

            }


            console.log(
                "Product added:",
                data
            );


            productMessage.textContent =
                "Product added successfully!";


            productForm.reset();


            loadAdminProducts();

        }
    );

}



// ========================================
// LOAD PRODUCTS
// ========================================

async function loadAdminProducts() {

    const productList =
        document.getElementById(
            "admin-product-list"
        );


    if (!productList) {
        return;
    }


    productList.innerHTML =
        "Loading products...";


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

        console.error(error);

        productList.innerHTML =
            "Error loading products: " +
            error.message;

        return;

    }


    if (!data || data.length === 0) {

        productList.innerHTML =
            "No products found.";

        return;

    }


    productList.innerHTML = "";


    data.forEach(product => {

        const card =
            document.createElement("div");


        card.className =
            "admin-product-card";


        let imageHTML = "";


        if (product.image_url) {

            imageHTML = `

                <img
                    src="${product.image_url}"
                    class="admin-product-image"
                    alt="${product.name}"
                >

            `;

        } else {

            imageHTML = `

                <div class="admin-product-image">
                    No Image
                </div>

            `;

        }


        card.innerHTML = `

            <div class="admin-product-info">

                ${imageHTML}


                <div class="admin-product-details">

                    <h3>
                        ${product.name}
                    </h3>


                    <p>
                        Category: ${product.category}
                    </p>


                    <p>
                        Price: ₹${product.price}
                    </p>


                    <p>
                        Stock: ${product.stock}
                    </p>


                    <p>
                        Sizes:
                        ${product.sizes || "Not specified"}
                    </p>

                </div>

            </div>


            <div class="admin-product-actions">

                <button
                    class="edit-btn"
                    onclick="editProduct('${product.id}')"
                >
                    Edit
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteProduct('${product.id}')"
                >
                    Delete
                </button>

            </div>

        `;


        productList.appendChild(card);

    });

}



// ========================================
// EDIT PRODUCT
// ========================================

async function editProduct(id) {

    const { data: product, error } =
        await supabaseClient
            .from("product")
            .select("*")
            .eq(
                "id",
                id
            )
            .single();


    if (error) {

        console.error(error);

        alert(
            "Error loading product: " +
            error.message
        );

        return;

    }


    document.getElementById(
        "product-name"
    ).value =
        product.name || "";


    document.getElementById(
        "product-category"
    ).value =
        product.category || "";


    document.getElementById(
        "product-price"
    ).value =
        product.price || "";


    document.getElementById(
        "product-sizes"
    ).value =
        product.sizes || "";


    document.getElementById(
        "product-stock"
    ).value =
        product.stock || 0;


    // FILE INPUT KO BLANK RAKHNA HAI
    document.getElementById(
        "product-image"
    ).value = "";


    document.getElementById(
        "product-description"
    ).value =
        product.description || "";


    // Save product ID

    productForm.dataset.editingId =
        id;


    // Change button

    productForm.querySelector(
        "button[type='submit']"
    ).textContent =
        "Update Product";


    // Scroll to form

    productForm.scrollIntoView({
        behavior: "smooth"
    });

}



// ========================================
// DELETE PRODUCT + DELETE IMAGE
// ========================================

async function deleteProduct(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this product?"
        );

    if (!confirmDelete) {
        return;
    }

    // Product ki image URL pehle nikaalenge

    const { data: product, error: fetchError } =
        await supabaseClient
            .from("product")
            .select("image_url")
            .eq("id", id)
            .single();

    if (fetchError) {

        console.error(fetchError);

        alert(
            "Error loading product: " +
            fetchError.message
        );

        return;
    }


    // ========================================
    // DELETE IMAGE FROM STORAGE
    // ========================================

    if (product.image_url) {

        try {

            const imageUrl =
                product.image_url.split("?")[0];

            const marker =
                "/object/public/product-images/";

            const markerIndex =
                imageUrl.indexOf(marker);

            if (markerIndex !== -1) {

                const filePath =
                    decodeURIComponent(
                        imageUrl.substring(
                            markerIndex + marker.length
                        )
                    );

                const { error: imageDeleteError } =
                    await supabaseClient.storage
                        .from("product-images")
                        .remove([
                            filePath
                        ]);

                if (imageDeleteError) {

                    console.error(
                        "Image delete error:",
                        imageDeleteError
                    );

                    alert(
                        "Image delete failed: " +
                        imageDeleteError.message
                    );

                    return;
                }
            }

        } catch (error) {

            console.error(
                "Image delete error:",
                error
            );

            alert(
                "Unable to delete product image."
            );

            return;
        }
    }


    // ========================================
    // DELETE PRODUCT FROM DATABASE
    // ========================================

    const { error } =
        await supabaseClient
            .from("product")
            .delete()
            .eq(
                "id",
                id
            );

    if (error) {

        console.error(error);

        alert(
            "Error deleting product: " +
            error.message
        );

        return;
    }


    alert(
        "Product and image deleted successfully!"
    );

    loadAdminProducts();
}



// ========================================
// RUN ON DASHBOARD
// ========================================

if (
    window.location.pathname.includes(
        "dashboard.html"
    )
) {

    checkLogin();

    loadAdminProducts();

}