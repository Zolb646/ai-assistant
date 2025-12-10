import { JSX } from "react";

interface ResultRendererProps {
  result: string;
}

const numberPattern = /^\s*\d+\./;
const bulletPattern = /^\s*[\*\-•]/;
const headerPattern = /:$/;

export const ResultRenderer = ({
  result,
}: ResultRendererProps): JSX.Element => {
  const clean = (str: string) => str.replace(/\*\*(.*?)\*\*/g, "$1");
  const lines = result
    .split("\n")
    .map((l) => clean(l.trim()))
    .filter((l) => l.length > 0);

  const parsedBlocks: JSX.Element[] = [];

  lines.forEach((line, idx) => {
    if (headerPattern.test(line)) {
      parsedBlocks.push(
        <h3 key={idx} className="font-semibold text-base mt-4 mb-2">
          {line}
        </h3>
      );
      return;
    }

    if (numberPattern.test(line)) {
      const number = line.split(".")[0];
      const text = line.replace(numberPattern, "").trim();

      parsedBlocks.push(
        <div key={idx} className="flex gap-2 text-sm items-start">
          <span className="font-medium text-foreground">{number}.</span>
          <span>{text}</span>
        </div>
      );
      return;
    }

    if (bulletPattern.test(line)) {
      const text = line.replace(bulletPattern, "").trim();

      parsedBlocks.push(
        <div key={idx} className="flex gap-2 text-sm items-start">
          <span className="text-foreground">•</span>
          <span>{text}</span>
        </div>
      );
      return;
    }

    parsedBlocks.push(
      <p key={idx} className="text-sm leading-relaxed">
        {line}
      </p>
    );
  });

  return <div className="flex flex-col gap-1.5">{parsedBlocks}</div>;
};
