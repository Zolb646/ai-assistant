"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { Trash } from "lucide-react";
import React from "react";
import { IoReload } from "react-icons/io5";
import { TabResultTitle, TabTitle } from "../_components/tabTitle";
import { TabDescription } from "../_components/tabDescirption";

type DetectedObject = {
  label: string;
  score: number;
  box: { xmin: number; ymin: number; xmax: number; ymax: number };
};
export const AnalysisTabsContent = () => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [image, setImage] = React.useState<string | null>(null);
  const [objects, setObjects] = React.useState<DetectedObject[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setImage(reader.result);
            setSelectedFile(file);
            setObjects([]);
          }
        };

        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDetect = async () => {
    try {
      if (!selectedFile || !image) return;

      setLoading(true);
      setObjects([]);

      const response = await fetch(image);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("image", blob, selectedFile.name || "upload.jpg");

      const res = await fetch("/api/object-detection", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Detection result:", data);

      if (data.objects) {
        setObjects(data.objects);
      } else {
        setObjects([]);
      }
    } catch (err) {
      console.error("Error detecting objects:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TabsContent value="analysis">
      <div className="w-full h-fit flex flex-col gap-2">
        <div className="w-full h-fit flex justify-between items-start">
          <TabTitle title={"Image analysis"} />
          <Button
            variant={objects.length === 0 ? "outline" : "default"}
            size={`icon`}
            onClick={() => {
              setImage(null);
              setSelectedFile(null);
              setObjects([]);
              setLoading(false);
            }}
            disabled={objects.length === 0}
          >
            <IoReload />
          </Button>
        </div>
        <TabDescription
          description="Upload a food photo, and AI will detect the ingredients."
          className="mt-2"
        />
        <div className="w-full h-fit flex flex-col gap-2">
          <label
            htmlFor="analysis-image"
            className={`h-11 border rounded-lg flex items-center ${
              image ? "h-fit w-fit p-2" : "px-3"
            }`}
          >
            {image ? (
              <div className="relative rounded-lg">
                <img
                  src={image}
                  alt="Uploaded"
                  className="h-50 object-cover rounded-lg"
                />
                <button
                  type="button"
                  className="absolute bottom-2 right-2 bg-white rounded-sm p-1 hover:bg-gray-200"
                  onClick={(e) => {
                    e.preventDefault();
                    setImage(null);
                  }}
                >
                  <Trash className="size-5 text-gray-600" />
                </button>
              </div>
            ) : (
              <p className="text-[#71717A]">
                <strong className="px-2 text-black">Choose File</strong>
                JPG, PNG
              </p>
            )}

            <Input
              id="analysis-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          <div className="w-full h-fit flex justify-end">
            <Button
              className={`${
                !image || loading || objects.length > 0 ? "bg-[#71717A]" : ""
              }`}
              disabled={!image || loading || objects.length > 0}
              onClick={handleDetect}
            >
              Generate
            </Button>
          </div>
        </div>{" "}
      </div>
      <div className="w-full h-fit flex flex-col gap-2 mt-6">
        <TabResultTitle title="Here is the summary" />
        <div className="border w-full h-fit px-3 py-2 rounded-lg">
          {loading ? (
            <p className="text-[#71717A] font-medium">Working...</p>
          ) : objects.length === 0 ? (
            <TabDescription description="First, enter your image to recognize ingredients." />
          ) : (
            <div className="flex flex-col gap-1">
              {objects.map((obj, i) => (
                <p key={i} className="text-[#52525B]">
                  <strong>{i + 1}. </strong> <strong>{obj.label}</strong> (
                  {Math.round(obj.score * 100)}
                  %)
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </TabsContent>
  );
};
