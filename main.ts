import {
	App,
	Command,
	Editor,
	MarkdownFileInfo,
	MarkdownView,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import { v4 as uuidv4 } from "uuid";

interface UUIDGeneratorPluginSettings {
	enableRepeat: boolean;
}

const DEFAULT_SETTINGS: UUIDGeneratorPluginSettings = {
	enableRepeat: false,
};

export default class UUIDGenerator extends Plugin {
	settings: UUIDGeneratorPluginSettings;
	repeatCommand: Command;
	lastUUID: string;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "generate-uuid-v4",
			name: "Generate UUID at Cursor",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.lastUUID = uuidv4();
				editor.replaceSelection(this.lastUUID);
			},
		});

		this.addCommand({
			id: "repeat-uuid-v4",
			name: "Repeat UUID at Cursor",
			editorCheckCallback: (
				checking: boolean,
				editor: Editor,
				ctx: MarkdownView | MarkdownFileInfo
			): boolean | void => {
				if (this.lastUUID == undefined) {
					return false;
				}

				if (checking) {
					return this.settings.enableRepeat;
				}

				editor.replaceSelection(this.lastUUID);
			},
		});

		this.addSettingTab(new UUIDGeneratorSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class UUIDGeneratorSettingTab extends PluginSettingTab {
	plugin: UUIDGenerator;

	constructor(app: App, plugin: UUIDGenerator) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "UUID Generator Settings" });

		new Setting(containerEl)
			.setName("Enable Repeat UUID at Cursor")
			.setDesc(
				"Enables/disables the 'Repeat UUID at Cursor' command to prevent confusion"
			)
			.addToggle((Boolean) =>
				Boolean.setValue(this.plugin.settings.enableRepeat).onChange(
					async (value) => {
						this.plugin.settings.enableRepeat = value;
						await this.plugin.saveSettings();
					}
				)
			);
	}
}
