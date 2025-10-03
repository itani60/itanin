// Mobile and Tablet Sidebar Functionality
// Global variables for mobile sidebar
let isMobileSidebarOpen = false;

// Main toggle sidebar function
window.toggleSidebar = function() {
    const sidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('sidebarOverlay');

    console.log('toggleSidebar called, current state:', isMobileSidebarOpen);

    if (!sidebar) {
        console.error('Mobile sidebar element not found!');
        return;
    }

    isMobileSidebarOpen = !isMobileSidebarOpen;

    if (isMobileSidebarOpen) {
        // Open sidebar
        sidebar.classList.add('active');
        if (overlay) {
            overlay.classList.add('active');
        }
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        console.log('Sidebar opened');
    } else {
        // Close sidebar
        sidebar.classList.remove('active');
        if (overlay) {
            overlay.classList.remove('active');
        }
        // Restore body scroll
        document.body.style.overflow = '';
        console.log('Sidebar closed');
    }
}

// Close sidebar when clicking outside
document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('mobileSidebar');
    const clickedInsideToggle = e.target.closest('.sidebar-toggle') !== null;
    const clickedInsideSidebar = sidebar && sidebar.contains(e.target);

    // Close sidebar if clicking outside (not the sidebar nor any toggle) and it's open
    if (isMobileSidebarOpen && !clickedInsideSidebar && !clickedInsideToggle) {
        window.toggleSidebar();
    }
});

// Close sidebar on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isMobileSidebarOpen) {
        window.toggleSidebar();
    }
});

// Handle window resize - close sidebar on desktop
window.addEventListener('resize', function() {
    if (window.innerWidth > 1400 && isMobileSidebarOpen) {
        window.toggleSidebar();
    }
});

// Mobile sidebar login button functionality
function handleMobileSidebarLogin() {
    // Close sidebar first
    if (isMobileSidebarOpen) {
        window.toggleSidebar();
    }
    
    // Small delay to allow sidebar to close, then redirect
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 300);
}

// Initialize mobile sidebar functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to close button
    const closeButton = document.getElementById('sidebarClose');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            if (isMobileSidebarOpen) {
                window.toggleSidebar();
            }
        });
    }
    
    // Add event listeners to sidebar links to close sidebar when clicked
    const sidebarLinks = document.querySelectorAll('.sidebar-item');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Small delay to allow the click action to complete
            setTimeout(() => {
                if (isMobileSidebarOpen) {
                    window.toggleSidebar();
                }
            }, 100);
        });
    });
    
    // Add click event listener for mobile sidebar login button
    const mobileLoginBtn = document.querySelector('#mobileSidebar a[href="login.html"]');
    if (mobileLoginBtn) {
        mobileLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleMobileSidebarLogin();
        });
    }
    
    // Add click event listener for mobile sidebar login link (alternative selector)
    const mobileLoginLink = document.querySelector('.mobile-sidebar a[href="login.html"]');
    if (mobileLoginLink) {
        mobileLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleMobileSidebarLogin();
        });
    }
    
    // Add click event listener for any login link in mobile sidebar
    const allMobileLoginLinks = document.querySelectorAll('#mobileSidebar a, .mobile-sidebar a');
    allMobileLoginLinks.forEach(link => {
        if (link.getAttribute('href') === 'login.html' || link.textContent.toLowerCase().includes('login')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                handleMobileSidebarLogin();
            });
        }
    });
    
    console.log('Mobile sidebar functionality initialized');
});

// Toggle submenu function
window.toggleSubmenu = function(element) {
    const item = element.parentElement;
    const isActive = item.classList.contains('active');
    
    // Close all other submenus
    document.querySelectorAll('.menu-items .item').forEach(otherItem => {
        if (otherItem !== item) {
            otherItem.classList.remove('active');
        }
    });
    
    // Toggle current submenu
    if (isActive) {
        item.classList.remove('active');
    } else {
        item.classList.add('active');
    }
}

// Gaming navigation function
function navigateToGamingCategory(category) {
    // Close sidebar first
    if (isMobileSidebarOpen) {
        window.toggleSidebar();
    }
    
    // Small delay to allow sidebar to close, then navigate
    setTimeout(() => {
        window.location.href = `gaming.html?category=${category}`;
    }, 300);
}

// Audio navigation function
function navigateToAudioCategory(category) {
    // Close sidebar first
    if (isMobileSidebarOpen) {
        window.toggleSidebar();
    }
    
    // Small delay to allow sidebar to close, then navigate
    setTimeout(() => {
        window.location.href = `audio.html?category=${category}`;
    }, 300);
}

// Smartphones navigation function
function navigateToSmartphonesCategory(category) {
    // Close sidebar first
    if (isMobileSidebarOpen) {
        window.toggleSidebar();
    }
    
    // Small delay to allow sidebar to close, then navigate
    setTimeout(() => {
        window.location.href = `smartphones.html?category=${category}`;
    }, 300);
}

// Initialize gaming navigation
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for gaming category links
    const gamingLinks = document.querySelectorAll('#mobileSidebar a[href*="#consoles"], #mobileSidebar a[href*="#gaming-laptops"], #mobileSidebar a[href*="#gaming-monitors"], #mobileSidebar a[href*="#handled-gaming"], #mobileSidebar a[href*="#consoles-accessories"], #mobileSidebar a[href*="#pc-gaming-accessories"]');
    
    // Add event listeners for smartphones category links
    const smartphonesLinks = document.querySelectorAll('#mobileSidebar a[href*="#smartphones"], #mobileSidebar a[href*="#tablets"], #mobileSidebar a[href*="#accessories"]');
    
    // Add event listeners for audio category links
    const audioLinks = document.querySelectorAll('#mobileSidebar a[href*="#earbuds"], #mobileSidebar a[href*="#headphones"], #mobileSidebar a[href*="#speakers"], #mobileSidebar a[href*="#party-speakers"], #mobileSidebar a[href*="#soundbars"], #mobileSidebar a[href*="#hifi"]');
    
    // Add event listeners for laptop category links
    const laptopLinks = document.querySelectorAll('#mobileSidebar a[href*="laptops.html"]');
    
    // Add event listeners for television category links
    const televisionLinks = document.querySelectorAll('#mobileSidebar a[href*="television.html"]');
    
    gamingLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
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
        });
    });
    
    // Handle audio category links
    audioLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            let category = '';
            
            // Map href to category parameter
            if (href.includes('#earbuds')) {
                category = 'earbuds';
            } else if (href.includes('#headphones')) {
                category = 'headphones';
            } else if (href.includes('#speakers')) {
                category = 'bluetooth-speakers';
            } else if (href.includes('#party-speakers')) {
                category = 'portable-speakers';
            } else if (href.includes('#soundbars')) {
                category = 'soundbars';
            } else if (href.includes('#hifi')) {
                category = 'hifi-systems';
            }
            
            if (category) {
                navigateToAudioCategory(category);
            }
        });
    });
    
    // Handle smartphones category links
    smartphonesLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            let category = '';
            
            // Map href to category parameter
            if (href.includes('#smartphones')) {
                category = 'smartphones';
            } else if (href.includes('#tablets')) {
                category = 'tablets';
            } else if (href.includes('#accessories')) {
                category = 'accessories';
            }
            
            if (category) {
                navigateToSmartphonesCategory(category);
            }
        });
    });
    
    // Handle laptop category links
    laptopLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            let category = 'macbooks'; // default
            
            // Map href to category parameter
            if (href.includes('category=windows')) {
                category = 'windows';
            } else if (href.includes('category=macbooks')) {
                category = 'macbooks';
            } else if (href.includes('category=chromebooks')) {
                category = 'chromebooks';
            }
            
            console.log('Laptop navigation clicked:', href, '-> category:', category);
            
            // Navigate to laptops page with category parameter
            window.location.href = `laptops.html?category=${category}`;
        });
    });
    
    // Handle television category links
    televisionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            let type = 'televisions'; // default
            
            // Map href to type parameter
            if (href.includes('type=televisions')) {
                type = 'televisions';
            } else if (href.includes('type=streaming-devices')) {
                type = 'streaming-devices';
            }
            
            console.log('Television navigation clicked:', href, '-> type:', type);
            
            // Navigate to television page with type parameter
            window.location.href = `television.html?type=${type}`;
        });
    });
    
    // Also handle any gaming-related links in the sidebar
    const allGamingLinks = document.querySelectorAll('#mobileSidebar a, .mobile-sidebar a');
    allGamingLinks.forEach(link => {
        const text = link.textContent.toLowerCase();
        const href = link.getAttribute('href');
        
        // Skip links that already have href-based detection
        if (href && (href.includes('#consoles') || href.includes('#gaming-laptops') || 
                   href.includes('#gaming-monitors') || href.includes('#handled-gaming') || 
                   href.includes('#consoles-accessories') || href.includes('#pc-gaming-accessories') ||
                   href.includes('#earbuds') || href.includes('#headphones') || 
                   href.includes('#speakers') || href.includes('#party-speakers') || 
                   href.includes('#soundbars') || href.includes('#hifi') ||
                   href.includes('#smartphones') || href.includes('#tablets') || href.includes('#accessories') ||
                   href.includes('laptops.html') || href.includes('television.html'))) {
            return; // Skip this link as it's already handled by href-based detection
        }
        
        if (text.includes('consoles accessories')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navigateToGamingCategory('consoles-accessories');
            });
        } else if (text.includes('gaming console') || (text.includes('console') && !text.includes('accessories'))) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navigateToGamingCategory('consoles');
            });
        } else if (text.includes('gaming laptop') || text.includes('laptop')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navigateToGamingCategory('laptop-gaming');
            });
        } else if (text.includes('gaming monitor') || text.includes('monitor')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navigateToGamingCategory('gaming-monitors');
            });
        } else if (text.includes('pc gaming accessories') || text.includes('pc gaming accessory')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navigateToGamingCategory('pc-gaming-accessories');
            });
        } else if (text.includes('windows laptop') || text.includes('windows laptops')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'laptops.html?category=windows';
            });
        } else if (text.includes('macbook') || text.includes('macbooks')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'laptops.html?category=macbooks';
            });
        } else if (text.includes('chromebook') || text.includes('chromebooks')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'laptops.html?category=chromebooks';
            });
        } else if (text.includes('television') || text.includes('televisions')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'television.html?type=televisions';
            });
        } else if (text.includes('streaming device') || text.includes('streaming devices')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'television.html?type=streaming-devices';
            });
        } else if (text.includes('smartphone') || text.includes('smartphones')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navigateToSmartphonesCategory('smartphones');
            });
        } else if (text.includes('tablet') || text.includes('tablets')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navigateToSmartphonesCategory('tablets');
            });
        } else if (text.includes('mobile accessories') || text.includes('accessories')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navigateToSmartphonesCategory('accessories');
            });
        } else if (text.includes('earbuds') || text.includes('earbud')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navigateToAudioCategory('earbuds');
            });
        } else if (text.includes('headphones') || text.includes('headphone')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navigateToAudioCategory('headphones');
            });
        } else if (text.includes('bluetooth speakers') || text.includes('bluetooth speaker')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navigateToAudioCategory('bluetooth-speakers');
            });
        } else if (text.includes('party speakers') || text.includes('party speaker')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navigateToAudioCategory('portable-speakers');
            });
        } else if (text.includes('soundbars') || text.includes('soundbar')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navigateToAudioCategory('soundbars');
            });
        } else if (text.includes('hifi') || text.includes('hi-fi') || text.includes('stereo')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navigateToAudioCategory('hifi-systems');
            });
        }
    });
});
