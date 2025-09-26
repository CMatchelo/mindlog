import { sendPasswordResetEmail } from "firebase/auth";
import { useForm } from "react-hook-form";
import { auth } from "../../../../firebase";

interface RegisterPsiInputs {
  email: string;
  firstName: string;
  lastName: string;
}

export const RegisterPsi = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPsiInputs>();

  const handleRegisterProfessional = async (formData: RegisterPsiInputs) => {
    const token = await auth.currentUser?.getIdToken();
    const res = await fetch("api/registerProfessional", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName}),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Profissional registrado com sucesso!");
      const actionCodeSettings = {
        url: "http://localhost:3000/resetPassword",
        handleCodeInApp: false,
      };
      await sendPasswordResetEmail(auth, formData.email, actionCodeSettings);
    } else {
      alert(`Erro ao registrar profissional: ${data.error}`);
    }
  };

  return (
    <div>
      <h1>Registrar novo psicologo</h1>
      <form onSubmit={handleSubmit(handleRegisterProfessional)}>
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
