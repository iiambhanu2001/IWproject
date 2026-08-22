import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function ActionModal({
  triggerText,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default", // default | danger | success
  onConfirm,
  children,
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    try {
      setLoading(true);

      if (onConfirm) {
        await onConfirm(); // supports async APIs
      }

      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  const colors = {
    default: "bg-[#4A8FA3] hover:bg-[#3c7688]",
    danger: "bg-red-500 hover:bg-red-600",
    success: "bg-green-500 hover:bg-green-600",
  };

  return (
    <>
      {/* Trigger */}
      <Button onClick={() => setOpen(true)}>
        {triggerText}
      </Button>

      {/* Modal */}
      <Modal show={open} size="md" onClose={() => setOpen(false)} popup>
        <ModalHeader />

        <ModalBody>
          <div className="text-center">

            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />

            <h3 className="mb-2 text-xl font-semibold text-[#1F2A24]">
              {title}
            </h3>

            <p className="mb-5 text-sm text-[#5A6A61]">
              {description}
            </p>

            {/* custom content */}
            {children && (
              <div className="mb-6 text-left">
                {children}
              </div>
            )}

            <div className="flex justify-center gap-4">

              <Button
                className={`text-white ${colors[type]}`}
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? "Processing..." : confirmText}
              </Button>

              <Button
                color="gray"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                {cancelText}
              </Button>

            </div>

          </div>
        </ModalBody>
      </Modal>
    </>
  );
}