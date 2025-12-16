let tasksdata = {}
const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');
const tasks = document.querySelectorAll('.task')
const addnewtask = document.querySelector('.addnewtask');
const modal = document.querySelector('.modal')
const cancel = document.querySelector('.cancel');
const addtask = document.querySelector('.addtask');
const bg = document.querySelector('.bg')
const input = document.querySelector('#title')
const desc = document.querySelector('#description')
const columns = [todo,progress,done]
let dragItem = null;

function createElement(title,desc,column){
let div = document.createElement('div');
    div.classList.add('task');
    div.setAttribute('draggable', 'true')
    
    div.innerHTML = `<h1>${title}</h1>
                    <p>${desc}</p>
                    <button>Delete</button>`

    div.addEventListener('dragstart',() => {
        dragItem = div;
    })

    const deletee = div.querySelector('button');
    deletee.addEventListener('click',() => {
        div.remove();
        updatecount();
    })
    
    column.appendChild(div);
}


if(localStorage.getItem("tasks")){
    const data = JSON.parse(localStorage.getItem("tasks"));
    for(const col in data){
        const column = document.querySelector(`#${col}`);
        data[col].forEach(task => {
            createElement(task.title,task.description,column)
        })
        updatecount();
    } 
}


tasks.forEach(task => {
    task.addEventListener('dragstart', e => {
        dragItem = task;
    })
})
// function to update count
function updatecount(){
    columns.forEach(e => {
            const tasklen = e.querySelectorAll('.task')
            let count = e.querySelector('.heading .right');
            tasksdata[e.id] = Array.from(tasklen).map(t => {
                return {
                    title: t.querySelector('h1').innerHTML,
                    description: t.querySelector('p').innerHTML
                }
            })
            localStorage.setItem("tasks" , JSON.stringify(tasksdata))
            count.innerHTML = tasklen.length;
        })
}
// function to drag and drop
function addDropEventsOnColumn(column){
    column.addEventListener('dragenter',(e) => {
        e.preventDefault();
        column.classList.add('hover-over');
    })
    column.addEventListener('dragleave',(e) => {
        e.preventDefault();
        column.classList.remove('hover-over');
    })

    column.addEventListener('dragover', (e) => {
        e.preventDefault();
    })

    column.addEventListener('drop',(e) => {
        e.preventDefault();
        column.appendChild(dragItem);
        column.classList.remove('hover-over')
        updatecount();  
    })
}

addDropEventsOnColumn(todo);
addDropEventsOnColumn(progress);
addDropEventsOnColumn(done);
// function to add new task
function addingnewtask(){
let tasktitle = input.value;
let description = desc.value;
    if(tasktitle.trim() == "" ) return;
    if(tasktitle.trim() == "" && description.trim() == "") return;
    createElement(tasktitle,description,todo);
    modal.classList.remove('active');
    updatecount();
    input.value = "";
    desc.value = "";
}

addtask.addEventListener('click',addingnewtask);

bg.addEventListener('click',() => {
    modal.classList.remove('active');
})

addnewtask.addEventListener('click',e => {
    modal.classList.add('active');
    input.focus();
})

cancel.addEventListener('click',e => {
    modal.classList.remove('active')
})

input.addEventListener('keydown' , e => {
    if(e.key == 'Enter') {
        e.preventDefault();
        description.focus();
    }
})

desc.addEventListener('keydown' , e => {
    if(e.key == 'Enter') {
        addingnewtask();
        input.value = "";
        desc.value = "";
        modal.classList.remove('active');
    }
})