// components/common/FilterDropdown.tsx
import React from "react";

interface FilterDropdownProps {
    options: Array<{ value: string; label: string }>;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
    options,
    placeholder = "Filter...",
    value,
    onChange,
}) => {
    return (
        <select
            className="p-1 bg-white border rounded lg:p-2 dark:bg-gray-800 dark:border-gray-700"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="" >{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};