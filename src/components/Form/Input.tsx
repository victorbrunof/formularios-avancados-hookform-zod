import { InputHTMLAttributes } from 'react';
import { useFormContext } from 'react-hook-form';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export function Input(props: InputProps) {
  const { register } = useFormContext();

  return (
    <input
      id={props.name}
      className="border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white"
      {...register(props.name)}
      {...props}
    />
  );
}
