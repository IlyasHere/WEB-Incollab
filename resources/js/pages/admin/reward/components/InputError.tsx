import type { ReactNode } from 'react';

export function InputError({ children }: { children: ReactNode }) {
    return (
        <p className="mt-2 text-sm font-medium text-[#D11149]">{children}</p>
    );
}
