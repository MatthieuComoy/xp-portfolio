import { fileSystem } from '../filesystem.js';
import { ImageViewer } from './imageViewer.js';

export class FileExplorer {
    constructor(path = []) {
        this.path = path; // Array of folder keys, e.g. ['graphic-projects', 'photography']
        this.currentFolder = this.resolvePath(path);
    }

    resolvePath(path) {
        let current = fileSystem.root;
        for (const key of path) {
            if (current.children && current.children[key]) {
                current = current.children[key];
            } else {
                return null;
            }
        }
        return current;
    }

    getWindowOptions() {
        return {
            title: this.currentFolder ? this.currentFolder.title : 'File Explorer',
            icon: 'folder',
            width: 600,
            height: 400,
            content: '',
            app: this
        };
    }

    init(container) {
        this.container = container;
        this.render();
    }

    render() {
        if (!this.currentFolder) {
            this.container.innerHTML = '<div style="padding: 20px;">Folder not found.</div>';
            return;
        }

        const items = Object.entries(this.currentFolder.children || {});

        this.container.innerHTML = `
            <div class="file-explorer" style="height: 100%; display: flex; flex-direction: column; background: white;">
                <div class="address-bar" style="padding: 5px; background: #ECE9D8; border-bottom: 1px solid #A0A0A0; display: flex; align-items: center; gap: 5px;">
                    <span>Address:</span>
                    <input type="text" value="${this.path.join(' / ')}" readonly style="flex: 1; border: 1px solid #7F9DB9; padding: 2px;" />
                    ${this.path.length > 0 ? '<button id="up-btn">Up</button>' : ''}
                </div>
                <div class="file-view" style="flex: 1; padding: 10px; display: flex; flex-wrap: wrap; align-content: flex-start; gap: 10px; overflow: auto;">
                    ${items.map(([key, item]) => `
                        <div class="file-item" data-key="${key}" data-type="${item.type}" style="width: 80px; display: flex; flex-direction: column; align-items: center; text-align: center; cursor: default; padding: 5px; border: 1px solid transparent;">
                            <img src="/icons/${item.type === 'folder' ? 'folder' : 'image-file'}.svg" style="width: 32px; height: 32px; margin-bottom: 5px;" />
                            <span style="font-size: 11px; word-break: break-word;">${item.title}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Add styles for hover/selection dynamically or inline
        const style = document.createElement('style');
        style.textContent = `
            .file-item:hover { background-color: #E8F0FF; border-color: #C2D3FC; }
        `;
        this.container.appendChild(style);

        // Event listeners
        this.container.querySelectorAll('.file-item').forEach(el => {
            el.addEventListener('dblclick', () => {
                const key = el.dataset.key;
                const type = el.dataset.type;
                if (type === 'folder') {
                    this.navigateTo([...this.path, key]);
                } else if (type === 'image') {
                    this.openImage(key);
                }
            });
        });

        const upBtn = this.container.querySelector('#up-btn');
        if (upBtn) {
            upBtn.addEventListener('click', () => {
                this.navigateTo(this.path.slice(0, -1));
            });
        }
    }

    navigateTo(newPath) {
        this.path = newPath;
        this.currentFolder = this.resolvePath(newPath);

        // Update window title
        const windowId = this.container.closest('.window').id;
        const titleEl = document.querySelector(`#${windowId} .title-bar-text`);
        if (titleEl && this.currentFolder) {
            // Keep icon, update text
            const icon = titleEl.querySelector('img');
            titleEl.innerHTML = '';
            if (icon) titleEl.appendChild(icon);
            titleEl.appendChild(document.createTextNode(this.currentFolder.title));
        }

        this.render();
    }

    openImage(key) {
        // Collect all images in current folder
        const images = Object.entries(this.currentFolder.children)
            .filter(([_, item]) => item.type === 'image')
            .map(([_, item]) => item);

        const index = images.findIndex(img => img === this.currentFolder.children[key]);

        // Open Image Viewer
        const event = new CustomEvent('open-app', {
            detail: {
                appId: 'image-viewer',
                args: { images, index }
            }
        });
        document.dispatchEvent(event);
    }

    cleanup() { }
}
