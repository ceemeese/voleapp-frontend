export interface ProblemDetails {
    title: string;
    detail: string;
    status: number;
    type: string;
    extensions?: {
        errors?: Record<string, string[]>;
    };
}