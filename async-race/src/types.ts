export type TCar = {
    name: string;
    color: string;
    id: number;
};

export type TWinnerData = {
    id: number;
    wins: number;
    time: number;
};

export type TWinner = {
    id: number;
    name: string;
    time: number;
};

export type TDriveParams = {
    velocity: number;
    distance: number;
};
