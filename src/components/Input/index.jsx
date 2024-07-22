import React, { forwardRef } from 'react'

export const Input = forwardRef((props, ref) => {
  const { type, label, error, ...rest } = props;
  return (
    <div className="flex flex-col text-left w-full">
      {label &&
        <label
          className="block mb-2 text-sm font-medium text-slate-900 dark:text-white"
          htmlFor={label}
        >
          {label}
        </label>}
      <input
        className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-900 dark:border-slate-800 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        type={type}
        id={label}
        ref={ref}
        {...rest}
      />
      {error && <p className="text-red-500 text-left text-sm ">
        Este campo es requerido
      </p>}
    </div>
  )
})