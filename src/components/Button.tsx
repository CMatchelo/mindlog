interface ButtonProps {
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    classname?: string;
}

export const Button = ({ children, type, onClick, classname }: ButtonProps) => {
    return (
        <button 
        type={type} 
        onClick={onClick} 
        className={`bg-primary1 text-white px-4 py-2 rounded hover:bg-primary1Light active:bg-primary1Dark transition cursor-pointer ${classname}`}>
            {children}
        </button>
    )
}