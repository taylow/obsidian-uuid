import { Editor, MarkdownView, Plugin } from 'obsidian';
import { v4 as uuidv4 } from 'uuid';

interface UUIDGeneratorPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: UUIDGeneratorPluginSettings = {
	mySetting: 'default'
}

export default class UUIDGenerator extends Plugin {
	settings: UUIDGeneratorPluginSettings;

	lastUUID: string;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'generate-uuid-v4',
			name: 'Generate UUID at Cursor',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.lastUUID = uuidv4();
				editor.replaceSelection(this.lastUUID);
			}
		});

		this.addCommand({
		id: 'repeat-uuid-v4',
			name: 'Repeat UUID at Cursor',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				editor.replaceSelection(this.lastUUID);
			}
		});
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
