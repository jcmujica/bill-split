import closeSvg from '../../assets/close.svg'

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
        <div className="relative flex flex-col gap-2 bg-slate-800 p-5 rounded-lg min-w-[700px]">
          <img
            className="absolute top-2 right-2 cursor-pointer"
            src={closeSvg}
            alt="Close"
            width={20}
            height={20}
            onClick={handleClose}
          />
          {children}
        </div>
      </div>
    </div>
  )
}