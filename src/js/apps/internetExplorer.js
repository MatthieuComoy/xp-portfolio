export class InternetExplorer {
  constructor() {
    this.homeUrl = '/ie-home.html';
    this.currentUrl = this.homeUrl;
  }

  getWindowOptions() {
    return {
      title: 'Internet Explorer',
      icon: 'ie',
      width: 800,
      height: 600,
      app: this
    };
  }

  init(container) {
    this.container = container;
    this.render();
    this.attachListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="ie-browser">
        <div class="ie-toolbar">
          <div class="ie-menu-bar">
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
            <span>Favorites</span>
            <span>Tools</span>
            <span>Help</span>
          </div>
          <div class="ie-nav-bar">
            <button class="ie-btn back-btn" disabled>Back</button>
            <button class="ie-btn fwd-btn" disabled>Forward</button>
            <button class="ie-btn stop-btn">Stop</button>
            <button class="ie-btn refresh-btn">Refresh</button>
            <button class="ie-btn home-btn">Home</button>
            <div class="ie-address-bar">
              <span>Address</span>
              <input type="text" value="${this.currentUrl}" />
              <button class="ie-go-btn">Go</button>
            </div>
          </div>
        </div>
        <div class="ie-content">
          <iframe src="${this.currentUrl}" frameborder="0"></iframe>
        </div>
      </div>
      <style>
        .ie-browser {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #ECE9D8;
        }
        .ie-toolbar {
          border-bottom: 1px solid #D4D0C8;
        }
        .ie-menu-bar {
          padding: 2px 5px;
          display: flex;
          gap: 10px;
          border-bottom: 1px solid #D4D0C8;
        }
        .ie-nav-bar {
          padding: 5px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .ie-btn {
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          padding: 2px 5px;
          display: flex;
          align-items: center;
        }
        .ie-btn:hover {
          border: 1px solid #808080;
          background: #F0F0F0;
        }
        .ie-address-bar {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 5px;
          margin-left: 10px;
        }
        .ie-address-bar input {
          flex: 1;
          border: 1px solid #7F9DB9;
          padding: 2px;
        }
        .ie-content {
          flex: 1;
          background: white;
          border-top: 2px solid #808080;
        }
        iframe {
          width: 100%;
          height: 100%;
        }
      </style>
    `;
  }

  attachListeners() {
    const iframe = this.container.querySelector('iframe');
    const input = this.container.querySelector('input');

    this.container.querySelector('.home-btn').addEventListener('click', () => {
      this.currentUrl = this.homeUrl;
      iframe.src = this.currentUrl;
      input.value = this.currentUrl;
    });

    this.container.querySelector('.refresh-btn').addEventListener('click', () => {
      iframe.src = iframe.src;
    });

    this.container.querySelector('.ie-go-btn').addEventListener('click', () => {
      this.currentUrl = input.value;
      iframe.src = this.currentUrl;
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.currentUrl = input.value;
        iframe.src = this.currentUrl;
      }
    });
  }
}
