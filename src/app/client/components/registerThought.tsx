import { useForm } from "react-hook-form";

interface RegisterThoughtInputs {
  situation: string;
  emotion?: string;
  automaticThought: string;
  evidenceFor?: string;
  evidenceAgainst: string;
  alternativeThought: string;
}

export const RegisterTought = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterThoughtInputs>();

  const handleRegisterThought = async (formData: RegisterThoughtInputs) => {
    console.log(formData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleRegisterThought)}>
        <input
          type="text"
          placeholder="Situaçao"
          {...register("situation", { required: "Digite a situação" })}
        />
        {errors.situation && (
          <p className="text-red-500">{errors.situation.message}</p>
        )}
        <button type="submit">Registrar Pensamento</button>
      </form>
    </div>
  );
};
