"use client";

import React, { useState, useActionState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";

// Simple toast implementation to replace shadcn's useToast

const Toast = ({
  title,
  description,
  variant = "default",
  onClose,
}: {
  title: string;
  description: string;
  variant?: "default" | "destructive";
  onClose: () => void;
}) => {
  return (
    <div
      className={`toast ${variant === "destructive" ? "toast-error" : "toast-default"}`}
    >
      <div className="toast-header">
        <strong>{title}</strong>
        <button onClick={onClose} className="toast-close">
          ×
        </button>
      </div>
      <div className="toast-body">{description}</div>
    </div>
  );
};

// Custom toast hook
const useCustomToast = () => {
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      title: string;
      description: string;
      variant?: "default" | "destructive";
    }>
  >([]);

  const toast = ({
    title,
    description,
    variant = "default",
  }: {
    title: string;
    description: string;
    variant?: "default" | "destructive";
  }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const ToastContainer = () => (
    <div className="toast-container">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          title={t.title}
          description={t.description}
          variant={t.variant}
          onClose={() =>
            setToasts((prev) => prev.filter((toast) => toast.id !== t.id))
          }
        />
      ))}
    </div>
  );

  return { toast, ToastContainer };
};

const CATEGORIES = [
  "Technology",
  "Health",
  "Education",
  "Finance",
  "Travel",
  "Food",
  "Other",
] as const;

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const { toast, ToastContainer } = useCustomToast();
  const router = useRouter();

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      };

      await formSchema.parseAsync(formValues);

      const result = await createPitch(prevState, formData, pitch);

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Your startup pitch has been created successfully",
        });

        // Force router refresh before navigation
        router.refresh();
        router.push(`/startup/${result._id}`);
      }
      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErorrs = error.flatten().fieldErrors;
        setErrors(fieldErorrs as unknown as Record<string, string>);
        toast({
          title: "Error",
          description: "Please check your inputs and try again",
          variant: "destructive",
        });
        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      toast({
        title: "Error",
        description: "An unexpected error has occurred",
        variant: "destructive",
      });

      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <>
      <ToastContainer />
      <form action={formAction} className="startup-form">
        <div className="form-group">
          <label htmlFor="title" className="text-26-semibold line-clamp-1">
            TITLE
          </label>
          <input
            id="title"
            name="title"
            className="startup-form_input"
            required
            placeholder="Startup Title"
            suppressHydrationWarning
          />
          {errors.title && <p className="startup-form_error">{errors.title}</p>}
        </div>

        <div className="form-group">
          <label
            htmlFor="description"
            className="text-26-semibold line-clamp-1"
          >
            DESCRIPTION
          </label>
          <textarea
            id="description"
            name="description"
            className="startup-form_textarea"
            required
            placeholder="Startup Description"
            rows={4}
            suppressHydrationWarning
          />
          {errors.description && (
            <p className="startup-form_error">
              String must contain at least 20 character(s)
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="category" className="text-26-semibold line-clamp-1">
            CATEGORY
          </label>
          <select
            id="category"
            name="category"
            className="startup-form_input"
            required
            suppressHydrationWarning
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="startup-form_error">{errors.category}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="link" className="text-26-semibold line-clamp-1">
            IMAGE URL
          </label>
          <input
            id="link"
            name="link"
            className="startup-form_input"
            required
            placeholder="Startup Image URL"
            suppressHydrationWarning
          />
          {errors.link && <p className="startup-form_error">{errors.link}</p>}
        </div>

        <div className="form-group" data-color-mode="light">
          <label htmlFor="pitch" className="text-26-semibold line-clamp-1">
            PITCH
          </label>
          <MDEditor
            value={pitch}
            onChange={(value) => setPitch(value as string)}
            id="pitch"
            preview="edit"
            height={300}
            style={{ borderRadius: 20, overflow: "hidden" }}
            textareaProps={{
              placeholder:
                "Briefly describe your idea and what problem it solves",
              suppressHydrationWarning: true,
            }}
            previewOptions={{
              disallowedElements: ["style"],
            }}
          />
          {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
        </div>

        <button
          type="submit"
          className="startup-form_btn"
          disabled={isPending}
          suppressHydrationWarning
        >
          {isPending ? "Submitting..." : "Submit Your Pitch"}
          <Send className="size-6 ml-2" />
        </button>
      </form>
    </>
  );
};

export default StartupForm;
