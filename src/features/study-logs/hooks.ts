import { useCallback, useEffect, useState } from "react";
import type { StudyLogDTO } from "./types";
import { getAllStudyLogs, addStudyLog, deleteStudyLog, updateStudyLog } from "./api";



const useStudyLogs = () => {
    const [logs, setLogs] = useState<StudyLogDTO[]>([]);
    const [loading, setLoading] = useState(false);


    const refetch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllStudyLogs();
            setLogs(data);
        } catch (e) {
            throw e;
        } finally {
            setLoading(false);
        }


    }, []);

    useEffect(() => { refetch(); }, [refetch]);

    const createStudyLog = useCallback(async (payload: { title: string, hours: number }) => {
        setLoading(true);

        try {
            await addStudyLog(payload);
            await refetch();
        } catch (e) {
            throw e;
        } finally {
            setLoading(false);
        }
    }, [refetch]);

    const removeStudyLog = useCallback(async (id: number) => {
        setLoading(true);

        try {
            await deleteStudyLog(id);
            await refetch();
        } catch (e) {
            throw e;
        } finally {
            setLoading(false);
        }
    }, [refetch]);

    const editStudyLog = useCallback(async (id: number, data: { title: string, hours: number }) => {
        setLoading(true);

        try {
            await updateStudyLog(id, data);
            await refetch();
        } catch (e) {
            throw e;
        } finally {
            setLoading(false);
        }
    }, [refetch]);

    return { logs, loading, createStudyLog, removeStudyLog, refetch, editStudyLog }
}


export default useStudyLogs;
