import {Component} from "../../components/component.js";
import {inject} from "../../registry.js";
import {Button, BUTTON_TYPE} from "../../components/button/index.js";

const DOWNLOAD_BUTTON_SLOT = "DOWNLOAD_BUTTON_SLOT"

/**
 * Email confirmation sent page component.
 */
export class DownloadSharedFile extends Component {
    @inject fileTypeFactory;
    @inject stateManagementService;
    @inject titleService;
    @inject apiService;
    #file
    #tag
    #error = false

    /**
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.titleService.setTitles(['Shared file']);
        this.init();
    }

    /**
     * @inheritDoc
     */
    afterRender() {
        if (this.#error || !this.#file) {
            return;
        }
        const downloadButtonSlot = this.getSlot(DOWNLOAD_BUTTON_SLOT)
        const downloadButton = new Button(downloadButtonSlot, {
            text: "Download",
            title: "Download",
            type: BUTTON_TYPE.PRIMARY
        })
        downloadButton.onClick(() => {
            console.log(this.#tag)
            this.apiService.downloadSharedFile(this.#tag)
                .then((data) => {
                    const a = document.createElement('a');
                    a.href = window.URL.createObjectURL(data);
                    a.download = this.#file.name + '.' + this.#file.extension;
                    a.click();
                })
                .catch((e) => {
                    console.log(e)
                    this.#error = true
                    this.render()
                })
        })
    }

    init() {
        super.init();
        this.setTag(this.stateManagementService.state.locationMetadata.tag)
        this.stateManagementService.addStateListener('locationMetadata', (state) => {
            this.setTag(state.locationMetadata.tag)
        })
    }

    setTag(tag) {
        this.#tag = tag
        if (tag) {
            this.apiService.viewSharedFile(this.#tag)
                .then(file => {
                    this.#error = false
                    this.#file = file;
                    this.render()
                })
                .catch((e) => {
                    this.#error = true
                    console.log(e)
                    this.render()
                })
        }
    }

    /**
     * @param {number} size
     * @returns {string}
     * @private
     */
    #convertSize(size) {
        let iteration = 0;
        while (size > 1024) {
            iteration++;
            size /= 1024;
        }
        const prefixArray = ['B', 'KB', 'MB', 'GB', 'TB'];
        return size.toFixed(1) + ' ' + prefixArray[iteration];
    };

    /**
     * @inheritDoc
     */
    markup() {
        if (this.#error) {
            return `
    <div class="page-wrapper">
    <header class="page-header">
        <a href="" title="FileHub"><img alt="FileHub" height="37" src="static/images/logo.png" width="200"></a>
    </header>
    <main class="container">
        <h1>Shared file</h1>
        <hr class="horizontal-line">
        <p style="color: #ff2323">File not found</p>
    </main>
</div>
    `
        }

        if (!this.#file) {
            return `
                <div class="page-wrapper">
    <header class="page-header">
        <a href="" title="FileHub"><img alt="FileHub" height="37" src="static/images/logo.png" width="200"></a>
    </header>
    <main class="container">
        <h1>Shared file</h1>
        <hr class="horizontal-line">
    </main>
</div>
            `
        }

        return `
    <div class="page-wrapper">
    <header class="page-header">
        <a href="" title="FileHub"><img alt="FileHub" height="37" src="static/images/logo.png" width="200"></a>
    </header>
    <main class="container">
        <h1>Shared file</h1>
        <hr class="horizontal-line">
        <p><span style="font-weight: bold">File name:</span> ${this.#file?.name}</p>
        <p><span style="font-weight: bold">File owner:</span> ${this.#file?.parentId}</p>
        <p><span style="font-weight: bold">File type:</span> ${this.fileTypeFactory.getType(this.#file?.mimetype).type}</p>
        <p><span style="font-weight: bold">File size:</span> ${this.#file ? this.#convertSize(this.#file.size) : null}</p>
        <br>
        ${this.addSlot(DOWNLOAD_BUTTON_SLOT)}
    </main>
</div>
    `;
    }
}
