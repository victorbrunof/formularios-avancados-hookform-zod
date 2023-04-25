import { useState } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { PlusCircle, XCircle } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { Form } from '@/components/Form';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const createUserFormSchema = z.object({
  name: z
    .string()
    .nonempty('O nome é obrigatório')
    .transform((name) => {
      return name
        .trim()
        .split(' ')
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1));
        })
        .join(' ');
    }),
  email: z
    .string()
    .nonempty('O e-mail é obrigatório')
    .email('Formato de e-mail inválido')
    .toLowerCase()
    .refine((email) => {
      return email.endsWith('@gmail.com');
    }, 'O e-mail precisa ser da Google'),
  password: z.string().min(6, 'A senha precisa de no mínimo 6 caracteres'),
  techs: z
    .array(
      z.object({
        title: z.string().nonempty('O título é obrigatório'),
        knowledge: z.coerce.number().min(1).max(100),
      })
    )
    .min(2, 'Insira pelo menos 2 tecnologias'),
  // avatar: z
  //   .instanceof(FileList)
  //   .refine((files) => !!files.item(0), 'A imagem de perfil é obrigatória')
  //   .refine(
  //     (files) => files.item(0)!.size <= MAX_FILE_SIZE,
  //     `Tamanho máximo de 5MB`
  //   )
  //   .refine(
  //     (files) => ACCEPTED_IMAGE_TYPES.includes(files.item(0)!.type),
  //     'Formato de imagem inválido'
  //   )
  //   .transform((files) => {
  //     return files.item(0)!;
  //   }),
});

type CreateUserFormData = z.infer<typeof createUserFormSchema>;

export default function Home() {
  const [output, setOutput] = useState('');

  const createUserForm = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    control,
  } = createUserForm;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'techs',
  });

  async function createUser(data: CreateUserFormData) {
    // await supabase.storage
    //   .from('forms-react')
    //   .upload(data.avatar?.name, data.avatar);

    setOutput(JSON.stringify(data, null, 2));
  }

  function addNewTech() {
    append({
      title: '',
      knowledge: 0,
    });
  }

  const userPassword = watch('password');
  const isPasswordStrong =
    /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(
      userPassword
    );

  return (
    <main className="h-screen bg-zinc-950 text-zinc-300 flex flex-col gap-10 items-center justify-center">
      <FormProvider {...createUserForm}>
        <form
          onSubmit={handleSubmit(createUser)}
          className="flex flex-col gap-4 w-full max-w-xs"
        >
          {/* <Form.Field>
            <Form.Label htmlFor="avatar">Avatar</Form.Label>
            <Form.Input type="file" name="avatar" />
            <Form.ErrorMessage field="avatar" />
          </Form.Field> */}

          <Form.Field>
            <Form.Label htmlFor="name">Nome</Form.Label>
            <Form.Input type="text" name="name" />
            <Form.ErrorMessage field="name" />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="email">E-mail</Form.Label>
            <Form.Input type="email" name="email" />
            <Form.ErrorMessage field="email" />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="password">Senha</Form.Label>

            {isPasswordStrong ? (
              <span className="text-xs text-emerald-600">Senha forte</span>
            ) : (
              <span className="text-xs text-red-600">Senha fraca</span>
            )}
            <Form.Input type="password" name="password" />
            <Form.ErrorMessage field="password" />
          </Form.Field>

          <Form.Field>
            <Form.Label>
              Tecnologias
              <button
                type="button"
                onClick={addNewTech}
                className="text-emerald-500 font-semibold text-xs flex items-center gap-1"
              >
                Adicionar <PlusCircle size={14} />
              </button>
            </Form.Label>
            <Form.ErrorMessage field="techs" />

            {fields.map((field, index) => {
              const fieldName = `techs.${index}.title`;

              return (
                <Form.Field key={field.id}>
                  <div className="flex gap-2">
                    <div className="flex-1 flex flex-col gap-1">
                      <Form.Input
                        className="w-full border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white"
                        type={fieldName}
                        name={fieldName}
                      />
                      <Form.ErrorMessage field={`techs.${index}.title`} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Form.Input
                        className="w-16 border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white"
                        type={`techs.${index}.knowledge`}
                        name={`techs.${index}.knowledge`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                </Form.Field>
              );
            })}
          </Form.Field>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-violet-500 text-white rounded px-3 h-10 font-semibold text-sm hover:bg-violet-600"
          >
            Salvar
          </button>
        </form>
      </FormProvider>

      <pre>{output}</pre>
    </main>
  );
}
