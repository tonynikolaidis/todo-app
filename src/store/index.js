import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

Vue.use(Vuex)

function updateTime() {
    let currentDate = new Date()
    let formattedDate = moment(currentDate).format('ddd, MMM D')

    let seconds = currentDate.getSeconds()
    let minutes = currentDate.getMinutes()
    let hour = currentDate.getHours()

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
    } else if (hour > 12) {
        hour -= 12
    }

    let time = hour + ':' + minutes + ' ' + pmAm

    return formattedDate + ' – ' + time
}

setInterval(() => {
    store.dispatch('updateDate').then(r => r)
}, 1000)

export function formatTime(time) {
    if (time) {
        let timeComponents = time.split(':')
        let hours = parseInt(timeComponents[0])
        let minutes = timeComponents[1]
        let formattedTime = ''

        let pmAm = ''

        if (hours > 11) {
            pmAm = 'PM'
        } else {
            pmAm = 'AM'
        }

        if (hours === 0) {
            hours = 12
        } else if (hours > 12) {
            hours -= 12
        }

        formattedTime += hours

        if (minutes !== '00') {
            formattedTime += ':' + minutes
        }

        formattedTime += ' ' + pmAm

        return formattedTime
    }

    return ''
}

export function getFormattedDate(date, time) {

    let string = null

    if (date !== null) {
        if (parseInt(date.split('-')[2]) - new Date().getDate() === 1) {
            string = 'Tomorrow'
        } else if (parseInt(date.split('-')[2]) - new Date().getDate() === 0) {
            string = 'Today'
        } else if (parseInt(date.split('-')[2]) - new Date().getDate() === -1) {
            string = 'Yesterday'
        } else {
            string = moment(date).format('ddd, MMM D')
        }

        if (time !== null) {
            string += ', ' + formatTime(time)
        }
    }

    return string
}

export const store = new Vuex.Store({
    state: {
        tasks: [],
        labels: [
            {header: 'Select a label or create one'}
        ],
        date: '',
        form: {show: false, type: null},
        showCompleted: false,
        taskToEdit: false,
        currentTask: {
            id: null,
            title: '',
            done: false,
            details: '',
            dueDate: null,
            dueTime: null,
            labels: []
        }
    },
    mutations: {
        sortByDueDate(state) {
            state.tasks.sort(function (a, b) {
                let dateA = 0
                let dateB = 0

                if (a.dueDate) {
                    let stringDateA = a.dueDate + 'T'
                    if (a.dueTime) {
                        stringDateA += a.dueTime + 'Z'
                    } else {
                        stringDateA += '00:00Z'
                    }
                    dateA = new Date(stringDateA)
                }

                if (b.dueDate) {
                    let stringDateB = b.dueDate + 'T'
                    if (b.dueTime) {
                        stringDateB += b.dueTime + 'Z'
                    } else {
                        stringDateB += '00:00Z'
                    }
                    dateB = new Date(stringDateB)
                }

                return dateA - dateB
            })
        },

        sortByLabel(state) {
            state.tasks.sort(function (a, b) {
                if (a.labels.length !== 0 && b.labels.length !== 0) {
                    if (a.labels[0].text > b.labels[0].text) {
                        return 1
                    } else {
                        return -1
                    }
                } else {
                    if (a.labels.length === 0) {
                        return -1
                    } else if (b.labels.length === 0) {
                        return 0
                    }
                    return 0
                }
            })
        },

        updateCurrentTaskId(state, id) {
            state.currentTask.id = id
        },
        updateCurrentTaskTitle(state, title) {
            state.currentTask.title = title
        },
        updateCurrentTaskDetails(state, details) {
            state.currentTask.details = details
        },
        updateCurrentTaskDueDate(state, date) {
            state.currentTask.dueDate = date
        },
        updateCurrentTaskDueTime(state, time) {
            state.currentTask.dueTime = time
        },
        updateCurrentTaskLabels(state, labels) {
            state.currentTask.labels = labels
        },
        updateDate(state) {
            state.date = updateTime()
        },
        addTask(state) {
            if (state.tasks == null) {
              state.tasks = []
            }
            state.tasks.unshift(state.currentTask)
            state.currentTask = {
                id: null,
                title: '',
                done: false,
                details: '',
                dueDate: null,
                dueTime: null,
                labels: []
            }
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
        editTask(state) {
            let taskIndex = state.tasks.findIndex(t => t.id === state.currentTask.id);
            state.tasks[taskIndex] = state.currentTask
            state.currentTask = {
                id: null,
                title: '',
                done: false,
                details: '',
                dueDate: null,
                dueTime: null,
                labels: []
            }
            localStorage.setItem('tasks', JSON.stringify(state.tasks))
        },
        setTaskToEdit(state, task) {
            if (task === null) {
                state.taskToEdit = false
            } else {
                state.taskToEdit = true
                state.currentTask = state.tasks.find(t => t.id === task.id)
            }
        },
        stopEditing(state) {
            state.currentTask = {
                id: null,
                title: '',
                done: false,
                details: '',
                dueDate: null,
                dueTime: null,
                labels: []
            }
        },
        appendToLabels(state, label) {
          state.labels.push(label)
        },
        removeLabel(state, label) {
            let deleteIndex = state.labels.findIndex(i => i === label)
            state.labels.splice(deleteIndex, 1)

            for (let i = 0; i < state.tasks.length; i++) {
                state.tasks[i].labels = state.tasks[i].labels.filter(l => l !== label)
            }

            localStorage.setItem('labels', JSON.stringify(state.labels))
        },
        setForm(state, form) {
            state.form = form
        },
        setShowCompleted(state, boolean) {
            if (state.tasks.filter(t => t.done === true).length === 0) {
                state.showCompleted = false
            } else {
                state.showCompleted = boolean
            }
        },
        initialiseStore(state) {
            state.tasks = JSON.parse(localStorage.getItem('tasks'))
            if (JSON.parse(localStorage.getItem('labels'))) {
                state.labels = JSON.parse(localStorage.getItem('labels'))
            } else {
                localStorage.setItem('labels', JSON.stringify(state.labels))
            }
        }
    },
    actions: {
        updateDate({commit}) {
            commit('updateDate')
        },
        addTask({commit}, task) {
            commit('addTask', task)
        },
        deleteTask({commit}, id) {
            commit('deleteTask', id)
        },
        doneTask({commit}, task) {
            commit('doneTask', task)
        },
        editTask({commit}, task) {
            commit('editTask', task)
        },
        setTaskToEdit({commit}, task) {
            commit('setTaskToEdit', task)
        },
        setForm({commit}, form) {
            commit('setForm', form)
        },
        setLabels({commit, labels}) {
            commit('setLabels', labels)
        }
    },
    modules: {},
    getters: {
        getTasks(state) {
            return state.tasks
        },
        getLabels(state) {
            return state.labels
        },
        getDate(state) {
            return state.date
        },
        getForm(state) {
            return state.form
        },
        getTaskToEdit(state) {
            return state.taskToEdit
        }
    }
})
