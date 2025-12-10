"use client";

import { TabsContent } from "@/components/ui/tabs";
import { TabResultTitle, TabTitle } from "../_components/tabTitle";
import { Button } from "@/components/ui/button";
import { IoReload } from "react-icons/io5";
import { TabDescription } from "../_components/tabDescirption";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

export const CreatorTabsContent = (): React.JSX.Element => {
  const [prompt, setPrompt] = React.useState<string>("");
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setImageUrl(null);

    try {
      const res = await fetch("/api/text-to-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data: { image?: string; error?: string } = await res.json();

      if (data.error) {
        console.error(data.error);
      } else if (data.image) {
        setImageUrl(data.image);
        console.log(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPrompt("");
    setImageUrl(null);
  };

  return (
    <TabsContent value="creator">
      <div className="w-full flex flex-col gap-2">
        <div className="w-full h-fit flex justify-between items-start">
          <TabTitle title="Food Image Creator" />
          <Button
            variant={!imageUrl ? "outline" : "default"}
            size="icon"
            disabled={!imageUrl}
            onClick={handleReset}
          >
            <IoReload />
          </Button>
        </div>

        <TabDescription
          description="What food image do you want? Describe it briefly."
          className="mt-2"
        />

        <Textarea
          placeholder="Өгөгдөл өгнө үү"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="resize-none h-28"
        />

        <div className="w-full h-fit flex justify-end">
          <Button
            className={`${loading || !prompt.trim() ? "bg-[#71717A]" : ""}`}
            onClick={handleGenerate}
            disabled={loading || !prompt.trim() || !!imageUrl}
          >
            {loading ? "Generating..." : "Generate"}
          </Button>
        </div>

        <div className="w-full h-fit flex flex-col gap-2 mt-6">
          <TabResultTitle title="Result" />
          <div className="border w-full h-fit px-3 py-2 rounded-lg flex justify-center items-center min-h-[200px]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Generated food"
                className="max-w-full rounded-md shadow-md"
              />
            ) : loading ? (
              <TabDescription description="Generating..." />
            ) : (
              <TabDescription description="First, enter your text to generate an image." />
            )}
          </div>
        </div>
      </div>
    </TabsContent>
  );
};
