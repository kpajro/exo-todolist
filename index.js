let body = document.body
let input = document.getElementById("add")
let addbtn = document.getElementById("addbtn")
let filterbtn = document.getElementById("filterbtn")
let list = document.getElementById("itemsList")
let options = document.getElementById("option")

let tasks = JSON.parse(localStorage.getItem('tasks')) || []

function createTodo(){
    if(input.value === ""){
        let err = document.createElement("p")
        err.classList.add("error")
        err.innerText = "The task name is empty!"
        body.appendChild(err)
        setTimeout(()=>{
            err.remove()
        },2000)
    }
    const taskName = input.value.trim()

    const newTask = { name: taskName, done: false }
    tasks.push(newTask)
    saveData()
    let task = displayTasks()
    input.value = ''
    return task
}

function displayTasks(filter = 'all') {
    list.innerHTML = ''
    tasks.forEach(task => {
        if ((filter === 'todo' && task.done) || (filter === 'done' && !task.done)) {
            return
        }
        let todo = document.createElement("div")
        let name = document.createElement("span")
        let checkbox = document.createElement("input")
        let del = document.createElement("img")
        let edit = document.createElement("img")

        todo.classList.add("todoItem")
        if(task.done){
            todo.classList.add("checked")
        } else {
            todo.classList.add("unchecked")
        }

        name.classList.add("itemInput")
        name.innerText = task.name

        checkbox.type = "checkbox"
        checkbox.checked = task.done
        
        edit.src = "./edit.png"
        edit.classList.add("itemImg")
        edit.style.width = "32px"

        del.src = "./bin.png"
        del.classList.add("itemImg")

        todo.appendChild(checkbox)
        todo.appendChild(name)
        todo.appendChild(edit)
        todo.appendChild(del)

        checkbox.addEventListener("change", () => {
            task.done = checkbox.checked
            if (!todo.classList.contains("checked") || task.done) {
                todo.classList.add("checked")
                todo.classList.remove("unchecked")
            } else {
                todo.classList.add("unchecked")
                todo.classList.remove("checked")
            }
            saveData()
            
        })

        edit.addEventListener("click", () => {
            let changer = document.createElement("input")
            changer.style.position = "absolute"
            changer.classList.add("itemInput")
            changer.value = task.name
            todo.replaceChild(changer, name)
            edit.style.pointerEvents = "none"
            changer.focus()
            changer.addEventListener("blur", () => {
                task.name = changer.value
                saveData()
                displayTasks(options.value)
            })
        })

        del.addEventListener("click", () => {
            tasks = tasks.filter(t => t !== task)
            saveData()
            displayTasks(options.value)
            todo.classList.add("totheright")
            setTimeout(()=>{
                todo.remove()
            },700)
        })

        list.appendChild(todo)
        return task
    })
}

function filterItems(){
    let selected = options.value
    displayTasks(selected)
}

function saveData(){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

addbtn.addEventListener("click", (evt)=>{
    try {
        let lasttodo = createTodo()
        saveData()
        lasttodo.classList.add("added")
        setTimeout(()=>{
            lasttodo.classList.remove("added")
        }, 200)
    } catch(err){
        console.log(err)
    }
})

filterbtn.addEventListener("click", (evt)=>{
    filterItems()
})

document.addEventListener("DOMContentLoaded", () => {
    displayTasks()
})

