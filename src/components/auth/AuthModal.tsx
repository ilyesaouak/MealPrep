import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: "login" | "register";
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultView = "login",
}) => {
  const [view, setView] = useState<"login" | "register">(defaultView);

  const handleSuccess = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {view === "login" ? "Welcome Back" : "Create an Account"}
          </DialogTitle>
        </DialogHeader>
        {view === "login" ? (
          <LoginForm
            onSuccess={handleSuccess}
            showRegister={() => setView("register")}
          />
        ) : (
          <RegisterForm
            onSuccess={handleSuccess}
            showLogin={() => setView("login")}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
