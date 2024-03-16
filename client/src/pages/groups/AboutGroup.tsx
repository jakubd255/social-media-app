import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import React from "react";
import {useOutletContext} from "react-router-dom";



const AboutGroup: React.FC<any> = (groupProps) => {
    const {group} = useOutletContext<any>() || groupProps;

    return(
        <div className="flex flex-col gap-[50px] items-start max-w-[1200px] w-[100%]">
            {group?.description ? (
                <div className="flex flex-col items-start">
                    <h2>
                        Description
                    </h2>
                    {group.description ? (
                        <pre className="text-left font-sans whitespace-pre-wrap">
                            {group.description}
                        </pre>
                    ) : null}
                </div>
            ) : null}
            {group?.rules.length ? (
                <div className="w-full">
                    <h2>
                        Rules from the admins
                    </h2>
                    <Accordion
                        type="multiple"
                        defaultValue={group.rules.map((_: any, index: number) => index.toString())}
                        className="w-full"
                    >
                        {group.rules.map((rule: any, index: number) =>
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
                </div>
            ) : null}
        </div>
    );
}

export default AboutGroup;