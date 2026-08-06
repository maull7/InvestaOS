import Button from './Button';
import Modal from './Modal';

type ConfirmModalProps = {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    loading?: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export default function ConfirmModal({
    open,
    title,
    message,
    confirmLabel = 'Delete',
    loading,
    onClose,
    onConfirm,
}: ConfirmModalProps) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        className="bg-dashboard-error text-white hover:bg-dashboard-error/90"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {confirmLabel}
                    </Button>
                </>
            }
        >
            <p className="text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                {message}
            </p>
        </Modal>
    );
}