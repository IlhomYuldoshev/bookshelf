export type BackendResponse<Data = unknown> = {
    data: Data;
    isOk: boolean;
    message: string;
};

export type TodoAny = any;
