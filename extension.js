const vscode = require("vscode");
const axios = require("axios");
const Settings = require("./src/settings");
const RootNode = require("./src/root-node");
const REVIEW_TO_FETCH = require("./constants");

const activate = async () => {
  const settings = Settings;
  await Settings.init();

  const { baseReviewPath } = settings.getSettings();
  const fisheyeProvider = new FisheyeProvider();

  vscode.window.registerTreeDataProvider("fisheye", fisheyeProvider);
  vscode.commands.registerCommand("fisheye.refresh", () =>
    fisheyeProvider.refresh()
  );
  vscode.commands.registerCommand("fisheye.openInBrowser", id =>
    vscode.commands.executeCommand(
      "vscode.open",
      vscode.Uri.parse(`${baseReviewPath}${id}`)
    )
  );
};
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;

class FisheyeProvider {
  constructor() {
    this.nodes = [];
    this._onDidChangeTreeData = new vscode.EventEmitter();
  }

  get onDidChangeTreeData() {
    return this._onDidChangeTreeData.event;
  }
  refresh() {
    this.nodes.forEach(item => this._onDidChangeTreeData.fire(item));
  }
  getTreeItem(element) {
    return element.getTreeItem();
  }
  async getChildren(element) {
    if (!element) {
      return this.getRootNodes();
    }
    return element.getChildren(element);
  }

  async getRootNodes() {
    const rootNodes = REVIEW_TO_FETCH.map(
      item => new RootNode(item.label, item.context, item.path)
    );
    this.nodes = rootNodes;
    return rootNodes;
  }
}
