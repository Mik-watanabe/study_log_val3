import type { StudyLogDTO } from "./types"
import supabase from "../../lib/supabase";

export const getAllStudyLogs = async (): Promise<StudyLogDTO[]> => {
    const { data, error } = await supabase
        .from("study-logs")
        .select("*");

    if (error) throw error;
    return data ?? [];
};

export const addStudyLog = async (payload: { title: string; hours: number; }): Promise<StudyLogDTO> => {
    const { data, error } = await supabase
        .from("study-logs")
        .insert(payload)
        .select("*")
        .single();

    if (error) throw error;
    return data;
}

export const deleteStudyLog = async (id: number): Promise<void> => {
    const { error } = await supabase.from("study-logs").delete().eq("id", id);
    if (error) throw error;
}

export const updateStudyLog = async (id: number, data: {title: string; hours: number}): Promise<void> => {
    const { error } = await supabase.from("study-logs").update({title: data.title, hours: data.hours}).eq("id", id);
    if (error) throw error;
}