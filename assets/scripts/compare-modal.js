// Compare Modal - Interactive Product Comparison
class CompareModal {
    constructor() {
        this.isOpen = false;
        this.products = [];
        this.allProducts = [];
        this.currentSearchTerm = '';
        this.searchResults = [];
        
        this.init();
    }

    init() {
        this.createModalHTML();
        this.attachEventListeners();
    }

    createModalHTML() {
        const modalHTML = `
            <!-- Compare Modal -->
            <div id="compare-modal" class="compare-modal">
                <div class="compare-modal-content">
                    <div class="compare-modal-header">
                        <h2>Compare Smartphones</h2>
                        <span id="compare-modal-close" class="compare-modal-close" onclick="hideCompareModal()">&times;</span>
                    </div>
                    <div class="compare-modal-body">
                        <!-- Products for comparison -->
                        <div id="compare-products-container" class="compare-products-container" style="display: flex; gap: 20px; margin-bottom: 30px;">
                            <!-- Product cards will be added here dynamically -->
                        </div>
                        
                        <!-- Product search for adding products -->
                        <div class="product-search-container">
                            <div class="search-header" style="margin-bottom: 15px; text-align: center;">
                                <h3 style="margin: 0; color: #333;">Find a phone to compare</h3>
                                <p style="margin: 5px 0 0; color: #666; font-size: 14px;">Search by brand or model name</p>
                            </div>
                            <input type="text" id="product-search-input" class="product-search-input" placeholder="e.g., Samsung Galaxy, iPhone, Pixel..." style="display: none; width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #ddd; font-size: 16px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                            <div id="product-search-results" class="product-search-results" style="display: none; max-height: 300px; overflow-y: auto; margin-top: 10px; border: 1px solid #eee; border-radius: 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
                                <!-- Search results will be added here dynamically -->
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    attachEventListeners() {
        // Close modal events
        document.getElementById('compare-modal-close').addEventListener('click', () => this.close());
        document.getElementById('compare-modal').addEventListener('click', (e) => {
            if (e.target.id === 'compare-modal') {
                this.close();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Search input events - will be attached after modal is created
        this.attachSearchInputListener();
    }

    attachSearchInputListener() {
        // Wait a bit for the modal to be created, then attach the listener
        setTimeout(() => {
            const searchInput = document.getElementById('product-search-input');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.currentSearchTerm = e.target.value;
                    this.performSearch();
                });
                console.log('Search input listener attached');
            } else {
                console.log('Search input not found');
            }
        }, 100);
    }

    async open(product = null) {
        if (this.isOpen) return;

        this.isOpen = true;
        document.getElementById('compare-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Load all products for search
        await this.loadAllProducts();

        // Initialize with empty state or provided product
        this.products = product ? [product] : [];
        this.renderProducts();

        // Don't automatically show search input - let user click empty slot
        this.hideSearchInput();
    }

    close() {
        if (!this.isOpen) return;

        this.isOpen = false;
        document.getElementById('compare-modal').style.display = 'none';
        document.body.style.overflow = '';
        
        // Reset state
        this.products = [];
        this.currentSearchTerm = '';
        this.searchResults = [];
        this.hideSearchInput();
    }

    async loadAllProducts() {
        try {
            const response = await fetch('https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/smartphones');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.allProducts = Array.isArray(data) ? data : (data.products || data.data || []);
        } catch (error) {
            console.error('Error loading products:', error);
            this.allProducts = [];
        }
    }

    renderProducts() {
        const container = document.getElementById('compare-products-container');
        container.innerHTML = '';

        // Always show 2 slots
        for (let i = 0; i < 2; i++) {
            const product = this.products[i];
            const cardHTML = product ? this.createProductCard(product, i) : this.createEmptyCard(i);
            container.insertAdjacentHTML('beforeend', cardHTML);
        }
    }

    createProductCard(product, index) {
        const lowestPrice = this.getLowestPrice(product);
        const formattedPrice = lowestPrice ? 
            lowestPrice.toLocaleString('en-ZA', { 
                style: 'currency', 
                currency: 'ZAR', 
                minimumFractionDigits: 0, 
                maximumFractionDigits: 0 
            }) : 'Price not available';

        const imageUrl = product.imageUrl || product.image || 'https://via.placeholder.com/150?text=No+Image';
        const productName = product.model || product.title || 'Unknown Product';
        const brandName = product.brand || 'Unknown Brand';

        return `
            <div class="product-card" data-index="${index}" style="flex: 1; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: white; position: relative;">
                <button onclick="compareModal.removeProduct(${index})" style="position: absolute; top: 10px; right: 10px; background: #ff4444; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; font-size: 14px;">&times;</button>
                <div style="text-align: center; margin-bottom: 15px;">
                    <img src="${imageUrl}" alt="${productName}" style="max-width: 120px; max-height: 120px; object-fit: contain;" onerror="this.src='https://via.placeholder.com/120?text=No+Image'">
                </div>
                <h3 style="margin: 0 0 5px 0; font-size: 18px; color: #333;">${productName}</h3>
                <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">${brandName}</p>
                <div style="text-align: center; font-size: 16px; font-weight: bold; color: #007bff; margin-bottom: 15px;">${formattedPrice}</div>
                
                <!-- Buttons Row -->
                <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 10px;">
                    <!-- Specs Button -->
                    <button onclick="compareModal.toggleSpecs(${index})" class="specs-toggle-btn" style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 6px;">
                        <span>Specs</span>
                        <i class="fas fa-chevron-down specs-chevron" style="font-size: 12px; transition: transform 0.3s ease;"></i>
                    </button>
                    
                    <!-- Prices Button -->
                    <button onclick="compareModal.togglePrices(${index})" class="prices-toggle-btn" style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 6px;">
                        <span>Prices</span>
                        <i class="fas fa-chevron-down prices-chevron" style="font-size: 12px; transition: transform 0.3s ease;"></i>
                    </button>
                </div>
                
                <!-- Specs Content (Hidden by default) -->
                <div class="specs-content" id="specs-${index}" style="display: none; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 10px; margin-top: 10px;">
                    ${this.renderAllSpecs(product.specs)}
                </div>
                
                <!-- Prices Content (Hidden by default) -->
                <div class="prices-content" id="prices-${index}" style="display: none; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 10px; margin-top: 10px;">
                    ${this.renderAllPrices(product.offers)}
                </div>
            </div>
        `;
    }

    createEmptyCard(index) {
        return `
            <div class="empty-card" data-index="${index}" style="flex: 1; border: 2px dashed #ddd; border-radius: 8px; padding: 40px 20px; background: #f9f9f9; text-align: center; cursor: pointer;" onclick="compareModal.showSearchForSlot(${index})">
                <div style="font-size: 48px; color: #ccc; margin-bottom: 15px;">+</div>
                <h4 style="margin: 0 0 10px 0; color: #666;">Add Product ${index + 1}</h4>
                <p style="margin: 0; color: #999; font-size: 14px;">Click to search and add a smartphone</p>
            </div>
        `;
    }

    renderSpecs(specs) {
        if (!specs) {
            return '<p class="text-muted">No specifications available</p>';
        }

        const keySpecs = this.extractKeySpecs(specs);
        return keySpecs.map(spec => `
            <div class="spec-item">
                <span class="spec-label">${spec.label}</span>
                <span class="spec-value">${spec.value}</span>
            </div>
        `).join('');
    }

    renderAllSpecs(specs) {
        if (!specs) {
            return '<p style="color: #999; text-align: center; margin: 10px 0;">No specifications available</p>';
        }

        let specsHTML = '';
        
        Object.entries(specs).forEach(([category, categorySpecs]) => {
            // Add category header
            specsHTML += `
                <div style="margin-bottom: 12px;">
                    <h5 style="margin: 0 0 8px 0; color: #333; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${this.formatCategoryName(category)}</h5>
            `;
            
            if (typeof categorySpecs === 'object' && !Array.isArray(categorySpecs)) {
                Object.entries(categorySpecs).forEach(([key, value]) => {
                    if (typeof value === 'object' && !Array.isArray(value)) {
                        // Nested object (like Display.Main)
                        specsHTML += `
                            <div style="margin-left: 10px; margin-bottom: 6px;">
                                <div style="font-weight: 500; color: #555; font-size: 12px; margin-bottom: 4px;">${this.formatSpecName(key)}</div>
                        `;
                        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                            specsHTML += `
                                <div style="margin-left: 10px; margin-bottom: 2px; font-size: 11px; color: #666;">
                                    <span style="font-weight: 500;">${this.formatSpecName(nestedKey)}:</span> ${nestedValue}
                                </div>
                            `;
                        });
                        specsHTML += `</div>`;
                    } else if (Array.isArray(value)) {
                        // Array of values
                        specsHTML += `
                            <div style="margin-left: 10px; margin-bottom: 6px;">
                                <div style="font-weight: 500; color: #555; font-size: 12px; margin-bottom: 4px;">${this.formatSpecName(key)}</div>
                                <ul style="margin: 0; padding-left: 15px; font-size: 11px; color: #666;">
                                    ${value.map(item => `<li>${item}</li>`).join('')}
                                </ul>
                            </div>
                        `;
                    } else {
                        // Simple value
                        specsHTML += `
                            <div style="margin-left: 10px; margin-bottom: 4px; font-size: 12px;">
                                <span style="font-weight: 500; color: #555;">${this.formatSpecName(key)}:</span> 
                                <span style="color: #666;">${value}</span>
                            </div>
                        `;
                    }
                });
            } else if (Array.isArray(categorySpecs)) {
                // Category is an array
                specsHTML += `
                    <div style="margin-left: 10px; margin-bottom: 6px;">
                        <ul style="margin: 0; padding-left: 15px; font-size: 11px; color: #666;">
                            ${categorySpecs.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }
            
            specsHTML += `</div>`;
        });
        
        return specsHTML;
    }

    renderAllPrices(offers) {
        if (!offers || offers.length === 0) {
            return '<p style="color: #999; text-align: center; margin: 10px 0;">No price information available</p>';
        }

        // Sort offers by price (lowest first)
        const sortedOffers = [...offers].sort((a, b) => (a.price || 0) - (b.price || 0));
        const lowestPrice = sortedOffers[0]?.price;

        let pricesHTML = '<div style="margin-bottom: 12px;">';
        
        sortedOffers.forEach((offer, index) => {
            const currentPrice = offer.price ? 
                offer.price.toLocaleString('en-ZA', { 
                    style: 'currency', 
                    currency: 'ZAR', 
                    minimumFractionDigits: 0, 
                    maximumFractionDigits: 0 
                }) : 'Price not available';
                
            const originalPrice = offer.originalPrice && offer.originalPrice !== offer.price ?
                offer.originalPrice.toLocaleString('en-ZA', { 
                    style: 'currency', 
                    currency: 'ZAR', 
                    minimumFractionDigits: 0, 
                    maximumFractionDigits: 0 
                }) : null;
            
            const isBestPrice = offer.price === lowestPrice;
            const savings = originalPrice && offer.originalPrice > offer.price ? 
                (offer.originalPrice - offer.price).toLocaleString('en-ZA', { 
                    style: 'currency', 
                    currency: 'ZAR', 
                    minimumFractionDigits: 0, 
                    maximumFractionDigits: 0 
                }) : null;

            pricesHTML += `
                <div style="margin-bottom: 12px; padding: 10px; border: 1px solid #eee; border-radius: 6px; background: white;">
                    <div style="margin-bottom: 6px;">
                        <div style="font-weight: 600; color: #333; font-size: 13px;">${offer.retailer}</div>
                    </div>
                    <div style="margin-bottom: 6px;">
                        ${originalPrice ? `<div style="text-decoration: line-through; color: #999; font-size: 11px; margin-bottom: 2px;">${originalPrice}</div>` : ''}
                        <div style="font-size: 16px; font-weight: bold; color: #007bff;">${currentPrice}</div>
                        ${savings ? `<div style="color: #28a745; font-size: 11px; font-weight: 500;">Save ${savings}</div>` : ''}
                    </div>
                    <a href="${offer.url}" target="_blank" style="display: inline-block; background: #007bff; color: white; padding: 6px 12px; border-radius: 4px; text-decoration: none; font-size: 11px; font-weight: 500; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#0056b3'" onmouseout="this.style.backgroundColor='#007bff'">
                        <i class="fas fa-external-link-alt" style="margin-right: 4px;"></i>Visit Store
                    </a>
                </div>
            `;
        });
        
        pricesHTML += '</div>';
        return pricesHTML;
    }

    extractKeySpecs(specs) {
        const keySpecs = [];
        
        // Display specs
        if (specs.Display?.Main) {
            const display = specs.Display.Main;
            if (display.Size) keySpecs.push({ label: 'Screen Size', value: display.Size });
            if (display.Resolution) keySpecs.push({ label: 'Resolution', value: display.Resolution });
        }
        
        // Performance specs
        if (specs.Performance) {
            if (specs.Performance.Ram) keySpecs.push({ label: 'RAM', value: specs.Performance.Ram });
            if (specs.Performance.Storage) keySpecs.push({ label: 'Storage', value: specs.Performance.Storage });
        }
        
        // Camera specs
        if (specs.Camera?.Rear_Main) {
            keySpecs.push({ label: 'Main Camera', value: specs.Camera.Rear_Main });
        }
        
        // Battery specs
        if (specs.Battery?.Capacity) {
            keySpecs.push({ label: 'Battery', value: specs.Battery.Capacity });
        }
        
        // Operating System
        if (specs.Os?.['Operating System']) {
            keySpecs.push({ label: 'OS', value: specs.Os['Operating System'] });
        }
        
        return keySpecs.slice(0, 6); // Limit to 6 key specs
    }

    renderPrices(offers, lowestPrice) {
        if (!offers || offers.length === 0) {
            return '<p class="text-muted">No price information available</p>';
        }

        // Sort offers by price
        const sortedOffers = [...offers].sort((a, b) => a.price - b.price);

        return sortedOffers.slice(0, 3).map(offer => {
            const isBestPrice = offer.price === lowestPrice;
            const formattedPrice = offer.price ? 
                offer.price.toLocaleString('en-ZA', { 
                    style: 'currency', 
                    currency: 'ZAR', 
                    minimumFractionDigits: 0, 
                    maximumFractionDigits: 0 
                }) : 'Price not available';

            return `
                <div class="price-item">
                    <span class="retailer-name">${offer.retailer}</span>
                    <div class="d-flex align-items-center gap-2">
                        <span class="price-value">${formattedPrice}</span>
                        ${isBestPrice ? '<span class="best-price">Best Price</span>' : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    attachCardEventListeners() {
        // Add click listeners for empty cards
        document.querySelectorAll('.product-compare-card.empty').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    const index = parseInt(card.dataset.index);
                    this.showSearchModal(index);
                }
            });
        });
    }

    showSearchModal(index) {
        const card = document.querySelector(`[data-index="${index}"]`);
        if (!card) return;

        // Create search modal HTML
        const searchModalHTML = `
            <div class="search-modal active" id="searchModal${index}">
                <div class="search-header">
                    <button class="action-btn btn-secondary" onclick="compareModal.hideSearchModal(${index})">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <input type="text" class="search-input" id="searchInput${index}" placeholder="Search smartphones...">
                </div>
                <div class="search-results" id="searchResults${index}">
                    <div class="text-center text-muted">
                        <i class="fas fa-search" style="font-size: 32px; margin-bottom: 12px; color: #6c757d;"></i>
                        <p style="color: #666;">Start typing to search for smartphones</p>
                    </div>
                </div>
            </div>
        `;

        card.insertAdjacentHTML('beforeend', searchModalHTML);

        // Focus on search input
        const searchInput = document.getElementById(`searchInput${index}`);
        searchInput.focus();

        // Add real-time search
        searchInput.addEventListener('input', (e) => {
            this.currentSearchTerm = e.target.value;
            this.performSearch(index);
        });

        // Add enter key support
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(index);
            }
        });
    }

    hideSearchModal(index) {
        const searchModal = document.getElementById(`searchModal${index}`);
        if (searchModal) {
            searchModal.remove();
        }
    }

    performSearch(index) {
        const searchTerm = this.currentSearchTerm.toLowerCase();
        const resultsContainer = document.getElementById(`searchResults${index}`);

        if (!searchTerm.trim()) {
            resultsContainer.innerHTML = `
                <div class="text-center text-muted">
                    <i class="fas fa-search" style="font-size: 32px; margin-bottom: 12px; color: #6c757d;"></i>
                    <p style="color: #666;">Start typing to search for smartphones</p>
                </div>
            `;
            return;
        }

        // Filter products
        const filteredProducts = this.allProducts.filter(product => {
            const name = (product.model || product.title || '').toLowerCase();
            const brand = (product.brand || '').toLowerCase();
            return name.includes(searchTerm) || brand.includes(searchTerm);
        });

        if (filteredProducts.length === 0) {
            resultsContainer.innerHTML = `
                <div class="text-center text-muted">
                    <i class="fas fa-search" style="font-size: 32px; margin-bottom: 12px; color: #6c757d;"></i>
                    <p style="color: #666;">No products found for "${searchTerm}"</p>
                </div>
            `;
            return;
        }

        // Display results
        resultsContainer.innerHTML = filteredProducts.slice(0, 10).map(product => {
            const imageUrl = product.imageUrl || product.image || 'https://via.placeholder.com/60?text=No+Image';
            const productName = product.model || product.title || 'Unknown Product';
            const brandName = product.brand || 'Unknown Brand';
            const lowestPrice = this.getLowestPrice(product);
            const formattedPrice = lowestPrice ? 
                lowestPrice.toLocaleString('en-ZA', { 
                    style: 'currency', 
                    currency: 'ZAR', 
                    minimumFractionDigits: 0, 
                    maximumFractionDigits: 0 
                }) : 'Price not available';

            return `
                <div class="search-result-item" onclick="compareModal.selectProduct(${index}, '${product.product_id || product.id}')">
                    <img src="${imageUrl}" alt="${productName}" onerror="this.src='https://via.placeholder.com/60?text=No+Image'">
                    <div class="search-result-info">
                        <h6>${productName}</h6>
                        <p>${brandName} • ${formattedPrice}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    selectProduct(index, productId) {
        const product = this.allProducts.find(p => (p.product_id || p.id) === productId);
        if (!product) return;

        // Add product to the specified slot
        this.products[index] = product;
        
        // Hide search modal
        this.hideSearchModal(index);
        
        // Re-render the grid
        this.renderCompareGrid();
        
        // Add animation
        const card = document.querySelector(`[data-index="${index}"]`);
        if (card) {
            card.classList.add('adding');
            setTimeout(() => card.classList.remove('adding'), 500);
        }

        // Update actions visibility
        this.updateActionsVisibility();
    }

    removeProduct(index) {
        this.products[index] = null;
        this.renderProducts();
    }

    showSearchInput() {
        const searchInput = document.getElementById('product-search-input');
        if (searchInput) {
            searchInput.style.display = 'block';
        }
    }

    hideSearchInput() {
        const searchInput = document.getElementById('product-search-input');
        const searchResults = document.getElementById('product-search-results');
        if (searchInput) {
            searchInput.style.display = 'none';
            searchInput.value = '';
        }
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }

    showSearchForSlot(index) {
        console.log('showSearchForSlot called with index:', index);
        this.currentSlot = index;
        this.showSearchInput();
        const searchInput = document.getElementById('product-search-input');
        if (searchInput) {
            searchInput.focus();
            searchInput.value = ''; // Clear any previous search
        }
        // Clear any previous search results
        const resultsContainer = document.getElementById('product-search-results');
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
    }

    performSearch() {
        const searchTerm = this.currentSearchTerm.toLowerCase();
        const resultsContainer = document.getElementById('product-search-results');

        if (!searchTerm.trim()) {
            resultsContainer.style.display = 'none';
            return;
        }

        // Filter products
        const filteredProducts = this.allProducts.filter(product => {
            const name = (product.model || product.title || '').toLowerCase();
            const brand = (product.brand || '').toLowerCase();
            return name.includes(searchTerm) || brand.includes(searchTerm);
        });

        if (filteredProducts.length === 0) {
            resultsContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">No products found</div>';
            resultsContainer.style.display = 'block';
            return;
        }

        // Display results
        resultsContainer.innerHTML = filteredProducts.slice(0, 8).map(product => {
            const imageUrl = product.imageUrl || product.image || 'https://via.placeholder.com/50?text=No+Image';
            const productName = product.model || product.title || 'Unknown Product';
            const brandName = product.brand || 'Unknown Brand';
            const lowestPrice = this.getLowestPrice(product);
            const formattedPrice = lowestPrice ? 
                lowestPrice.toLocaleString('en-ZA', { 
                    style: 'currency', 
                    currency: 'ZAR', 
                    minimumFractionDigits: 0, 
                    maximumFractionDigits: 0 
                }) : 'Price not available';

            return `
                <div class="search-result-item" onclick="compareModal.selectProduct('${product.product_id || product.id}')" style="display: flex; align-items: center; gap: 12px; padding: 12px; border-bottom: 1px solid #eee; cursor: pointer; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f5f5f5'" onmouseout="this.style.backgroundColor='white'">
                    <img src="${imageUrl}" alt="${productName}" style="width: 50px; height: 50px; object-fit: contain; border-radius: 4px;" onerror="this.src='https://via.placeholder.com/50?text=No+Image'">
                    <div style="flex: 1;">
                        <h6 style="margin: 0 0 4px 0; color: #333; font-size: 14px;">${productName}</h6>
                        <p style="margin: 0; color: #666; font-size: 12px;">${brandName} • ${formattedPrice}</p>
                    </div>
                </div>
            `;
        }).join('');

        resultsContainer.style.display = 'block';
    }

    selectProduct(productId) {
        console.log('selectProduct called with productId:', productId);
        console.log('currentSlot:', this.currentSlot);
        const product = this.allProducts.find(p => (p.product_id || p.id) === productId);
        console.log('found product:', product);
        
        if (product && this.currentSlot !== undefined) {
            this.products[this.currentSlot] = product;
            console.log('products array after adding:', this.products);
            this.renderProducts();
            this.hideSearchInput();
            this.currentSlot = undefined;
        } else {
            console.log('Failed to add product - product:', !!product, 'currentSlot:', this.currentSlot);
        }
    }

    toggleSpecs(index) {
        const specsContent = document.getElementById(`specs-${index}`);
        const chevron = document.querySelector(`#specs-${index}`).previousElementSibling.querySelector('.specs-chevron');
        
        if (specsContent.style.display === 'none') {
            specsContent.style.display = 'block';
            chevron.style.transform = 'rotate(180deg)';
        } else {
            specsContent.style.display = 'none';
            chevron.style.transform = 'rotate(0deg)';
        }
    }

    togglePrices(index) {
        const pricesContent = document.getElementById(`prices-${index}`);
        const chevron = document.querySelector(`#prices-${index}`).previousElementSibling.querySelector('.prices-chevron');
        
        if (pricesContent.style.display === 'none') {
            pricesContent.style.display = 'block';
            chevron.style.transform = 'rotate(180deg)';
        } else {
            pricesContent.style.display = 'none';
            chevron.style.transform = 'rotate(0deg)';
        }
    }

    updateActionsVisibility() {
        const actions = document.getElementById('compareActions');
        const hasProducts = this.products.some(p => p !== null);
        actions.style.display = hasProducts ? 'flex' : 'none';
    }

    formatCategoryName(category) {
        return category.replace(/([A-Z])/g, ' $1')
                      .replace(/^./, str => str.toUpperCase())
                      .trim();
    }

    formatSpecName(specName) {
        return specName.replace(/([A-Z])/g, ' $1')
                       .replace(/_/g, ' ')
                       .replace(/^./, str => str.toUpperCase())
                       .trim();
    }

    getLowestPrice(product) {
        if (!product.offers || product.offers.length === 0) return 0;
        const prices = product.offers.map(offer => offer.price).filter(price => typeof price === 'number' && price > 0);
        return prices.length > 0 ? Math.min(...prices) : 0;
    }

    exportComparison() {
        if (this.products.filter(p => p !== null).length < 2) {
            alert('Please add at least 2 products to compare');
            return;
        }

        // Create comparison data
        const comparisonData = this.products.filter(p => p !== null).map(product => ({
            name: product.model || product.title,
            brand: product.brand,
            price: this.getLowestPrice(product),
            specs: this.extractKeySpecs(product.specs),
            offers: product.offers
        }));

        // Create downloadable content
        const content = this.generateComparisonText(comparisonData);
        this.downloadTextFile(content, 'smartphone-comparison.txt');
    }

    generateComparisonText(products) {
        let content = 'SMARTPHONE COMPARISON REPORT\n';
        content += '='.repeat(50) + '\n\n';

        products.forEach((product, index) => {
            content += `PRODUCT ${index + 1}: ${product.brand} ${product.name}\n`;
            content += '-'.repeat(30) + '\n';
            content += `Price: ${product.price.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' })}\n\n`;
            
            content += 'Key Specifications:\n';
            product.specs.forEach(spec => {
                content += `  • ${spec.label}: ${spec.value}\n`;
            });
            content += '\n';
        });

        return content;
    }

    downloadTextFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    shareComparison() {
        if (this.products.filter(p => p !== null).length < 2) {
            alert('Please add at least 2 products to compare');
            return;
        }

        const productNames = this.products.filter(p => p !== null).map(p => `${p.brand} ${p.model || p.title}`).join(' vs ');
        const shareText = `Check out this smartphone comparison: ${productNames}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Smartphone Comparison',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Comparison link copied to clipboard!');
            });
        }
    }
}

// Initialize the compare modal
let compareModal;
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all scripts are loaded
    setTimeout(() => {
        compareModal = new CompareModal();
        console.log('Compare modal initialized');
    }, 100);
});

// Global function to open compare modal (called from other scripts)
function openCompareModal(product = null) {
    if (compareModal) {
        compareModal.open(product);
    } else {
        console.log('Compare modal not ready yet, waiting...');
        // Wait for modal to be initialized
        const checkModal = setInterval(() => {
            if (compareModal) {
                clearInterval(checkModal);
                compareModal.open(product);
            }
        }, 100);
        
        // Timeout after 5 seconds
        setTimeout(() => {
            clearInterval(checkModal);
            if (!compareModal) {
                console.error('Compare modal failed to initialize');
            }
        }, 5000);
    }
}

// Also attach to window object for better compatibility
window.openCompareModal = openCompareModal;

// Global function to hide compare modal
function hideCompareModal() {
    if (compareModal) {
        compareModal.close();
    }
}
