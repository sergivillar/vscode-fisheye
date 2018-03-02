const vscode = require("vscode");

const Settings = {
  username: "",
  password: "",
  baseApi: "",

  init: async function() {
    const {
      username,
      password,
      baseApi,
      baseReviewPath
    } = vscode.workspace.getConfiguration("fisheye.settings");

    this.username = username;
    this.password = password;
    this.baseApi = baseApi;
    this.baseReviewPath = baseReviewPath;

    await this.configureExtension();
  },

  configureExtension: async function() {
    if (this.username && this.password && this.baseApi) {
      return;
    }

    const result = await vscode.window.showInformationMessage(
      "Welcome to fisheye-extensions. You need to configure the extension",
      "OK"
    );

    if (result !== "OK") {
      return;
    }
    const username = await vscode.window.showInputBox({
      placeHolder: "Enter your fisheye username",
      ignoreFocusOut: true
    });

    const password = await vscode.window.showInputBox({
      placeHolder: "Enter your fisheye password",
      ignoreFocusOut: true,
      password: true
    });

    const baseApi = await vscode.window.showInputBox({
      placeHolder:
        "Enter your base api url of fisheye (e.g. https://fisheye.com/)",
      ignoreFocusOut: true
    });

    const baseReviewPath = await vscode.window.showInputBox({
      placeHolder:
        "Enter your base review url of fisheye (e.g. https://fisheye.com/cru/)",
      ignoreFocusOut: true
    });

    try {
      await vscode.workspace
        .getConfiguration()
        .update(
          "fisheye.settings",
          { username, password, baseApi, baseReviewPath },
          vscode.ConfigurationTarget.Global
        );
    } catch (error) {
      return vscode.window.showErrorMessage(
        "Error savig fisheye-extenions settings."
      );
    }

    this.username = username;
    this.password = password;
    this.baseApi = baseApi;
    this.baseReviewPath = baseReviewPath;

    vscode.window.showInformationMessage("Thanks. Extension ready to rock");
  },

  getSettings: function() {
    return {
      username: this.username,
      password: this.password,
      baseApi: this.baseApi,
      baseReviewPath: this.baseReviewPath
    };
  }
};

module.exports = Settings;
