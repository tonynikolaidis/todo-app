import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function updateTime() {
    let currentDate = new Date()
    let day = currentDate.getDay()
    let date = currentDate.getDate()
    let month = currentDate.getMonth()

    let seconds = currentDate.getSeconds()
    let minutes = currentDate.getMinutes()
    let hour = currentDate.getHours()

    let days = [
        {id: 0, day: 'Sunday'},
        {id: 1, day: 'Monday'},
        {id: 2, day: 'Tuesday'},
        {id: 3, day: 'Wednesday'},
        {id: 4, day: 'Thursday'},
        {id: 5, day: 'Friday'},
        {id: 6, day: 'Saturday'}
    ]

    let months = [
        {id: 0, month: 'January'},
        {id: 1, month: 'February'},
        {id: 2, month: 'March'},
        {id: 3, month: 'April'},
        {id: 4, month: 'May'},
        {id: 5, month: 'June'},
        {id: 6, month: 'July'},
        {id: 7, month: 'August'},
        {id: 8, month: 'September'},
        {id: 9, month: 'October'},
        {id: 10, month: 'November'},
        {id: 11, month: 'December'}
    ]

    day = days.find(d => d.id === day).day.substring(0, 3)
    month = months.find(m => m.id === month).month.substring(0, 3)

    if (minutes < 10) {
        minutes = '0' + minutes
    }

    if (seconds < 10) {
        seconds = '0' + seconds
    }

    let pmAm = ''

    if (hour > 11) {
        pmAm = 'PM'
    } else {
        pmAm = 'AM'
    }

    if (hour === 0) {
        hour = 12
    }
    else if (hour > 12) {
        hour -= 12
    }

    // let time = hour + ':' + minutes + ':' + seconds + ' ' + pmAm
    let time = hour + ':' + minutes + ' ' + pmAm

    return day + ', ' + date + ' ' + month + ' – ' + time
}

setInterval(() => {
    store.dispatch('updateDate').then(r => r)
}, 1000)

export const store = new Vuex.Store({
    state: {
        tasks: [],
        date: ''
    },
    mutations: {
        updateDate(state) {
            state.date = updateTime()
        },
        addTask(state, task) {
            if (state.tasks === null) {
                state.tasks = []
            }

            state.tasks.push(task)
            localStorage.setItem('tasks', JSON.stringify(state.tasks))
        },
        deleteTask(state, id) {
            state.tasks = state.tasks.filter(t => t.id !== id);
            localStorage.setItem('tasks', JSON.stringify(state.tasks))
        },
        doneTask(state, id) {
            let task = state.tasks.find(t => t.id === id);
            task.done = !task.done;
            localStorage.setItem('tasks', JSON.stringify(state.tasks))
        },
        initialiseStore(state) {
            state.tasks = JSON.parse(localStorage.getItem('tasks'))
        }
    },
    actions: {
        updateDate({commit}) {
            commit('updateDate')
        },
        addTask({commit}, task) {
            commit('addTask', task)
        },
        deleteTask({commit}, task) {
            commit('deleteTask', task)
        },
        doneTask({commit}, task) {
            commit('doneTask', task)
        }
    },
    modules: {},
    getters: {
        getTasks(state) {
            return state.tasks
        },
        getDate(state) {
            return state.date
        }
    }
})
