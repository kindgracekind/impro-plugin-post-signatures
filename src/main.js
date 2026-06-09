import { Plugin, PluginSettingTab, Setting } from "@impro.social/impro-plugin";

const DEFAULT_SETTINGS = {
  signature: "",
  applyToReplies: false,
  newLine: true,
};

class SignatureSettingTab extends PluginSettingTab {
  constructor() {
    super();
    this.setName("Signature");
  }

  display() {
    new Setting(this.containerEl)
      .setName("Signature")
      .setDesc("Appended to the end of every new post.")
      .addTextArea((textarea) =>
        textarea
          .setPlaceholder("— sent from impro")
          .setValue(this.plugin.settings.signature)
          .onChange(async (value) => {
            this.plugin.settings.signature = value;
            await this.plugin.saveData(this.plugin.settings);
          }),
      );

    new Setting(this.containerEl)
      .setName("New line")
      .setDesc("Put the signature on a new line.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.newLine)
          .onChange(async (value) => {
            this.plugin.settings.newLine = value;
            await this.plugin.saveData(this.plugin.settings);
          }),
      );

    new Setting(this.containerEl)
      .setName("Apply to replies")
      .setDesc("Also append the signature when replying to a post.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.applyToReplies)
          .onChange(async (value) => {
            this.plugin.settings.applyToReplies = value;
            await this.plugin.saveData(this.plugin.settings);
          }),
      );
  }
}

class SignaturePlugin extends Plugin {
  async onload() {
    const saved = await this.loadData();
    this.settings = { ...DEFAULT_SETTINGS, ...(saved ?? {}) };
    this.addSettingTab(new SignatureSettingTab());

    this.app.on("post-composer-open", (composer, context) => {
      if (!this.settings.signature) return;
      if (context?.kind === "reply" && !this.settings.applyToReplies) return;
      const separator = this.settings.newLine ? "\n\n" : " ";
      composer.appendText(`${separator}${this.settings.signature}`);
      composer.setCursor(0);
    });
  }
}

SignaturePlugin.register();
