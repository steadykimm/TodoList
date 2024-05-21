import { ReactNode, useCallback, useReducer, useRef, useState } from "react";
import "../css/ToDoList.css";
import React from "react";
import { CiSquarePlus, CiSquareRemove } from "react-icons/ci";
import { RiCheckboxLine, RiCheckboxBlankLine, RiPaintBrushFill } from "react-icons/ri";
import cn from "classnames";
import EditModal from "../Modal/EditModal"

interface Todo {
    id: number;
    text: string;
    checked: boolean;
    category: number;
}

interface ListTemplateProps {
    children: ReactNode;
}

interface InsertProps {
    onInsert: (text: string) => void;
}

interface ListProps {
    todos: Todo[];
    onRemove: (id: number) => void;
    onToggle: (id: number) => void;
    onEdit: (id: number, text: string) => void;
    onCategorize: (id: number, category: number) => void;
}

interface ListItemProps {
    todo: Todo;
    onRemove: (id: number) => void;
    onToggle: (id: number) => void;
    onEdit: (id: number, text: string) => void;
    onCategorize: (id: number, category: number) => void;
}

type ActionType = 
    { type: "INSERT"; text: string; nextId: number } | 
    { type: "REMOVE"; id: number } |
    { type: "TOGGLE"; id: number } |
    { type: "EDIT"; id: number; text: string } |
    { type: "CATEGORIZE"; id: number; category: number}

function todoReducer(todos: Todo[], action: ActionType): Todo[] {
    switch (action.type) {
        case "INSERT":
            return todos.concat({
                id: action.nextId,
                text: action.text,
                checked: false,
                category: 1
            });
        case "REMOVE":
            return todos.filter((todo) => todo.id !== action.id);
        case "TOGGLE":
            return todos.map((todo) =>
                todo.id === action.id ? { ...todo, checked: !todo.checked } : todo
            );
        case "EDIT":
            return todos.map((todo) =>
                todo.id === action.id ? { ...todo, text: action.text } : todo
            );
        case "CATEGORIZE":
            return todos.map((todo) =>
                todo.id === action.id ? { ...todo, category: action.category } : todo
            );
        default:
            return todos;
    }
}

const initialTodos: Todo[] =[
    {
        id: 1,
        text: '투두리스트 만들기',
        checked: false,
        category: 1
    }
];

function ToDoList() {

    const [todos, dispatch] = useReducer(todoReducer, initialTodos);

    const nextId = useRef(2);

    const onInsert = useCallback((text: string) => {
        dispatch({ type: 'INSERT', text, nextId: nextId.current });
        nextId.current += 1;
    }, []);

    const onRemove = useCallback((id: number) => {
        dispatch({ type: 'REMOVE', id });
    }, []);

    const onToggle = useCallback((id: number) => {
        dispatch({ type: 'TOGGLE', id });
    }, []);

    const onEdit = useCallback((id: number, text: string) => {
        dispatch({ type: 'EDIT', id, text });
    }, []);

    const onCategorize = useCallback((id: number, category: number) => {
        dispatch({ type: 'CATEGORIZE', id, category });
    }, []);

    return (
        <ListTemplate>
            <Insert onInsert={onInsert} />
            <List 
            todos={todos} 
            onRemove={onRemove} 
            onToggle={onToggle} 
            onEdit={onEdit}
            onCategorize={onCategorize}
            />
        </ListTemplate>
    );
}

function ListTemplate({ children }: ListTemplateProps) {
    return (
        <div className="ListTemplate">
            <div className="title">To Do List</div>
            <div className="content">{children}</div>
        </div>
    );
}

function Insert({onInsert}: InsertProps) {
    const [value, setValue] = useState('');
    
    const onChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }, []);

    const onSubmit = useCallback(
        (e: React.FormEvent) => {
            onInsert(value);
            setValue('');
            e.preventDefault();
        },
        [onInsert, value]
    );

    return (
        <form className="Insert" onSubmit={onSubmit}>
            <input 
                placeholder="오늘의 할 일은 무엇인가요?"
                type="text"
                value={value}
                onChange={onChange} 
            />
            <button type="submit">
                <CiSquarePlus />
            </button>
        </form>
    );
}

function List({ todos, onRemove, onToggle, onEdit, onCategorize }: ListProps) {
    return(
        <ul className="List">
            {todos.map(todo => (
                <ListItem
                    key={todo.id}
                    todo={todo}
                    onRemove={onRemove}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onCategorize={onCategorize}
                />
            ))}
        </ul>
    );
}

function ListItem({ todo, onRemove, onToggle, onEdit, onCategorize }: ListItemProps) { 
    const { id, text, checked, category } = todo;

    const handleSave = (newText: string) => {
        onEdit(id, newText);
    };

    const handleCategorize = () => {
        const newCategory = (category % 4) + 1;
        onCategorize(id, newCategory);
    }

    return(
        <li className={cn('ListItem', `category${category}`)}>
            <div className={cn('checkbox', { checked })}
                onClick={() => onToggle(id)}>
                {checked ? <RiCheckboxLine /> : <RiCheckboxBlankLine />}
                <div className="text">{text}</div>
            </div>
            <div className="category" onClick={handleCategorize}>
                <RiPaintBrushFill />
            </div>
            <div className="edit">
                <EditModal 
                    initialText={text}
                    onSave={handleSave}
                />
            </div>
            <div className="remove"
                onClick={() => onRemove(todo.id)}>
                <CiSquareRemove />
            </div>
        </li>
    );
}

export default ToDoList;
