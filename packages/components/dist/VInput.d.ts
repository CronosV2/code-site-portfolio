import React from 'react';
export interface VInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}
export declare const VInput: React.FC<VInputProps>;
