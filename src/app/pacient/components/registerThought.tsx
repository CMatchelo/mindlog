import { useAuth } from "@/Contexts/AuthContext";
import { useForm, UseFormRegister, FieldErrors } from "react-hook-form";
import { auth } from "../../../../firebase";
import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@/utils/icons";
import { Button } from "@/components/Button";
import LoadingScreen from "@/components/LoadingScreen";
import { PopupMessage } from "@/components/PopupMessage";

interface RegisterThoughtInputs {
  situation: string;
  emotion?: string;
  automaticThought?: string;
  evidenceFor?: string;
  evidenceAgainst?: string;
  alternativeThought?: string;
}

const questionTitles: Record<keyof RegisterThoughtInputs, string> = {
  situation: "Situação",
  emotion: "Emoção",
  automaticThought: "Pensamento automático",
  evidenceFor: "Evidências a favor",
  evidenceAgainst: "Evidências contrárias",
  alternativeThought: "Pensamento alternativo",
};

interface FormInputFieldProps {
  title?: string;
  name:
    | "situation"
    | "emotion"
    | "automaticThought"
    | "evidenceFor"
    | "evidenceAgainst"
    | "alternativeThought";
  placeholder: string;
  requiredMessage?: string;
  required?: boolean;
  register: UseFormRegister<RegisterThoughtInputs>;
  errors: FieldErrors<RegisterThoughtInputs>;
}

const FormInputField = ({
  title,
  name,
  placeholder,
  requiredMessage,
  required,
  register,
  errors,
}: FormInputFieldProps) => {
  const error = errors[name]?.message as string | undefined;
  return (
    <div className="w-full flex-shrink-0 flex flex-col items-center justify-center">
      <div className="flex flex-col w-[100%] sm:w-1/2">
        <span className="self-start px-3 text-md font-bold w-11/12">
          {title}
        </span>
        <textarea
          className="bg-secondary1 resize-none border-primary1 border-2
        m-1 p-1 h-20 
        rounded-md"
          placeholder={placeholder}
          {...register(name, required ? { required: requiredMessage } : {})}
        />
        {error && <span className="text-red-500">{requiredMessage}</span>}
      </div>
    </div>
  );
};

export const RegisterTought = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset 
  } = useForm<RegisterThoughtInputs>();

  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [savingThought, setSavingThought] = useState(false);
  const [displayPopup, setDisplayPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState<string>("Pensamento salvo com sucesso")

  const handleRegisterThought = async (formData: RegisterThoughtInputs) => {
    setSavingThought(true);
    if (!user || user.role !== "client") {
      console.error("Usuário não autenticado ou não é um cliente.");
      setSavingThought(false);
      return;
    }
    try {
      const res = await fetch("/api/registerThought", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({ ...formData }),
      });

      await res.json();

      if (!res.ok) {
        setPopupMsg("Erro ao registrar pensamento. Tente novamente")
      } else {
        setStep(1);
        reset();
        setPopupMsg("Pensamento registrado com sucesso")
      }
    } catch (err) {
      console.error("Erro ao registrar pensamento:", err);
      setPopupMsg("Erro ao registrar pensamento. Tente novamente")
    } finally {
      setSavingThought(false);
      setDisplayPopup(true);
    }
  };

  const nextStep = () => {
    if (step >= 7) return;

    const currentValues = getValues();
    const currentField = Object.keys(currentValues)[step - 1];
    const currentValue =
      currentValues[currentField as keyof typeof currentValues];

    if (currentField === "situation") {
      if (!currentValue || currentValue.trim() === "") {
        return;
      }
    }

    setStep((prev) => prev + 1);
  };

  const previousStep = () => {
    if (step <= 1) return;
    setStep((prev) => prev - 1);
  };

  if (savingThought) {
    return (
      <LoadingScreen />
    );
  }

  if (displayPopup) {
    return (
      <PopupMessage message={popupMsg} onClose={() => setDisplayPopup(false)} />
    );
  }

  return (
    <div className="bg-secondary2 my-2 p-2 rounded-md shadow-lg flex flex-col">
      <h1 className="self-center text-md sm:text-2xl font-bold mb-2 text-primary1">
        Registrar novo pensamento
      </h1>
      <form
        onSubmit={handleSubmit(handleRegisterThought)}
        className="w-full overflow-hidden relative flex flex-col
        translatey-100 transition-transform duration-500"
      >
        <div
          className={`flex transition-transform duration-500 ${
            step > 6 ? "hidden" : ""
          }`}
          style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
        >
          <FormInputField
            name="situation"
            placeholder="Ex: Meu chefe gritou comigo"
            title="Situação *"
            required={true}
            requiredMessage="A situação é obrigatória"
            register={register}
            errors={errors}
          />
          <FormInputField
            name="emotion"
            placeholder="Ex: Ansiedade, tristeza, raiva..."
            title="Emoção"
            required={false}
            register={register}
            errors={errors}
          />
          <FormInputField
            name="automaticThought"
            placeholder="Ex: Eu estou errado. Por isso ele gritou"
            title="Pensamento automático"
            required={false}
            register={register}
            errors={errors}
          />
          <FormInputField
            name="evidenceFor"
            placeholder="Quais evidências apoiam esse pensamento?"
            title="Evidências a favor"
            required={false}
            register={register}
            errors={errors}
          />

          <FormInputField
            name="evidenceAgainst"
            placeholder="Quais evidências contradizem esse pensamento?"
            title="Evidências contrárias"
            required={false}
            register={register}
            errors={errors}
          />

          <FormInputField
            name="alternativeThought"
            placeholder="Qual seria um pensamento alternativo?"
            title="Pensamento alternativo"
            required={false}
            register={register}
            errors={errors}
          />
        </div>
        {step >= 7 && (
          <div className="self-center w-[100%] sm:max-w-1/2">
            {Object.entries(getValues()).map(([key, value]) => {
              const title =
                questionTitles[key as keyof RegisterThoughtInputs] || key;
              return (
                <div key={key} className="mb-2 flex flex-col">
                  <span className="font-semibold">{title}</span>
                  <span className="ml-2">{value || "-"}</span>
                </div>
              );
            })}
          </div>
        )}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={previousStep}
            className="border-1 border-primary1 rounded-md p-1 m-1 shadow-lg cursor-pointer"
          >
            <ArrowLeftIcon size={30} />
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="border-1 border-primary1 rounded-md p-1 m-1 shadow-lg cursor-pointer"
          >
            <ArrowRightIcon size={30} />
          </button>
        </div>
        {step >= 7 && (
          <div className="flex justify-center">
            <Button type="submit" classname="m-3">
              Registrar Pensamento
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
