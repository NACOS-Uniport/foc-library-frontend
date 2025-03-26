export interface MaterialUploadData {
    level: string;
    courseCode: string;
    courseTitle: string;
    description: string;
    material: File | null;
}

export interface PendingUpload extends MaterialUploadData {
    status: string;
    fileName: string;
}

export interface UploadStatus {
    uploading: boolean;
    error: string | null;
    success: boolean;
}