export const BASE_URL = 'http://localhost:3000';

export const GARAGE_URL = `${BASE_URL}/garage`;

export const WINNERS_URL = `${BASE_URL}/winners`;

export const ENGINE_URL = `${BASE_URL}/engine`;

export const CARS_PER_PAGE = 7;
export const WINNERS_PER_PAGE = 10;

export const TRACK_START = 22; // начальная точка трека в % от ширины родителя
export const TRACK_END = 91; // конечная точка трека в % от ширины родителя
export const ANIMATION_SPEED = 10;

export const DRIVE_STATUS = {
    STARTED: 'started',
    STOPPED: 'stopped',
    DRIVE: 'drive',
};

export const SORT_TYPE = {
    ID: 'id',
    WINS: 'wins',
    TIME: 'time',
};

export const SORT_ORDER = {
    ASC: 'ASC',
    DESC: 'DESC',
};

export const CAR_BRANDS = [
    'Cadillac',
    'Bentley',
    'Audi',
    'BMW',
    'Chevrolet',
    'Ford',
    'Fiat',
    'Honda',
    'Jaguar',
    'Kia',
    'Mazda',
    'Lexus',
    'Nissan',
    'Tesla',
    'Toyota',
];

export const CAR_MODELS = [
    'Model S',
    'Mustang',
    'Tiguan',
    'X5',
    'Civic',
    'Accord',
    'Focus',
    'Fabia',
    'Fusion',
    'Fiesta',
    'Accent',
    'Sonata',
    'Getz',
];
