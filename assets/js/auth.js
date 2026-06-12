/* MEDIK-PLUS PHARMACY - Authentication Logic */

/* =============================================
   LOGIN PAGE
   ============================================= */
function initLoginPage() {
    var form = document.getElementById('login-form');
    if (!form) return;

    // Check for success message from signup redirect
    var params = new URLSearchParams(window.location.search);
    if (params.get('registered') === '1') {
        var alert = document.getElementById('login-alert');
        if (alert) {
            alert.textContent = 'Account created successfully. Please sign in.';
            alert.className = 'auth-alert success visible';
        }
    }

    // Password toggle
    setupPasswordToggle('login-password', 'toggle-login-password', 'toggle-login-icon');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var valid = true;

        var emailEl = document.getElementById('login-email');
        var passEl = document.getElementById('login-password');
        var alertEl = document.getElementById('login-alert');

        // Clear previous errors
        clearFieldError('login-email');
        clearFieldError('login-password');
        alertEl.className = 'auth-alert error';
        alertEl.textContent = '';

        // Validate email
        if (!emailEl.value.trim() || !isValidEmail(emailEl.value.trim())) {
            showFieldError('login-email', 'login-email-error');
            valid = false;
        }

        // Validate password
        if (!passEl.value) {
            showFieldError('login-password', 'login-password-error');
            valid = false;
        }

        if (!valid) return;

        // Check credentials
        var email = emailEl.value.trim().toLowerCase();
        var password = passEl.value;

        // Admin credentials
        if (email === 'admin@medikplus.com' && password === 'Admin1234') {
            localStorage.setItem('medik_auth', 'true');
            localStorage.setItem('medik_role', 'admin');
            localStorage.setItem('medik_user_name', 'Admin');
            localStorage.setItem('medik_auth_user', JSON.stringify({ name: 'Admin', role: 'admin' }));
            if (document.getElementById('remember-me') && document.getElementById('remember-me').checked) {
                localStorage.setItem('medik_remember', 'true');
            }
            window.location.href = 'dashboard.html';
            return;
        }

        // Check stored users
        var users = JSON.parse(localStorage.getItem('medik_users') || '[]');
        var found = null;
        for (var i = 0; i < users.length; i++) {
            if (users[i].email.toLowerCase() === email && users[i].password === password) {
                found = users[i];
                break;
            }
        }

        if (found) {
            localStorage.setItem('medik_auth', 'true');
            localStorage.setItem('medik_role', found.role);
            localStorage.setItem('medik_user_name', found.name);
            localStorage.setItem('medik_auth_user', JSON.stringify({ name: found.name, role: found.role }));
            window.location.href = 'dashboard.html';
            return;
        }

        // Invalid credentials
        alertEl.textContent = 'Invalid email or password. Please try again.';
        alertEl.className = 'auth-alert error visible';
        passEl.value = '';
    });
}

/* =============================================
   SIGNUP PAGE
   ============================================= */
function initSignupPage() {
    var form = document.getElementById('signup-form');
    if (!form) return;

    setupPasswordToggle('signup-password', 'toggle-signup-password', 'toggle-signup-icon');
    setupPasswordToggle('signup-confirm', 'toggle-confirm-password', 'toggle-confirm-icon');

    // Password strength meter
    var passEl = document.getElementById('signup-password');
    if (passEl) {
        passEl.addEventListener('input', function () {
            updateStrengthBar(this.value);
        });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var valid = true;

        var nameEl = document.getElementById('signup-name');
        var emailEl = document.getElementById('signup-email');
        var roleEl = document.getElementById('signup-role');
        var passwordEl = document.getElementById('signup-password');
        var confirmEl = document.getElementById('signup-confirm');
        var alertEl = document.getElementById('signup-alert');

        // Clear errors
        ['signup-name', 'signup-email', 'signup-role', 'signup-password', 'signup-confirm'].forEach(function (id) {
            clearFieldError(id);
        });
        alertEl.className = 'auth-alert error';
        alertEl.textContent = '';

        if (!nameEl.value.trim() || nameEl.value.trim().length < 2) {
            showFieldError('signup-name', 'signup-name-error');
            valid = false;
        }

        if (!emailEl.value.trim() || !isValidEmail(emailEl.value.trim())) {
            showFieldError('signup-email', 'signup-email-error');
            valid = false;
        }

        if (!roleEl.value) {
            showFieldError('signup-role', 'signup-role-error');
            valid = false;
        }

        if (!passwordEl.value || passwordEl.value.length < 8) {
            document.getElementById('signup-password-error').textContent = 'Password must be at least 8 characters.';
            showFieldError('signup-password', 'signup-password-error');
            valid = false;
        }

        if (confirmEl.value !== passwordEl.value) {
            showFieldError('signup-confirm', 'signup-confirm-error');
            valid = false;
        }

        if (!valid) return;

        // Check if email already exists
        var users = JSON.parse(localStorage.getItem('medik_users') || '[]');
        var exists = users.some(function (u) {
            return u.email.toLowerCase() === emailEl.value.trim().toLowerCase();
        });

        if (exists) {
            alertEl.textContent = 'An account with this email already exists.';
            alertEl.className = 'auth-alert error visible';
            return;
        }

        // Store new user
        var newUser = {
            id: Date.now(),
            name: nameEl.value.trim(),
            email: emailEl.value.trim().toLowerCase(),
            role: roleEl.value,
            password: passwordEl.value,
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem('medik_users', JSON.stringify(users));

        window.location.href = 'login.html?registered=1';
    });
}

/* =============================================
   FORGOT PASSWORD PAGE
   ============================================= */
function initForgotPasswordPage() {
    var form = document.getElementById('forgot-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var emailEl = document.getElementById('forgot-email');

        clearFieldError('forgot-email');

        if (!emailEl.value.trim() || !isValidEmail(emailEl.value.trim())) {
            showFieldError('forgot-email', 'forgot-email-error');
            return;
        }

        // Show success panel, hide form
        form.style.display = 'none';
        var panel = document.getElementById('forgot-success-panel');
        if (panel) {
            panel.className = 'auth-success-panel visible';
        }
    });
}

/* =============================================
   HELPERS
   ============================================= */

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(inputId, errorId) {
    var input = document.getElementById(inputId);
    var error = document.getElementById(errorId);
    if (input) input.classList.add('error');
    if (error) error.classList.add('visible');
}

function clearFieldError(inputId) {
    var input = document.getElementById(inputId);
    if (input) input.classList.remove('error');
    // Find sibling error span
    var errId = inputId + '-error';
    var err = document.getElementById(errId);
    if (err) err.classList.remove('visible');
}

function setupPasswordToggle(inputId, btnId, iconId) {
    var input = document.getElementById(inputId);
    var btn = document.getElementById(btnId);
    var icon = document.getElementById(iconId);
    if (!input || !btn || !icon) return;

    btn.addEventListener('click', function () {
        var isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        icon.className = isPassword ? 'ti ti-eye-off' : 'ti ti-eye';
    });
}

function updateStrengthBar(password) {
    var bar = document.getElementById('strength-bar');
    var label = document.getElementById('strength-label');
    if (!bar || !label) return;

    var score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (password.length === 0) {
        bar.style.width = '0%';
        bar.style.backgroundColor = 'transparent';
        label.textContent = 'Enter a password';
        label.style.color = '#718096';
        return;
    }

    if (score <= 2) {
        bar.style.width = '33%';
        bar.style.backgroundColor = '#E53E3E';
        label.textContent = 'Weak';
        label.style.color = '#FC8181';
    } else if (score <= 3) {
        bar.style.width = '66%';
        bar.style.backgroundColor = '#F5A623';
        label.textContent = 'Fair';
        label.style.color = '#F5A623';
    } else {
        bar.style.width = '100%';
        bar.style.backgroundColor = '#00B4A6';
        label.textContent = 'Strong';
        label.style.color = '#4FD1C5';
    }
}
