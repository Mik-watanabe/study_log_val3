import { Heading, Separator, Flex, Container, Em } from "@chakra-ui/react";
import useStudyLogs from "./features/study-logs/hooks";
import PrimaryButton from "./components/ui/PrimaryButton";
import StudyLogTable from "./features/study-logs/components/StudyLogTable";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import { useMemo, useState } from "react";
import StudyLogModal from "./features/study-logs/components/StudyLogModal";
import useMessage from "./hooks/useMessage";
import type { StudyLogDTO } from "./features/study-logs/types";

function App() {
  const { logs, loading, createStudyLog, removeStudyLog, editStudyLog} = useStudyLogs();
  const { showMessage } = useMessage();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectLog, setSelectLog] = useState<StudyLogDTO | null>(null);

  const openModal = () => {
    setOpen(true);
  };

  const totalHours = useMemo(
    () => logs.reduce((s, l) => s + l.hours, 0),
    [logs]
  );

  const onCreate = async (data: { title: string; hours: number }) => {
    try {
      setOpen(false);
      await createStudyLog(data);
      showMessage({
        title: "Study log created successfully",
        status: "success",
      });
    } catch {
      showMessage({ title: "Failed to add study log", status: "error" });
    }
  };

  const onDelete = async (id: number) => {
    try {
      await removeStudyLog(id);
      showMessage({
        title: "Study log deleted successfully",
        status: "success",
      });
    } catch {
      showMessage({ title: "Failed to delete study log", status: "error" });
    }
  };

  const onUpdate = async (
    id: number,
    data: { title: string; hours: number }
  ) => {
    setOpen(false);
    try {
      await editStudyLog(id, data);
      showMessage({
        title: "Study log updated successfully",
        status: "success",
      });
    } catch {
      showMessage({ title: "Failed to update study log", status: "error" });
    }
  };

  const startCreate = async () => {
    setMode("create");
    setSelectLog(null);
    openModal();
  };

  const startUpdate = async (data: StudyLogDTO) => {
    setMode("update");
    setSelectLog(data);
    openModal();
  };
  return (
    <>
      <Container maxW={{ base: "none", md: "2xl" }} p={0}>
        <Heading as="h1" size="3xl" pt={8} pb={4}>
          ✰Study Log✍︎ ꙳⋆
        </Heading>
        <Separator size="md" borderColor="blue" />
        <Container py={8}>
          {!loading && (
            <Flex justify="center" pb={8} align="center" gap={4}>
              <p>合計時間：　<Em fontWeight="semibold">{totalHours} / 1000 (H)</Em></p>
              <PrimaryButton onClick={startCreate} loading={loading}>
                Add Study log
              </PrimaryButton>
            </Flex>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : (
            <StudyLogTable
              logs={logs}
              onDelete={onDelete}
              onUpdate={startUpdate}
            />
          )}
        </Container>
      </Container>
      <StudyLogModal
        open={open}
        setOpen={setOpen}
        onCreate={onCreate}
        onUpdate={onUpdate}
        mode={mode}
        initialValue={selectLog}
      />
    </>
  );
}

export default App;

// TODO
// tag機能をつけたい
// user機能をつけたい
// authの練習になる
