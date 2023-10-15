import {Column, Task} from "../../taskBoardTypes.ts";
import DeleteIcon from "../../shared/icons/deleteIcon.tsx";
import {SortableContext, useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities"
import {useMemo, useState} from "react";
import PlusIcon from "../../shared/icons/plusIcon.tsx";
import TaskCard from "../taskCard/taskCard.tsx";
interface Props{
    column: Column
    deleteColumn: (id: number) => void
    updateColumn: (id: number, title: string) => void
    createTask: (columnID: number) => void
    tasks: Task[]
    deleteTask: (id: number) => void
    updateTask: (id: number, title: string) => void
}
const ColumnContainer = (props: Props) => {
    const {column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask} = props
    const [editMode, setEditMode] = useState(false)
    const [name, setName] = useState(column.title)
    const tasksIds = useMemo(() => {
        return tasks.map(t => t.id)
    }, [tasks])
    const {
        setNodeRef,
        attributes,
        listeners,
        transition,
        transform,
        isDragging
    } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
        disabled: editMode,
    })
    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }
    if(isDragging){
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="
                bg-column_bg_color
                w-[350px] h-[500px] max-h-[500px]
                rounded-md flex flex-col opacity-50 border-2 border-rose-500"
            >
            </div>
        )
    }
    function changeName(name: string) {
        setName(name)
        //@ts-ignore
        updateColumn(column.id, name)
    }
    return (
        <div
            ref={setNodeRef}
            style={style}
            className="
            bg-column_bg_color
            w-[350px] h-[500px] max-h-[500px]
            rounded-2xl
            flex flex-col
        ">
            <div
                {...attributes}
                {...listeners}
                onClick={() => setEditMode(true)}
                className="
                bg-main_bg_color
                h-[60px]
                cursor-grab
                rounded-lg
                p-3
                text-md font-bold
                border-4 border-column_bg_color
                flex items-center justify-between

            ">
                <div className="flex gap-2 items-center w-full justify-between">
                    <div className="
                        flex justify-center items-center
                        bg-column_bg_color
                        px-2 py-1
                        text-sm
                        rounded-full
                    ">{tasks.length}</div>
                    {!editMode && column.title}
                    {Boolean(editMode) && <input
                        type="text"
                        className="bg-black focus:border-rose-500 border rounded outline-none px-2"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        autoFocus
                        onBlur={() => setEditMode(false)}
                        onKeyDown={e => {
                            if(e.key !== "Enter") return;
                            setEditMode(false)
                            changeName(name)
                        }}
                        />
                    }
                    <button
                        onClick={() => deleteColumn(column.id)}
                        className="
                        stroke-gray-500
                        hover:stroke-white hover:bg-column_bg_color
                        rounded
                        px-1 py-2
                    ">
                        <DeleteIcon/>
                    </button>
                </div>
            </div>
            <div
                className="
                    flex flex-grow flex-col gap-4
                    p-2
                    overflow-x-hidden overflow-y-auto
                ">
                {tasks.length > 0?
                    <SortableContext items={tasksIds}>
                        {tasks.map(task =>
                            <TaskCard
                                key={task.id}
                                task={task}
                                deleteTask={deleteTask}
                                updateTask={updateTask}
                            ></TaskCard>
                        )}
                    </SortableContext>
                    :
                    <div className="
                        w-full
                        h-full
                        flex items-center justify-center
                        flex-col
                        text-center
                    ">
                        <h1 className="text-2xl">Write your goals here.</h1>
                        (Don't forget about Drag & Drop)
                    </div>
                }
            </div>
            <button
                onClick={() => createTask(+column.id)}
                className="
                flex gap-2 items-center
                border-column_bg_color border-2 rounded-md
                p-4 border-x-column_bg_color
                hover:bg-main_bg_color hover:text-rose-500
                active:bg-black
            ">
                <PlusIcon/>
                Add task
            </button>
        </div>
    );
};

export default ColumnContainer;