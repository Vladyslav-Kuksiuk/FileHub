import {Component} from "../../../components/component.js";
import {inject} from "../../../registry.js";
import {LogOutAdminAction} from "../../../state-management/user/log-out-admin-action.js";
import {SearchRow} from "../../../components/search-row/index.js";
import {ApiServiceError} from "../../../server-connection/api-service-error.js";
import {StatisticCharts} from "./statistics.js";
import {UserStatus} from "./user-status.js";

const SEARCH_ROW_SLOT = "SEARCH_ROW_SLOT"
const USER_STATUS_SLOT = "BUTTON_GROUP_SLOT"
const STATISTICS_SLOT = "STATISTICS_SLOT"

/**
 * Admin Dashboard page component.
 */
export class AdminDashboardPage extends Component {
    #eventTarget = new EventTarget();
    @inject stateManagementService;
    @inject titleService;
    @inject apiService;
    #isUserBanned = false
    #user = null
    #userFiles = null


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
        let statisticsSlot = this.getSlot(STATISTICS_SLOT)
        let statisticCharts = new StatisticCharts(statisticsSlot)

        let statusSlot = this.getSlot(USER_STATUS_SLOT)
        let userStatus = new UserStatus(statusSlot, this.#user != null, this.#user, this.#isUserBanned)
        userStatus.onBanClick((email)=>{
            if(window.confirm(`Do you really want to ban ${email}?`)){
                this.apiService.banUser(email)
                    .then(()=>{
                        userStatus.reload(true, email, true)
                    })
                    .catch((e) => {
                        console.log(e)
                    })
            }
        })
        userStatus.onUnbanClick((email)=>{
            if(window.confirm(`Do you really want to unban ${email}?`)){
                this.apiService.unbanUser(email)
                    .then(()=>{
                        userStatus.reload(true, email, false)
                    })
                    .catch((e) => {
                        console.log(e)
                    })
            }
        })
        userStatus.onDeleteFilesClick((email)=>{
            if(window.confirm(`Do you really want to delete all ${email} files?`)){
                this.apiService.deleteUserFiles(email)
                    .then(()=>{
                        this.apiService.loadUserStatistics(email)
                            .then((stats) => {
                                statisticCharts.reload(stats.items, email)
                                this.#isUserBanned = stats.isBanned
                                this.#user = email
                                userStatus.reload(true, email, stats.isBanned)
                            })
                            .catch((e) => {
                                if(e instanceof ApiServiceError && e.statusCode() === 404){
                                    searchRow.error = "User not found"
                                }else {
                                    searchRow.error = "Something failed, please try again"
                                }
                                console.log(e)
                            })
                    })
                    .catch((e) => {
                        console.log(e)
                    })
            }
        })

        let searchSlot = this.getSlot(SEARCH_ROW_SLOT)
        let searchRow = new SearchRow(searchSlot, "Enter user email...")
        searchRow.onSearchClick((searchInput) => {
            searchRow.error = null
            if(searchInput.trim().length === 0) {
                this.apiService.loadFilesStatistics()
                    .then((files)=> {
                        statisticCharts.reload(files, null)
                        userStatus.reload(false, null, false)
                    })
                    .catch((e)=> {
                        searchRow.error = "Something failed, please try again"
                        console.log(e)
                    })
            } else if(searchInput.trim().length < 3) {
                searchRow.error = "Please enter at least 3 symbols"
            } else {
                this.apiService.loadUserStatistics(searchInput)
                    .then((stats) => {
                        statisticCharts.reload(stats.items, searchInput)
                        this.#isUserBanned = stats.isBanned
                        this.#user = searchInput
                        userStatus.reload(true, searchInput, stats.isBanned)
                    })
                    .catch((e) => {
                        if(e instanceof ApiServiceError && e.statusCode() === 404){
                            searchRow.error = "User not found"
                        }else {
                            searchRow.error = "Something failed, please try again"
                        }
                        console.log(e)
                    })
            }
        })
        if(this.#user === null) {
            this.apiService.loadFilesStatistics()
                .then((files)=> {
                    statisticCharts.reload(files, null)
                    userStatus.reload(false, null, null)
                })
                .catch((e)=> {
                    console.log(e)
                })
        } else {
            statisticCharts.reload(this.#userFiles, this.#user)
            userStatus.reload(true, this.#user, this.#isUserBanned)
        }
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
            <div class="row table-tool-bar">
                <div class="col-xs-8 col-sm-6">
                    ${this.addSlot(SEARCH_ROW_SLOT)}
                </div>
            </div>
            ${this.addSlot(USER_STATUS_SLOT)}
            <br>
               ${this.addSlot(STATISTICS_SLOT)}
            <br>
        </div>
    </main>
</div>
    `;
    }
}
