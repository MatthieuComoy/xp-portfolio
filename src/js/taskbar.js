export class Taskbar {
    constructor(windowManager) {
        this.windowManager = windowManager;
        this.startButton = document.getElementById('start-button');
        this.startMenu = document.getElementById('start-menu');
        this.clock = document.getElementById('clock');

        this.init();
    }

    init() {
        // Start Button
        this.startButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleStartMenu();
        });

        // Close start menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.startMenu.contains(e.target) && !this.startButton.contains(e.target)) {
                this.closeStartMenu();
            }
        });

        // Clock
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);

        // Start Menu Items
        this.startMenu.querySelectorAll('.start-item').forEach(item => {
            item.addEventListener('click', () => {
                const appId = item.dataset.app;
                if (appId) {
                    const event = new CustomEvent('open-app', { detail: { appId } });
                    document.dispatchEvent(event);
                    this.closeStartMenu();
                }
            });
        });
    }

    toggleStartMenu() {
        this.startMenu.classList.toggle('hidden');
        this.startButton.classList.toggle('active');
    }

    closeStartMenu() {
        this.startMenu.classList.add('hidden');
        this.startButton.classList.remove('active');
    }

    updateClock() {
        const now = new Date();
        this.clock.textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
}
