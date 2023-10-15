export type ID = string | number
export type Column = {
    id: number
    title: string
}
export type Task = {
    id: number
    columnID: number
    content: string
}