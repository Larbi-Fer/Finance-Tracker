import { ChangeEvent, FormEvent, useState } from "react"

export const useForm = <T extends { [key: string]: any }>(
  fields: T,
  onSubmit: (whenFinish: () => void, currentFields: T) => any
) => {
  const [flds, setFlds] = useState<T>(fields)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFlds(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    onSubmit(() => {
      setLoading(false)
      setFlds(fields)
    }, flds)
  }

  return { flds, setFlds, loading, handleChange, handleSubmit }
}
