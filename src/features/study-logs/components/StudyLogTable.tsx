import { Table } from "@chakra-ui/react";
import type { StudyLogDTO } from "../types";
import { memo } from "react";
import { MdDeleteForever } from "react-icons/md";
import PrimaryIconButton from "../../../components/ui/PrimaryIconButton";
import { LiaEdit } from "react-icons/lia";
type Props = {
  logs: StudyLogDTO[];
  onDelete: (id: number) => Promise<void>;
  onUpdate: (data: StudyLogDTO) => void;
};

const StudyLogTable = memo(({ logs, onDelete, onUpdate }: Props) => {
  console.log("studyLogtable");
  return (
    <Table.ScrollArea
      borderWidth="1px"
      rounded="md"
      height="200px"
      bgColor="white"
    >
      <Table.Root size="sm" stickyHeader>
        <Table.Header>
          <Table.Row bg="bg.subtle">
            <Table.ColumnHeader>Title</Table.ColumnHeader>
            <Table.ColumnHeader>Hours</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end"></Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {logs.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.title}</Table.Cell>
              <Table.Cell>{item.hours}</Table.Cell>
              <Table.Cell textAlign="end">
                <PrimaryIconButton
                  label="edit icon"
                  color="blue"
                  onClick={() => onUpdate(item)}
                >
                  <LiaEdit />
                </PrimaryIconButton>

                <PrimaryIconButton
                  label="delete icon"
                  color="red"
                  onClick={() => onDelete(item.id)}
                >
                  <MdDeleteForever />
                </PrimaryIconButton>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
});

export default StudyLogTable;
