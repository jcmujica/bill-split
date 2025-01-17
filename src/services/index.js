import { createOpenAI } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export const getBillData = async (apiKey, image, currency) => {
  const openai = createOpenAI({
    apiKey: apiKey,
  })

  try {
    const imageBase64 = await getBase64(image)

    const prompt = `
      Read the items in the following image, it is the picture of a bill from a restaurant or bar, get the text in the image and return a JSON object with the items, names, quantities and prices, the number format for prices is ${currency}. Group the items by quantity. Add a random id to each item.
    `

    const { object } = await generateObject({
      model: openai('gpt-4-turbo'),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image',
              image: imageBase64,
            },
          ],
        },
      ],
      schema: z.object({
        items: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            quantity: z.number(),
            price: z.number(),
          })
        ),
      })
    })

    return object
  } catch (error) {
    console.error('Error processing image:', error)
  }
}

export const getFakeBillData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        items: [
          {
            id: "1",
            name: "Copa Errazuriz",
            quantity: 4,
            price: 4490
          },
          {
            id: "2",
            name: "Mestra lager pils",
            quantity: 4,
            price: 5490
          },
          {
            id: "3",
            name: "Pizza Mona Lisa",
            quantity: 1,
            price: 14990
          },
          {
            id: "4",
            name: "Salmon el salmon",
            quantity: 1,
            price: 9990
          },
          {
            id: "5",
            name: "El Republicano TD",
            quantity: 1,
            price: 5490
          }
        ]
      })
    }, 1000)
  })
}