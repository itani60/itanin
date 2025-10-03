// Sidebar and Header Functionality
// Global variables for header and sidebar
let isHeaderCategoriesOpen = false;
let isSidebarOpen = false;

// Categories subcategory data
const subcategories = {
        'smartphones-tablets': {
            title: 'Smartphones and Tablets',
            items: [
                { name: 'Smartphones', href: 'smartphones.html?category=smartphones' },
                { name: 'Tablets', href: 'smartphones.html?category=tablets' },
                { name: 'Accessories', href: 'smartphones.html?category=accessories' }
            ]
        },
    'laptops-accessories': {
        title: 'Laptops and Accessories',
        items: [
            { name: 'Windows Laptops', href: 'laptops.html?category=windows' },
            { name: 'Chromebooks', href: 'laptops.html?category=chromebooks' },
            { name: 'MacBooks', href: 'laptops.html?category=macbooks' },
            { name: 'Accessories', href: '#laptop-accessories' }
        ]
    },
    'wearables': {
        title: 'Wearables Devices',
        items: [
            { name: 'Smartwatches', href: '#smartwatches' },
            { name: 'Fitness Trackers', href: '#fitness-trackers' }
        ]
    },
    'televisions': {
        title: 'Televisions & Streaming Devices',
        items: [
            { name: 'Televisions', href: 'television.html?type=televisions' },
            { name: 'Streaming Devices', href: 'television.html?type=streaming-devices' }
        ]
    },
    'audio': {
        title: 'Audio',
        items: [
            { name: 'Earbuds', href: '#earbuds' },
            { name: 'Headphones', href: '#headphones' },
            { name: 'Bluetooth Speakers', href: '#bluetooth-speakers' },
            { name: 'Party Speakers', href: '#party-speakers' },
            { name: 'Soundbars', href: '#soundbars' },
            { name: 'Hi-fi Systems', href: '#hifi-systems' }
        ]
    },
    'gaming': {
        title: 'Gaming',
        items: [
            { name: 'Consoles', href: '#consoles' },
            { name: 'Gaming Laptops', href: '#gaming-laptops' },
            { name: 'Gaming Monitors', href: '#gaming-monitors' },
            { name: 'Handled Gaming', href: '#handled-gaming' },
            { name: 'Consoles Accessories', href: '#consoles-accessories' },
            { name: 'PC Gaming Accessories', href: '#pc-gaming-accessories' }
        ]
    },
    'networking': {
        title: 'Wi-Fi & Networking',
        items: [
            { name: 'Routers', href: '#routers' },
            { name: 'WiFi Ups', href: '#wifi-ups' },
            { name: 'Extenders & Repeaters', href: '#extenders-repeaters' }
        ]
    },
    'appliances': {
        title: 'Appliances',
        items: [
            { name: 'Fridges & Freezers', href: '#fridges-freezers', subItems: [
                { name: 'Fridges', href: '#fridges' },
                { name: 'Freezers', href: '#freezers' }
            ]},
            { name: 'Microwaves, Ovens & Stoves', href: '#microwaves-ovens-stoves' },
            { name: 'Kettles, Coffee Machines', href: '#kettles-coffee-machines' },
            { name: 'Floorcare', href: '#floorcare' },
            { name: 'Food Preparation', href: '#food-preparation' },
            { name: 'Heaters & Electric Blankets', href: '#heaters-electric-blankets' },
            { name: 'Personal Care', href: '#personal-care' },
            { name: 'Cookers & Air Fryers', href: '#cookers-air-fryers' },
            { name: 'Toasters & Sandwich Makers', href: '#toasters-sandwich-makers' },
            { name: 'Dishwashers', href: '#dishwashers' },
            { name: 'Irons & Steamers', href: '#irons-steamers' },
            { name: 'Sewing Machine', href: '#sewing-machine' },
            { name: 'Humidifiers & Purifiers', href: '#humidifiers-purifiers' }
        ]
    }
};

// Header categories dropdown functionality
function toggleHeaderCategories() {
    const headerCategoriesDropdown = document.querySelector('.header-categories-dropdown');
    isHeaderCategoriesOpen = !isHeaderCategoriesOpen;
    
    if (isHeaderCategoriesOpen) {
        headerCategoriesDropdown.classList.add('active');
    } else {
        headerCategoriesDropdown.classList.remove('active');
    }
}

function selectHeaderCategory(category, categoryName) {
    // Filter by the selected category
    filterByCategory(category);
    closeHeaderCategories();
}

// Gaming navigation function
function navigateToGamingCategory(category) {
    // Close header categories if open
    closeHeaderCategories();
    
    // Navigate to gaming page with category parameter
    window.location.href = `gaming.html?category=${category}`;
}

// Audio navigation function
function navigateToAudioCategory(category) {
    // Close header categories if open
    closeHeaderCategories();
    
    // Navigate to audio page with category parameter
    window.location.href = `audio.html?category=${category}`;
}

function closeHeaderCategories() {
    const headerCategoriesDropdown = document.querySelector('.header-categories-dropdown');
    if (headerCategoriesDropdown) {
        headerCategoriesDropdown.classList.remove('active');
        isHeaderCategoriesOpen = false;
    }
}

// Note: Mobile sidebar functionality moved to sidebar-mobile.js

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    const headerCategoriesDropdown = document.querySelector('.header-categories-dropdown');
    
    if (headerCategoriesDropdown && !headerCategoriesDropdown.contains(e.target)) {
        closeHeaderCategories();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Close dropdowns with Escape key
    if (e.key === 'Escape') {
        if (isHeaderCategoriesOpen) {
            closeHeaderCategories();
        }
    }
});

// Initialize categories dropdown functionality
function initializeCategoriesDropdown() {
    const categoryItems = document.querySelectorAll('.category-item');
    const subcategoryTitle = document.getElementById('subcategory-title');
    const subcategoryContent = document.getElementById('subcategory-content');
    const subSubcategoryTitle = document.getElementById('sub-subcategory-title');
    const subSubcategoryContent = document.getElementById('sub-subcategory-content');
    const dropdownRoot = document.querySelector('.categories-dropdown');
    const categoriesMenu = document.querySelector('.categories-menu');

    const resetThirdCol = () => {
        subSubcategoryTitle.textContent = 'Select a subcategory';
        subSubcategoryContent.innerHTML = '<p>Hover over a subcategory to see more options</p>';
        if (categoriesMenu) categoriesMenu.classList.remove('show-col-3');
    };

    const showSecondCol = () => {
        if (categoriesMenu) categoriesMenu.classList.add('show-col-2');
    };

    categoryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const category = this.getAttribute('data-category');
            const subcategoryData = subcategories[category];

            if (subcategoryData) {
                subcategoryTitle.textContent = subcategoryData.title;
                subcategoryContent.innerHTML = subcategoryData.items.map(item => {
                    const hasSubItems = item.subItems && item.subItems.length > 0;
                    const chevronIcon = hasSubItems ? '<i class="fas fa-chevron-right"></i>' : '';
                    return `<a href="${item.href}" class="subcategory-item" data-subcategory="${item.name}" data-category="${category}">${item.name} ${chevronIcon}</a>`;
                }).join('');

                // Wire second-level hover and click events
                const newSubcategoryItems = subcategoryContent.querySelectorAll('.subcategory-item');
                newSubcategoryItems.forEach(subItemEl => {
                    subItemEl.addEventListener('mouseenter', function() {
                        const subcategoryName = this.getAttribute('data-subcategory');
                        const currentCategory = this.getAttribute('data-category');

                        if (currentCategory && subcategories[currentCategory]) {
                            const subcategoryData = subcategories[currentCategory].items.find(i => i.name === subcategoryName);

                            if (subcategoryData && subcategoryData.subItems) {
                                subSubcategoryTitle.textContent = subcategoryData.name;
                                subSubcategoryContent.innerHTML = subcategoryData.subItems.map(subItem =>
                                    `<a href="${subItem.href}" class="sub-subcategory-item">${subItem.name}</a>`
                                ).join('');
                                if (categoriesMenu) categoriesMenu.classList.add('show-col-3');
                            } else {
                                subSubcategoryTitle.textContent = 'No further options';
                                subSubcategoryContent.innerHTML = '<p>No additional subcategories available.</p>';
                                if (categoriesMenu) categoriesMenu.classList.remove('show-col-3');
                            }
                        }
                    });

                    // Add click event for gaming categories
                    subItemEl.addEventListener('click', function(e) {
                        const href = this.getAttribute('href');
                        const currentCategory = this.getAttribute('data-category');
                        
                        // Handle gaming category navigation
                        if (currentCategory === 'gaming') {
                            e.preventDefault();
                            let category = '';
                            
                            // Map href to category parameter
                            if (href.includes('#consoles')) {
                                category = 'consoles';
                            } else if (href.includes('#gaming-laptops')) {
                                category = 'laptop-gaming';
                            } else if (href.includes('#gaming-monitors')) {
                                category = 'gaming-monitors';
                            } else if (href.includes('#handled-gaming')) {
                                category = 'handled-gaming';
                            } else if (href.includes('#consoles-accessories')) {
                                category = 'consoles-accessories';
                            } else if (href.includes('#pc-gaming-accessories')) {
                                category = 'pc-gaming-accessories';
                            }
                            
                            if (category) {
                                navigateToGamingCategory(category);
                            }
                        }
                        
                        // Handle laptop category navigation
                        if (currentCategory === 'laptops-accessories') {
                            e.preventDefault();
                            let category = '';
                            
                            // Map href to category parameter
                            if (href.includes('category=windows')) {
                                category = 'windows';
                            } else if (href.includes('category=macbooks')) {
                                category = 'macbooks';
                            } else if (href.includes('category=chromebooks')) {
                                category = 'chromebooks';
                            }
                            
                            if (category) {
                                console.log('Laptop navigation clicked:', href, '-> category:', category);
                                window.location.href = `laptops.html?category=${category}`;
                            }
                        }
                        
                        // Handle smartphones-tablets category navigation
                        if (currentCategory === 'smartphones-tablets') {
                            e.preventDefault();
                            console.log('Smartphones navigation clicked:', href);
                            window.location.href = href;
                        }
                        
                        // Handle television category navigation
                        if (currentCategory === 'televisions') {
                            e.preventDefault();
                            let type = '';
                            
                            // Map href to type parameter
                            if (href.includes('type=televisions')) {
                                type = 'televisions';
                            } else if (href.includes('type=streaming-devices')) {
                                type = 'streaming-devices';
                            }
                            
                            if (type) {
                                console.log('Television navigation clicked:', href, '-> type:', type);
                                window.location.href = `television.html?type=${type}`;
                            }
                        }
                        
                        // Handle audio category navigation
                        if (currentCategory === 'audio') {
                            e.preventDefault();
                            let category = '';
                            
                            // Map href to category parameter
                            if (href.includes('#earbuds')) {
                                category = 'earbuds';
                            } else if (href.includes('#headphones')) {
                                category = 'headphones';
                            } else if (href.includes('#bluetooth-speakers')) {
                                category = 'bluetooth-speakers';
                            } else if (href.includes('#party-speakers')) {
                                category = 'portable-speakers';
                            } else if (href.includes('#soundbars')) {
                                category = 'soundbars';
                            } else if (href.includes('#hifi-systems')) {
                                category = 'hifi-systems';
                            }
                            
                            if (category) {
                                console.log('Audio navigation clicked:', href, '-> category:', category);
                                navigateToAudioCategory(category);
                            }
                        }
                    });
                });

                showSecondCol();
                resetThirdCol();
            } else {
                subcategoryTitle.textContent = 'No subcategories';
                subcategoryContent.innerHTML = '<p>No subcategories available for this category.</p>';
                showSecondCol();
                resetThirdCol();
            }
        });
    });

    // Direct delegation for third column updates as pointer moves across second column
    document.addEventListener('mouseover', function(e) {
        if (e.target.classList && e.target.classList.contains('subcategory-item')) {
            const subcategoryName = e.target.getAttribute('data-subcategory');
            const currentCategory =
                e.target.getAttribute('data-category') ||
                (e.target.closest('.categories-dropdown')?.querySelector('.category-item:hover')?.getAttribute('data-category'));

            if (currentCategory && subcategories[currentCategory]) {
                const subcategoryData = subcategories[currentCategory].items.find(item => item.name === subcategoryName);
                if (subcategoryData && subcategoryData.subItems) {
                    subSubcategoryTitle.textContent = subcategoryData.name;
                    subSubcategoryContent.innerHTML = subcategoryData.subItems.map(subItem =>
                        `<a href="${subItem.href}" class="sub-subcategory-item">${subItem.name}</a>`
                    ).join('');
                    if (categoriesMenu) categoriesMenu.classList.add('show-col-3');
                } else {
                    subSubcategoryTitle.textContent = 'No further options';
                    subSubcategoryContent.innerHTML = '<p>No additional subcategories available.</p>';
                    if (categoriesMenu) categoriesMenu.classList.remove('show-col-3');
                }
            }
        }
        
    });

    // Clear slide states when the dropdown closes
    if (dropdownRoot) {
        dropdownRoot.addEventListener('mouseleave', () => {
            if (categoriesMenu) {
                categoriesMenu.classList.remove('show-col-2');
                categoriesMenu.classList.remove('show-col-3');
            }
        });
    }
}

// Header login button functionality
function handleHeaderLogin() {
    // Close header categories if open (safe call)
    try { closeHeaderCategories(); } catch (e) {}

    const redirect = () => {
        window.location.href = 'login.html';
    };

    try {
        // If mobile sidebar is open, close it first, then navigate (match mobile behavior)
        if (typeof isMobileSidebarOpen !== 'undefined' && isMobileSidebarOpen && typeof window.toggleSidebar === 'function') {
            window.toggleSidebar();
            setTimeout(redirect, 300);
        } else {
            redirect();
        }
    } catch (err) {
        redirect();
    }
}

// Initialize header functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Header and Sidebar functionality loaded');
    
    // Initialize categories dropdown
    initializeCategoriesDropdown();
    
    // Add click event listeners for sidebar toggle
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleSidebar();
        });
    }
    
    // Add click event listener for header login button
    const headerLoginBtn = document.getElementById('desktopLoginBtn');
    if (headerLoginBtn) {
        headerLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleHeaderLogin();
        });
    }
    
    // Add click event listener for header login link (if exists)
    const headerLoginLink = document.querySelector('a[href="login.html"]');
    if (headerLoginLink && !headerLoginLink.id) {
        headerLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleHeaderLogin();
        });
    }

    // Hover-intent for desktop flyout to prevent flicker on small gaps
    const dropdownRoot = document.querySelector('.categories-dropdown');
    const categoriesMenu = document.querySelector('.categories-menu');
    if (dropdownRoot && categoriesMenu) {
        let openTimer = null;
        let closeTimer = null;

        const openWithIntent = () => {
            clearTimeout(closeTimer);
            if (openTimer) return;
            openTimer = setTimeout(() => {
                dropdownRoot.classList.add('hover-open');
                openTimer = null;
            }, 80); // slight delay to stabilize hover
        };

        // Track recent mouse movement for lightweight menu-aim toward 3rd panel
        const lastMoves = [];
        const MAX_MOVES = 6;
        dropdownRoot.addEventListener('mousemove', (e) => {
            lastMoves.push({ x: e.clientX, y: e.clientY, t: Date.now() });
            if (lastMoves.length > MAX_MOVES) lastMoves.shift();
        });

        function isAimingToThird() {
            try {
                const subCol = document.getElementById('subcategories-column');
                const subSubCol = document.getElementById('sub-subcategories-column');
                if (!subCol || !subSubCol) return false;

                const r2 = subCol.getBoundingClientRect();
                const r3 = subSubCol.getBoundingClientRect();

                // Level-2 must be visible to consider aiming to level-3
                if (!categoriesMenu.classList.contains('show-col-2')) return false;

                // Need at least two points to compute heading
                if (lastMoves.length < 2) return false;
                const a = lastMoves[0];
                const b = lastMoves[lastMoves.length - 1];
                const dx = b.x - a.x;
                const dy = b.y - a.y;

                const headingRight = dx > 12;
                const smallVerticalChange = Math.abs(dy) < 60;

                // Corridor around level-2 vertical range
                const yInCorridor = b.y > (r2.top - 24) && b.y < (r2.bottom + 24);

                // If between level-2 and level-3, keep open as user crosses the gap
                const betweenPanels = b.x > (r2.right - 16) && b.x < (r3.left + 24);

                return (headingRight && smallVerticalChange && yInCorridor) || betweenPanels;
            } catch {
                return false;
            }
        }

        // Smarter close with menu-aim (delay more if moving toward 3rd panel)
        const closeWithIntent = (baseDelay = 120) => {
            clearTimeout(openTimer);
            openTimer = null;
            clearTimeout(closeTimer);

            const delay = isAimingToThird() ? 260 : baseDelay;

            closeTimer = setTimeout(() => {
                dropdownRoot.classList.remove('hover-open');
                // also reset slide states to avoid ghost panels
                categoriesMenu.classList.remove('show-col-2', 'show-col-3');
            }, delay);
        };

        // Pointer-based
        dropdownRoot.addEventListener('mouseenter', openWithIntent);
        dropdownRoot.addEventListener('mouseleave', () => closeWithIntent(150));

        // Keep open when entering flyout panels (level 2 and 3)
        const subCol = document.getElementById('subcategories-column');
        const subSubCol = document.getElementById('sub-subcategories-column');
        [categoriesMenu, subCol, subSubCol].forEach(el => {
            if (el) {
                el.addEventListener('mouseenter', openWithIntent);
                el.addEventListener('mouseleave', () => closeWithIntent(180));
            }
        });

        // Keyboard focus support (optional but helps accessibility)
        dropdownRoot.addEventListener('focusin', () => {
            clearTimeout(closeTimer);
            dropdownRoot.classList.add('hover-open');
        });
        dropdownRoot.addEventListener('focusout', (e) => {
            // close only if focus moves completely outside the root
            if (!dropdownRoot.contains(e.relatedTarget)) {
                closeWithIntent();
            }
        });
    }
});
