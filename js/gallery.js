const galleryContainer =
    document.getElementById("gallery-container");

async function loadGallery() {

    galleryContainer.innerHTML =
        `<p class="loading">Loading gallery...</p>`;

    const { data, error } =
        await supabaseClient
            .from("product")
            .select("id, name, category, image_url")
            .order("created_at", {
                ascending: false
            });

    if (error) {

        console.error(
            "Gallery loading error:",
            error
        );

        galleryContainer.innerHTML =
            `<p>Unable to load gallery.</p>`;

        return;
    }

    if (!data || data.length === 0) {

        galleryContainer.innerHTML =
            `<p>No images available yet.</p>`;

        return;
    }

    galleryContainer.innerHTML = "";

    data.forEach(product => {

        if (!product.image_url) {
            return;
        }

        const item =
            document.createElement("a");

        item.className =
            "gallery-item";

        // Image click → Product Details
        item.href =
            `product.html?id=${product.id}`;

        item.innerHTML = `

            <img
                src="${product.image_url}"
                alt="${product.name}"
            >

            <div class="gallery-overlay">

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${product.category || ""}
                </p>

            </div>

        `;

        galleryContainer.appendChild(item);

    });
}

loadGallery();