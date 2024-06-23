import FileDownload from "../FileDownload";



const PostFiles: React.FC<{files: string[]}> = ({files}) => {
    if(files?.length) return(
        <div className="flex flex-col gap-2 px-3">
            {files.map((file: string) => (
                <FileDownload url={file}/>
            ))}
        </div>
    );
}

export default PostFiles;