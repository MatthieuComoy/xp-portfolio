export class Notepad {
    constructor(content = '') {
        this.content = content;
    }

    getWindowOptions() {
        return {
            title: 'Notepad',
            icon: 'notepad',
            width: 500,
            height: 400,
            content: '', // Will be filled in init
            app: this
        };
    }

    init(container) {
        this.container = container;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="notepad-container" style="height: 100%; display: flex; flex-direction: column;">
                <div class="notepad-menu" style="background: #ECE9D8; padding: 2px 5px; border-bottom: 1px solid #A0A0A0; font-size: 11px;">
                    <span style="margin-right: 10px;">File</span>
                    <span style="margin-right: 10px;">Edit</span>
                    <span style="margin-right: 10px;">Format</span>
                    <span style="margin-right: 10px;">View</span>
                    <span style="margin-right: 10px;">Help</span>
                </div>
                <textarea class="notepad-textarea" style="flex: 1; resize: none; border: none; outline: none; font-family: 'Lucida Console', monospace; font-size: 13px; padding: 5px; overflow: auto;">${this.content}</textarea>
            </div>
        `;
    }

    cleanup() {
        // Cleanup if needed
    }
}
