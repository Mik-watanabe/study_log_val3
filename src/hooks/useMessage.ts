import { toaster } from "../components/ui/toaster"

type Props = {
    title: string;
    status: "success" | "error" | "warning" | "info"
}

const useMessage = () => {

    const showMessage = ({ title, status }: Props) => {
        toaster.create({
            description: title,
            type: status,
            closable: true,
        })
    }
    
    return { showMessage }
}

export default useMessage