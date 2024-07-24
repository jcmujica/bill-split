# Bill Split

Este proyecto es una aplicación web que te ayuda a repartir el dinero de tu cuenta de una salida con tus amigos. Te permite dividir el dinero en partes y asegurarte de que se reparten de manera justa.

## ¿Cómo funciona?

El proceso de repartir el dinero es muy sencillo. Primero, debes cargar la imagen de la cuenta de la salida con tus amigos. Luego, se le pedirá que ingreses la clave de OpenAI para que la aplicación pueda procesar la imagen y extraer los ítems y asignarlos a tus amigos.

Una vez que hayas cargado la imagen y ingresado la clave de OpenAI, los ítems se mostrarán en la sección de "Verificar ítems y asignarlos a tus amigos". Aquí puedes ver los ítems que se encuentran en la imagen y asignarlos a tus amigos. Esta sección permite editar los precios en caso de que se hayan cargados incorrectamente por la IA.

Luego, se mostrará la sección de "Enviar a tus amigos". Aquí puedes ver los totales de los ítems asignados a tus amigos y enviarlos por WhatsApp.

## ¿Cómo funciona la IA?

La IA se encarga de extraer los ítems de la imagen y asignarlos a tus amigos. Para hacerlo, se utiliza la biblioteca [ai](https://github.com/vercel/ai) de Vercel y la API de OpenAI.

## ¿Cómo puedo probar la aplicación?

Puedes probar la aplicación corriendo el siguiente comando en tu terminal:

```
npm run dev
```

Luego, accederás a la aplicación en http://localhost:5173/.

Puedes encontrar una imagen en la carpeta `public/bill.png` que se puede utilizar para probar la aplicación.

La aplicación tambien está deployada en [vercel](https://bill-split-red.vercel.app/).