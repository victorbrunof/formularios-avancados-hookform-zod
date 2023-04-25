import { LabelHTMLAttributes } from 'react';

export function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className="text-sm  flex items-center justify-between" {...props} />
  );
}
