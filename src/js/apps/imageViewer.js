export class ImageViewer {
    constructor(images = [], initialIndex = 0) {
        this.images = images;
        this.currentIndex = initialIndex;
    }

    getWindowOptions() {
        return {
            title: 'Image Viewer',
            icon: 'image-file',
            width: 700,
            height: 550,
            content: '',
            app: this
        };
    }

    init(container) {
        this.container = container;
        this.render();
    }

    render() {
        if (this.images.length === 0) {
            this.container.innerHTML = '<div style="padding: 20px;">No images to display.</div>';
            return;
        }

        const currentImage = this.images[this.currentIndex];

        this.container.innerHTML = `
            <div class="image-viewer" style="height: 100%; display: flex; flex-direction: column; background: #F0F0F0;">
                <div class="toolbar" style="padding: 5px; background: #ECE9D8; border-bottom: 1px solid #A0A0A0; display: flex; gap: 5px;">
                    <button id="prev-btn" ${this.currentIndex === 0 ? 'disabled' : ''}>Previous</button>
                    <button id="next-btn" ${this.currentIndex === this.images.length - 1 ? 'disabled' : ''}>Next</button>
                    <span style="margin-left: auto; align-self: center;">${this.currentIndex + 1} / ${this.images.length}</span>
                </div>
                <div class="image-display" style="flex: 1; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 10px; background: white;">
                    <img src="${currentImage.src}" alt="${currentImage.title}" style="max-width: 100%; max-height: 100%; object-fit: contain; box-shadow: 0 0 5px rgba(0,0,0,0.2);" />
                </div>
                <div class="status-bar" style="padding: 2px 5px; background: #ECE9D8; border-top: 1px solid #A0A0A0; font-size: 11px;">
                    ${currentImage.title}
                </div>
            </div>
        `;

        this.container.querySelector('#prev-btn').addEventListener('click', () => this.prevImage());
        this.container.querySelector('#next-btn').addEventListener('click', () => this.nextImage());
    }

    prevImage() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.render();
        }
    }

    nextImage() {
        if (this.currentIndex < this.images.length - 1) {
            this.currentIndex++;
            this.render();
        }
    }

    cleanup() { }
}
