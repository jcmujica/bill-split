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
import closeSvg from '@/assets/close.svg'
import checkSvg from '@/assets/check.svg'
import userEditSvg from '@/assets/userEdit.svg'
import userAddSvg from '@/assets/userAdd.svg'
import './App.css'

const CURRENCY_FORMATS = [
  { value: 'CLP', label: 'CLP' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
]

function App() {
  const [step, setStep] = useState(1)
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
    <main className="flex flex-col items-center min-h-screen px-4 py-8 sm:px-6 lg:px-8 gap-2.5 bg-slate-900 min-w-full">
      <Header />
      <div className="w-full mx-auto">
        <AccordionStep
          step={1}
          currentStep={step}
          setStep={setStep}
          title="1. Sube la imagen de la cuenta"
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
          title="2. Verifica los ítems y asignalos a tus amigos"
        >
          <div className='grid grid-cols-12 gap-4'>
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
            <div className='col-span-4'>
              <FriendsSection
                friends={friends}
                setFriends={setFriends}
              />
            </div>
          </div>
        </AccordionStep>
        <AccordionStep
          step={3}
          currentStep={step}
          setStep={setStep}
          title="3. Enviar a tus amigos"
        >
          <SendEmailsSection
            friends={friends}
            setFriends={setFriends}
            items={items}
            assignments={assignments}
          />
        </AccordionStep>
      </div>
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
      {isProcessed ?
        <div className='flex flex-col p-2.5 rounded-lg'>
          <Button
            onClick={handleProcessAgain}
            disabled={isLoading}
          >
            Nueva cuenta
          </Button>
        </div> :
        <FormProvider {...methods}>
          <div className='flex flex-col p-5 gap-2 rounded-lg'>
            <div className="flex w-full gap-4 mb-4">
              <Input
                label="OpenAI API Key"
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
            <Button onClick={handleSubmit(onSubmit)} disabled={isLoading}>
              Siguiente
            </Button>
          </div>
        </FormProvider>}
    </div>
  )
}

const ItemsSection = (props) => {
  const { items, setItems, isLoading, friends, setAssignments, assignments, } = props
  const [itemPrice, setItemPrice] = useState(0)
  const [editingPlanId, setEditingPlanId] = useState(null)
  const [selectedItem, setselectedItem] = useState({})
  const [totals, setTotals] = useState({})

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
    if (isNaN(itemPrice)) {
      alert('Please enter a valid price')
      return
    }

    setItems((prevItems) => prevItems.map((item) => {
      if (item.id === editingPlanId) {
        return { ...item, itemPrice }
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

  // const calculateTotals = () => {
  //   const totals = friends.reduce((acc, friend) => {
  //     acc[friend.id] = 0
  //     return acc
  //   }, {})

  //   items.forEach((item) => {
  //     const assignedFriendId = assignments[item.id]
  //     if (assignedFriendId) {
  //       totals[assignedFriendId] += item.price * item.quantity
  //     }
  //   })

  //   return totals
  // }

  // useEffect(() => {
  //   setTotals(calculateTotals())
  // }, [assignments, items])

  return (
    <>
      <div className='flex flex-col'>
        {isLoading ?
          <div className="flex flex-col min-h-80 justify-center items-center">
            <Loader />
          </div>
          :
          items?.length > 0 && (
            <>
              <div className="grid grid-cols-5 gap-2 bg-slate-900 p-2 rounded-md">
                <div className="text-left font-bold">Nombre</div>
                <div className="font-bold">Cantidad</div>
                <div className="font-bold">Precio</div>
                <div className="font-bold">Total</div>
                <div className="font-bold">Asignar</div>
              </div>
              <div className="flex flex-col gap-2">
                {items.map((item, index) => (
                  <div key={index} className={`grid grid-cols-5 gap-2 border-t border-gray-700 p-2 rounded-sm ${assignments[item.id] ? 'bg-slate-900' : ''}`}>
                    <div
                      className="text-left text-xs flex items-center ">
                      {item.name}
                    </div>
                    <div className="flex items-center justify-center text-xs">
                      {item.quantity}
                    </div>
                    <div
                      onClick={() => handleEditPlan(item.id)}
                      className="flex items-center justify-center text-xs">
                      {editingPlanId === item.id ?
                        <Input
                          value={itemPrice}
                          onChange={(e) => handlePriceOnChange(e)}
                          onKeyPress={(e) => handleOnKeyPress(e)}
                          onBlur={(e) => handleSavePrice(item.id, e.target.value)}
                          placeholder="Precio"
                        />
                        : item.price}
                    </div>
                    <div className="flex items-center justify-center text-xs">
                      {item.quantity * item.price}
                    </div>
                    <div className="flex items-center justify-center text-xs cursor-pointer">
                      <img
                        className="cursor-pointer text-white"
                        color="white"
                        src={userEditSvg}
                        alt="Edit"
                        width={20}
                        height={20}
                        onClick={() => handleAssignItem(item)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )
        }
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

const AssignmentsSection = (props) => {
  const { assignments, setAssignments, item, friends, handleCloseAssignItem } = props;
  const [error, setError] = useState(null);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      assignments: friends.reduce((acc, friend) => {
        acc[friend.id] = assignments[item.id]?.[friend.id] || 0;
        return acc;
      }, {}),
    },
  });

  useEffect(() => {
    reset({
      assignments: friends.reduce((acc, friend) => {
        acc[friend.id] = assignments[item.id]?.[friend.id] || 0;
        return acc;
      }, {}),
    });
  }, [item, friends, reset, assignments]);

  const onSubmit = (data) => {
    const totalAssignments = Object.values(data.assignments).reduce((acc, qty) => acc + parseFloat(qty || 0), 0);

    if (totalAssignments !== item.quantity) {
      setError('El total de asignaciones debe ser igual al número de ítems');
      return;
    }
    setAssignments({
      ...assignments,
      [item.id]: data.assignments
    });
    setError(null);
    handleCloseAssignItem();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 items-center justify-center">
      <h2 className="text-2xl mb-6">Asignar a amigos</h2>
      <div className="grid grid-cols-3 bg-slate-900 p-2.5 rounded-md w-full">
        <div className="text-left font-bold">Ítem</div>
        <div className="font-bold">Cantidad</div>
        <div className="font-bold">Precio</div>
        <div className="font-medium text-gray-900 dark:text-white text-lg text-left">{item?.name}</div>
        <div className="font-medium text-gray-900 dark:text-white text-lg">{item?.quantity}</div>
        <div className="font-medium text-gray-900 dark:text-white text-lg">{item?.price * item?.quantity}</div>
      </div>
      <div className="grid grid-cols-3 bg-slate-900 p-2.5 rounded-md w-full">
        {friends.map((friend, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 p-2 rounded-sm">
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
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        Asignar
      </button>
    </form>
  );
};

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
            <img src={userAddSvg} alt="Add" width={20} height={20} />
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
                className="bg-slate-900 hover:bg-slate-700 text-white rounded-md px-2 py-3 cursor-pointer"
                onClick={() => handleDiscardNewFriend(index)}>
                <img src={closeSvg} alt="Close" width={20} height={20} />
              </button>
            </div>
            <div className="col-span-2">
              <button
                className="bg-slate-900 hover:bg-slate-700 text-white rounded-md px-2 py-3 cursor-pointer disabled:bg-slate-700 disabled:cursor-not-allowed"
                onClick={() => handleSaveNewFriend(index, friend.id)}
              >
                <img src={checkSvg} alt="Add" width={20} height={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {friends.length > 0 && (
        <div className="flex flex-col gap-2 mt-4">
          <h3>Amigos</h3>
          {friends.map(friend => (
            <div className="flex gap-2 items-center justify-center w-full bg-slate-900 rounded-md p-2" key={friend.id}>
              <p>{friend.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const SendEmailsSection = (props) => {
  const { friends, setFriends, items, assignments } = props
  const [addingNewFriend, setAddingNewFriend] = useState(false)
  const [newFriends, setNewFriends] = useState([])
  const [totals, setTotals] = useState({})

  return (
    <div className={"col-span-2"}>
      {/* <h3 className="block my-2 text-md font-medium text-gray-900 dark:text-white text-left">3. Enviar a tus amigos</h3> */}
      <div className='flex flex-col bg-slate-800 p-5 rounded-lg min-h-96'>
        <div className="flex flex-col bg-slate-800 rounded-lg min-h-96">
          {friends.map((friend, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 border-b border-gray-700 p-2 rounded-sm">
              <div className="text-left text-xs">{friend.name}</div>
              <div className="flex items-center justify-center text-xs">{friend.email}</div>
              <div className="flex items-center justify-center text-xs">{totals[friend.id] || 0}</div>
            </div>
          ))}
          {friends.length <= 0 &&
            <div className="flex gap-2 mt-4">
              <h2>No hay amigos aún</h2>
            </div>
          }
          {newFriends.length > 0 ?
            <div className="flex flex-col gap-2 mt-4">
              {newFriends.map(friend => (
                <div className="flex gap-2">
                  <Input type="text" {...register('name', { required: true })} placeholder="Nombre" />
                  <Input type="email" {...register('email', { required: true })} placeholder="Email" />
                  <Input type="number" {...register('quantity', { required: true })} placeholder="Cantidad" />
                  <Button onClick={() => handleRemoveFriend(friend)}>
                    <img src={closeSvg} alt="Close" width={20} height={20} />
                  </Button>
                  <Button onClick={handleSubmit(onSubmit)} disabled={!isValid}>
                    <img src={checkSvg} alt="Add" width={20} height={20} />
                  </Button>
                </div>
              ))}
            </div> :
            <p className="text-center">No hay amigos aún</p>
          }
        </div>
      </div>
    </div>
  )
}

export default App