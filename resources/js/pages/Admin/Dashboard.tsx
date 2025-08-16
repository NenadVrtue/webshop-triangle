import React from 'react';

type Props = { title: string };

export default function Dashboard({ title }: Props) {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="mt-2 text-gray-500">Dobrodošao/la u admin panel.</p>
        </div>
    );
}
