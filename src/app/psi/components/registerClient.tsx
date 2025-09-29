import { sendPasswordResetEmail } from "firebase/auth";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { auth } from "../../../../firebase";
import { useAuth } from "@/Contexts/AuthContext";
import { Button } from "@/components/Button";
import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { PopupMessage } from "@/components/PopupMessage";

interface RegisterClientInputs {
  email: string;
  firstName: string;
  lastName: string;
}

interface InputFormProps {
  type: string;
  title: string;
  placeholder: string;
  register: UseFormRegister<RegisterClientInputs>;
  errors: FieldErrors<RegisterClientInputs>;
  name: "firstName" | "lastName" | "email";
}

const InputForm = ({
  type,
  title,
  placeholder,
  register,
  errors,
  name,
}: InputFormProps) => {
  const error = errors[name]?.message as string | undefined;
  return (
    <div className="flex flex-col w-full gap-1">
      <label className="text-md font-bold">{title}</label>
      <input
        className="bg-secondary1 p-1 rounded-sm border-1 boder"
        type={type}
        placeholder={placeholder}
        {...register(name, { required: "Campo obrigatório" })}
      />
      {error && <p className="text-red-500">Campo obrigatório</p>}
    </div>
  );
};

export const RegisterClient = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterClientInputs>();

  const { user } = useAuth();
  const [checking, setChecking] = useState(false);
  const [displayPopup, setDisplayPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState<string>(
    "Cliente cadastrado com sucesso. Ele receberá um email pedindo para finalizar a criação da conta."
  );

  const handleRegisterClient = async (formData: RegisterClientInputs) => {
    setChecking(true);
    const token = await auth.currentUser?.getIdToken();
    if (!user || user.role !== "professional") {
      setChecking(false);
      return;
    }
    const res = await fetch("api/registerClient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        nameResponsible: `${user.firstName} ${user.lastName}`,
        crpResponsible: user?.crp,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      const actionCodeSettings = {
        url: "http://localhost:3000/resetPassword",
        handleCodeInApp: false,
      };
      await sendPasswordResetEmail(auth, formData.email, actionCodeSettings);
      setPopupMsg("Cliente cadastrado com sucesso. Ele receberá um email pedindo para finalizar a criação da conta.")
      setDisplayPopup(true)
      setChecking(false);
    } else {
      setPopupMsg("Erro ao registrar cliente. Tente novamente mais tarde")
      setDisplayPopup(true)
      alert(`Erro ao registrar profissional: ${data.error}`);
      setChecking(false);
    }
  };

  return (
    <div className="bg-secondary2 p-4 rounded-md shadow-md space-y-3 sm:space-y-2">
      {checking && <LoadingScreen />}
      {displayPopup && <PopupMessage message={popupMsg} onClose={() => setDisplayPopup(false)} />}
      <h1 className="text-lg font-bold">Novo Paciente</h1>
      <form
        className="flex flex-col sm:flex-row items-start justify-around gap-5"
        onSubmit={handleSubmit(handleRegisterClient)}
      >
        <InputForm
          name="email"
          type="email"
          title="Email"
          placeholder="email@exemplo.com"
          register={register}
          errors={errors}
        />
        <InputForm
          name="firstName"
          type="text"
          title="Nome"
          placeholder="Nome do paciente"
          register={register}
          errors={errors}
        />
        <InputForm
          name="lastName"
          type="text"
          title="Sobrenome"
          placeholder="Sobrenome do paciente"
          register={register}
          errors={errors}
        />

        <Button classname="self-end" type="submit">
          Registrar
        </Button>
      </form>
    </div>
  );
};
