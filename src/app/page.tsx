"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenerationTabsContent } from "./_features/generationTabsContent";
import { AnalysisTabsContent } from "../app/_features/analysisTabsContent";
import { CreatorTabsContent } from "../app/_features/creatorTabsContent";
import React from "react";
import ChatBot from "./_features/chatBot";
export default function Home() {
  const [tab, setTab] = React.useState("analysis");

  React.useEffect(() => {
    const saved = localStorage.getItem("active-tab");
    if (saved) setTab(saved);
  }, []);

  const handleChange = (value: string) => {
    setTab(value);
    localStorage.setItem("active-tab", value);
  };
  return (
    <div className="flex flex-col w-screen h-screen items-center">
      <header className="w-full h-fit flex border py-4 px-12">
        <p className="font-semibold text-lg">AI tools</p>
      </header>
      <div className="h-screen w-3xl border py-6">
        <Tabs className="gap-6" value={tab} onValueChange={handleChange}>
          <TabsList>
            <TabsTrigger value="analysis">Image analysis</TabsTrigger>
            <TabsTrigger value="generation">Ingredient recognition</TabsTrigger>
            <TabsTrigger value="creator">Image creator</TabsTrigger>
          </TabsList>
          <AnalysisTabsContent />
          <GenerationTabsContent />
          <CreatorTabsContent />
        </Tabs>
      </div>
      <ChatBot />
    </div>
  );
}
