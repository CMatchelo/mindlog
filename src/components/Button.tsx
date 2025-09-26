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
        className={`bg-primary1 text-white hover:bg-primary1Light active:bg-primary1Dark transition
         px-4 py-2 rounded min-w-40 
         cursor-pointer ${classname}`}>
            {children}
        </button>
    )
}