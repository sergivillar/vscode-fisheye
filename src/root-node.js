const vscode = require("vscode");
const axios = require("axios");
const Review = require("./fisheye.js");
const settings = require("./settings");

class RootNode {
  constructor(label, context, path) {
    this.label = label;
    this.contextValue = context;
    this.path = path;
  }

  getTreeItem(element) {
    let item = new vscode.TreeItem(
      this.label,
      vscode.TreeItemCollapsibleState.Collapsed
    );
    item.contextValue = this.contextValue;
    return item;
  }
  async getChildren(element) {
    const nodes = [];

    const pendingRequest = await fetchReviews(element.path);
    pendingRequest.data.reviewData.forEach(item => {
      const review = new Review(item.name, item.permaIdHistory);
      nodes.push(review);
    });

    return nodes;
  }
}

const fetchReviews = path => {
  const { username, password, baseApi } = settings.getSettings();
  return axios.get(baseApi + path, {
    auth: { username, password }
  });
};

module.exports = RootNode;
