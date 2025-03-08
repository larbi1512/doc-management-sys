// components/common/DocumentActions.tsx
import React from "react";
import { Link } from "react-router-dom";
import { EyeIcon, PencilIcon, TrashBinIcon } from "../../icons";

interface DocumentActionsProps {
    viewUrl: string;
    editUrl: string;
    onDelete: () => void;
}

export const DocumentActions: React.FC<DocumentActionsProps> = ({
    viewUrl,
    editUrl,
    onDelete
}) => {
    return (
        <div className="flex gap-2">
            <Link
                to={viewUrl}
                className="text-blue-500 hover:text-blue-700"
                title="View"
            >
                <EyeIcon className="w-5 h-5" />
            </Link>
            <Link
                to={editUrl}
                className="text-gray-600 hover:text-gray-800"
                title="Edit"
            >
                <PencilIcon className="w-5 h-5" />
            </Link>
            <button
                onClick={onDelete}
                className="text-red-500 hover:text-red-700"
                title="Delete"
            >
                <TrashBinIcon className="w-5 h-5" />
            </button>
        </div>
    );
};