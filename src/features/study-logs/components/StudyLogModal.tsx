import {
  Dialog,
  Portal,
  Button,
  CloseButton,
  Separator,
  Stack,
  Field,
  Input,
} from "@chakra-ui/react";
import { memo, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { StudyLogDTO } from "../types";

interface IFormValues {
  title: string;
  hours: number;
}

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "create" | "update";
  initialValue?: StudyLogDTO | null;
  onCreate: (payload: IFormValues) => Promise<void>;
  onUpdate: (id: number, data: IFormValues) => Promise<void>;
};

const StudyLogModal = memo(
  ({ open, setOpen, mode, initialValue, onCreate, onUpdate }: Props) => {
    console.log("study log modal");

    const {
      register,
      handleSubmit,
      formState: { errors, isValid, isDirty },
      reset,
    } = useForm<IFormValues>({
      mode: "onChange",
    });

    const onSubmit = handleSubmit((data) => {
      if (mode === "update" && !isDirty) return;
      if (mode === "create") {
        onCreate(data);
      } else {
        onUpdate(initialValue!.id, data);
      }
    });

    useEffect(() => {
      if (open) {
        if (mode === "create") {
          reset({ title: "", hours: 1 });
        } else if (mode === "update" && initialValue) {
          reset({ title: initialValue.title, hours: initialValue.hours });
        }
      }
    }, [open, reset, initialValue, mode]);

    return (
      <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>
                  {mode === "create" ? "Add study log" : "Edit study log"}
                </Dialog.Title>
                <Separator size="md" />
              </Dialog.Header>
              <Dialog.Body>
                <form onSubmit={onSubmit}>
                  <Stack gap="4" align="flex-start" maxW="sm">
                    <Field.Root invalid={!!errors.title}>
                      <Field.Label>Title</Field.Label>
                      <Input
                        {...register("title", {
                          required: "title is required",
                          pattern: {
                            value: /^[A-Za-z ]+$/i,
                            message: "Please enter letters only.",
                          },
                        })}
                      />
                      <Field.ErrorText>
                        {errors.title && errors.title.message}
                      </Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.hours}>
                      <Field.Label>Hours</Field.Label>
                      <Input
                        {...register("hours", {
                          valueAsNumber: true,
                          required: "hours is required",
                          validate: (value) =>
                            (value >= 1 && value <= 99) ||
                            "Hours must be between 1 and 99.",
                        })}
                      />
                      <Field.ErrorText>{errors.hours?.message}</Field.ErrorText>
                    </Field.Root>

                    <Button
                      type="submit"
                      disabled={!isValid || !isDirty}
                      colorPalette="blue"
                      variant="surface"
                    >
                      {mode === "update" ? "Update" : "Create"}
                    </Button>
                  </Stack>
                </form>
              </Dialog.Body>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    );
  }
);

export default StudyLogModal;
