import { CAR_BRANDS } from './constants';
import { TCar } from './types';

export const generateRandomColor = (): string => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

export const getRandomValueFromArray = <T>(arr: Array<T>): T => {
    return arr[Math.floor(Math.random() * (arr.length - 1))];
};

export const generateNewCar = (): TCar => {
    const name = getRandomValueFromArray(CAR_BRANDS);
    const color = generateRandomColor();
    return { name, color };
};
