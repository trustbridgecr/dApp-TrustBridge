import * as React from "react";
import * as Toast from "@radix-ui/react-toast";

export function useToast() {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const triggerToast = (msg: string) => {
    setMessage(msg);
    setOpen(true);
  };

  const ToastComponent = () => (
    <Toast.Provider>
      <Toast.Root open={open} onOpenChange={setOpen} className="toast">
        <Toast.Title>{message}</Toast.Title>
        <Toast.Close />
      </Toast.Root>
      <Toast.Viewport className="toast-viewport" />
    </Toast.Provider>
  );

  return { triggerToast, ToastComponent };
}

