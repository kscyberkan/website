
import React from 'react'

type ButtonProps = {
    id?: string;
    label?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

function Button_Default(props: ButtonProps) {
    return (
        <button id={props.id} type="button" onClick={props.onClick} className="mt-6 w-full rounded-xl bg-[var(--primary)] py-3 font-semibold text-white transition active:scale-95 hover:opacity-90 hover:cursor-pointer">
            {props.label}
        </button>
    )
}

const InputField = {
    "Default": Button_Default
}

export default InputField
