import {Component} from "../../../components/component.js";
import {inject} from "../../../registry.js";
import {LogOutAdminAction} from "../../../state-management/user/log-out-admin-action.js";
import {FileTypeFactory} from "../../../components/file-list/file-type-factory.js";

/**
 * Admin Dashboard page component.
 */
export class AdminDashboardPage extends Component {
    #eventTarget = new EventTarget();
    @inject stateManagementService;
    @inject titleService;
    @inject apiService;

    /**
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.titleService.setTitles(['Admin Dashboard']);
        this.init();
    }

    /**
     * @inheritDoc
     */
    afterRender() {
        const filesNumberChart =  this.rootElement.querySelector('[data-td="files-number-chart"]')
        const filesSizeByMimetypeChart =  this.rootElement.querySelector('[data-td="files-size-by-mimetype-chart"]')
        const archivedFilesSizeByMimetypeChart =  this.rootElement.querySelector('[data-td="archived-files-size-by-mimetype-chart"]')
        const archivedFilesSizeVsNonArchivedChart =  this.rootElement.querySelector('[data-td="archived-vs-non-archived-horizontal-chart"]')

        this.apiService.loadFilesStatistics()
            .then((items)=> {
                let filesNumberChartData = {
                    labels: items.map((item) => (new FileTypeFactory()).getType(item.mimetype).type),
                    datasets: [{
                        label: 'Files number',
                        data: items.map((item) => item.filesNumber)
                    }]
                }
                let filesSizeByMimetypeData = {
                    labels: items.map((item) => (new FileTypeFactory()).getType(item.mimetype).type),
                    datasets: [{
                        label: 'Files size',
                        data: items.map((item) => item.size)
                    }]
                }
                let archivedFilesSizeByMimetypeData = {
                    labels: items.map((item) => (new FileTypeFactory()).getType(item.mimetype).type),
                    datasets: [{
                        label: 'Archived files size',
                        data: items.map((item) => item.archivedSize)
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
                               items.reduce((accumulator, cur) => {
                                   return accumulator + cur.size
                               }, 0),
                               items.reduce((accumulator, cur) => {
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
            })
            .catch((e)=> {
                console.log(e)
            })
        this.rootElement.querySelector('[data-td="logout-link"]').addEventListener('click', (event)=>{
            event.preventDefault();
            this.stateManagementService.dispatch(new LogOutAdminAction());
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
            size/=1024;
        }
        const prefixArray = ['B', 'KB', 'MB', 'GB', 'TB'];
        return size.toFixed(1) + ' ' + prefixArray[iteration];
    };

    /**
     * @inheritDoc
     */
    onDestroy() {
    }

    /**
     * @inheritDoc
     */
    markup() {
        return `
    <div class="page-wrapper table-page-wrapper">
    <header class="page-header">
        <a href=""><img alt="FileHub" height="37" src="static/images/logo.png"
                                          title="FileHub" width="200"></a>
            <ul class="authorized-user-panel">
            <li>
                <slot>
                    <span aria-hidden="true" class="glyphicon glyphicon-user"></span>
                    <span>admin</span>
                </slot>
            </li>
            <li>
                <a ${this.markElement('logout-link')} class="logout-button" href="/" title="Log Out">
                    Log Out
                    <span aria-hidden="true" class="glyphicon glyphicon-log-out"></span>
                </a>
            </li>
        </ul>
    </header>
    <main class="container">
        <h1>Admin Dashboard</h1>
        <hr class="horizontal-line">
        <div>
            <span class="charts-container">
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
            </span>
            <br>
            <div class="horizontal-chart-container">
                <p>Archived files size vs actual files size</p>
                <canvas ${this.markElement('archived-vs-non-archived-horizontal-chart')}></canvas>
            </div>
        </div>
    </main>
</div>
    `;
    }
}
