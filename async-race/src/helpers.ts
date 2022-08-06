import { CAR_BRANDS, CAR_MODELS } from './constants';

export const generateRandomColor = (): string => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

export const getRandomValueFromArray = <T>(arr: Array<T>): T => {
    return arr[Math.floor(Math.random() * (arr.length - 1))];
};

export const generateNewCar = (): { name: string; color: string } => {
    const name = `${getRandomValueFromArray(CAR_BRANDS)} ${getRandomValueFromArray(CAR_MODELS)}`;
    const color = generateRandomColor();
    return { name, color };
};
