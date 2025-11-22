export class MyComputer {
    constructor() {
        this.currentPath = 'My Computer';
    }

    getWindowOptions() {
        return {
            title: 'My Computer',
            icon: 'computer',
            width: 600,
            height: 400,
            app: this
        };
    }

    init(container) {
        this.container = container;
        this.render();
    }

    render() {
        this.container.innerHTML = `
      <div class="explorer">
        <div class="explorer-toolbar">
          <div class="menu-bar">
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
            <span>Favorites</span>
            <span>Tools</span>
            <span>Help</span>
          </div>
          <div class="nav-buttons">
            <button>Back</button>
            <button>Forward</button>
            <button>Up</button>
            <div class="separator"></div>
            <button>Search</button>
            <button>Folders</button>
          </div>
          <div class="address-bar">
            <span>Address</span>
            <input type="text" value="${this.currentPath}" readonly />
            <button>Go</button>
          </div>
        </div>
        <div class="explorer-body">
          <div class="explorer-sidebar">
            <div class="sidebar-panel">
              <div class="panel-header">System Tasks</div>
              <div class="panel-content">
                <div class="task-item">View system information</div>
                <div class="task-item">Add or remove programs</div>
                <div class="task-item">Change a setting</div>
              </div>
            </div>
            <div class="sidebar-panel">
              <div class="panel-header">Other Places</div>
              <div class="panel-content">
                <div class="task-item">My Network Places</div>
                <div class="task-item">My Documents</div>
                <div class="task-item">Control Panel</div>
              </div>
            </div>
          </div>
          <div class="explorer-content">
            <div class="group-header">Hard Disk Drives</div>
            <div class="drive-grid">
              <div class="drive-item">
                <img src="/icons/drive.png" onerror="this.src='/vite.svg'" />
                <div class="drive-info">
                  <div class="drive-name">Local Disk (C:)</div>
                </div>
              </div>
            </div>
            
            <div class="group-header">Devices with Removable Storage</div>
            <div class="drive-grid">
              <div class="drive-item">
                <img src="/icons/cd.png" onerror="this.src='/vite.svg'" />
                <div class="drive-info">
                  <div class="drive-name">CD Drive (D:)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        .explorer {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #ECE9D8;
        }
        .explorer-toolbar {
          border-bottom: 1px solid #D4D0C8;
        }
        .menu-bar {
          padding: 2px 5px;
          display: flex;
          gap: 10px;
          border-bottom: 1px solid #D4D0C8;
        }
        .nav-buttons {
          padding: 5px;
          display: flex;
          gap: 5px;
          align-items: center;
          border-bottom: 1px solid #D4D0C8;
        }
        .address-bar {
          padding: 5px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .address-bar input {
          flex: 1;
          border: 1px solid #7F9DB9;
          padding: 2px;
        }
        .explorer-body {
          flex: 1;
          display: flex;
          border-top: 1px solid white;
        }
        .explorer-sidebar {
          width: 200px;
          background: linear-gradient(to bottom, #748AFF 0%, #4057D2 100%);
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .sidebar-panel {
          background: white;
          border-radius: 3px;
          overflow: hidden;
        }
        .panel-header {
          background: linear-gradient(to right, #FFF 0%, #C6D3F7 100%);
          padding: 5px;
          font-weight: bold;
          color: #215DC6;
          cursor: pointer;
        }
        .panel-content {
          padding: 5px 10px;
        }
        .task-item {
          color: #215DC6;
          cursor: pointer;
          padding: 2px 0;
          font-size: 11px;
        }
        .task-item:hover {
          text-decoration: underline;
        }
        .explorer-content {
          flex: 1;
          background: white;
          padding: 10px;
          overflow: auto;
        }
        .group-header {
          font-weight: bold;
          margin-bottom: 5px;
          padding-bottom: 2px;
          border-bottom: 1px solid #ECE9D8;
        }
        .drive-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 20px;
        }
        .drive-item {
          display: flex;
          align-items: center;
          gap: 5px;
          width: 200px;
          cursor: default;
        }
        .drive-item img {
          width: 32px;
          height: 32px;
        }
        .drive-name {
          font-weight: bold;
        }
      </style>
    `;
    }
}
