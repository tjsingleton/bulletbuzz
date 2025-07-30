// Custom JavaScript for BulletBuzz API Documentation
// Adds navigation links to the main documentation site

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    function addNavigation() {
        // Create navigation bar
        const navBar = document.createElement('div');
        navBar.className = 'api-nav';
        navBar.innerHTML = `
            <div class="container">
                <h1>📚 BulletBuzz API Documentation</h1>
                <div class="nav-links">
                    <a href="../" title="Back to main documentation">
                        📖 Main Docs
                    </a>
                    <a href="../game/" title="Play the game">
                        🎮 Play Game
                    </a>
                    <a href="https://github.com/tjsingleton/bulletbuzz" target="_blank" title="View source code">
                        🔗 GitHub
                    </a>
                    <a href="../testing/" title="Testing documentation" class="primary">
                        🧪 Testing
                    </a>
                </div>
            </div>
        `;
        
        // Insert navigation at the top of the page
        const body = document.body;
        const firstChild = body.firstChild;
        body.insertBefore(navBar, firstChild);
        
        // Also add a breadcrumb-style link in the existing toolbar
        const toolbar = document.querySelector('.tsd-page-toolbar');
        if (toolbar) {
            const toolbarContents = toolbar.querySelector('.tsd-toolbar-contents');
            if (toolbarContents) {
                const backLink = document.createElement('a');
                backLink.href = '../';
                backLink.className = 'tsd-widget';
                backLink.style.marginRight = '15px';
                backLink.style.color = '#666';
                backLink.style.textDecoration = 'none';
                backLink.innerHTML = '← Back to Docs';
                backLink.title = 'Return to main documentation';
                
                // Insert before the search button
                const searchTrigger = toolbar.querySelector('#tsd-search-trigger');
                if (searchTrigger) {
                    toolbarContents.insertBefore(backLink, searchTrigger);
                } else {
                    toolbarContents.appendChild(backLink);
                }
            }
        }
        
        // Add a floating "Back to Docs" button for mobile
        const floatingButton = document.createElement('div');
        floatingButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            cursor: pointer;
            font-weight: 500;
            transition: transform 0.2s ease;
        `;
        floatingButton.innerHTML = '📖 Back to Docs';
        floatingButton.title = 'Return to main documentation';
        floatingButton.onclick = function() {
            window.location.href = '../';
        };
        floatingButton.onmouseenter = function() {
            this.style.transform = 'scale(1.05)';
        };
        floatingButton.onmouseleave = function() {
            this.style.transform = 'scale(1)';
        };
        
        // Only show on mobile
        if (window.innerWidth <= 768) {
            document.body.appendChild(floatingButton);
        }
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth <= 768) {
                if (!document.body.contains(floatingButton)) {
                    document.body.appendChild(floatingButton);
                }
            } else {
                if (document.body.contains(floatingButton)) {
                    document.body.removeChild(floatingButton);
                }
            }
        });
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addNavigation);
    } else {
        addNavigation();
    }
})(); 