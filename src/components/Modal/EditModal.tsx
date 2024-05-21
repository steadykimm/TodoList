import { useState } from "react";
import { MdEdit } from "react-icons/md";
import { CiCircleRemove } from "react-icons/ci";
import React from "react";
import "../css/Modal.css"

interface EditModalProps {
    onSave: (text: string) => void;
    initialText: string;
}

export default function EditModal({ onSave, initialText }: EditModalProps){
    const [modal, setModal] = useState(false);
    const [editText, setEditText] = useState(initialText);

    const toggleModal = () => {
        setModal(!modal);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditText(e.target.value);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(editText);
        toggleModal();
    }
    


    return(
        <>
            <button 
            className="btn-modal-open"
            onClick={toggleModal}>
                <MdEdit />
            </button>

            {modal && (
                <div className="modal">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <input id="editInput"
                            type="text"
                            value={editText}
                            onChange={handleChange}
                            />
                            <br />
                            <button className="btn-edit" type="submit">
                                수정하기
                            </button>
                            <button className="btn-close" 
                            onClick={toggleModal}>
                                <CiCircleRemove />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}