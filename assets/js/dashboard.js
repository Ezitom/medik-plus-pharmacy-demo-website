/* MEDIK-PLUS PHARMACY - Dashboard Application Logic */

document.addEventListener('DOMContentLoaded', function () {
    // 1. Authenticate check
    checkAuth();

    // 2. Set profile details
    setupProfile();

    // 3. Tab Switching
    setupTabs();

    // 4. Load & render all data
    loadAndRenderAll();

    // 5. Setup Forms and Modals
    setupModalsAndForms();

    // 6. Setup Logout
    setupLogout();
    
    // 7. Mobile Sidebar toggle
    setupMobileSidebar();
});

/* =============================================
   AUTHENTICATION CHECK
   ============================================= */
function checkAuth() {
    var auth = localStorage.getItem('medik_auth');
    if (auth !== 'true') {
        window.location.href = 'login.html';
    }
}

/* =============================================
   PROFILE INITIALIZATION
   ============================================= */
function setupProfile() {
    var username = 'Staff User';
    var role = 'Staff';
    
    // Attempt to parse medik_auth_user JSON object
    var authUserStr = localStorage.getItem('medik_auth_user');
    if (authUserStr) {
        try {
            var authUser = JSON.parse(authUserStr);
            if (authUser.name) username = authUser.name;
            if (authUser.role) role = authUser.role;
        } catch (e) {
            console.error('Error parsing medik_auth_user from localStorage', e);
        }
    } else {
        // Fallback to legacy individual keys
        username = localStorage.getItem('medik_user_name') || username;
        role = localStorage.getItem('medik_role') || role;
    }

    var usernameEl = document.getElementById('profile-username');
    var roleEl = document.getElementById('profile-role');
    var avatarEl = document.getElementById('profile-avatar-letters');

    if (usernameEl) usernameEl.textContent = username;
    if (roleEl) roleEl.textContent = role;

    if (avatarEl) {
        // Extract first letters of name
        var parts = username.split(' ');
        var initials = '';
        if (parts.length > 0 && parts[0]) initials += parts[0][0].toUpperCase();
        if (parts.length > 1 && parts[1]) initials += parts[1][0].toUpperCase();
        avatarEl.textContent = initials || 'ST';
    }
}

/* =============================================
   TAB SWITCHING
   ============================================= */
function setupTabs() {
    var menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
    var panels = document.querySelectorAll('.tab-panel');

    menuItems.forEach(function (item) {
        item.addEventListener('click', function () {
            var tabName = this.getAttribute('data-tab');

            // Remove active classes
            menuItems.forEach(function (m) { m.classList.remove('active'); });
            panels.forEach(function (p) { p.classList.remove('active'); });

            // Add active class
            this.classList.add('active');
            var targetPanel = document.getElementById('panel-' + tabName);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }

            // Collapse mobile sidebar when navigation link is clicked
            var sidebar = document.querySelector('.dashboard-sidebar');
            if (sidebar) {
                sidebar.classList.remove('open');
            }

            // Refresh specific tables upon viewing
            loadAndRenderAll();
        });
    });
}

/* =============================================
   MOBILE SIDEBAR DRAWER TOGGLE
   ============================================= */
function setupMobileSidebar() {
    var toggleBtn = document.getElementById('btn-sidebar-toggle');
    var sidebar = document.querySelector('.dashboard-sidebar');
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            sidebar.classList.toggle('open');
        });
        document.addEventListener('click', function (e) {
            if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== toggleBtn) {
                sidebar.classList.remove('open');
            }
        });
    }
}

/* =============================================
   LOGOUT
   ============================================= */
function setupLogout() {
    var btn = document.getElementById('btn-logout');
    if (btn) {
        btn.addEventListener('click', function () {
            localStorage.removeItem('medik_auth');
            localStorage.removeItem('medik_role');
            localStorage.removeItem('medik_user_name');
            localStorage.removeItem('medik_auth_user');
            window.location.href = 'login.html';
        });
    }
}

/* =============================================
   DATA INITIALIZATION & RENDERING
   ============================================= */
var defaultProducts = [
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

var defaultCategories = [
    { id: "cat-1", name: "Prescription", icon: "ti ti-pill" },
    { id: "cat-2", name: "First Aid", icon: "ti ti-first-aid-kit" },
    { id: "cat-3", name: "Mother and Baby", icon: "ti ti-baby-carriage" },
    { id: "cat-4", name: "Supplements", icon: "ti ti-leaf" },
    { id: "cat-5", name: "Cardiac Care", icon: "ti ti-heart" },
    { id: "cat-6", name: "Eye Care", icon: "ti ti-eye" },
    { id: "cat-7", name: "Skin", icon: "ti ti-droplet" }
];

function loadAndRenderAll() {
    // Check if products exist in localStorage, if not initialize them
    if (!localStorage.getItem('medik_products')) {
        localStorage.setItem('medik_products', JSON.stringify(defaultProducts));
    }

    // Check if categories exist in localStorage, if not initialize them
    if (!localStorage.getItem('medik_categories')) {
        localStorage.setItem('medik_categories', JSON.stringify(defaultCategories));
    }

    var bookings = JSON.parse(localStorage.getItem('medik_bookings') || '[]');
    var products = JSON.parse(localStorage.getItem('medik_products') || '[]');
    var staff = JSON.parse(localStorage.getItem('medik_users') || '[]');
    var messages = JSON.parse(localStorage.getItem('medik_inquiries') || '[]');

    // 1. Update stats indicators
    updateStats(bookings, products, staff, messages);

    // 2. Render overview panel items
    renderOverview(bookings);

    // 3. Render reservations list
    renderBookingsList(bookings);

    // 4. Render medications list
    renderProductsList(products);

    // 5. Render categories list
    renderCategoriesList();

    // 6. Render staff members
    renderStaffList(staff);

    // 7. Render inquiries list
    renderMessagesList(messages);

    // 8. Populate category dropdown dynamically
    populateCategoryDropdowns();
}

function updateStats(bookings, products, staff, messages) {
    document.getElementById('stat-bookings-count').textContent = bookings.length;
    document.getElementById('stat-products-count').textContent = products.length;
    // Total staff includes master admin + registered ones
    document.getElementById('stat-staff-count').textContent = staff.length + 1;
    
    // Unread messages count
    var unread = messages.filter(function (m) { return m.status === 'Unread'; }).length;
    document.getElementById('stat-messages-count').textContent = unread;
}

/* =============================================
   TAB PANEL RENDERING
   ============================================= */

// OVERVIEW PANEL
function renderOverview(bookings) {
    var tbody = document.getElementById('recent-bookings-tbody');
    if (!tbody) return;

    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-data"><i class="ti ti-inbox"></i>No reservations recorded yet.</td></tr>';
        return;
    }

    // Sort descending by date/id and take latest 5
    var recent = bookings.slice().sort(function (a, b) {
        var aTime = a.createdAt ? new Date(a.createdAt).getTime() : a.id;
        var bTime = b.createdAt ? new Date(b.createdAt).getTime() : b.id;
        return bTime - aTime;
    }).slice(0, 5);

    tbody.innerHTML = recent.map(function (b) {
        var statusClass = b.status.toLowerCase();
        var dateFormatted = (b.date || b.pickupDate) ? new Date(b.date || b.pickupDate).toLocaleDateString() : '-';
        return `
            <tr>
                <td style="font-weight:700; color:#00B4A6;">${b.code || b.id}</td>
                <td>${escapeHTML(b.name || b.customerName)}</td>
                <td>${dateFormatted}</td>
                <td>$${parseFloat(b.total || 0).toFixed(2)}</td>
                <td><span class="badge-status ${statusClass}">${b.status}</span></td>
            </tr>
        `;
    }).join('');
}

// RESERVATIONS PANEL
function renderBookingsList(bookings) {
    var tbody = document.getElementById('bookings-tbody');
    if (!tbody) return;

    // Get active filter status
    var activeFilterBtn = document.querySelector('#booking-status-filters .dash-filter-btn.active');
    var statusFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-status') : 'All';
    var searchQuery = document.getElementById('booking-search').value.trim().toLowerCase();

    var filtered = bookings.slice();

    // Filter by status
    if (statusFilter !== 'All') {
        filtered = filtered.filter(function (b) {
            return b.status.toLowerCase() === statusFilter.toLowerCase();
        });
    }

    // Filter by search
    if (searchQuery) {
        filtered = filtered.filter(function (b) {
            var codeMatch = (b.code || b.id || '').toLowerCase().indexOf(searchQuery) !== -1;
            var nameMatch = (b.name || b.customerName || '').toLowerCase().indexOf(searchQuery) !== -1;
            return codeMatch || nameMatch;
        });
    }

    // Sort descending by date or id
    filtered.sort(function (a, b) {
        var aTime = a.createdAt ? new Date(a.createdAt).getTime() : a.id;
        var bTime = b.createdAt ? new Date(b.createdAt).getTime() : b.id;
        if (isNaN(aTime)) aTime = 0;
        if (isNaN(bTime)) bTime = 0;
        return bTime - aTime;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="no-data"><i class="ti ti-inbox"></i>No reservations matching criteria.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(function (b) {
        var statusClass = b.status.toLowerCase();
        var itemsList = b.products ? b.products.map(function (p) { return p.name; }).join(', ') : '-';
        if (itemsList.length > 30) itemsList = itemsList.substring(0, 28) + '...';
        var dateFormatted = (b.date || b.pickupDate) ? new Date(b.date || b.pickupDate).toLocaleDateString() : '-';
        var bookingId = typeof b.id === 'string' ? `'${b.id}'` : b.id;

        var actionButtons = '';
        if (b.status === 'Pending') {
            actionButtons = `
                <button type="button" class="btn-icon" onclick="changeBookingStatus(${bookingId}, 'Completed')" title="Mark as Completed">
                    <i class="ti ti-check"></i>
                </button>
                <button type="button" class="btn-icon danger" onclick="changeBookingStatus(${bookingId}, 'Cancelled')" title="Cancel Order">
                    <i class="ti ti-ban"></i>
                </button>
            `;
        }

        actionButtons += `
            <button type="button" class="btn-icon danger" onclick="deleteBooking(${bookingId})" title="Delete Record">
                <i class="ti ti-trash"></i>
            </button>
        `;

        return `
            <tr>
                <td style="font-weight:700; color:#00B4A6;">${b.code || b.id}</td>
                <td>${escapeHTML(b.name || b.customerName)}</td>
                <td>${escapeHTML(b.phone)}</td>
                <td>${dateFormatted}</td>
                <td><span class="table-desc-text" title="${escapeHTML(b.products ? b.products.map(p=>p.name).join(', ') : '')}">${escapeHTML(itemsList)}</span></td>
                <td>$${parseFloat(b.total || 0).toFixed(2)}</td>
                <td><span class="badge-status ${statusClass}">${b.status}</span></td>
                <td>
                    <div class="action-btns">
                        ${actionButtons}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// MEDICATIONS PANEL
function renderProductsList(products) {
    var tbody = document.getElementById('products-tbody');
    if (!tbody) return;

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-data"><i class="ti ti-inbox"></i>No products in inventory.</td></tr>';
        return;
    }

    tbody.innerHTML = products.map(function (p) {
        var imgSrc = p.image || '';
        if (imgSrc && imgSrc.indexOf('/') === -1) {
            imgSrc = 'assets/images/products/' + imgSrc;
        }
        return `
            <tr>
                <td>
                    <div class="product-cell-info">
                        <img src="${imgSrc}" class="product-cell-img" alt="${escapeHTML(p.name)}" data-name="${escapeHTML(p.name)}" data-category="${escapeHTML(p.category)}" onerror="dashImgFallback(this)">
                        <span style="font-weight:600; color:#F0F4F8;">${escapeHTML(p.name)}</span>
                    </div>
                </td>
                <td>${escapeHTML(p.category)}</td>
                <td style="font-weight:700; color:#00B4A6;">$${parseFloat(p.price || 0).toFixed(2)}</td>
                <td><span class="table-desc-text" title="${escapeHTML(p.description)}">${escapeHTML(p.description)}</span></td>
                <td>
                    <div class="action-btns">
                        <button type="button" class="btn-icon" onclick="openEditProductModal(${p.id})" title="Edit Product">
                            <i class="ti ti-edit"></i>
                        </button>
                        <button type="button" class="btn-icon danger" onclick="deleteProduct(${p.id})" title="Delete Product">
                            <i class="ti ti-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// CATEGORIES PANEL
function renderCategoriesList() {
    var categoriesGrid = document.getElementById('categories-grid');
    if (!categoriesGrid) return;

    var categories = JSON.parse(localStorage.getItem('medik_categories') || '[]');
    var products = JSON.parse(localStorage.getItem('medik_products') || '[]');

    // Count products per category
    var counts = {};
    products.forEach(function (p) {
        counts[p.category] = (counts[p.category] || 0) + 1;
    });

    var html = '';
    categories.forEach(function (cat) {
        var count = counts[cat.name] || 0;
        html += `
            <div class="category-card glass-card" data-id="${cat.id}">
                <button type="button" class="category-delete-btn" onclick="deleteCategory('${cat.id}')" title="Delete Category">
                    <i class="ti ti-trash"></i>
                </button>
                <div class="category-card-icon">
                    <i class="${cat.icon}"></i>
                </div>
                <h4 class="category-card-title">${escapeHTML(cat.name)}</h4>
                <span class="category-card-badge">${count} Products</span>
            </div>
        `;
    });

    // Dash add button
    html += `
        <div class="category-card category-add-card" id="btn-trigger-add-category">
            <div class="category-card-icon">
                <i class="ti ti-plus"></i>
            </div>
            <h4 class="category-card-title">Add Category</h4>
        </div>
    `;

    categoriesGrid.innerHTML = html;

    // Click handler to open add category modal
    var addBtn = document.getElementById('btn-trigger-add-category');
    if (addBtn) {
        addBtn.addEventListener('click', function () {
            openAddCategoryModal();
        });
    }
}

// STAFF DIRECTORY PANEL
function renderStaffList(staff) {
    var tbody = document.getElementById('staff-tbody');
    if (!tbody) return;

    // Default admin
    var rows = `
        <tr>
            <td>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                    <i class="ti ti-shield-check" style="color:#F5A623; font-size:1.15rem;"></i>
                    <span style="font-weight:600;">System Administrator</span>
                </div>
            </td>
            <td>admin@medikplus.com</td>
            <td><span class="badge-status completed">Admin</span></td>
            <td>System Defined</td>
            <td>-</td>
        </tr>
    `;

    if (staff.length > 0) {
        rows += staff.map(function (s) {
            var dateFormatted = s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '-';
            return `
                <tr>
                    <td style="font-weight:600;">${escapeHTML(s.name)}</td>
                    <td>${escapeHTML(s.email)}</td>
                    <td><span class="badge-status unread">${escapeHTML(s.role)}</span></td>
                    <td>${dateFormatted}</td>
                    <td>
                        <div class="action-btns">
                            <button type="button" class="btn-icon danger" onclick="deleteStaff(${s.id})" title="Revoke Access">
                                <i class="ti ti-user-minus"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    tbody.innerHTML = rows;
}

// INQUIRIES PANEL
function renderMessagesList(messages) {
    var tbody = document.getElementById('messages-tbody');
    if (!tbody) return;

    if (messages.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data"><i class="ti ti-inbox"></i>No messages received yet.</td></tr>';
        return;
    }

    // Sort descending by id
    messages.sort(function (a, b) { return b.id - a.id; });

    tbody.innerHTML = messages.map(function (m) {
        var statusClass = m.status ? m.status.toLowerCase() : 'unread';
        var dateFormatted = m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '-';
        var actionButtons = '';
        if (m.status === 'Unread') {
            actionButtons = `
                <button type="button" class="btn-icon" onclick="markMessageRead(${m.id})" title="Mark as Read">
                    <i class="ti ti-mail-opened"></i>
                </button>
            `;
        }
        actionButtons += `
            <button type="button" class="btn-icon danger" onclick="deleteMessage(${m.id})" title="Delete Message">
                <i class="ti ti-trash"></i>
            </button>
        `;

        return `
            <tr>
                <td>${dateFormatted}</td>
                <td>
                    <div style="font-weight:600;">${escapeHTML(m.name)}</div>
                    <div style="font-size:0.75rem; color:#A0AEC0;">${escapeHTML(m.email)}</div>
                </td>
                <td style="font-weight:600; color:#F0F4F8;">${escapeHTML(m.subject)}</td>
                <td><span class="table-desc-text" title="${escapeHTML(m.message)}">${escapeHTML(m.message)}</span></td>
                <td><span class="badge-status ${statusClass}">${m.status || 'Unread'}</span></td>
                <td>
                    <div class="action-btns">
                        ${actionButtons}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

/* =============================================
   MUTATING OPERATIONS (CRUD Actions)
   ============================================= */

// Change Reservation Status
window.changeBookingStatus = function (id, status) {
    var bookings = JSON.parse(localStorage.getItem('medik_bookings') || '[]');
    for (var i = 0; i < bookings.length; i++) {
        if (bookings[i].id === id) {
            bookings[i].status = status;
            break;
        }
    }
    localStorage.setItem('medik_bookings', JSON.stringify(bookings));
    loadAndRenderAll();
    showToast(`Order status updated to ${status}.`, 'success');
};

// Delete Booking
window.deleteBooking = function (id) {
    if (!confirm('Are you sure you want to delete this booking record permanently?')) return;
    var bookings = JSON.parse(localStorage.getItem('medik_bookings') || '[]');
    var filtered = bookings.filter(function (b) { return b.id !== id; });
    localStorage.setItem('medik_bookings', JSON.stringify(filtered));
    loadAndRenderAll();
    showToast('Booking record deleted.', 'success');
};

// Mark Message as Read
window.markMessageRead = function (id) {
    var messages = JSON.parse(localStorage.getItem('medik_inquiries') || '[]');
    for (var i = 0; i < messages.length; i++) {
        if (messages[i].id === id) {
            messages[i].status = 'Read';
            break;
        }
    }
    localStorage.setItem('medik_inquiries', JSON.stringify(messages));
    loadAndRenderAll();
    showToast('Message marked as read.', 'success');
};

// Delete Message
window.deleteMessage = function (id) {
    if (!confirm('Delete this message permanently?')) return;
    var messages = JSON.parse(localStorage.getItem('medik_inquiries') || '[]');
    var filtered = messages.filter(function (m) { return m.id !== id; });
    localStorage.setItem('medik_inquiries', JSON.stringify(filtered));
    loadAndRenderAll();
    showToast('Message deleted.', 'success');
};

// Delete Staff Portal Access
window.deleteStaff = function (id) {
    if (!confirm('Revoke staff portal access for this user?')) return;
    var staff = JSON.parse(localStorage.getItem('medik_users') || '[]');
    var filtered = staff.filter(function (s) { return s.id !== id; });
    localStorage.setItem('medik_users', JSON.stringify(filtered));
    loadAndRenderAll();
    showToast('Staff access revoked.', 'success');
};

// Delete Product
window.deleteProduct = function (id) {
    if (!confirm('Are you sure you want to remove this medication from inventory?')) return;
    var products = JSON.parse(localStorage.getItem('medik_products') || '[]');
    var filtered = products.filter(function (p) { return p.id !== id; });
    localStorage.setItem('medik_products', JSON.stringify(filtered));
    loadAndRenderAll();
    showToast('Medication removed from inventory.', 'success');
};

// Open Edit Product Modal
window.openEditProductModal = function (id) {
    var products = JSON.parse(localStorage.getItem('medik_products') || '[]');
    var found = products.find(function (p) { return p.id === id; });
    if (!found) return;

    // Reset validations
    resetProductFormErrors();

    // Populate fields
    document.getElementById('product-form-id').value = found.id;
    document.getElementById('prod-name').value = found.name;
    
    // Ensure dropdown is populated before setting it
    populateCategoryDropdowns();
    document.getElementById('prod-category').value = found.category;
    
    document.getElementById('prod-price').value = found.price;
    document.getElementById('prod-image').value = found.image || '';
    document.getElementById('prod-desc').value = found.description;

    document.getElementById('product-modal-title').textContent = 'Edit Medication Details';
    document.getElementById('product-modal').classList.add('active');
};

/* =============================================
   MODALS AND FORMS
   ============================================= */
function setupModalsAndForms() {
    // Search bindings
    var searchInput = document.getElementById('booking-search');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            var bookings = JSON.parse(localStorage.getItem('medik_bookings') || '[]');
            renderBookingsList(bookings);
        });
    }

    // Reservation Filter buttons
    var filterBtns = document.querySelectorAll('#booking-status-filters .dash-filter-btn');
    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');
            var bookings = JSON.parse(localStorage.getItem('medik_bookings') || '[]');
            renderBookingsList(bookings);
        });
    });

    // Product Modal control
    var pModal = document.getElementById('product-modal');
    var pClose = document.getElementById('product-modal-close');
    var pOpen = document.getElementById('btn-add-product');

    if (pOpen && pModal) {
        pOpen.addEventListener('click', function () {
            resetProductFormErrors();
            document.getElementById('product-form-id').value = '';
            document.getElementById('product-form').reset();
            document.getElementById('product-modal-title').textContent = 'Add New Medication';
            populateCategoryDropdowns();
            pModal.classList.add('active');
        });
    }

    if (pClose && pModal) {
        pClose.addEventListener('click', function () {
            pModal.classList.remove('active');
        });
    }

    // Staff Modal control
    var sModal = document.getElementById('staff-modal');
    var sClose = document.getElementById('staff-modal-close');
    var sOpen = document.getElementById('btn-add-staff');

    if (sOpen && sModal) {
        sOpen.addEventListener('click', function () {
            resetStaffFormErrors();
            document.getElementById('staff-form').reset();
            sModal.classList.add('active');
        });
    }

    if (sClose && sModal) {
        sClose.addEventListener('click', function () {
            sModal.classList.remove('active');
        });
    }

    // Initialize Category Modal Handlers
    setupCategoryModal();

    // Product Form submission
    var pForm = document.getElementById('product-form');
    if (pForm) {
        pForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var valid = true;

            var nameEl = document.getElementById('prod-name');
            var catEl = document.getElementById('prod-category');
            var priceEl = document.getElementById('prod-price');
            var descEl = document.getElementById('prod-desc');
            var idEl = document.getElementById('product-form-id');
            var imgEl = document.getElementById('prod-image');

            // Reset field errors
            resetProductFormErrors();

            if (!nameEl.value.trim()) {
                showError('prod-name', 'prod-name-error');
                valid = false;
            }
            if (!catEl.value) {
                showError('prod-category', 'prod-category-error');
                valid = false;
            }
            if (!priceEl.value || parseFloat(priceEl.value) <= 0) {
                showError('prod-price', 'prod-price-error');
                valid = false;
            }
            if (!descEl.value.trim()) {
                showError('prod-desc', 'prod-desc-error');
                valid = false;
            }

            if (!valid) return;

            var products = JSON.parse(localStorage.getItem('medik_products') || '[]');

            if (idEl.value) {
                // Edit existing
                var prodId = parseInt(idEl.value);
                for (var i = 0; i < products.length; i++) {
                    if (products[i].id === prodId) {
                        products[i].name = nameEl.value.trim();
                        products[i].category = catEl.value;
                        products[i].price = parseFloat(priceEl.value);
                        products[i].image = imgEl.value.trim();
                        products[i].description = descEl.value.trim();
                        break;
                    }
                }
                showToast('Medication updated successfully.', 'success');
            } else {
                // Add new
                var newProduct = {
                    id: Date.now(),
                    name: nameEl.value.trim(),
                    category: catEl.value,
                    price: parseFloat(priceEl.value),
                    image: imgEl.value.trim(),
                    description: descEl.value.trim()
                };
                products.push(newProduct);
                showToast('Medication added to inventory.', 'success');
            }

            localStorage.setItem('medik_products', JSON.stringify(products));
            loadAndRenderAll();
            pModal.classList.remove('active');
        });
    }

    // Staff Form submission
    var sForm = document.getElementById('staff-form');
    if (sForm) {
        sForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var valid = true;

            var nameEl = document.getElementById('st-name');
            var emailEl = document.getElementById('st-email');
            var roleEl = document.getElementById('st-role');
            var passEl = document.getElementById('st-password');

            // Reset field errors
            resetStaffFormErrors();

            if (!nameEl.value.trim()) {
                showError('st-name', 'st-name-error');
                valid = false;
            }
            if (!emailEl.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
                showError('st-email', 'st-email-error');
                valid = false;
            }
            if (!roleEl.value) {
                showError('st-role', 'st-role-error');
                valid = false;
            }
            if (!passEl.value || passEl.value.length < 8) {
                showError('st-password', 'st-password-error');
                valid = false;
            }

            if (!valid) return;

            var staff = JSON.parse(localStorage.getItem('medik_users') || '[]');

            // Check duplicate email
            var exists = staff.some(function (u) {
                return u.email.toLowerCase() === emailEl.value.trim().toLowerCase();
            }) || emailEl.value.trim().toLowerCase() === 'admin@medikplus.com';

            if (exists) {
                alert('A staff user with this email already exists.');
                return;
            }

            var newStaff = {
                id: Date.now(),
                name: nameEl.value.trim(),
                email: emailEl.value.trim().toLowerCase(),
                role: roleEl.value,
                password: passEl.value,
                createdAt: new Date().toISOString()
            };

            staff.push(newStaff);
            localStorage.setItem('medik_users', JSON.stringify(staff));
            loadAndRenderAll();
            showToast('New staff registered.', 'success');
            sModal.classList.remove('active');
        });
    }
}

function showError(inputId, errorId) {
    var input = document.getElementById(inputId);
    var error = document.getElementById(errorId);
    if (input) input.classList.add('error');
    if (error) error.classList.add('visible');
}

function resetProductFormErrors() {
    ['prod-name', 'prod-category', 'prod-price', 'prod-desc'].forEach(function (id) {
        var input = document.getElementById(id);
        var err = document.getElementById(id + '-error');
        if (input) input.classList.remove('error');
        if (err) err.classList.remove('visible');
    });
}

function resetStaffFormErrors() {
    ['st-name', 'st-email', 'st-role', 'st-password'].forEach(function (id) {
        var input = document.getElementById(id);
        var err = document.getElementById(id + '-error');
        if (input) input.classList.remove('error');
        if (err) err.classList.remove('visible');
    });
}

/* =============================================
   CATEGORIES OPERATIONS (Fix 4)
   ============================================= */
var selectedCategoryIcon = '';

function setupCategoryModal() {
    var modal = document.getElementById('category-modal');
    var closeBtn = document.getElementById('category-modal-close');
    var cancelBtn = document.getElementById('btn-cancel-category');
    var form = document.getElementById('category-form');
    var tiles = document.querySelectorAll('.icon-tile');

    tiles.forEach(function (tile) {
        tile.addEventListener('click', function () {
            tiles.forEach(function (t) { t.classList.remove('selected'); });
            this.classList.add('selected');
            selectedCategoryIcon = this.getAttribute('data-icon');
            document.getElementById('cat-icon-error').classList.remove('visible');
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        form.reset();
        tiles.forEach(function (t) { t.classList.remove('selected'); });
        selectedCategoryIcon = '';
        document.getElementById('cat-name-error').classList.remove('visible');
        document.getElementById('cat-icon-error').classList.remove('visible');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    // Escape and outside click close
    window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (modal && modal.classList.contains('active')) closeModal();
            var pModal = document.getElementById('product-modal');
            if (pModal && pModal.classList.contains('active')) pModal.classList.remove('active');
            var sModal = document.getElementById('staff-modal');
            if (sModal && sModal.classList.contains('active')) sModal.classList.remove('active');
        }
    });

    document.addEventListener('click', function (e) {
        if (modal && e.target === modal) closeModal();
        var pModal = document.getElementById('product-modal');
        if (pModal && e.target === pModal) pModal.classList.remove('active');
        var sModal = document.getElementById('staff-modal');
        if (sModal && e.target === sModal) sModal.classList.remove('active');
    });

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var nameEl = document.getElementById('cat-name');
            var valid = true;

            if (!nameEl.value.trim()) {
                document.getElementById('cat-name-error').classList.add('visible');
                valid = false;
            } else {
                document.getElementById('cat-name-error').classList.remove('visible');
            }

            if (!selectedCategoryIcon) {
                document.getElementById('cat-icon-error').classList.add('visible');
                valid = false;
            } else {
                document.getElementById('cat-icon-error').classList.remove('visible');
            }

            if (!valid) return;

            var categories = JSON.parse(localStorage.getItem('medik_categories') || '[]');
            
            // Check duplicates
            var duplicate = categories.some(function (c) {
                return c.name.toLowerCase() === nameEl.value.trim().toLowerCase();
            });

            if (duplicate) {
                alert('A category with this name already exists.');
                return;
            }

            var newCat = {
                id: 'cat-' + Date.now(),
                name: nameEl.value.trim(),
                icon: selectedCategoryIcon
            };

            categories.push(newCat);
            localStorage.setItem('medik_categories', JSON.stringify(categories));
            
            showToast('Category created successfully.', 'success');
            closeModal();
            renderCategoriesList();
            populateCategoryDropdowns();
        });
    }
}

function openAddCategoryModal() {
    var modal = document.getElementById('category-modal');
    if (modal) modal.classList.add('active');
}

window.deleteCategory = function (id) {
    if (!confirm('Are you sure you want to delete this category? Products in this category will not be deleted but they will lose their category association.')) return;
    var categories = JSON.parse(localStorage.getItem('medik_categories') || '[]');
    var filtered = categories.filter(function (c) { return c.id !== id; });
    localStorage.setItem('medik_categories', JSON.stringify(filtered));
    showToast('Category deleted.', 'success');
    renderCategoriesList();
    populateCategoryDropdowns();
};

function populateCategoryDropdowns() {
    var dropdown = document.getElementById('prod-category');
    if (!dropdown) return;

    var categories = JSON.parse(localStorage.getItem('medik_categories') || '[]');
    
    // Save current selection
    var currentVal = dropdown.value;

    dropdown.innerHTML = '<option value="" disabled selected>Select category</option>' + 
        categories.map(function (cat) {
            return `<option value="${escapeHTML(cat.name)}">${escapeHTML(cat.name)}</option>`;
        }).join('');

    // Restore selection if it still exists
    if (categories.some(function (cat) { return cat.name === currentVal; })) {
        dropdown.value = currentVal;
    }
}

/* =============================================
   HELPERS & FALLBACKS
   ============================================= */
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
}

window.dashImgFallback = function (imgEl) {
    var name     = imgEl.getAttribute('data-name')     || 'Product';
    var category = imgEl.getAttribute('data-category') || '';
    var label    = name.length > 20 ? name.substring(0, 20) + '...' : name;

    var svgContent = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">',
        '<defs><linearGradient id="dbg" x1="0%" y1="0%" x2="100%" y2="100%">',
        '<stop offset="0%" style="stop-color:#0D2B45;stop-opacity:1"/>',
        '<stop offset="100%" style="stop-color:#0A3D62;stop-opacity:1"/>',
        '</linearGradient></defs>',
        '<rect width="100" height="100" fill="url(#dbg)" rx="6"/>',
        '<circle cx="50" cy="45" r="18" fill="rgba(0,180,166,0.15)" stroke="#00B4A6" stroke-width="1.5"/>',
        '<text x="50" y="51" font-family="Arial,sans-serif" font-size="16" fill="#00B4A6" text-anchor="middle">+</text>',
        '<text x="50" y="82" font-family="Arial,sans-serif" font-size="8" fill="#CBD5E0" text-anchor="middle" font-weight="600">' + label + '</text>',
        '</svg>'
    ].join('');

    imgEl.onerror = null; // prevent loop
    imgEl.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);
};

function showToast(message, type) {
    var toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '2rem';
    toast.style.right = '2rem';
    toast.style.padding = '1rem 2rem';
    toast.style.borderRadius = '8px';
    toast.style.fontFamily = "'Raleway', sans-serif";
    toast.style.fontWeight = '700';
    toast.style.fontSize = '0.9rem';
    toast.style.zIndex = '99999';
    toast.style.color = 'white';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
    toast.style.animation = 'fade-in 0.3s ease-out';
    toast.style.border = '1px solid rgba(255,255,255,0.1)';
    
    if (type === 'success') {
        toast.style.backgroundColor = '#00B4A6';
    } else {
        toast.style.backgroundColor = '#E53E3E';
    }
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(function () {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s ease';
        setTimeout(function () {
            toast.remove();
        }, 400);
    }, 3000);
}
