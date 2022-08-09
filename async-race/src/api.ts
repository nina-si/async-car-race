import { TCar, TDriveParams, TWinnerData } from './types';

import { DRIVE_STATUS, ENGINE_URL, GARAGE_URL, WINNERS_URL } from './constants';

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

export const createCar = async (body: { name: string; color: string }): Promise<TCar> =>
    (
        await fetch(GARAGE_URL, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    ).json();

export const updateCar = async (id: number, body: Record<string, unknown>): Promise<TCar> =>
    (
        await fetch(`${GARAGE_URL}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    ).json();

export const deleteCar = async (id: number): Promise<void> => {
    (
        await fetch(`${GARAGE_URL}/${id}`, {
            method: 'DELETE',
        })
    ).json();
};

export const deleteCarFromWinners = async (id: number): Promise<void> => {
    (
        await fetch(`${WINNERS_URL}/${id}`, {
            method: 'DELETE',
        })
    ).json();
};

export const getDriveParams = async (id: number, status: string): Promise<TDriveParams> => {
    const result = (
        await fetch(`${ENGINE_URL}?id=${id}&status=${status}`, {
            method: 'PATCH',
        })
    ).json();

    return result;
};

export const switchDriveMode = async (id: number, signal?: AbortSignal): Promise<number> => {
    if (signal) {
        return (
            await fetch(`${ENGINE_URL}?id=${id}&status=${DRIVE_STATUS.DRIVE}`, {
                method: 'PATCH',
                signal: signal,
            })
        ).status;
    } else
        return (
            await fetch(`${ENGINE_URL}?id=${id}&status=${DRIVE_STATUS.DRIVE}`, {
                method: 'PATCH',
            })
        ).status;
};

export const stopEngine = async (id: number): Promise<void> => {
    const result = (
        await fetch(`${ENGINE_URL}?id=${id}&status=${DRIVE_STATUS.STOPPED}`, {
            method: 'PATCH',
        })
    ).json();

    return result;
};

export const getWinnerData = async (id: number): Promise<TWinnerData[] | null> => {
    try {
        const result = (await fetch(`${WINNERS_URL}?id=${id}`)).json();
        return result;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export const createNewWinner = async (body: TWinnerData): Promise<void> => {
    (
        await fetch(WINNERS_URL, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    ).json();
};

export const updateWinner = async (id: number, body: { wins: number; time: number }): Promise<void> =>
    (
        await fetch(`${WINNERS_URL}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    ).json();

export const getWinners = async (
    page: number,
    limit: number,
    sort: string,
    order: string
): Promise<{ winners: TWinnerData[]; count: string | null }> => {
    const result = await fetch(`${WINNERS_URL}?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`);

    return {
        winners: await result.json(),
        count: result.headers.get('X-Total-Count'),
    };
};
