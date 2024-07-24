import { Icon } from "../Icons"
export const Modal = (props) => {
  const { isOpen, onClose, children } = props

  const handleClose = () => {
    onClose()
  }

  return (
    <div
      className={`${isOpen ? 'block' : 'hidden'} fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50`}
    >
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="relative flex flex-col gap-2 bg-white dark:bg-slate-800 p-5 rounded-lg min-w-[700px]">
          <span className="absolute top-2 right-2 cursor-pointer" onClick={handleClose}>
            <Icon type="close" className="stroke-black dark:stroke-white cursor-pointer"  />
          </span>
          {children}
        </div>
      </div>
    </div>
  )
}