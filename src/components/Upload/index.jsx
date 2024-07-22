import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'

export const Upload = ({ name }) => {
  const { register, setValue, watch } = useFormContext()
  const [preview, setPreview] = useState(null)

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setValue(name, selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    } else {
      alert('Please upload a valid image file')
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white text-left" htmlFor="file_input">Adjuntar imagen</label>
        <input
          className="block w-full text-sm text-slate-900 border border-slate-300 rounded-lg cursor-pointer bg-slate-50 dark:text-slate-400 focus:outline-none dark:bg-slate-900 dark:border-slate-800 dark:placeholder-slate-400 p-2.5"
          id="file_input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <div>
        <h3 className="block mb-2 text-sm font-medium text-slate-900 dark:text-white text-left">
          Vista previa
        </h3>
        <div className="flex flex-col gap-2 min-h-[200px] bg-slate-900 p-2.5 rounded-lg">
          {preview &&
            <img
              src={preview}
              alt="Preview"
              className="rounded-lg self-center"
              style={{ maxWidth: '300px', maxHeight: '200px' }}
            />}
        </div>
      </div>

    </div>
  )
}
