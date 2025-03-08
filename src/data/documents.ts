// data/documents.ts
export interface Document {
    id: number;
    name: string;
    fileName: string;
    type: 'PDF' | 'DOCX' | 'XLSX' | 'TXT' | 'OTHER' | 'IMAGE';
    dateAdded: string;
    size: number; // in bytes
    addedBy: string;
    lastViewDate: string;
    lastViewedBy: string;
    author: string;
    description?: string;
}

export const documents: Document[] = [
    {
        id: 1,
        name: "Statement of Purpose",
        fileName: "statementofpurpose.pdf",
        type: "PDF",
        dateAdded: "2024-02-15",
        size: 2_500_000, // 2.5MB
        addedBy: "Alice Johnson",
        lastViewDate: "2024-03-20",
        lastViewedBy: "Bob Smith",
        author: "Alice Johnson",
        description: "Initial project proposal document"
    },
    {
        id: 2,
        name: "Internship report",
        url: "/documents/project-proposal.pdf",
        type: "PDF",
        dateAdded: "2024-02-15",
        size: 2_500_000, // 2.5MB
        addedBy: "Alice Johnson",
        lastViewDate: "2024-03-20",
        lastViewedBy: "Bob Smith",
        author: "Alice Johnson",
        description: "Initial project proposal document"
    },
    // Add more sample documents
];