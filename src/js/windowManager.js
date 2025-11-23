export class WindowManager {
    constructor() {
        this.windows = [];
        this.activeWindow = null;
        this.zIndexCounter = 100;
        this.container = document.getElementById('window-container');
        this.taskbarWindows = document.getElementById('taskbar-windows');

        // Bind methods
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
    }

    createWindow(options) {
        const id = 'window-' + Date.now();
        const isMobile = window.innerWidth < 768;
        const defaultWidth = isMobile ? Math.min(600, window.innerWidth * 0.9) : (options.width || 600);
        const defaultHeight = isMobile ? Math.min(400, window.innerHeight * 0.6) : (options.height || 400);
        const defaultX = isMobile ? (window.innerWidth - defaultWidth) / 2 : (options.x || 50 + (this.windows.length * 20));
        const defaultY = isMobile ? 20 + (this.windows.length * 20) : (options.y || 50 + (this.windows.length * 20));

        const win = {
            id,
            title: options.title || 'Untitled',
            icon: options.icon || 'default',
            width: defaultWidth,
            height: defaultHeight,
            x: defaultX,
            y: defaultY,
            isMinimized: false,
            isMaximized: false,
            content: options.content || '',
            onClose: options.onClose,
            app: options.app
        };

        this.windows.push(win);
        this.renderWindow(win);
        this.createTaskbarItem(win);
        this.focusWindow(id);

        return win;
    }

    renderWindow(win) {
        const el = document.createElement('div');
        el.id = win.id;
        el.className = 'window';
        el.style.width = win.width + 'px';
        el.style.height = win.height + 'px';
        el.style.left = win.x + 'px';
        el.style.top = win.y + 'px';
        el.style.zIndex = this.zIndexCounter++;

        el.innerHTML = `
      <div class="title-bar">
        <div class="title-bar-text">
          <img src="/icons/${win.icon}.svg" onerror="this.style.display='none'" />
          ${win.title}
        </div>
        <div class="title-bar-controls">
          <div class="title-bar-button minimize-btn">_</div>
          <div class="title-bar-button maximize-btn">□</div>
          <div class="title-bar-button close-btn">X</div>
        </div>
      </div>
      <div class="window-body">
        ${win.content}
      </div>
      <div class="resize-handle"></div>
    `;

        this.container.appendChild(el);

        // Event listeners
        const titleBar = el.querySelector('.title-bar');
        titleBar.addEventListener('mousedown', (e) => this.startDragging(e, win));
        titleBar.addEventListener('touchstart', (e) => this.startDragging(e, win), { passive: false });

        const resizeHandle = el.querySelector('.resize-handle');
        resizeHandle.addEventListener('mousedown', (e) => this.startResizing(e, win));
        resizeHandle.addEventListener('touchstart', (e) => this.startResizing(e, win), { passive: false });

        el.addEventListener('mousedown', () => this.focusWindow(win.id));

        el.querySelector('.minimize-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.minimizeWindow(win.id);
        });

        el.querySelector('.maximize-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.maximizeWindow(win.id);
        });

        el.querySelector('.close-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeWindow(win.id);
        });

        // Initialize app if provided
        if (win.app && typeof win.app.init === 'function') {
            win.app.init(el.querySelector('.window-body'));
        }
    }

    createTaskbarItem(win) {
        const item = document.createElement('div');
        item.id = `taskbar-${win.id}`;
        item.className = 'taskbar-item active';
        item.innerHTML = `
      <img src="/icons/${win.icon}.svg" onerror="this.style.display='none'" />
      <span>${win.title}</span>
    `;

        item.addEventListener('click', () => {
            if (win.isMinimized) {
                this.restoreWindow(win.id);
            } else if (this.activeWindow === win.id) {
                this.minimizeWindow(win.id);
            } else {
                this.focusWindow(win.id);
            }
        });

        this.taskbarWindows.appendChild(item);
    }

    closeWindow(id) {
        const winIndex = this.windows.findIndex(w => w.id === id);
        if (winIndex === -1) return;

        const win = this.windows[winIndex];

        // Cleanup app if needed
        if (win.app && typeof win.app.cleanup === 'function') {
            win.app.cleanup();
        }

        const el = document.getElementById(id);
        if (el) el.remove();

        const taskbarItem = document.getElementById(`taskbar-${id}`);
        if (taskbarItem) taskbarItem.remove();

        this.windows.splice(winIndex, 1);

        if (this.activeWindow === id) {
            this.activeWindow = null;
            // Focus next top window
            if (this.windows.length > 0) {
                this.focusWindow(this.windows[this.windows.length - 1].id);
            }
        }
    }

    focusWindow(id) {
        const win = this.windows.find(w => w.id === id);
        if (!win) return;

        if (win.isMinimized) {
            this.restoreWindow(id);
        }

        this.activeWindow = id;
        this.zIndexCounter++;

        const el = document.getElementById(id);
        if (el) {
            el.style.zIndex = this.zIndexCounter;
            el.classList.remove('inactive');
            el.classList.add('active');
        }

        // Update other windows styling
        this.windows.forEach(w => {
            if (w.id !== id) {
                const wEl = document.getElementById(w.id);
                if (wEl) {
                    wEl.classList.remove('active');
                    wEl.classList.add('inactive');
                }
            }
        });

        // Update taskbar
        document.querySelectorAll('.taskbar-item').forEach(item => {
            item.classList.remove('active');
        });
        const taskbarItem = document.getElementById(`taskbar-${id}`);
        if (taskbarItem) taskbarItem.classList.add('active');
    }

    minimizeWindow(id) {
        const win = this.windows.find(w => w.id === id);
        if (!win) return;

        win.isMinimized = true;
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');

        const taskbarItem = document.getElementById(`taskbar-${id}`);
        if (taskbarItem) taskbarItem.classList.remove('active');

        this.activeWindow = null;
    }

    restoreWindow(id) {
        const win = this.windows.find(w => w.id === id);
        if (!win) return;

        win.isMinimized = false;
        const el = document.getElementById(id);
        if (el) el.classList.remove('hidden');

        this.focusWindow(id);
    }

    maximizeWindow(id) {
        const win = this.windows.find(w => w.id === id);
        if (!win) return;

        const el = document.getElementById(id);
        if (!el) return;

        if (win.isMaximized) {
            // Restore
            el.style.width = win.width + 'px';
            el.style.height = win.height + 'px';
            el.style.left = win.x + 'px';
            el.style.top = win.y + 'px';
            win.isMaximized = false;
        } else {
            // Maximize
            el.style.width = '100%';
            el.style.height = 'calc(100% - var(--taskbar-height))';
            el.style.left = '0';
            el.style.top = '0';
            win.isMaximized = true;
        }
    }

    startDragging(e, win) {
        if (win.isMaximized) return;
        if (e.target.closest('.title-bar-controls')) return;

        // Prevent default only for touch to stop scrolling
        if (e.type === 'touchstart') {
            e.preventDefault();
        }

        this.isDragging = true;
        this.dragTarget = win;

        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        this.dragOffsetX = clientX - win.x;
        this.dragOffsetY = clientY - win.y;

        if (e.type === 'touchstart') {
            document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
            document.addEventListener('touchend', this.handleTouchEnd);
        } else {
            document.addEventListener('mousemove', this.handleMouseMove);
            document.addEventListener('mouseup', this.handleMouseUp);
        }
    }

    startResizing(e, win) {
        if (win.isMaximized) return;
        e.stopPropagation();

        if (e.type === 'touchstart') {
            e.preventDefault();
        }

        this.isResizing = true;
        this.resizeTarget = win;

        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        this.resizeStartX = clientX;
        this.resizeStartY = clientY;
        this.initialWidth = win.width;
        this.initialHeight = win.height;

        if (e.type === 'touchstart') {
            document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
            document.addEventListener('touchend', this.handleTouchEnd);
        } else {
            document.addEventListener('mousemove', this.handleMouseMove);
            document.addEventListener('mouseup', this.handleMouseUp);
        }
    }

    handleMouseMove(e) {
        this.handleMove(e.clientX, e.clientY);
    }

    handleTouchMove(e) {
        e.preventDefault(); // Prevent scrolling
        this.handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }

    handleMove(clientX, clientY) {
        if (this.isDragging && this.dragTarget) {
            const win = this.dragTarget;
            const el = document.getElementById(win.id);

            if (el) {
                const newX = clientX - this.dragOffsetX;
                const newY = clientY - this.dragOffsetY;

                // Simple bounds checking (optional, can be improved)
                // const maxX = window.innerWidth - 50;
                // const maxY = window.innerHeight - 50;

                win.x = newX;
                win.y = newY;

                el.style.left = newX + 'px';
                el.style.top = newY + 'px';
            }
        } else if (this.isResizing && this.resizeTarget) {
            const win = this.resizeTarget;
            const el = document.getElementById(win.id);

            if (el) {
                const deltaX = clientX - this.resizeStartX;
                const deltaY = clientY - this.resizeStartY;

                const newWidth = Math.max(200, this.initialWidth + deltaX);
                const newHeight = Math.max(150, this.initialHeight + deltaY);

                win.width = newWidth;
                win.height = newHeight;

                el.style.width = newWidth + 'px';
                el.style.height = newHeight + 'px';
            }
        }
    }

    handleMouseUp() {
        this.stopInteraction();
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    }

    handleTouchEnd() {
        this.stopInteraction();
        document.removeEventListener('touchmove', this.handleTouchMove);
        document.removeEventListener('touchend', this.handleTouchEnd);
    }

    stopInteraction() {
        this.isDragging = false;
        this.dragTarget = null;
        this.isResizing = false;
        this.resizeTarget = null;
    }
}
