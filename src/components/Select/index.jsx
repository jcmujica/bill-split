import React, { forwardRef } from 'react'

export const Select = forwardRef((props, ref) => {
  const { label, options = [], error, ...rest } = props;

  return (
    <section className="flex flex-col gap-2 w-full">
      {label &&
        <label htmlFor={label} className="block text-sm font-medium text-slate-900 dark:text-white text-left">
          {label}
        </label>
      }
      <select
        className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-slate-900 dark:border-slate-800 dark:placeholder-slate-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
        id={label}
        ref={ref}
        {...rest}
      >
        <option value=""></option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-left text-sm ">
        Este campo es requerido
      </p>}
    </section>
  )
})
