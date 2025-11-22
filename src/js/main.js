import '../styles/main.css';
import { WindowManager } from './windowManager.js';
import { Desktop } from './desktop.js';
import { Taskbar } from './taskbar.js';

// Import Apps
import { Calculator } from './apps/calculator.js';
import { Paint } from './apps/paint.js';
import { Minesweeper } from './apps/minesweeper.js';
import { InternetExplorer } from './apps/internetExplorer.js';
import { PdfViewer } from './apps/pdfViewer.js';
import { MyComputer } from './apps/myComputer.js';

import { Notepad } from './apps/notepad.js';
import { ImageViewer } from './apps/imageViewer.js';
import { FileExplorer } from './apps/fileExplorer.js';
import { Solitaire } from './apps/solitaire.js';

class App {
    constructor() {
        this.windowManager = new WindowManager();
        this.desktop = new Desktop(this.windowManager);
        this.taskbar = new Taskbar(this.windowManager);

        this.apps = {
            'calculator': Calculator,
            'paint': Paint,
            'minesweeper': Minesweeper,
            'internet-explorer': InternetExplorer,
            'cv': PdfViewer,
            'my-computer': MyComputer,
            'notepad': Notepad,
            'image-viewer': ImageViewer,
            'file-explorer': FileExplorer,
            'solitaire': Solitaire
        };

        this.init();
    }

    init() {
        document.addEventListener('open-app', (e) => {
            this.launchApp(e.detail.appId, e.detail.args);
        });

        // Launch Notepad on startup
        setTimeout(() => {
            this.launchApp('notepad', {
                content: `Welcome to my Windows XP Portfolio!

Here you can explore my projects and skills in a nostalgic environment.

- Double click on "My Computer" to see my tech stack.
- Check out "Graphic Projects" folder on the desktop for my art.
- Use the Start Menu to access other apps.

Enjoy your stay!
`
            });
        }, 500);
    }

    launchApp(appId, args) {
        const AppClass = this.apps[appId];
        if (AppClass) {
            // Handle special construction for apps that need args
            let appInstance;
            if (appId === 'notepad' && args && args.content) {
                appInstance = new AppClass(args.content);
            } else if (appId === 'image-viewer' && args) {
                appInstance = new AppClass(args.images, args.index);
            } else if (appId === 'file-explorer' && args && args.path) {
                appInstance = new AppClass(args.path);
            } else {
                appInstance = new AppClass();
            }

            this.windowManager.createWindow(appInstance.getWindowOptions());
        } else {
            console.warn(`App ${appId} not found`);
        }
    }
}

// Initialize
console.log('Starting App initialization...');
try {
    new App();
    console.log('App initialized successfully');
} catch (e) {
    console.error('Error initializing App:', e);
}
