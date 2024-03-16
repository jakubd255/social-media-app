import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {Trash2} from "lucide-react";
import store from "@/store";
import {updateGroup} from "@/store/slices/groupsSlice.ts";



type Rule = {
    header: string;
    description?: string;
};

const GroupRules: React.FC = () => {
    const {group}: any = useOutletContext();

    const [edit, setEdit] = useState<boolean>(false);
    const handleToggleEdit = () => setEdit(!edit);

    const [rules, setRules] = useState<Rule[]>([]);

    useEffect(() => {
        setRules(group?.rules || []);
    }, [group]);

    const handleHeaderUpdate = (e: any, index: number) => {
        const updated = rules.map((rule, i: number) => i === index ? {...rule, header: e.target.value} : rule);
        setRules(updated);
    };

    const handleDescriptionUpdate = (e: any, index: number) => {
        const updated = rules.map((rule, i: number) => i === index ? {...rule, description: e.target.value} : rule);
        setRules(updated);
    };

    const handleAddRule = () => {
        setRules([...rules, {header: "", description: ""}]);
    }

    const handleRemoveRule = (index: number) => {
        const updated = rules.filter((_, i: number) => i !== index);
        setRules(updated);
    };

    const handleEdit = () => {
        rules.forEach(rule => {
            if(!rule.header)
                return;
        });

        store.dispatch(updateGroup({id: group._id, form: {rules: rules}}));
        handleToggleEdit();
    }

    const handleCancel = () => {
        setRules(group?.rules || []);
        handleToggleEdit();
    }

    if(group) return(
        <div className="flex flex-col gap-10 pt-2 max-w-[1000px] w-full">
            <h2 className="text-2xl text-left">
                Group rules
            </h2>
            {rules.length ? (
                <div className="flex flex-col">
                    {!edit ? (
                        <Accordion type="multiple">
                            {rules.map((rule: Rule, index: number) =>
                                <AccordionItem value={index.toString()}>
                                    <AccordionTrigger>
                                        {rule.header}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {rule.description}
                                    </AccordionContent>
                                </AccordionItem>
                            )}
                        </Accordion>
                    ) : rules.length ? (
                        <div className="flex flex-col gap-10">
                            {rules.map((rule: Rule, index: number) =>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleRemoveRule(index)}
                                    >
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                    <div className="flex-1 flex flex-col gap-1">
                                        <Input
                                            placeholder="Rule"
                                            value={rule.header}
                                            onChange={e => handleHeaderUpdate(e, index)}
                                        />
                                        <Textarea
                                            placeholder="Description"
                                            value={rule.description}
                                            onChange={e => handleDescriptionUpdate(e, index)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ): null}
                </div>
            ) : null}
            <div>
                {edit ? (
                    <div className="flex gap-2.5">
                        <Button onClick={handleAddRule} variant="outline">
                            Add rule
                        </Button>
                        <Button onClick={handleCancel} variant="outline">
                            Cancel
                        </Button>
                        <Button onClick={handleEdit}>
                            Confirm
                        </Button>
                    </div>
                ) : (
                    <Button onClick={handleToggleEdit}>
                        {rules.length ? "Edit rules" : "Add rules"}
                    </Button>
                )}
            </div>
        </div>
    );
}

export default GroupRules;