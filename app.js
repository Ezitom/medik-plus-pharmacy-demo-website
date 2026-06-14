/* MEDIK-PLUS PHARMACY - Application Logic */

/**
 * Returns a branded SVG data-URI placeholder for missing product images.
 * Called directly from onerror on img elements via imgFallback(this).
 * @param {HTMLImageElement} imgEl - The img element that failed to load.
 */
function imgFallback(imgEl) {
    const name = imgEl.getAttribute('data-name') || 'Product';
    const category = imgEl.getAttribute('data-category') || '';
    const label = name.length > 22 ? name.substring(0, 22) + '\u2026' : name;

    const svgContent = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="220" viewBox="0 0 300 220">',
        '<defs><linearGradient id="pbg" x1="0%" y1="0%" x2="100%" y2="100%">',
        '<stop offset="0%" style="stop-color:#0D2B45;stop-opacity:1"/>',
        '<stop offset="100%" style="stop-color:#0A3D62;stop-opacity:1"/>',
        '</linearGradient></defs>',
        '<rect width="300" height="220" fill="url(#pbg)" rx="12"/>',
        '<rect x="0" y="0" width="300" height="4" fill="#00B4A6" rx="2"/>',
        '<circle cx="150" cy="88" r="40" fill="rgba(0,180,166,0.15)" stroke="#00B4A6" stroke-width="1.5"/>',
        '<text x="150" y="100" font-family="Arial,sans-serif" font-size="30" fill="#00B4A6" text-anchor="middle">+</text>',
        '<text x="150" y="152" font-family="Arial,sans-serif" font-size="13" fill="#CBD5E0" text-anchor="middle" font-weight="600">' + label + '</text>',
        '<text x="150" y="174" font-family="Arial,sans-serif" font-size="11" fill="#4A7FA5" text-anchor="middle">' + category + '</text>',
        '</svg>'
    ].join('');

    imgEl.onerror = null; // prevent infinite loop
    imgEl.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);
}

// Common Product Data
let productsData = [
    {
        id: 1,
        name: "Atorvastatin (Lipitor) 20mg",
        category: "Prescription",
        price: 45.00,
        description: "Prescription medication used to lower cholesterol and reduce risk of cardiovascular disease.",
        image: "assets/images/products/atorvastatin.jpg"
    },
    {
        id: 2,
        name: "Digital Blood Pressure Monitor",
        category: "First Aid",
        price: 59.99,
        description: "Automatic upper arm blood pressure monitor with precision sensing and dual user memory.",
        image: "assets/images/products/bp_monitor.jpg"
    },
    {
        id: 3,
        name: "Infant Gentle Formula 400g",
        category: "Mother and Baby",
        price: 28.50,
        description: "Easy to digest, milk-based infant formula with iron, DHA, and essential vitamins.",
        image: "assets/images/products/formula.jpg"
    },
    {
        id: 4,
        name: "Multivitamin Active Men & Women",
        category: "Supplements",
        price: 19.95,
        description: "Daily multivitamin and mineral supplement with high-potency antioxidants and nutrients.",
        image: "assets/images/products/multivitamin.jpg"
    },
    {
        id: 5,
        name: "Lubricant Eye Drops 15ml",
        category: "Eye Care",
        price: 12.99,
        description: "Sterile eye drops that provide fast, soothing relief for dry, irritated, and tired eyes.",
        image: "assets/images/products/eye_drops.jpg"
    },
    {
        id: 6,
        name: "Hyaluronic Acid Hydrating Serum",
        category: "Skin",
        price: 24.50,
        description: "Deeply hydrating serum that plumps skin, enhances radiance, and reduces fine lines.",
        image: "assets/images/products/serum.jpg"
    },
    {
        id: 7,
        name: "First Aid Emergency Kit",
        category: "First Aid",
        price: 34.99,
        description: "All-purpose first aid kit with 150 emergency medical and bandage supplies.",
        image: "assets/images/products/first_aid_kit.jpg"
    },
    {
        id: 8,
        name: "Amoxicillin 500mg (10 Capsules)",
        category: "Prescription",
        price: 18.00,
        description: "Broad-spectrum penicillin antibiotic used to treat bacterial infections. Prescription required.",
        image: "assets/images/products/amoxicillin.jpg"
    }
];

const defaultCategories = [
    { id: "cat-1", name: "Prescription", icon: "ti ti-pill" },
    { id: "cat-2", name: "First Aid", icon: "ti ti-first-aid-kit" },
    { id: "cat-3", name: "Mother and Baby", icon: "ti ti-baby-carriage" },
    { id: "cat-4", name: "Supplements", icon: "ti ti-leaf" },
    { id: "cat-5", name: "Cardiac Care", icon: "ti ti-heart" },
    { id: "cat-6", name: "Eye Care", icon: "ti ti-eye" },
    { id: "cat-7", name: "Skin", icon: "ti ti-droplet" }
];

document.addEventListener('DOMContentLoaded', () => {
    // Global Footer Initialisation
    initGlobalFooter();

    // Theme Initialisation
    initTheme();

    // Mobile Hamburger Menu
    initMobileMenu();

    // Active Nav Link Highlight
    highlightActiveLink();

    // Auth-aware Login / Dashboard nav button
    updateNavAuthState();

    // Sync Products from localStorage
    if (!localStorage.getItem('medik_products')) {
        localStorage.setItem('medik_products', JSON.stringify(productsData));
    } else {
        try {
            productsData = JSON.parse(localStorage.getItem('medik_products'));
        } catch (e) {
            console.error('Error loading products from localStorage', e);
        }
    }

    // Sync Categories from localStorage
    if (!localStorage.getItem('medik_categories')) {
        localStorage.setItem('medik_categories', JSON.stringify(defaultCategories));
    }

    // Page Specific Initialisations
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (currentPage.includes('products.html')) {
        initProductsPage();
    } else if (currentPage.includes('booking.html')) {
        initBookingPage();
    } else if (currentPage.includes('contact.html')) {
        initContactPage();
    } else if (currentPage === 'index.html' || currentPage === '') {
        initHomePage();
    }
});

/* Load Global Footer dynamically or use static fallback */
function initGlobalFooter() {
    const footerContainer = document.getElementById('global-footer');
    if (!footerContainer) return;

    const fallbackHtml = `
        <div class="footer-container">
            <div class="footer-col footer-brand">
                <a href="index.html" class="logo">
                    <div class="logo-cross"><i class="ti ti-plus"></i></div>
                    MEDIK-PLUS
                </a>
                <p>MEDIK-PLUS PHARMACY offers clinical expertise, safe prescriptions, and high-quality wellness services. Your reliable partner in community health care.</p>
                <div class="social-links">
                    <a href="#" aria-label="Facebook"><i class="ti ti-brand-facebook"></i></a>
                    <a href="#" aria-label="Instagram"><i class="ti ti-brand-instagram"></i></a>
                    <a href="#" aria-label="Twitter"><i class="ti ti-brand-twitter"></i></a>
                    <a href="#" aria-label="WhatsApp"><i class="ti ti-brand-whatsapp"></i></a>
                </div>
            </div>
            <div class="footer-col">
                <h3>Quick Links</h3>
                <ul class="footer-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="about.html">About</a></li>
                    <li><a href="services.html">Services</a></li>
                    <li><a href="products.html">Products</a></li>
                    <li><a href="booking.html">Booking</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h3>Our Services</h3>
                <ul class="footer-links">
                    <li><a href="services.html">Prescriptions</a></li>
                    <li><a href="services.html">Consultations</a></li>
                    <li><a href="services.html">Home Delivery</a></li>
                    <li><a href="services.html">Immunization</a></li>
                    <li><a href="services.html">Chronic Care</a></li>
                    <li><a href="services.html">Diagnostic Kits</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h3>Contact Info</h3>
                <div class="footer-contact-item">
                    <i class="ti ti-map-pin"></i>
                    <span> 2 Zone C, Adekola Junction, Off New Ife Road, Iyana Agbala Road, Ibadan, Oyo State.</span>
                </div>
                <p class="footer-contact-label">Call us directly</p>
                <a href="tel:+2347065352978" class="footer-contact-link">
                    <i class="ti ti-phone" aria-hidden="true"></i> +2347065352978
                </a>
                <a href="tel:+2348061528355" class="footer-contact-link">
                    <i class="ti ti-phone" aria-hidden="true"></i> +2348061528355
                </a>
                <a href="mailto:medikpluspharmacyhawc@gmail.com" class="footer-contact-link">
                    <i class="ti ti-mail" aria-hidden="true"></i> medikpluspharmacyhawc@gmail.com
                </a>
                <div class="footer-contact-item">
                    <i class="ti ti-clock"></i>
                    <span>Mon - Sat: 8:00 AM - 10:00 PM<br>Sun: 10:00 AM - 6:00 PM</span>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 MEDIK-PLUS PHARMACY. All rights reserved.</p>
            <p><a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
        </div>
    `;

    if (window.location.protocol !== 'file:') {
        fetch('footer.html')
            .then(res => {
                if (!res.ok) throw new Error('Network error');
                return res.text();
            })
            .then(html => {
                footerContainer.innerHTML = html;
            })
            .catch(() => {
                footerContainer.innerHTML = fallbackHtml;
            });
    } else {
        footerContainer.innerHTML = fallbackHtml;
    }
}

/* Theme switcher logic */
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    // Apply saved theme or default to light
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark');
        if (themeToggle) themeToggle.innerHTML = '<i class="ti ti-sun"></i>';
    } else {
        body.classList.remove('dark');
        if (themeToggle) themeToggle.innerHTML = '<i class="ti ti-moon"></i>';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark');
            const isDark = body.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeToggle.innerHTML = isDark ? '<i class="ti ti-sun"></i>' : '<i class="ti ti-moon"></i>';
        });
    }
}

/* Mobile Navbar drawer */
function initMobileMenu() {
    const hamburger = document.getElementById('mobile-menu-btn');
    const navLinks  = document.getElementById('navbar-links');

    if (!hamburger || !navLinks) return;

    // Append mobile auth button to the drawer list dynamically
    if (!document.getElementById('mobile-nav-auth-item')) {
        const authLi = document.createElement('li');
        authLi.id = 'mobile-nav-auth-item';
        authLi.className = 'mobile-only-auth-item';
        authLi.innerHTML = `<a href="login.html" id="mobile-nav-auth-btn" class="mobile-only-auth-btn">Staff Login</a>`;
        navLinks.appendChild(authLi);
    }

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        hamburger.innerHTML = isOpen
            ? '<i class="ti ti-x"></i>'
            : '<i class="ti ti-menu-2"></i>';
    });

    // Close on any nav link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.innerHTML = '<i class="ti ti-menu-2"></i>';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.innerHTML = '<i class="ti ti-menu-2"></i>';
        }
    });
}

/* Auth-aware nav button: shows Login or Dashboard */
function updateNavAuthState() {
    const navBtn = document.getElementById('nav-auth-btn');
    const mobileNavBtn = document.getElementById('mobile-nav-auth-btn');
    const isLoggedIn = localStorage.getItem('medik_auth') === 'true';

    if (navBtn) {
        if (isLoggedIn) {
            navBtn.href        = 'dashboard.html';
            navBtn.textContent = 'Dashboard';
        } else {
            navBtn.href        = 'login.html';
            navBtn.textContent = 'Staff Login';
        }
    }

    if (mobileNavBtn) {
        if (isLoggedIn) {
            mobileNavBtn.href        = 'dashboard.html';
            mobileNavBtn.textContent = 'Dashboard';
        } else {
            mobileNavBtn.href        = 'login.html';
            mobileNavBtn.textContent = 'Staff Login';
        }
    }
}

/* Highlight current active page link */
function highlightActiveLink() {
    let currentPage = window.location.pathname.split('/').pop();
    if (!currentPage) currentPage = 'index.html';

    const navAnchors = document.querySelectorAll('.nav-links a');
    navAnchors.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/* Home Page Utilities */
function initHomePage() {
    // Dynamically insert products preview on homepage if products container exists
    const previewContainer = document.getElementById('home-products-preview');
    if (previewContainer) {
        const previewProducts = productsData.slice(0, 3);
        previewContainer.innerHTML = previewProducts.map(product => {
            let imgSrc = product.image || '';
            if (imgSrc && imgSrc.indexOf('/') === -1) {
                imgSrc = 'assets/images/products/' + imgSrc;
            }
            return `
                <div class="card product-card">
                    <div class="card-image">
                        <span class="product-category-pill">${product.category}</span>
                        <img src="${imgSrc}" alt="${product.name}" data-name="${product.name}" data-category="${product.category}" onerror="imgFallback(this)">
                    </div>
                    <div class="card-content">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <div class="card-footer">
                            <span class="product-price">$${product.price.toFixed(2)}</span>
                            <a href="booking.html?select=${product.id}" class="btn btn-primary btn-sm">Book Now</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Video playback fallback / simulation
    const video = document.querySelector('.hero-video-bg');
    if (video) {
        video.play().catch(error => {
            console.log('Video autoplay failed or was prevented by browser auto-play policy.');
        });
    }
}

/* Products Page Categories filter */
function initProductsPage() {
    const productsGrid = document.getElementById('products-grid');
    const filterBar = document.getElementById('category-filter-bar');
    const searchInput = document.getElementById('product-search');
    const clearBtn = document.getElementById('search-clear');

    if (!productsGrid || !filterBar) return;

    let currentCategory = 'All';

    // Load categories dynamically from localStorage
    const categories = JSON.parse(localStorage.getItem('medik_categories') || '[]');
    let filterHtml = `<button class="filter-btn active" data-filter="All" id="filter-all">All Products</button>`;
    categories.forEach(cat => {
        filterHtml += `<button class="filter-btn" data-filter="${escapeHTML(cat.name)}" id="filter-${cat.id}">${escapeHTML(cat.name)}</button>`;
    });
    filterBar.innerHTML = filterHtml;

    // Function to render products
    function renderProducts() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

        // Toggle clear button visibility
        if (clearBtn) {
            if (query) {
                clearBtn.classList.add('active');
            } else {
                clearBtn.classList.remove('active');
            }
        }

        let filtered = productsData;

        // Filter by category
        if (currentCategory !== 'All') {
            filtered = filtered.filter(p => p.category.toLowerCase() === currentCategory.toLowerCase());
        }

        // Filter by search query
        if (query) {
            filtered = filtered.filter(p => 
                (p.name && p.name.toLowerCase().includes(query)) || 
                (p.description && p.description.toLowerCase().includes(query))
            );
        }

        if (filtered.length === 0) {
            const safeQuery = escapeHTML(searchInput ? searchInput.value : '');
            productsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="ti ti-search" aria-hidden="true"></i>
                    <h3>No results found</h3>
                    <p>We couldn't find any medications or products matching "${safeQuery}". Please double-check your spelling or try another query.</p>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = filtered.map(product => {
            let imgSrc = product.image || '';
            if (imgSrc && imgSrc.indexOf('/') === -1) {
                imgSrc = 'assets/images/products/' + imgSrc;
            }

            const isUnavailable = product.status === 'Out of Stock' || product.stock_quantity === 0;

            let actionHtml = '';
            if (isUnavailable) {
                actionHtml = `
                    <div class="unavailable-notice">
                        <i class="ti ti-alert-circle" aria-hidden="true"></i>
                        <span>Not available at the moment</span>
                    </div>
                    <a href="contact.html" class="contact-cta-link">
                        <i class="ti ti-message-circle" aria-hidden="true"></i>
                        Contact us for inquiry
                    </a>
                `;
            } else {
                actionHtml = `
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <a href="booking.html?select=${product.id}" class="btn btn-primary">Book</a>
                `;
            }

            return `
                <div class="card product-card ${isUnavailable ? 'card--unavailable' : ''}" data-category="${product.category}">
                    <div class="card-image">
                        <span class="product-category-pill">${product.category}</span>
                        <img src="${imgSrc}" alt="${product.name}" data-name="${product.name}" data-category="${product.category}" onerror="imgFallback(this)">
                        ${isUnavailable ? `
                        <div class="unavailable-overlay">
                            <i class="ti ti-alert-circle" aria-hidden="true"></i>
                        </div>
                        ` : ''}
                    </div>
                    <div class="card-content">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <div class="card-footer" style="${isUnavailable ? 'flex-direction: column; align-items: flex-start; gap: 0;' : ''}">
                            ${actionHtml}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Initial Render
    renderProducts();

    // Setup Filter Button Click Events (using delegation)
    filterBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;

        filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-filter');
        renderProducts();
    });

    // Search events
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            renderProducts();
        });
    }

    if (clearBtn && searchInput) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            renderProducts();
            searchInput.focus();
        });
    }
}

/* Booking Page Picker and Form Submission */
function initBookingPage() {
    const pickerContainer = document.getElementById('product-picker');
    const customerForm = document.getElementById('booking-form');
    const receiptItemsContainer = document.getElementById('receipt-items');
    const receiptTotalContainer = document.getElementById('receipt-total-value');

    const receiptName = document.getElementById('receipt-customer-name');
    const receiptPhone = document.getElementById('receipt-customer-phone');
    const receiptDate = document.getElementById('receipt-pickup-date');
    const receiptTagContainer = document.getElementById('receipt-tag-container');
    const receiptTagCode = document.getElementById('receipt-tag-code');
    const receiptStatusBadge = document.getElementById('receipt-status-badge');
    const receiptActions = document.getElementById('receipt-actions');
    const receiptContainer = document.getElementById('receipt-container');
    const bookingLayout = document.querySelector('.booking-layout');

    if (!pickerContainer || !customerForm) return;

    // Selected products set
    let selectedProductIds = new Set();

    // Check for query parameter selection
    const urlParams = new URLSearchParams(window.location.search);
    const selectId = parseInt(urlParams.get('select'));
    if (selectId && productsData.some(p => p.id === selectId)) {
        const selectedProduct = productsData.find(p => p.id === selectId);
        const isUnavailable = selectedProduct.status === 'Out of Stock' || selectedProduct.stock_quantity === 0;
        if (!isUnavailable) {
            selectedProductIds.add(selectId);
        }
    }

    // Render the pickable list
    function renderPicker() {
        const availableProducts = [];
        const unavailableProducts = [];
        
        productsData.forEach(product => {
            const isUnavailable = product.status === 'Out of Stock' || product.stock_quantity === 0;
            if (isUnavailable) {
                unavailableProducts.push(product);
            } else {
                availableProducts.push(product);
            }
        });

        const orderedProducts = [...availableProducts, ...unavailableProducts];

        pickerContainer.innerHTML = orderedProducts.map(product => {
            const isUnavailable = product.status === 'Out of Stock' || product.stock_quantity === 0;
            const isSelected = selectedProductIds.has(product.id);
            let imgSrc = product.image || '';
            if (imgSrc && imgSrc.indexOf('/') === -1) {
                imgSrc = 'assets/images/products/' + imgSrc;
            }

            let inlineCalloutHtml = '';
            if (isUnavailable) {
                inlineCalloutHtml = `
                    <div class="unavailable-notice">
                        <i class="ti ti-alert-circle" aria-hidden="true"></i>
                        <span>Out of stock</span>
                    </div>
                `;
            }

            return `
                <div class="picker-item ${isUnavailable ? 'unavailable' : ''} ${isSelected ? 'selected' : ''}" data-id="${product.id}" data-unavailable="${isUnavailable}">
                    <div class="picker-info">
                        <div class="picker-image">
                            <img src="${imgSrc}" alt="${product.name}" data-name="${product.name}" data-category="${product.category}" onerror="imgFallback(this)">
                        </div>
                        <div class="picker-details">
                            <h4>${product.name}</h4>
                            <p>${product.category}</p>
                            ${inlineCalloutHtml}
                        </div>
                    </div>
                    <div class="picker-info">
                        <span class="picker-price">$${product.price.toFixed(2)}</span>
                        ${!isUnavailable ? `
                        <div class="picker-checkbox">
                            <i class="ti ti-check"></i>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        // Add click events to picker items
        const items = pickerContainer.querySelectorAll('.picker-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                const isUnavailable = item.getAttribute('data-unavailable') === 'true';
                if (isUnavailable) {
                    return;
                }

                const id = parseInt(item.getAttribute('data-id'));
                if (selectedProductIds.has(id)) {
                    selectedProductIds.delete(id);
                } else {
                    selectedProductIds.add(id);
                }
                updateBookingState();
            });
        });
    }

    // Update live receipt panel and state
    function updateBookingState() {
        // Update selection UI classes
        const items = pickerContainer.querySelectorAll('.picker-item');
        items.forEach(item => {
            const id = parseInt(item.getAttribute('data-id'));
            if (selectedProductIds.has(id)) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });

        // Build receipt items list
        const selectedProducts = productsData.filter(p => selectedProductIds.has(p.id));

        if (selectedProducts.length === 0) {
            receiptItemsContainer.innerHTML = `
                <div class="receipt-item">
                    <span class="receipt-item-name" style="font-style: italic;">No items selected</span>
                    <span class="receipt-item-price">$0.00</span>
                </div>
            `;
            receiptTotalContainer.textContent = "$0.00";
        } else {
            receiptItemsContainer.innerHTML = selectedProducts.map(p => `
                <div class="receipt-item">
                    <span class="receipt-item-name">${p.name}</span>
                    <span class="receipt-item-price">$${p.price.toFixed(2)}</span>
                </div>
            `).join('');

            const total = selectedProducts.reduce((sum, p) => sum + p.price, 0);
            receiptTotalContainer.textContent = `$${total.toFixed(2)}`;
        }

        // Live client info update
        const nameInput = document.getElementById('customer-name');
        const phoneInput = document.getElementById('customer-phone');
        const dateInput = document.getElementById('pickup-date');

        receiptName.textContent = nameInput.value.trim() || '-';
        receiptPhone.textContent = phoneInput.value.trim() || '-';

        if (dateInput.value) {
            const dateObj = new Date(dateInput.value);
            receiptDate.textContent = dateObj.toLocaleDateString(undefined, {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } else {
            receiptDate.textContent = '-';
        }
    }

    // Add real-time event listeners on text form inputs
    const nameInput = document.getElementById('customer-name');
    const phoneInput = document.getElementById('customer-phone');
    const dateInput = document.getElementById('pickup-date');

    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    [nameInput, phoneInput, dateInput].forEach(input => {
        if (input) {
            input.addEventListener('input', updateBookingState);
            input.addEventListener('change', updateBookingState);
        }
    });

    // Handle form submission
    customerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Check if at least one product is selected
        if (selectedProductIds.size === 0) {
            showToast('Please select at least one product to book.', 'error');
            return;
        }

        // Validate customer details inputs
        let valid = true;
        const nameVal = nameInput.value.trim();
        const phoneVal = phoneInput.value.trim();
        const dateVal = dateInput.value;

        // Reset error displays
        document.getElementById('customer-name-error').style.display = 'none';
        document.getElementById('customer-phone-error').style.display = 'none';
        document.getElementById('pickup-date-error').style.display = 'none';
        nameInput.classList.remove('error');
        phoneInput.classList.remove('error');
        dateInput.classList.remove('error');

        if (!nameVal || nameVal.length < 2) {
            document.getElementById('customer-name-error').style.display = 'block';
            nameInput.classList.add('error');
            valid = false;
        }

        if (!phoneVal || !/^[+]?[0-9\s\-()]{7,18}$/.test(phoneVal)) {
            document.getElementById('customer-phone-error').style.display = 'block';
            phoneInput.classList.add('error');
            valid = false;
        }

        if (!dateVal) {
            const errEl = document.getElementById('pickup-date-error');
            errEl.textContent = 'Pickup date is required.';
            errEl.style.display = 'block';
            dateInput.classList.add('error');
            valid = false;
        } else {
            const selectedDate = new Date(dateVal);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                const errEl = document.getElementById('pickup-date-error');
                errEl.textContent = 'Pickup date cannot be in the past.';
                errEl.style.display = 'block';
                dateInput.classList.add('error');
                valid = false;
            }
        }

        if (!valid) return;

        // Generate confirmation tag code (MDP-7X3KAB format)
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let randomPart = '';
        for (let i = 0; i < 6; i++) {
            randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        const confirmationCode = `MDP-${randomPart}`;

        // Persist booking to localStorage with exact fields requested in Fix 6
        const selectedProducts = productsData.filter(p => selectedProductIds.has(p.id));
        const total = selectedProducts.reduce((sum, p) => sum + p.price, 0);
        const newBooking = {
            id:           confirmationCode,
            code:         confirmationCode, // compatibility
            customerName: nameVal,
            name:         nameVal, // compatibility
            phone:        phoneVal,
            pickupDate:   dateVal,
            date:         dateVal, // compatibility
            products:     selectedProducts.map(p => ({ id: p.id, name: p.name, price: p.price })),
            total:        total,
            status:       'Pending',
            createdAt:    new Date().toISOString()
        };
        const bookings = JSON.parse(localStorage.getItem('medik_bookings') || '[]');
        bookings.push(newBooking);
        localStorage.setItem('medik_bookings', JSON.stringify(bookings));

        // Show confirmation status badge inside receipt
        if (receiptStatusBadge) {
            receiptStatusBadge.innerHTML = '<span class="badge-status completed" style="background: rgba(0, 180, 166, 0.12); color: #00B4A6; border: 1px solid rgba(0, 180, 166, 0.2); padding: 0.25rem 0.75rem; border-radius: 20px; font-weight: 700; font-size: 0.75rem; text-transform: uppercase;">Confirmed</span>';
            receiptStatusBadge.style.display = 'block';
        }

        // Show confirmation tag code inside dashed box
        receiptTagCode.textContent = confirmationCode;
        receiptTagContainer.style.display = 'block';

        // Hide left column entirely, set receipt to centered single column
        document.querySelector('.booking-left-column').style.display = 'none';
        if (bookingLayout) {
            bookingLayout.style.gridTemplateColumns = '1fr';
        }
        if (receiptContainer) {
            receiptContainer.style.maxWidth = '480px';
            receiptContainer.style.margin = '0 auto';
            receiptContainer.style.width = '100%';
        }

        // Show receipt print / reload action buttons
        if (receiptActions) {
            receiptActions.style.display = 'flex';
        }

        // Scroll to receipt
        receiptContainer.scrollIntoView({ behavior: 'smooth' });

        showToast('Booking submitted successfully! Please save your confirmation code.', 'success');
    });

    // Setup action buttons click events
    const printBtn = document.getElementById('btn-print-receipt');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }

    const resetBtn = document.getElementById('btn-reset-booking');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            // Restore original split visual layout
            document.querySelector('.booking-left-column').style.display = 'block';
            if (bookingLayout) {
                bookingLayout.style.gridTemplateColumns = '';
            }
            if (receiptContainer) {
                receiptContainer.style.maxWidth = '';
                receiptContainer.style.margin = '';
            }

            // Hide confirmation widgets
            receiptTagContainer.style.display = 'none';
            if (receiptStatusBadge) receiptStatusBadge.style.display = 'none';
            if (receiptActions) receiptActions.style.display = 'none';

            // Reset selected products and text inputs
            selectedProductIds.clear();
            customerForm.reset();
            nameInput.value = '';
            phoneInput.value = '';
            dateInput.value = '';

            // Clean error classes
            nameInput.classList.remove('error');
            phoneInput.classList.remove('error');
            dateInput.classList.remove('error');
            document.getElementById('customer-name-error').style.display = 'none';
            document.getElementById('customer-phone-error').style.display = 'none';
            document.getElementById('pickup-date-error').style.display = 'none';

            // Refresh UI
            renderPicker();
            updateBookingState();
        });
    }

    // Initial calls
    renderPicker();
    updateBookingState();
}

/* Contact page form response */
function initContactPage() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name    = document.getElementById('contact-name').value.trim();
        const email   = document.getElementById('contact-email').value.trim();
        const subject = document.getElementById('contact-subject').value;
        const message = document.getElementById('contact-message').value.trim();

        // Persist message to localStorage so admin dashboard can view it
        const newMessage = {
            id:        Date.now(),
            name:      name,
            email:     email,
            subject:   subject,
            message:   message,
            status:    'Unread',
            createdAt: new Date().toISOString()
        };
        const inquiries = JSON.parse(localStorage.getItem('medik_inquiries') || '[]');
        inquiries.push(newMessage);
        localStorage.setItem('medik_inquiries', JSON.stringify(inquiries));

        showToast(`Thank you, ${name}! Your message has been received.`, 'success');
        contactForm.reset();
    });
}

/* HTML Escaping helper */
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
}

/* Helper function: Custom Toast message */
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '2rem';
    toast.style.right = '2rem';
    toast.style.padding = '1rem 2rem';
    toast.style.borderRadius = '8px';
    toast.style.fontFamily = "'Raleway', sans-serif";
    toast.style.fontWeight = '700';
    toast.style.zIndex = '9999';
    toast.style.color = 'white';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    toast.style.animation = 'fade-in 0.3s ease-out';

    if (type === 'success') {
        toast.style.backgroundColor = '#00B4A6';
    } else {
        toast.style.backgroundColor = '#E53E3E';
    }

    toast.innerHTML = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 4000);
}
