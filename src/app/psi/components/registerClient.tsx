import { sendPasswordResetEmail } from "firebase/auth";
import { useForm } from "react-hook-form";
import { auth } from "../../../../firebase";
import { useAuth } from "@/Contexts/AuthContext";

interface RegisterClientInputs {
  email: string;
  firstName: string;
  lastName: string;
}

export const RegisterClient = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterClientInputs>();

  const { user } = useAuth();

  const handleRegisterClient = async (formData: RegisterClientInputs) => {
    const token = await auth.currentUser?.getIdToken();
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
        nameResponsible: user?.firstName + " " + user?.lastName
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Cliente registrado com sucesso!");
      await sendPasswordResetEmail(auth, formData.email);
    } else {
      alert(`Erro ao registrar profissional: ${data.error}`);
    }
  };

  return (
    <div>
      <h1>Registrar novo Cliente</h1>
      <form onSubmit={handleSubmit(handleRegisterClient)}>
        <input
          type="email"
          placeholder="email"
          {...register("email", { required: "Digite o email" })}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input
          type="text"
          placeholder="nome"
          {...register("firstName", { required: "Digite o nome" })}
        />
        {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}

        <input
          type="text"
          placeholder="sobrenome"
          {...register("lastName", { required: "Digite o sobrenome" })}
        />
        {errors.lastName && (
          <p className="text-red-500">{errors.lastName.message}</p>
        )}

        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};
