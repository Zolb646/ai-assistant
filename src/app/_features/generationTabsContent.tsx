"use client";

import { JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { TabResultTitle, TabTitle } from "../_components/tabTitle";
import { IoReload } from "react-icons/io5";
import { TabDescription } from "../_components/tabDescirption";
import { Textarea } from "@/components/ui/textarea";
import { ResultRenderer } from "../_components/resultRenderer";

export const GenerationTabsContent = (): JSX.Element => {
  const [text, setText] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  interface ApiResponse {
    text?: string;
    error?: string;
  }

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/text-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      const data: ApiResponse = await res.json();

      if (data.text) {
        setResult(data.text);
      } else {
        setResult(data.error ?? "Unknown error occurred");
      }
    } catch (error) {
      console.error(error);
      setResult("Something went wrong.");
    }

    setLoading(false);
  };

  const handleReset = (): void => {
    setText("");
    setResult("");
  };

  return (
    <TabsContent value="generation">
      <div className="w-full h-fit flex flex-col gap-2">
        <div className="w-full h-fit flex justify-between items-start">
          <TabTitle title="Ingredient recognition" />

          <Button
            variant={result.length === 0 ? "outline" : "default"}
            size="icon"
            disabled={result.length === 0}
            onClick={handleReset}
          >
            <IoReload />
          </Button>
        </div>

        <TabDescription
          description="Describe the food, and AI will detect the ingredients."
          className="mt-2"
        />

        <Textarea
          placeholder="Орц тодорхойлох"
          value={text}
          className="h-28"
          onChange={(e) => setText(e.target.value)}
        />

        <div className="w-full h-fit flex justify-end">
          <Button
            className={`${
              !text.trim() || loading || !!result ? "bg-[#71717A]" : ""
            }`}
            onClick={handleGenerate}
            disabled={loading || !text.trim() || !!result}
          >
            {loading ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>

      <div className="w-full h-fit flex flex-col gap-2 mt-6">
        <TabResultTitle title="Identified Ingredients" />

        <div className="border w-full max-h-180 overflow-auto px-3 py-2 rounded-lg">
          {loading ? (
            <TabDescription description="Generating..." />
          ) : !result ? (
            <TabDescription
              description={"First, enter your text to recognize ingredients."}
            />
          ) : (
            <ResultRenderer result={result} />
          )}
        </div>
      </div>
    </TabsContent>
  );
};
