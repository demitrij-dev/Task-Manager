import {Task} from "../../taskBoardTypes.ts";
import DeleteIcon from "../../shared/icons/deleteIcon.tsx";
import {useState} from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities"
interface Props{
    task: Task
    deleteTask: (id: number) => void
    updateTask: (id: number, content: string) => void
}
const TaskCard = ({task, deleteTask, updateTask}: Props) => {
    const [mouseIsOver, setMouseIsOver] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const {
        setNodeRef, attributes, listeners,
        transition, transform, isDragging
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task
        },
        disabled: editMode
    })
    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }
    const toggleEditMode = () => {
        setEditMode(prev => !prev)
        setMouseIsOver(false)
    }
    if(isDragging){
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="
                bg-main_bg_color p-2.5 opacity-50
                h-[100px] min-h-[100px]
                flex items-center
                text-left
                rounded-xl
                border-2 border-rose-500
                cursor-grab
                relative
                task
            "/>
        )
    }
    if(editMode){
        return (
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="
                bg-main_bg_color p-2.5
                h-[100px] min-h-[100px]
                flex items-center
                text-left
                rounded-xl
                hover:ring-2 hover:ring-inset hover:ring-rose-500
                cursor-grab
                relative
            ">
                <textarea
                    value={task.content}
                    autoFocus
                    onBlur={toggleEditMode}
                    onKeyDown={e => {
                        if(e.key === "Enter" && e.shiftKey) toggleEditMode()
                    }}
                    onChange={e => updateTask(task.id, e.target.value)}
                    placeholder="Task here"
                    className="
                    h-[90%] w-full resize-none
                    border-none rounded
                    bg-transparent text-white
                    focus:outline-none
                ">

                </textarea>
            </div>
        );
    }
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={toggleEditMode}
            onMouseEnter={() => setMouseIsOver(true)}
            onMouseLeave={() => setMouseIsOver(false)}
            className="
            bg-main_bg_color p-2.5
            h-[100px] min-h-[100px]
            flex items-center
            text-left
            rounded-xl
            hover:ring-2 hover:ring-inset hover:ring-rose-500
            cursor-grab
            relative
            task
        ">
            <p className="
                my-auto h-[90%] w-full
                overflow-y-auto overflow-x-hidden
                whitespace-pre-wrap
            ">
                {task.content}
            </p>
            {mouseIsOver &&
                <button
                    onClick={() => deleteTask(task.id)}
                    className="
                    stroke-white
                    absolute
                    right-4 top-1/2
                    -translate-y-1/2
                    p-2 rounded
                    bg-column_bg_color
                    opacity-60 hover:opacity-100
            ">
                <DeleteIcon/>
            </button>}
        </div>
    );
};

export default TaskCard;