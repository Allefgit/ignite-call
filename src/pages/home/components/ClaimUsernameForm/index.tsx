import { TextInput, Button, Text } from '@ignite-ui/react'
import { Form, FormAnnotation } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/router'

const claimUserNameSchema = z.object({
  userName: z
    .string()
    .min(3, { message: 'Mínimo de 3 letras.' })
    .regex(/^([a-z\\-]+)$/i, { message: 'Somente letras e hifens' })
    .transform((userName) => userName.toLocaleLowerCase()),
})

type ClaimUserNameFormData = z.infer<typeof claimUserNameSchema>

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimUserNameFormData>({
    resolver: zodResolver(claimUserNameSchema),
  })

  const router = useRouter()

  async function handleClaimUserName(data: ClaimUserNameFormData) {
    const { userName } = data

    await router.push(`/register?userName=${userName}`)
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUserName)}>
        <TextInput
          size="sm"
          prefix="ignite.com/"
          placeholder="seu-usuário"
          {...register('userName')}
        />
        <Button size="sm" type="submit">
          Reservar Usuário
          <ArrowRight />
        </Button>
      </Form>
      <FormAnnotation>
        <Text size="sm">
          {errors.userName
            ? errors.userName?.message
            : 'Escolha seu username preferido!'}
        </Text>
      </FormAnnotation>
    </>
  )
}
