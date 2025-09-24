interface PopupMessageProps {
    title?: string;
    message: string;
    onClose?: () => void;
}

export const PopupMessage = ({title, message, onClose}: PopupMessageProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white p-6 mx-5 rounded-md shadow-md max-w-sm w-full">
                {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
                <p className="mb-4">{message}</p>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="bg-primary1 text-white px-4 py-2 rounded-md hover:bg-primary2 transition"
                    >
                        Fechar
                    </button>
                )}
            </div>
        </div>
    )
}