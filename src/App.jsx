import { useEffect, useState } from "react"
import { FormProvider, useFieldArray, useForm, Controller } from "react-hook-form"
import { Input } from '@/components/Input'
import { Upload } from '@/components/Upload'
import { getBillData } from '@/services'
import { nanoid } from "nanoid"
import { Header } from '@/components/Header'
import { Button } from "@/components/Button"
import { Select } from "@/components/Select"
import { Loader } from "@/components/Loader"
import { Modal } from "@/components/Modal"
import { AccordionStep } from "@/components/Accordion"
import { Icon } from "@/components/Icons"
import { Tooltip } from 'react-tooltip'
import './App.css'

const CURRENCY_FORMATS = [
  { value: 'CLP', label: 'CLP' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
]

function calculateTotalOwed(assignments, friends, items) {
  const totalOwed = {}

  friends.forEach(friend => {
    totalOwed[friend.id] = 0
  })

  for (let itemId in assignments) {
    const itemAssignment = assignments[itemId]
    const item = items.find(item => item.id === itemId)

    for (let friendId in itemAssignment) {
      const quantity = parseFloat(itemAssignment[friendId])
      const totalCost = item.price * quantity
      totalOwed[friendId] += totalCost
    }
  }

  const result = friends.map(friend => {
    return {
      name: friend.name,
      totalOwed: totalOwed[friend.id]
    }
  })

  return result
}

function App() {
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessed, setIsProcessed] = useState(false)
  const [friends, setFriends] = useState([])
  const [assignments, setAssignments] = useState({})
  const [items, setItems] = useState([
    {
      "id": "1",
      "name": "Copa Errazuriz",
      "quantity": 4,
      "price": 4490
    },
    {
      "id": "2",
      "name": "Mestra lager pils",
      "quantity": 4,
      "price": 5490
    },
    {
      "id": "3",
      "name": "Pizza Mona Lisa",
      "quantity": 1,
      "price": 14990
    },
    {
      "id": "4",
      "name": "Salmon el salmon",
      "quantity": 1,
      "price": 9990
    },
    {
      "id": "5",
      "name": "El Republicano TD",
      "quantity": 1,
      "price": 5490
    }
  ])

  console.log({ assignments })

  return (
    <main className="flex flex-col items-center min-h-screen px-4 py-8 sm:px-6 lg:px-8 gap-2.5 dark:bg-slate-900 min-w-full">
      <Header />
      {step === 0 ?
        <div className="w-full mx-auto">
          <h2 className="text-xl break-words">
            ¿Cometiste el <span className="text-green-500">grave error</span> de pagar la <span className="text-green-500">cuenta entera</span> en una salida con tus amigos y ahora debes cobrarles?
          </h2>
          <h2 className="text-xl break-words mt-2">
            Te ayudamos a repartir la cuenta, recuperar tu dinero y mantener tus amistades.
          </h2>
          <div className="mt-12">
            <Button type="outline" onClick={() => setStep(1)}>
              Empezar
            </Button>
          </div>
        </div>
        : <div className="w-full mx-auto">
          <AccordionStep
            step={1}
            currentStep={step}
            setStep={setStep}
            title="Sube la imagen de la cuenta"
          >
            <UploadSection
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              isProcessed={isProcessed}
              setIsProcessed={setIsProcessed}
              setItems={setItems}
              setStep={setStep}
            />
          </AccordionStep>
          <AccordionStep
            step={2}
            currentStep={step}
            setStep={setStep}
            title="Verifica los ítems y asignalos a tus amigos"
            disabled={isLoading || items.length === 0}
          >
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-4'>
                <FriendsSection
                  friends={friends}
                  setFriends={setFriends}
                />
              </div>
              <div className='col-span-8'>
                <ItemsSection
                  items={items}
                  setItems={setItems}
                  isLoading={isLoading}
                  friends={friends}
                  setAssignments={setAssignments}
                  assignments={assignments}
                  isProcessed={isProcessed}
                />
              </div>
            </div>
          </AccordionStep>
          <AccordionStep
            step={3}
            currentStep={step}
            setStep={setStep}
            title="Enviar a tus amigos"
            disabled={isLoading || items.length === 0 || friends.length === 0}
          >
            <SendMessageSection
              friends={friends}
              setFriends={setFriends}
              items={items}
              assignments={assignments}
            />
          </AccordionStep>
        </div>}
    </main>
  )
}

const UploadSection = (props) => {
  const { isLoading, setIsLoading, setItems, isProcessed, setIsProcessed, setStep } = props
  const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY || ''
  console.log({ openAIApiKey })
  const methods = useForm({
    defaultValues: {
      apiKey: openAIApiKey
    },
  })
  const { register, handleSubmit, formState: { errors }, watch, reset } = methods
  const file = watch('imageUpload')

  const onSubmit = async (data) => {
    setIsLoading(true)
    const response = await getBillData(data.apiKey, file, data.currency)
    setIsLoading(false)
    setItems(response?.items || [])
    setIsProcessed(true)
    setStep(2)
    reset()
  }

  const handleProcessAgain = () => {
    setIsProcessed(false)
    reset()
  }

  return (
    <div>
      {isLoading ?
        <div className="flex flex-col min-h-80 justify-center items-center">
          <Loader />
        </div>
        : isProcessed ?
          <div className='flex flex-col p-2.5 rounded-lg'>
            <Button
              onClick={handleProcessAgain}
              disabled={isLoading}
            >
              Nueva cuenta
            </Button>
          </div> :
          <FormProvider {...methods}>
            <div className='flex flex-col p-5 gap-5 rounded-lg'>
              <div className="flex w-full gap-10 mb-4">
                <Input
                  label="Clave de OpenAI"
                  type="password"
                  placeholder="OpenAI API Key"
                  error={errors.apiKey}
                  {...register('apiKey', { required: true })}
                />
                <Select
                  label="Moneda"
                  options={CURRENCY_FORMATS}
                  error={errors.currency}
                  {...register('currency', { required: true })}
                />
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <Upload name="imageUpload" />
              </div>
              <div className="text-center">
                <Button onClick={handleSubmit(onSubmit)} disabled={isLoading}>
                  Procesar imagen
                </Button>
              </div>
            </div>
          </FormProvider>
      }
    </div>
  )
}

const ItemsSection = (props) => {
  const { items, setItems, isLoading, friends, setAssignments, assignments, } = props
  const [itemPrice, setItemPrice] = useState(0)
  const [editingPlanId, setEditingPlanId] = useState(null)
  const [selectedItem, setselectedItem] = useState({})

  const handleEditPlan = (itemId) => {
    setEditingPlanId(itemId)
    setItemPrice(items.find((item) => item.id === itemId).price)
  }

  const handlePriceOnChange = (e) => {
    setItemPrice(e.target.value)
  }

  const handleOnKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSavePrice()
    }
  }

  const handleSavePrice = () => {
    const price = Number(itemPrice)
    if (isNaN(price)) {
      alert('Ingrese un precio válido')
      return
    }

    setItems((prevItems) => prevItems.map((item) => {
      if (item.id === editingPlanId) {
        return { ...item, price }
      }
      return item
    }))

    setEditingPlanId(null)
  }

  const handleAssignItem = (item) => {
    setselectedItem(item)
  }

  const handleCloseAssignItem = () => {
    setselectedItem({})
  }

  return (
    <>
      <div className='flex flex-col'>
        {items?.length > 0 && (
          <>
            <div className="grid grid-cols-12 gap-2 dark:bg-slate-800 p-2">
              <div className="text-left font-bold col-span-3">Nombre</div>
              <div className="font-bold col-span-2">Cantidad</div>
              <div className="font-bold col-span-3">Precio</div>
              <div className="font-bold col-span-2">Total</div>
              <div className="font-bold col-span-2">Asignar</div>
            </div>
            <div className="flex flex-col">
              {items.map((item, index) => (
                <div key={index} className={`grid grid-cols-12 gap-2 border-t border-gray-700 p-2 rounded-sm ${assignments[item.id] ? 'bg-slate-900' : ''}`}>
                  <div
                    className="text-left text-xs flex items-center col-span-3">
                    {item.name}
                  </div>
                  <div className="flex items-center justify-center text-xs col-span-2">
                    {item.quantity}
                  </div>
                  <div
                    onClick={() => handleEditPlan(item.id)}
                    className="flex items-center justify-center text-xs col-span-3">
                    {editingPlanId === item.id ?
                      <Input
                        value={itemPrice}
                        onChange={(e) => handlePriceOnChange(e)}
                        onKeyPress={(e) => handleOnKeyPress(e)}
                        onBlur={(e) => handleSavePrice(item.id, e.target.value)}
                        placeholder="Precio"
                      /> :
                      <span
                        data-tooltip-id="edit-price"
                        data-tooltip-content="Editar Precio"
                        className="flex items-center justify-center text-xs hover:bg-green-500 dark:hover:bg-slate-800 p-1 cursor-pointer rounded-sm"
                      >
                        <span>
                          {item.price}
                        </span>
                        <Icon type="pen" className="ml-2 h-3 w-3 fill-green-400 dark:fill-white" />
                        <Tooltip id="edit-price" />
                      </span>
                    }
                  </div>
                  <div className="flex items-center justify-center text-xs col-span-2">
                    {item.quantity * item.price}
                  </div>
                  <div
                    className="flex items-center justify-center text-xs cursor-pointer col-span-2 hover:bg-green-500 dark:hover:bg-slate-800 rounded-sm"
                    onClick={() => handleAssignItem(item)}
                  >
                    <span data-tooltip-id="assign-item" data-tooltip-content="Asignar a tus amigos" className="flex items-center justify-center text-xs p-1 cursor-pointer rounded-sm">
                      <Icon type="editUser" color="white" className="fill-green-400 dark:fill-white" />
                    </span>
                    <Tooltip id="assign-item" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <Modal
        isOpen={selectedItem.id}
        setIsOpen={setEditingPlanId}
        onClose={handleCloseAssignItem}
      >
        {friends.length > 0 ? (
          <AssignmentsSection
            assignments={assignments}
            setAssignments={setAssignments}
            items={items}
            friends={friends}
            item={selectedItem}
            handleCloseAssignItem={handleCloseAssignItem}
          />
        ) : (
          <div className="flex flex-col gap-2 mt-4 items-center justify-center">
            <h2 className="text-center text-2xl mb-6">
              Debes agregar amigos antes de asignar un ítem
            </h2>
            <div className="max-w-lg">
              <Button onClick={handleCloseAssignItem}>
                Cerrar
              </Button>
            </div>
          </div >
        )}
      </Modal >
    </>
  )
}

const FriendsSection = ({ friends, setFriends }) => {
  const { register, control, getValues, formState: { errors } } = useForm({
    defaultValues: {
      friends: friends,
      newFriends: []
    }
  })

  const { fields: newFriends, append, remove } = useFieldArray({
    control,
    name: 'newFriends'
  })

  const handleAddNewFriend = () => {
    append({ id: nanoid(), name: '' })
  }

  const handleSaveNewFriend = (index, id) => {
    const newFriend = getValues(`newFriends.${index}.name`)
    if (!newFriend) {
      return
    }

    remove(index)
    setFriends([...friends, { name: newFriend, id: id }])
  }

  const handleDiscardNewFriend = (index) => {
    remove(index)
  }

  return (
    <div>
      <div className="flex gap-2 w-full">
        <Button type="outline" onClick={handleAddNewFriend}>
          <div className="flex items-center justify-center gap-2">
            <span>Agregar Amigos</span>
            <Icon type="addUser" className="fill-green-500 hover:fill-white" />
          </div>
        </Button>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        {newFriends.map((friend, index) => (
          <div className="grid grid-cols-12 gap-2 w-full" key={friend.id}>
            <div className="col-span-8">
              <Input
                type="text"
                {...register(`newFriends.${index}.name`, { required: true })}
                placeholder="Nombre"
              />
            </div>
            <div className="col-span-2">
              <button
                className="bg-green-900 dark:bg-slate-800 hover:bg-slate-700 text-white rounded-md p-2 cursor-pointer"
                onClick={() => handleDiscardNewFriend(index)}>
                <Icon type="close" className="w-3 h-3 stroke-white" />
              </button>
            </div>
            <div className="col-span-2">
              <button
                className="bg-green-900 dark:bg-slate-800 hover:bg-slate-700 text-white rounded-md p-2 cursor-pointer disabled:bg-slate-700 disabled:cursor-not-allowed"
                onClick={() => handleSaveNewFriend(index, friend.id)}
              >
                <Icon type="check" className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {friends.length > 0 && (
        <div className="flex flex-col gap-2 mt-4">
          <h3>Amigos</h3>
          {friends.map(friend => (
            <div className="flex gap-2 items-center justify-center w-full bg-green-300 dark:bg-slate-900 rounded-md p-2" key={friend.id}>
              <p>{friend.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const AssignmentsSection = (props) => {
  const { assignments, setAssignments, item, friends, handleCloseAssignItem } = props
  const [error, setError] = useState(null)

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      assignments: friends.reduce((acc, friend) => {
        acc[friend.id] = assignments[item.id]?.[friend.id] || 0
        return acc
      }, {}),
    },
  })

  useEffect(() => {
    reset({
      assignments: friends.reduce((acc, friend) => {
        acc[friend.id] = assignments[item.id]?.[friend.id] || 0
        return acc
      }, {}),
    })
  }, [item, friends, reset, assignments])

  const onSubmit = (data) => {
    const totalAssignments = Object.values(data.assignments).reduce((acc, qty) => acc + parseFloat(qty || 0), 0)

    if (totalAssignments !== item.quantity) {
      setError('El total de asignaciones debe ser igual al número de ítems')
      return
    }
    setAssignments({
      ...assignments,
      [item.id]: data.assignments
    })
    setError(null)
    handleCloseAssignItem()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 items-center justify-center"
    >
      <h2 className="text-2xl mb-6">Asignar a amigos</h2>
      <div className="grid grid-cols-3 bg-green-100 dark:bg-slate-900 p-2.5 rounded-md w-full">
        <div className="text-left font-bold">Ítem</div>
        <div className="font-bold">Cantidad</div>
        <div className="font-bold">Precio</div>
        <div className="font-medium text-gray-900 dark:text-white text-lg text-left">{item?.name}</div>
        <div className="font-medium text-gray-900 dark:text-white text-lg">{item?.quantity}</div>
        <div className="font-medium text-gray-900 dark:text-white text-lg">{item?.price * item?.quantity}</div>
      </div>
      <div className="flex flex-col bg-green-100 dark:bg-slate-900 p-2.5 rounded-md w-full">
        <div className="flex justify-between items-center gap-2 p-2 rounded-sm font-bold">
          <div>Nombre</div>
          <div>Cantidad</div>
        </div>
        {friends.map((friend, index) => (
          <div key={index} className="flex justify-between items-center gap-2 p-2 rounded-sm">
            <div className="text-left">{friend.name}</div>
            <div>
              <Controller
                control={control}
                name={`assignments.${friend.id}`}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="0">0</option>
                    {[0.5, ...Array.from({ length: item.quantity }, (_, i) => i + 1)].map((qty) => (
                      <option key={qty} value={qty}>
                        {qty}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
          </div>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        Asignar
      </button>
    </form>
  )
}

const SendMessageSection = (props) => {
  const { friends, items, assignments, currency } = props
  const [totals, setTotals] = useState([
    {
      "name": "JC",
      "totalOwed": 38435
    },
    {
      "name": "Toño",
      "totalOwed": 16475
    }
  ])
  const { control, getValues } = useForm()

  useEffect(() => {
    const totalOwed = calculateTotalOwed(assignments, friends, items)

    setTotals(totalOwed)
  }, [assignments, items, friends])

  const sendWhatsAppMessage = (friend) => {
    const phoneNumbers = getValues(`phoneNumbers.${friend.id}`);
    const phoneNumber = phoneNumbers;
    if (phoneNumber) {
      const message = `Hola! ${friend.name}, me debes un total de ${friend.totalOwed} ${currency} para el pago de tus ítems. Si tienes alguna duda, no dudes en contactarme.`;
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <form>
      <div className="col-span-2">
        <div className="flex flex-col dark:bg-slate-800 p-5 rounded-lg min-h-96">
          <div className="flex flex-col dark:bg-slate-800 rounded-lg min-h-96">
            {totals?.map((friend, index) => (
              <div key={index} className="grid grid-cols-6 gap-2 border-b border-green-500 dark:border-gray-700 p-2 rounded-sm">
                <div className="flex items-center justify-center text-left col-span-1 text-lg">{friend.name}</div>
                <div className="flex items-center justify-center text-lg col-span-1">{friend.totalOwed || 0}</div>
                <div className="flex items-center col-span-4">
                  <Controller
                    name={`phoneNumbers.${friend.name}`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <input
                        type="tel"
                        placeholder="Teléfono"
                        className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-slate-900 dark:border-slate-800 dark:placeholder-slate-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                        {...field}
                      />
                    )}
                  />
                  <button
                    type="button"
                    className="ml-2 btn btn-primary bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
                    onClick={() => sendWhatsAppMessage(friend)}
                  >
                    Enviar por WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}

export default App