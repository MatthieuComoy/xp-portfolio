export class PdfViewer {
    constructor() {
        this.pdfUrl = '/cv.pdf'; // Placeholder path
    }

    getWindowOptions() {
        return {
            title: 'My CV.pdf - Adobe Reader',
            icon: 'pdf',
            width: 700,
            height: 800,
            app: this
        };
    }

    init(container) {
        this.container = container;
        this.render();
    }

    render() {
        this.container.innerHTML = `
      <div class="pdf-viewer">
        <div class="pdf-toolbar">
          <button class="pdf-btn">Save a Copy</button>
          <button class="pdf-btn">Print</button>
          <div class="pdf-separator"></div>
          <button class="pdf-btn">Previous</button>
          <button class="pdf-btn">Next</button>
          <div class="pdf-separator"></div>
          <div class="zoom-controls">
            <button class="pdf-btn">-</button>
            <span>100%</span>
            <button class="pdf-btn">+</button>
          </div>
        </div>
        <div class="pdf-content">
          <div class="pdf-placeholder">
            <p>CV PDF Placeholder</p>
            <p>Please place your cv.pdf in the public folder.</p>
            <a href="#" class="download-link">Download CV</a>
          </div>
          <!-- iframe would go here for real PDF -->
          <!-- <iframe src="${this.pdfUrl}" frameborder="0"></iframe> -->
        </div>
      </div>
      <style>
        .pdf-viewer {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #808080;
        }
        .pdf-toolbar {
          background: #ECE9D8;
          padding: 5px;
          display: flex;
          gap: 5px;
          border-bottom: 1px solid #808080;
          align-items: center;
        }
        .pdf-btn {
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          padding: 2px 5px;
        }
        .pdf-btn:hover {
          border: 1px solid #808080;
          background: #F0F0F0;
        }
        .pdf-separator {
          width: 1px;
          height: 16px;
          background: #808080;
          margin: 0 5px;
        }
        .pdf-content {
          flex: 1;
          padding: 20px;
          overflow: auto;
          display: flex;
          justify-content: center;
        }
        .pdf-placeholder {
          background: white;
          width: 595px; /* A4 width at 72dpi approx */
          height: 842px; /* A4 height */
          box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #333;
        }
        iframe {
          width: 100%;
          height: 100%;
        }
      </style>
    `;
    }
}
