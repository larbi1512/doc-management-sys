// components/common/ActionIcons.tsx
import React from "react";
import { Link } from "react-router-dom";
import { PencilIcon, TrashBinIcon } from "../../icons";

interface ActionIconsProps {
    editUrl: string;
    onDelete: () => void;
}

export const ActionIcons: React.FC<ActionIconsProps> = ({ editUrl, onDelete }) => {
    return (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Link to={editUrl} className="text-blue-500 hover:text-blue-700">
                <PencilIcon className="w-5 h-5" />
            </Link>
            <button onClick={onDelete} className="text-red-500 hover:text-red-700">
                <TrashBinIcon className="w-5 h-5" />
            </button>
        </div>
    );
};