"use client";
import { useState } from "react";
import { create, all } from "mathjs";

const math = create(all, {});

function formatNumber(numStr: string): string {
  // Check if it's already in scientific notation
  if (/e[+-]?\d+/i.test(numStr)) return numStr;

  // Check if it's a valid number
  if (!/^[-+]?\d+(?:\.\d+)?$/.test(numStr)) return numStr;

  const num = parseFloat(numStr);
  if (isNaN(num)) return numStr;

  // Remove trailing zeros and decimal point if not needed
  const str = numStr.replace(/\.?0+$/, "");

  const neg = str.startsWith("-");
  const n = neg ? str.slice(1) : str;
  const [intPart, decPart] = n.split(".");

  // Use scientific notation only if integer part exceeds 13 digits
  if (intPart.length > 13) {
    return num.toExponential(6).replace(/\.?0+e/, "e");
  }

  // If total length exceeds 20 digits, round the decimal part
  const totalLength = intPart.length + (decPart ? decPart.length : 0);
  let finalDecPart = decPart;

  if (totalLength > 20 && decPart) {
    const maxDecimalPlaces = Math.max(0, 20 - intPart.length);
    const rounded = num.toFixed(maxDecimalPlaces);
    const [, newDecPart] = rounded.split(".");
    finalDecPart = newDecPart ? newDecPart.replace(/0+$/, "") : undefined;
  }

  // Add commas for integer part
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return (neg ? "-" : "") + withCommas + (finalDecPart ? "." + finalDecPart : "");
}

function formatExpr(expr: string): string {
  if (!expr) return "0";
  if (expr === "Error") return "Error";
  return expr.replace(/(^|[^A-Za-z0-9_])(-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)/gi, (_: string, pre: string, num: string) => pre + formatNumber(num));
}

export default function Calculator() {
  const [expr, setExpr] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);

  function evaluateExpression() {
    try {
      const scope = {
        ln: (x: number) => Math.log(x),
        log: (x: number) => Math.log10(x),
        pi: Math.PI,
        e: Math.E,
      };
      const res = math.evaluate(expr, scope);
      let resultStr = String(res);

      // Check if result needs scientific notation (only for large integers)
      const num = parseFloat(resultStr);
      if (!isNaN(num)) {
        const [intPart] = resultStr.split(".");
        const cleanIntPart = intPart.replace(/^[-+]?/, "");
        if (cleanIntPart.length > 13) {
          resultStr = num.toExponential(6).replace(/\.?0+e/, "e");
        }
      }

      setHistory((prev) => [...prev, `${expr}=${resultStr}`].slice(-3));
      setExpr(resultStr);
    } catch {
      setExpr("Error");
    }
  }

  const push = (s: string) => setExpr((p) => p + s);
  const clearAll = () => setExpr("");
  const backspace = () => setExpr((p) => (p ? p.slice(0, -1) : ""));

  const percent = () => {
    setExpr((p) => {
      const m = /(\d+(?:\.\d+)?)\s*$/.exec(p);
      if (!m) return p || "";
      const start = m.index;
      const num = m[1];
      return p.slice(0, start) + `(${num}/100)`;
    });
  };

  const Btn = ({ children, onClick, variant = "neutral" }: { children: React.ReactNode; onClick: () => void; variant?: "neutral" | "op" | "num" | "accent" | "warn" | "func" | "clear" }) => {
    const base =
      "select-none rounded-lg text-lg font-semibold shadow-sm active:translate-y-px transition-colors";
    const styles = {
      neutral: "bg-gray-500 text-white hover:bg-gray-600 py-4",
      op: "bg-gray-600 text-white hover:bg-gray-700 py-4",
      num: "bg-gray-700 text-white hover:bg-gray-800 py-4",
      accent: "bg-orange-600 text-white hover:bg-orange-700 py-4",
      warn: "bg-red-600 text-white hover:bg-red-700 py-4",
      func: "bg-gray-500 text-white hover:bg-gray-600 py-2",
      clear: "bg-gray-800 text-white hover:bg-gray-900 py-4",
    };
    return (
      <button className={`${base} ${styles[variant]}`} onClick={onClick}>
        {children}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center gap-4 py-6 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-black shadow-xl p-4">
        <div className="h-40 w-full rounded-2xl bg-green-50 text-slate-900 flex flex-col items-end justify-end px-4 py-3 text-sm font-mono overflow-y-auto border border-green-200">
          {history.map((line, i) => (
            <div key={i} className="text-slate-500 text-xs mb-0.5">{line}</div>
          ))}
          <div className="text-3xl mt-1 font-semibold">{formatExpr(expr) || "0"}</div>
        </div>

        <div className="grid grid-cols-5 gap-2 mt-3">
          <Btn variant="func" onClick={() => push("sin(")}>sin</Btn>
          <Btn variant="func" onClick={() => push("cos(")}>cos</Btn>
          <Btn variant="func" onClick={() => push("tan(")}>tan</Btn>
          <Btn variant="func" onClick={() => push("log(")}>log</Btn>
          <Btn variant="func" onClick={() => push("ln(")}>ln</Btn>
        </div>

        <div className="grid grid-cols-5 gap-2 mt-2">
          <Btn variant="func" onClick={() => push("e")}>e</Btn>
          <Btn variant="func" onClick={() => push("pi")}>π</Btn>
          <Btn variant="func" onClick={() => push("!")}>x!</Btn>
          <Btn variant="func" onClick={() => push("^")}>xʸ</Btn>
          <Btn variant="func" onClick={() => push("sqrt(")}>√</Btn>
        </div>

        <div className="grid grid-cols-5 gap-2 mt-2">
          <Btn variant="warn" onClick={clearAll}>AC</Btn>
          <Btn variant="clear" onClick={backspace}>C</Btn>
          <Btn variant="func" onClick={() => push("(")}> ( </Btn>
          <Btn variant="func" onClick={() => push(")")}> ) </Btn>
          <Btn variant="func" onClick={percent}>%</Btn>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-2">
          <Btn variant="num" onClick={() => push("7")}>7</Btn>
          <Btn variant="num" onClick={() => push("8")}>8</Btn>
          <Btn variant="num" onClick={() => push("9")}>9</Btn>
          <Btn variant="op" onClick={() => push("/")}>÷</Btn>
          
          <Btn variant="num" onClick={() => push("4")}>4</Btn>
          <Btn variant="num" onClick={() => push("5")}>5</Btn>
          <Btn variant="num" onClick={() => push("6")}>6</Btn>
          <Btn variant="op" onClick={() => push("*")}>×</Btn>
          
          <Btn variant="num" onClick={() => push("1")}>1</Btn>
          <Btn variant="num" onClick={() => push("2")}>2</Btn>
          <Btn variant="num" onClick={() => push("3")}>3</Btn>
          <Btn variant="op" onClick={() => push("-")}>−</Btn>
          
          <Btn variant="num" onClick={() => push("0")}>0</Btn>
          <Btn variant="num" onClick={() => push(".")}>.</Btn>
          <Btn variant="accent" onClick={evaluateExpression}>=</Btn>
          <Btn variant="op" onClick={() => push("+")}>＋</Btn>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-2">
      </div>
    </div>
  );
}