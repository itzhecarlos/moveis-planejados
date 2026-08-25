import { z } from "zod";

const documentTypeSchema = z.enum(["cpf", "cnpj"]);

const customerFiscalProfileBaseSchema = z.object({
  fullName: z.string().min(3, "Informe o nome completo."),
  email: z.string().email("Informe um e-mail válido."),
  phone: z.string().min(10, "Informe um telefone válido."),
  documentType: documentTypeSchema,
  documentNumber: z.string().min(11, "Informe CPF ou CNPJ."),
  isCompany: z.boolean(),
  legalName: z.string().optional(),
  tradeName: z.string().optional(),
  stateRegistration: z.string().optional(),
  municipalRegistration: z.string().optional(),
  postalCode: z.string().min(8, "Informe o CEP."),
  street: z.string().min(3, "Informe a rua."),
  number: z.string().min(1, "Informe o número."),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Informe o bairro."),
  city: z.string().min(2, "Informe a cidade."),
  state: z.string().min(2, "Informe a UF.").max(2, "Use apenas a UF."),
  notes: z.string().optional(),
  fiscalConsent: z.boolean().refine((value) => value, "Confirme o uso dos dados para emissão fiscal.")
});

export const customerFiscalProfileSchema = customerFiscalProfileBaseSchema.superRefine(validateFiscalProfile);

export const customerSignUpSchema = customerFiscalProfileBaseSchema
  .extend({
    password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres.")
  })
  .superRefine(validateFiscalProfile);

export const customerSignInSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe a senha.")
});

export type CustomerFiscalProfileInput = z.infer<typeof customerFiscalProfileSchema>;
export type CustomerSignInInput = z.infer<typeof customerSignInSchema>;
export type CustomerSignUpInput = z.infer<typeof customerSignUpSchema>;

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function validateFiscalProfile(
  value: z.infer<typeof customerFiscalProfileBaseSchema>,
  ctx: z.RefinementCtx
) {
  const digits = onlyDigits(value.documentNumber);

  if (value.documentType === "cpf" && digits.length !== 11) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["documentNumber"],
      message: "CPF deve ter 11 dígitos."
    });
  }

  if (value.documentType === "cnpj" && digits.length !== 14) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["documentNumber"],
      message: "CNPJ deve ter 14 dígitos."
    });
  }

  if (value.documentType === "cnpj" && !value.legalName?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["legalName"],
      message: "Informe a razão social para CNPJ."
    });
  }
}
