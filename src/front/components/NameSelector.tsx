import { FormEvent, useState } from 'react';

type NameSelectorProps = {
    onSelect: (username: string) => void;
    disabled: boolean;
};

export default function NameSelector({ onSelect, disabled }: NameSelectorProps) {
    // State
    const [error, setError] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const name = new FormData(e.currentTarget as HTMLFormElement).get('name');
        if (!name || name.toString().trim() === '') {
            setError('Vous devez choisir un pseudo');
            return;
        }
        onSelect(name.toString());
    };

    return (
        <>
            <h1>Sélectionner un pseudo</h1>
            {error && (
                <div className='alert'>
                    {error}
                    <button
                        onClick={() => setError('')}
                        className='alert__close'
                    >
                        &times;
                    </button>
                </div>
            )}
            <form
                className='flex'
                action=''
                onSubmit={handleSubmit}
                style={{
                    marginTop: '20px',
                    gap: '30px'
                }}
            >
                <label htmlFor='username'>Entrer votre pseudo</label>
                <input
                    disabled={disabled}
                    type='text'
                    id='username'
                    name='username'
                    required
                />
                <button
                    className='button'
                    disabled={disabled}
                >
                    Valider
                </button>
            </form>
        </>
    );
}
