import React from 'react';
export interface VCardProps {
    title?: string;
    description?: string;
    children?: React.ReactNode;
    className?: string;
    hoverable?: boolean;
}
export declare const VCard: React.FC<VCardProps>;
