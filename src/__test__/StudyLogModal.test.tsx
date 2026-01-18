import { vi, describe, test, expect, beforeEach } from "vitest";
import StudyLogModal from "../features/study-logs/components/StudyLogModal";
import { screen, waitFor } from "@testing-library/react";
import type { StudyLogModalProps } from "../features/study-logs/components/StudyLogModal";
import { renderWithChakra } from "./render";
import userEvent from "@testing-library/user-event";
import { inputProps } from "@zag-js/date-picker";

const mockOnCreate = vi.fn().mockResolvedValue(undefined);
const mockOnUpdate = vi.fn().mockResolvedValue(undefined);

const renderModal = (
  props?: Partial<React.ComponentProps<typeof StudyLogModal>>
) => {
  const defaultProps: StudyLogModalProps = {
    open: true,
    setOpen: vi.fn(),
    mode: "create",
    initialValue: null,
    onCreate: mockOnCreate,
    onUpdate: mockOnUpdate,
  };

  return renderWithChakra(<StudyLogModal {...defaultProps} {...props} />);
};

const setup = (props?: Partial<React.ComponentProps<typeof StudyLogModal>>) => {
  renderModal(props);
  const user = userEvent.setup();
  const getTitleInput = () => screen.getByRole("textbox", { name: /title/i });
  const getHoursInput = () =>
    screen.getByRole("spinbutton", { name: /hours/i });
  const getSubmitButton = () =>
    screen.getByRole("button", { name: /create|update/i });

  return { user, getTitleInput, getHoursInput, getSubmitButton };
};

const setupUpdateModal = () =>
  setup({
    mode: "update",
    initialValue: {
      id: 1,
      title: "Test Test",
      hours: 4,
      created_at: new Date().toISOString(),
    },
  });

describe("StudyLogModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create mode", () => {
    test("shows the create title", () => {
      renderModal();

      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        /Add study log/i
      );
    });

    test("disables the create button when form is invalid", () => {
      renderModal();
      expect(screen.getByRole("button", { name: /Create/i })).toBeDisabled();
    });

    test("shows an error when title contains non-letters", async () => {
      const { user, getTitleInput } = setup();
      await user.type(getTitleInput(), "111");
      expect(
        await screen.findByText(/please enter letters only\./i)
      ).toBeInTheDocument();
    });

    test.each([
      { value: "0", reason: "below minimum" },
      { value: "100", reason: "above maximum" },
    ])("shows error when hours is invalid (%s)", async ({ value }) => {
      const { user, getHoursInput } = setup();

      const input = getHoursInput();
      await user.clear(input);
      await user.type(input, value);

      expect(
        await screen.findByText(/Hours must be between 1 and 99./i)
      ).toBeInTheDocument();
    });

    test("shows an error when hours is not a number", async () => {
      const { user, getHoursInput } = setup();

      const input = getHoursInput();
      await user.clear(input);
      await user.type(input, "aaa");

      expect(await screen.findByText(/hours is required/i)).toBeInTheDocument();
    });

    test("calls onCreate with valid values", async () => {
      const { user, getTitleInput, getHoursInput, getSubmitButton } = setup();

      await user.type(getTitleInput(), "Test Test");
      const inputHours = getHoursInput();
      await user.clear(inputHours);
      await user.type(inputHours, "3");

      const createBtn = screen.getByRole("button", { name: /create/i });
      await waitFor(() => expect(createBtn).toBeEnabled());
      await user.click(createBtn);

      expect(mockOnCreate).toHaveBeenCalledWith({
        title: "Test Test",
        hours: 3,
      });
    });
  });

  describe("update mode", () => {
    test("shows the update title", async () => {
      setupUpdateModal();

      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        /Edit study log/i
      );
    });

    test("prefills the form with initial values", async () => {
      const { getTitleInput, getHoursInput } = setupUpdateModal();
      expect(getTitleInput()).toHaveValue("Test Test");
      expect(getHoursInput()).toHaveValue(4);
    });

    test("disables the update button when no changes are made", async () => {
      setupUpdateModal();

      const button = screen.getByRole("button", { name: /Update/i });
      expect(button).toBeDisabled();
    });
  });
});
