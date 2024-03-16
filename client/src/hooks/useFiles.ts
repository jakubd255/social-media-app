import {useRef, useState} from "react";



const useFiles = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const deleteByIndex = (index: number) => {
        const updatedFiles = [...selectedFiles];
        updatedFiles.splice(index, 1);
        setSelectedFiles(updatedFiles);
    }

    const ref = useRef<HTMLInputElement | null>(null);
    const handleOpen = () => ref.current && ref.current.click();

    const handleFileChange = (e: any) => {
        setSelectedFiles([...selectedFiles, ...e.target.files]);
    };

    const handleReset = () => {
        setSelectedFiles([]);
    }

    const getLength = () => selectedFiles.length;

    const getUrl = () => selectedFiles.length ? URL.createObjectURL(selectedFiles[0]) : "";

    return {selectedFiles, deleteByIndex, ref, handleOpen, handleFileChange, handleReset, getLength, getUrl}
}

export default useFiles;