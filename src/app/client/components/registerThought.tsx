import { useAuth } from "@/Contexts/AuthContext";
/* import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../firebase"; */
import { useForm, UseFormRegister, FieldErrors } from "react-hook-form";
import { auth } from "../../../../firebase";

interface RegisterThoughtInputs {
  situation: string;
  emotion?: string;
  automaticThought: string;
  evidenceFor?: string;
  evidenceAgainst: string;
  alternativeThought: string;
}

interface FormInputFieldProps {
  name:
    | "situation"
    | "emotion"
    | "automaticThought"
    | "evidenceFor"
    | "evidenceAgainst"
    | "alternativeThought";
  placeholder: string;
  requiredMessage: string;
  register: UseFormRegister<RegisterThoughtInputs>;
  errors: FieldErrors<RegisterThoughtInputs>;
  type: string;
}

const FormInputField = ({
  name,
  placeholder,
  requiredMessage,
  register,
  errors,
  type,
}: FormInputFieldProps) => {
  const error = errors[name]?.message as string | undefined;
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, { required: requiredMessage })}
      />
      {error && <span>{requiredMessage}</span>}
    </div>
  );
};

export const RegisterTought = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterThoughtInputs>();

  const { user } = useAuth();

  const handleRegisterThought = async (formData: RegisterThoughtInputs) => {
    console.log(formData);
    if (!user || user.role !== "client") {
      console.error("Usuário não autenticado ou não é um cliente.");
      return;
    }
    try {
      /* await addDoc(collection(db, "users", user.uid, "thoughts"), {
        ...formData,
        createdAt: serverTimestamp(),
      }); */
      const res = await fetch("/api/registerThought", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({ ...formData }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Erro ao registrar pensamento:", data.error);
      } else {
        console.log("Pensamento registrado com sucesso!");
      }
    } catch (err) {
      console.error("Erro ao registrar pensamento:", err);
    } finally {
      console.log("Função finalizada com sucesso!");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleRegisterThought)}>
        <FormInputField
          name="situation"
          type="text"
          placeholder="Situação"
          requiredMessage="A situação é obrigatória"
          register={register}
          errors={errors}
        />
        <FormInputField
          name="emotion"
          type="text"
          placeholder="Emoção"
          requiredMessage="A emoção é obrigatória"
          register={register}
          errors={errors}
        />
        <FormInputField
          name="automaticThought"
          type="text"
          placeholder="Pensamento automático"
          requiredMessage="O pensamento é obrigatório"
          register={register}
          errors={errors}
        />
        <FormInputField
          name="evidenceFor"
          type="text"
          placeholder="Evidências que apoiam o pensamento"
          requiredMessage="A evidência é obrigatória"
          register={register}
          errors={errors}
        />

        <FormInputField
          name="evidenceAgainst"
          type="text"
          placeholder="Evidências que contrariam o pensamento"
          requiredMessage="A evidência é obrigatória"
          register={register}
          errors={errors}
        />

        <FormInputField
          name="alternativeThought"
          type="text"
          placeholder="Pensamento alternativo"
          requiredMessage="O pensamento alternativo é obrigatório"
          register={register}
          errors={errors}
        />
        <button type="submit">Registrar Pensamento</button>
      </form>
    </div>
  );
};
