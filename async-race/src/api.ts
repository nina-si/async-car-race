import { TCar } from './types';

import { GARAGE_URL } from './constants';

export const getCars = async (page: number, limit: number): Promise<{ cars: TCar[] | []; count: string | null }> => {
    const result = await fetch(`${GARAGE_URL}?_page=${page}&_limit=${limit}`);

    return {
        cars: await result.json(),
        count: result.headers.get('X-Total-Count'),
    };
};

export const getCarInfo = async (id: number): Promise<TCar> => {
    const carInfo = (await fetch(`${GARAGE_URL}/${id}`)).json();
    return carInfo;
};

export const createCar = async (body: TCar) =>
    (
        await fetch(GARAGE_URL, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    ).json();

export const updateCar = async (id: number, body: Record<string, unknown>) =>
    (
        await fetch(`${GARAGE_URL}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    ).json();

export const deleteCar = async (id: number) => {
    (
        await fetch(`${GARAGE_URL}/${id}`, {
            method: 'DELETE',
        })
    ).json();
};
