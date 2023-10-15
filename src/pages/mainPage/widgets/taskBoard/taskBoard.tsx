import PlusIcon from "./shared/icons/plusIcon.tsx";
import {useMemo, useState} from "react";
import {Column, Task} from "./taskBoardTypes.ts";
import ColumnContainer from "./entities/columnContainer/columnContainer.tsx";
import {
    DndContext,
    DragEndEvent, DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor, TouchSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {arrayMove, SortableContext} from "@dnd-kit/sortable";
import {createPortal} from "react-dom";
import TaskCard from "./entities/taskCard/taskCard.tsx";

const TaskBoard = () => {
    const [columns, setColumns] = useState<Column[]>([])
    const columnsID = useMemo(() => columns.map((col) => col.id), [columns])
    const [activeColumn, setActiveColumn] = useState<Column | null>(null)
    const [activeTask, setActiveTask] = useState<Task | null>(null)
    const sensors = useSensors(
        useSensor(PointerSensor, {
        activationConstraint: {
            distance: 10,
        }
    }), useSensor(TouchSensor, {activationConstraint: {distance: 10}})
    )
    const [tasks, setTasks] = useState<Task[]>([])
    function createColumn(){
        console.log(columns)
        const columnToAdd: Column = {
            id: Number(Date.now().toString().substring(0, 25)),
            title: `Column ${columns.length + 1}`
        }
        setColumns([...columns, columnToAdd])
        // const generateNewID = (): number => {return Math.round(Math.random() * 1001)}
    }
    function deleteColumn(id: number){
        setColumns([...columns.filter(e => e.id !== id)])
        setTasks([...tasks.filter(e => e.columnID !== id)])
    }
    function updateColumn(id: number, title: string){
        const newColumns = columns.map(col => {
            if(col.id !== id) return col;
            return {...col, title: title}
        })
        setColumns(newColumns)
    }
    function createTask(columnID: number){
        const newTask: Task = {
            id: Number(Date.now().toString().substring(0, 25)),
            columnID,
            content: `Task ${tasks.length + 1}`
        }
        setTasks([...tasks, newTask])
    }
    function deleteTask(id: number){
        const newTasks = tasks.filter(e => e.id !== id)
        setTasks(newTasks)
    }
    function updateTask(id: number, title: string){
        const newTasks = tasks.map(task => {
            if(task.id !== id) return task;
            return {...task, content: title}
        })
        setTasks(newTasks)
    }
    function onDragStart(event: DragStartEvent){
        if(event.active.data.current?.type === "Column"){
            setActiveColumn(event.active.data.current.column)
            return;
        }
        if(event.active.data.current?.type === "Task"){
            setActiveTask(event.active.data.current.task)
            return;
        }
    }
    function onDragEnd(event: DragEndEvent){
        setActiveColumn(null)
        setActiveTask(null)
        const {active, over} = event
        if(!over) return;
        const activeColumnId = active.id
        const overColumnId = over.id
        if(activeColumnId === overColumnId) return;
        setColumns(columns => {
            const activeColumnIndex = columns.findIndex(col => col.id === activeColumnId)
            const overColumnIndex = columns.findIndex(col => col.id === overColumnId)
            return arrayMove(columns, activeColumnIndex, overColumnIndex)
        })
    }
    function onDragOver(event: DragOverEvent){
        const {active, over} = event
        if(!over) return;
        const activeId = active.id
        const overId = over.id
        if(activeId === overId) return;

        const isActiveATask = active.data.current?.type === "Task"
        const isOverATask = over.data.current?.type === "Task"
        if(!isActiveATask) return;
        if(isActiveATask && isOverATask){
            setTasks(tasks => {
                const activeIdx = tasks.findIndex(e => e.id === activeId)
                const overIdx = tasks.findIndex(e => e.id === overId)
                tasks[activeIdx].columnID = tasks[overIdx].columnID
                return arrayMove(tasks, activeIdx, overIdx)
            })
        }

        const isOverAColumn = over.data.current?.type === "Column"
        if(isActiveATask && isOverAColumn){
            setTasks(tasks => {
                const activeIdx = tasks.findIndex(e => e.id === activeId)
                tasks[activeIdx].columnID = +overId
                return arrayMove(tasks, activeIdx, activeIdx)
            })
        }
    }
    return (
        <div className="
            m-auto
            flex items-center
            min-h-screen w-full
            overflow-x-auto overflow-y-hidden
            px=[40px]
        ">
            <DndContext
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                sensors={sensors}
                onDragOver={onDragOver}
            >
                <div className="m-auto flex gap-2 max-2xl:flex-col-reverse md:flex-row">
                    {columns.length > 0 ?
                        <div className="flex gap-4 max-2xl:flex-col-reverse md:flex-row">
                            <SortableContext items={columnsID}>
                                {columns.map((column) =>
                                    <ColumnContainer
                                        key={column.id}
                                        column={column}
                                        deleteColumn={deleteColumn}
                                        updateColumn={updateColumn}
                                        createTask={createTask}
                                        tasks={tasks.filter(e => e.columnID == column.id)}
                                        deleteTask={deleteTask}
                                        updateTask={updateTask}
                                    />
                                )}
                            </SortableContext>
                        </div>
                        :
                        <div
                            className="
                            bg-column_bg_color
                            w-[350px] h-[500px] max-h-[500px]
                            rounded-md
                            flex flex-col items-center justify-center
                            text-xl
                            text-white
                            border-opacity-50
                            border-2 border-main_bg_color
                        ">
                            Let's make a plan now!
                        </div>
                    }
                    <button
                        onClick={createColumn}
                        className="
                            h-[55px] w-[350px] min-w-[350px]
                            cursor-pointer
                            rounded-lg
                            bg-main_bg_color
                            border-3 border-column_bg_color
                            p-5
                            ring-rose-500
                            hover:ring-2 hover:border-none
                            flex gap-2 items-center
                        ">
                        <PlusIcon/>
                        Add column
                    </button>
                </div>
                {createPortal(
                    <DragOverlay>
                        {activeColumn &&
                            <ColumnContainer
                                key={activeColumn.id}
                                column={activeColumn}
                                deleteColumn={deleteColumn}
                                updateColumn={updateColumn}
                                createTask={createTask}
                                tasks={tasks.filter(e => e.columnID == activeColumn.id)}
                                deleteTask={deleteTask}
                                updateTask={updateTask}
                            />
                        }
                        {activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask}/>}
                    </DragOverlay>,
                    document.body)
                }
            </DndContext>
        </div>
    );
};

export default TaskBoard;