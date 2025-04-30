import axios, { Axios } from "axios";

export default class ApiHandler {
    ax = axios;

    constructor() {
        this.ax.defaults.baseURL = process.env.MIX_APP_URL + '/api';
        this.ax.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }

    // Trashed.. Login is implemented in session
    async loginAttempt(username, passw) {
        return this.ax.post('/user/login', { username: username, pass: passw }).then(e => e.data);
    }

    async listTaskEntries(status, limit, page, search) {
        return this.ax.get('/task-list', { params: { status: status, limit: limit, offset: page, title: search } }).then(e => e.data);
    }

    async updateTaskStatus(id, status) {
        return this.ax.post('/task/status/update', { id: id, status: status }).then(e => e.data);
    }

    async updatePublished(id, status) {
        return this.ax.post('/task/publish/update', { id: id, status: status }).then(e => e.data);
    }

    async createTaskEntries(data) {
        return this.ax.post('/task/create', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(e => {
            if (e.status === 200) {
                return e.data;
            }
        }).catch(dataResp => {
            let e = dataResp.response
            let data = { message: e.data.fail }
            if (e.status === 500) {
                return { ...data, status: 'error' }
            } else {
                return { ...data, status: 'warning' }
            }
        });
    }

    async registerUser(info) {
        return this.ax.post('/user/register', info).then(e => {
            if (e.status === 200) {
                return e.data;
            }
        }).catch(dataResp => {
            let e = dataResp.response
            let data = { message: e.data.fail }
            if (e.status === 500) {
                return { ...data, status: 'error' }
            } else {
                return { ...data, status: 'warning' }
            }
        });
    }
}