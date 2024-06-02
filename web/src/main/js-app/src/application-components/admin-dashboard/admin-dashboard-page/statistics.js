import {Component} from "../../../components/component.js";
import {FileTypeFactory} from "../../../components/file-list/file-type-factory.js";

/**
 * Statistics component.
 */
export class StatisticCharts extends Component {
    #files = null
    #user = null

    /**
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.init();
    }

    reload(files, user) {
        this.#files = files;
        this.#user = user
        this.render()
    }

    /**
     * @inheritDoc
     */
    afterRender() {
        let files = this.#files
        if (files === null) return
        const filesNumberChart = this.rootElement.querySelector('[data-td="files-number-chart"]')
        const filesSizeByMimetypeChart = this.rootElement.querySelector('[data-td="files-size-by-mimetype-chart"]')
        const archivedFilesSizeByMimetypeChart = this.rootElement.querySelector('[data-td="archived-files-size-by-mimetype-chart"]')
        const archivedFilesSizeVsNonArchivedChart = this.rootElement.querySelector('[data-td="archived-vs-non-archived-horizontal-chart"]')
        if (filesNumberChart == null || archivedFilesSizeByMimetypeChart == null || archivedFilesSizeVsNonArchivedChart == null) return;

        let filesNumberChartData = {
            labels: files.map((item) => (new FileTypeFactory()).getType(item.mimetype).type),
            datasets: [{
                label: 'Files number',
                data: files.map((item) => item.filesNumber)
            }]
        }
        let filesSizeByMimetypeData = {
            labels: files.map((item) => (new FileTypeFactory()).getType(item.mimetype).type),
            datasets: [{
                label: 'Files size',
                data: files.map((item) => item.size)
            }]
        }
        let archivedFilesSizeByMimetypeData = {
            labels: files.map((item) => (new FileTypeFactory()).getType(item.mimetype).type),
            datasets: [{
                label: 'Archived files size',
                data: files.map((item) => item.archivedSize)
            }]
        }
        let sizeDoughnutOptions = {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            return ctx.label + ': ' + this.#convertSize(ctx.parsed)
                        }
                    }
                }
            }
        };

        new Chart(filesNumberChart, {
            type: 'doughnut',
            data: filesNumberChartData,
            options: {
                responsive: false,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
        new Chart(filesSizeByMimetypeChart, {
            type: 'doughnut',
            data: filesSizeByMimetypeData,
            options: sizeDoughnutOptions
        });
        new Chart(archivedFilesSizeByMimetypeChart, {
            type: 'doughnut',
            data: archivedFilesSizeByMimetypeData,
            options: sizeDoughnutOptions
        });
        new Chart(archivedFilesSizeVsNonArchivedChart, {
            type: 'bar',
            data: {
                labels: ['Actual size', 'Archived size'],
                datasets: [{
                    label: 'Size',
                    data: [
                        files.reduce((accumulator, cur) => {
                            return accumulator + cur.size
                        }, 0),
                        files.reduce((accumulator, cur) => {
                            return accumulator + cur.archivedSize
                        }, 0),
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (ctx) => {
                                return ctx.label + ': ' + this.#convertSize(ctx.parsed.x)
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
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
        return `
    <div>
            <h3>${this.#user === null ? "All users statistics" : this.#user + " statistics"}</h3>
            <hr class="horizontal-line">
            <div class="charts-container">
                <div>
                    <p>Files number by mimetype</p>
                    <canvas ${this.markElement('files-number-chart')}></canvas>
                </div>
                <div>
                    <p>Files size by mimetype</p>
                    <canvas ${this.markElement('files-size-by-mimetype-chart')}></canvas>
                </div>
                <div>
                    <p>Archived files size by mimetype</p>
                    <canvas ${this.markElement('archived-files-size-by-mimetype-chart')}></canvas>
                </div>
            </div>
            <div class="horizontal-chart-container">
                <p>Archived files size vs actual files size</p>
                <canvas ${this.markElement('archived-vs-non-archived-horizontal-chart')}></canvas>
            </div>
    </div>
    `;
    }
}
