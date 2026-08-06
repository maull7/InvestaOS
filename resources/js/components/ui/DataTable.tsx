import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

import Button from './Button';
import Icon from './Icon';
import Card from '../dashboard/Card';
import { cn } from '@/lib/utils';

type Column<T> = {
    key: string;
    label: string;
    className?: string;
    render: (row: T) => ReactNode;
};

type Pagination = {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

type DataTableProps<T> = {
    columns: Column<T>[];
    rows: T[];
    keyField: keyof T;
    title?: string;
    onCreate?: () => void;
    createLabel?: string;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    emptyText?: string;
    pagination?: Pagination;
};

export default function DataTable<T>({
    columns,
    rows,
    keyField,
    title,
    onCreate,
    createLabel = 'Add',
    onEdit,
    onDelete,
    emptyText = 'No records yet.',
    pagination,
}: DataTableProps<T>) {
    const pageNav = (url: string | null, label: string) =>
        url ? (
            <Link
                href={url}
                preserveScroll
                className="inline-flex items-center gap-1 rounded-full border border-dashboard-outline-variant px-4 py-1.5 text-sm font-semibold text-dashboard-on-surface transition-colors hover:bg-dashboard-surface-container-high dark:border-white/15 dark:text-dashboard-inverse-on-surface dark:hover:bg-white/5"
            >
                {label === 'Prev' && <Icon name="back" size="text-sm" />}
                {label}
                {label === 'Next' && <Icon name="forward" size="text-sm" />}
            </Link>
        ) : null;

    return (
        <Card className="overflow-hidden">
            {(title || onCreate) && (
                <div className="flex items-center justify-between border-b border-dashboard-outline-variant/20 px-6 py-4 dark:border-white/10">
                    <h3 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                        {title}
                    </h3>
                    {onCreate && (
                        <Button variant="solid" onClick={onCreate} className="px-4 py-2">
                            <Icon name="add" size="text-sm" /> {createLabel}
                        </Button>
                    )}
                </div>
            )}
            {rows.length === 0 ? (
                <p className="px-6 py-10 text-center text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                    {emptyText}
                </p>
            ) : (
                <>
                    <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-dashboard-outline-variant/20 text-left text-xs text-dashboard-on-surface-variant dark:border-white/10 dark:text-dashboard-surface-variant">
                                {columns.map((col) => (
                                    <th key={col.key} className={cn('px-6 py-3 font-medium', col.className)}>
                                        {col.label}
                                    </th>
                                ))}
                                {(onEdit || onDelete) && (
                                    <th className="px-6 py-3 text-right font-medium">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr
                                    key={String(row[keyField])}
                                    className="border-b border-dashboard-outline-variant/10 last:border-0 dark:border-white/5"
                                >
                                    {columns.map((col) => (
                                        <td key={col.key} className={cn('px-6 py-3.5 text-dashboard-on-surface dark:text-dashboard-inverse-on-surface', col.className)}>
                                            {col.render(row)}
                                        </td>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center justify-end gap-2">
                                                {onEdit && (
                                                    <button
                                                        type="button"
                                                        aria-label="Edit"
                                                        onClick={() => onEdit(row)}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-dashboard-on-surface-variant transition-colors hover:bg-dashboard-surface-container-high hover:text-dashboard-on-surface dark:text-dashboard-surface-variant dark:hover:bg-white/10"
                                                    >
                                                        <Icon name="edit" size="text-sm" />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        type="button"
                                                        aria-label="Delete"
                                                        onClick={() => onDelete(row)}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-dashboard-error transition-colors hover:bg-dashboard-error/10"
                                                    >
                                                        <Icon name="trash" size="text-sm" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                    {pagination && (
                        <div className="flex items-center justify-between gap-4 border-t border-dashboard-outline-variant/20 px-6 py-4 dark:border-white/10">
                            <span className="text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                {pagination.total} data · Halaman {pagination.current_page} dari {pagination.last_page}
                            </span>
                            <div className="flex gap-2">
                                {pageNav(pagination.prev_page_url, 'Prev')}
                                {pageNav(pagination.next_page_url, 'Next')}
                            </div>
                        </div>
                    )}
                </>
            )}
        </Card>
    );
}