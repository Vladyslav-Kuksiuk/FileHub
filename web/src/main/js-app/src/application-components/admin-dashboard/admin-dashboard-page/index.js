import {Component} from "../../../components/component.js";
import {inject} from "../../../registry.js";
import {LogOutAdminAction} from "../../../state-management/user/log-out-admin-action.js";

/**
 * Admin Dashboard page component.
 */
export class AdminDashboardPage extends Component {
    #eventTarget = new EventTarget();
    @inject stateManagementService;
    @inject titleService;

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
        const ctx =  this.rootElement.querySelector('[data-td="file-type-chart"]')

        var data = {
            labels: ['Красный', 'Зеленый', 'Синий'],
            datasets: [{
                label: 'Мой набор данных',
                data: [12, 19, 6],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(54, 162, 235, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        };

        var options = {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        };

        new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: options
        });
        this.rootElement.querySelector('[data-td="logout-link"]').addEventListener('click', (event)=>{
            event.preventDefault();
            this.stateManagementService.dispatch(new LogOutAdminAction());
        });
    }

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
            <canvas ${this.markElement('file-type-chart')}></canvas>
        </div>
    </main>
</div>
    `;
    }
}
