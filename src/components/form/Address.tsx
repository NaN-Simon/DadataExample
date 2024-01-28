import * as z from "zod"
import { useState } from 'react'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { AddressSuggestions, DaDataAddress, DaDataSuggestion } from 'react-dadata';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import 'react-dadata/dist/react-dadata.css';

const formSchema = z.object({
  address: z.string().min(2).max(1000),
})

const Address = () => {
  const [value, setValue] = useState<DaDataSuggestion<DaDataAddress> | undefined>()
  const [changedValue, setChangedValue] = useState('')
  const [step, setStep] = useState(1)
  const key = '2395f8adc307ea077d978592cede9be81665712d'

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
    },
  })

  const handleSelect = (dadata: DaDataSuggestion<DaDataAddress>) => {
    setValue(dadata)
    const result = {
      region_with_type: dadata.data.region_with_type,
      settlement: dadata.data.settlement,
      house: dadata.data.house,
      flat: dadata.data.flat
    }
    const validatedDadata = Object.values(result).filter(value => value !== '' && value !== null && value !== undefined).join(", ")
    setChangedValue(validatedDadata)
    return validatedDadata;
  }

  const onSubmit = (values: { address: string; }) => {
    console.log(values)
    values && setStep(2)
  }

  const addToLocalStorage = () => {
    localStorage.setItem('address', changedValue)
  }

  const removeLocalStorage = () => {
    localStorage.removeItem('address')
  }

  return (
    <>
      {/* step 1 */}
      {step === 1 && <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <AddressSuggestions
                    token={key}
                    {...field}
                    value={value}
                    onChange={(e) => { e && field.onChange(handleSelect(e)) }}
                  />
                </FormControl>
                <FormDescription>
                  This is your address.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">to Step 2</Button>
        </form>
      </Form>}

      {/* 2 step */}
      {step === 2 && (
        <div className="flex flex-col justify-center items-center gap-y-2">
          <pre>{changedValue && JSON.stringify(changedValue, null, 2)}</pre>
          <div className="flex gap-x-2">
            <Button onClick={() => {
              setStep(1)
            }}
            >
              to Step 1
            </Button>
            <Button onClick={() => {
              addToLocalStorage()
              setStep(3)
            }}
            >
              to Step 3
            </Button>
          </div>
        </div>
      )}

      {/* 3 step */}
      {step === 3 && (
        <div className="flex flex-col justify-center items-center gap-y-2">
          <p>LocalStorage was updated.</p>
          <div className="flex gap-x-2">
            <Button onClick={() => {
              setStep(2)
            }}>to Step 2</Button>
            <Button onClick={() => {
              removeLocalStorage()
              setStep(1)
            }}>Reset</Button>
          </div>
        </div>
      )}

    </>
  )
}

export default Address
