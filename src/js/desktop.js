export class Desktop {
    constructor(windowManager) {
        this.windowManager = windowManager;
        this.container = document.getElementById('desktop');
        this.icons = [
            { id: 'my-computer', title: 'My Computer', icon: 'computer', app: 'my-computer' },
            { id: 'recycle-bin', title: 'Recycle Bin', icon: 'recycle-bin', app: 'recycle-bin' },
            { id: 'ie', title: 'Internet Explorer', icon: 'ie', app: 'internet-explorer' },
            { id: 'cv', title: 'My CV.pdf', icon: 'pdf', app: 'cv' },
            { id: 'graphic-projects', title: 'Graphic Projects', icon: 'folder', app: 'file-explorer', args: { path: ['graphic-projects'] } },
            { id: 'solitaire', title: 'Solitaire', icon: 'solitaire', app: 'solitaire' },
            { id: 'minesweeper', title: 'Minesweeper', icon: 'mine', app: 'minesweeper' },
            { id: 'paint', title: 'Paint', icon: 'paint', app: 'paint' },
            { id: 'calculator', title: 'Calculator', icon: 'calc', app: 'calculator' },
        ];

        this.renderIcons();
    }

    renderIcons() {
        console.log('Rendering icons...', this.icons);
        if (!this.container) {
            console.error('Desktop container not found!');
            return;
        }
        this.container.innerHTML = '';

        this.icons.forEach((icon, index) => {
            const el = document.createElement('div');
            el.className = 'desktop-icon';
            el.dataset.app = icon.app;
            el.innerHTML = `
        <img src="/icons/${icon.icon}.svg" onerror="this.src='/vite.svg'" />
        <span>${icon.title}</span>
      `;

            // Simple grid positioning
            const col = Math.floor(index / 8);
            const row = index % 8;

            // Use CSS grid or flex instead of absolute for responsiveness, 
            // but XP had grid. Let's stick to flex in desktop.css for now.

            el.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectIcon(el);
            });

            el.addEventListener('dblclick', () => {
                this.openApp(icon.app, icon.args);
            });

            this.container.appendChild(el);
        });

        this.container.addEventListener('click', () => {
            this.deselectAll();
        });
    }

    selectIcon(el) {
        this.deselectAll();
        el.classList.add('selected');
    }

    deselectAll() {
        document.querySelectorAll('.desktop-icon').forEach(el => {
            el.classList.remove('selected');
        });
    }

    openApp(appId, args) {
        const event = new CustomEvent('open-app', { detail: { appId, args } });
        document.dispatchEvent(event);
    }
}
