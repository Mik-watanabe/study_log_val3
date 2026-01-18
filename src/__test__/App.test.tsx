import App from "../App";
import { screen, within, waitFor } from "@testing-library/react";
import { renderWithChakra } from "./render";
import { describe, test, expect, vi, beforeEach } from "vitest";
import type { StudyLogDTO } from "../features/study-logs/types";
import userEvent from "@testing-library/user-event";

const mocks = vi.hoisted(() => {
  let db: StudyLogDTO[] = [];

  return {
    seed: (rows: StudyLogDTO[]) => {
      db = [...rows];
    },
    getDb: () => db,
    mockGetAllStudyLogs: vi.fn(async () => db),
    mockCreateStudyLog: vi.fn(
      async (payload: { title: string; hours: number }) => {
        const nextId = db.length ? Math.max(...db.map((x) => x.id)) + 1 : 1;

        const newRow: StudyLogDTO = {
          id: nextId,
          title: payload.title,
          hours: payload.hours,
          created_at: new Date().toISOString(),
        };

        db = [...db, newRow];
      }
    ),
    mockUpdateStudyLog: vi.fn(
      async (id: number, data: { title: string; hours: number }) => {
        db = db.map((x) => (x.id === id ? { ...x, ...data } : x));
        return undefined;
      }
    ),
    mockDeleteStudyLog: vi.fn(async (id: number) => {
      db = db.filter((x) => x.id !== id);
    }),
  };
});

vi.mock("../features/study-logs/api.ts", () => ({
  getAllStudyLogs: mocks.mockGetAllStudyLogs,
  createStudyLog: mocks.mockCreateStudyLog,
  updateStudyLog: mocks.mockUpdateStudyLog,
  deleteStudyLog: mocks.mockDeleteStudyLog,
}));

const setup = async () => {
  const user = userEvent.setup();
  renderWithChakra(<App />);
  const table = await screen.findByRole("table");
  const bodyRows = within(table).getAllByRole("row").slice(1);
  return { user, table, bodyRows };
};

const openEditModalForFirstRow = async () => {
  const { user, bodyRows } = await setup();

  await user.click(
    within(bodyRows[0]).getByRole("button", { name: /edit_icon/i })
  );
  const dialog = await screen.findByRole("dialog");
  return { user, dialog };
};

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.seed([
      {
        id: 1,
        title: "title1",
        hours: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        title: "title2",
        hours: 2,
        created_at: new Date().toISOString(),
      },
    ]);
  });

  test("displays the page title", async () => {
    renderWithChakra(<App />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Study Log");
  });

  test("shows a loading indicator while fetching logs", async () => {
    renderWithChakra(<App />);
    expect(screen.queryByText(/loading/i)).toBeInTheDocument();
    await screen.findByRole("table");
  });

  test("shows the 'Add Study log' button", async () => {
    await setup();
    expect(
      screen.getByRole("button", { name: /Add Study log/i })
    ).toBeInTheDocument();
  });

  test("renders the study log table", async () => {
    const { table } = await setup();
    expect(table).toBeInTheDocument();
  });

  test("displays all study logs in the table", async () => {
    const { bodyRows } = await setup();

    expect(bodyRows).toHaveLength(2);
  });

  test("shows an edit button for each study log", async () => {
    const { bodyRows } = await setup();

    bodyRows.forEach((row) => {
      const editButton = within(row).getByRole("button", {
        name: /edit_icon/i,
      });
      expect(editButton).toBeInTheDocument();
    });
  });

  test("shows a delete button for each study log", async () => {
    const { bodyRows } = await setup();

    bodyRows.forEach((e) => {
      const editButton = within(e).getByRole("button", {
        name: /delete_icon/i,
      });
      expect(editButton).toBeInTheDocument();
    });
  });

  test("deletes a study log when the delete button is clicked", async () => {
    const { bodyRows, user } = await setup();
    const firstRow = bodyRows[0];

    await user.click(
      within(firstRow).getByRole("button", {
        name: /delete_icon/i,
      })
    );

    expect(mocks.mockDeleteStudyLog).toHaveBeenCalledTimes(1);
    expect(mocks.mockDeleteStudyLog).toHaveBeenCalledWith(1);
    expect(mocks.getDb()).toHaveLength(1);
  });

  test("opens the edit modal when the edit button is clicked", async () => {
    const { dialog } = await openEditModalForFirstRow();

    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByRole("heading", { name: /Edit study log/i })
    ).toBeInTheDocument();
  });

  test("prefills the edit form with the selected study log data", async () => {
    const { dialog } = await openEditModalForFirstRow();

    expect(within(dialog).getByRole("textbox", { name: /title/i })).toHaveValue(
      mocks.getDb()[0].title
    );
    expect(
      within(dialog).getByRole("spinbutton", { name: /hours/i })
    ).toHaveValue(mocks.getDb()[0].hours);
  });

  test("updates a study log and closes the modal", async () => {
    const { dialog, user } = await openEditModalForFirstRow();
    const inputTitle = within(dialog).getByRole("textbox", { name: /title/i });
    const inputHour = within(dialog).getByRole("spinbutton", {
      name: /hours/i,
    });

    const title = "Edited title";
    const hours = 4;

    await user.clear(inputTitle);
    await user.type(inputTitle, title);

    await user.clear(inputHour);
    await user.type(inputHour, hours.toString());

    const updateBtn = within(dialog).getByRole("button", { name: /update/i });
    await waitFor(() => expect(updateBtn).toBeEnabled());
    await user.click(updateBtn);

    expect(mocks.mockUpdateStudyLog).toHaveBeenCalledWith(1, {
      title: title,
      hours: hours,
    });
    expect(mocks.getDb()).toHaveLength(2);

    expect(mocks.getDb()[0].title).toBe(title);
    expect(mocks.getDb()[0].hours).toBe(hours);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  test("closes the modal when the close button is clicked", async () => {
    const { user, dialog } = await openEditModalForFirstRow();

    await user.click(within(dialog).getByRole("button", { name: /Close/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
