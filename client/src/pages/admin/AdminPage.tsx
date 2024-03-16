import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight} from "lucide-react";
import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Outlet} from "react-router-dom";
import {Forbidden} from "@/pages/error";
import {useSelector} from "react-redux";



const AdminPage: React.FC = () => {
    const user = useSelector((state: any) => state.auth.user);
    
    const [pages, setPages] = useState(0);
    const [page, setPage] = useState(1);

    const [draft, setDraft] = useState<string>("");
    const handleDraftUpdate = (e: any) => setDraft(e.target.value);

    const [input, setInput] = useState<string>("");

    const handleSearch = () => {
        setInput(draft);
    }

    if(user?.admin && user?._id) return(
        <div className="flex flex-1 justify-center">
            <div className="flex flex-col gap-3 mt-5">
                <div className="flex gap-2">
                    <Input 
                        placeholder="Search..."
                        value={draft}
                        onChange={handleDraftUpdate}
                    />
                    <Button variant="outline" onClick={handleSearch}>
                        Search
                    </Button>
                </div>
                <div className="rounded-md border">
                    <Outlet context={{page, setPage, input, setPages}}/>
                </div>
                <div className="flex justify-between">
                    Page {page} of {pages}
                    <div className="flex gap-2 pb-10">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="w-[36px] h-[36px] flex -space-x-2"
                            disabled={page == 1}
                            onClick={() => setPage(1)}
                        >
                            <ChevronLeft className="h-4 w-4"/>
                            <ChevronLeft className="h-4 w-4"/>
                        </Button>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="w-[36px] h-[36px]" 
                            disabled={page == 1}
                            onClick={() => setPage(page => page-1)}
                        >
                            <ChevronLeft className="h-4 w-4"/>
                        </Button>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="w-[36px] h-[36px]" 
                            disabled={page == pages}
                            onClick={() => setPage(page => page+1)}
                        >
                            <ChevronRight className="h-4 w-4"/>
                        </Button>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="w-[36px] h-[36px] flex -space-x-2"
                            disabled={page == pages}
                            onClick={() => setPage(pages)}
                        >
                            <ChevronRight className="h-4 w-4"/>
                            <ChevronRight className="h-4 w-4"/>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
    else if(user._id && !user.admin) return <Forbidden/>
}

export default AdminPage;