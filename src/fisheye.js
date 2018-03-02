const vscode = require("vscode");
class Fisheye {
  constructor(name, id) {
    this.name = name;
    this.id = id;
  }
  getTreeItem() {
    const item = new vscode.TreeItem(
      this.name,
      vscode.TreeItemCollapsibleState.none
    );
    item.command = {
      command: "fisheye.openInBrowser",
      arguments: [this.id]
    };
    return item;
  }
}

module.exports = Fisheye;
