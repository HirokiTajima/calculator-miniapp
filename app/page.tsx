"use client";
import { useState } from "react";
import { create, all } from "mathjs";

const math = create(all, {});

function addCommas(numStr) {
  if (!/^[-+]?\d+(?:\.\d+)?$/.test(numStr)) return numStr;
  const neg = numStr.startsWith("-");
  const n = neg ? numStr.slice(1) : numStr;
  const [i, d] = n.split(".");
  const withCommas = i.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return (neg ? "-" : "") + withCommas + (d ? "." + d : "");
}

function formatExpr(expr) {
  if (!expr) return "0";
  if (expr === "Error") return "Error";
  return expr.replace(/(^|[^A-Za-z0-9_])(-?\d+(?:\.\d+)?)/g, (_, pre, num) => pre + addCommas(num));
}

export default function Calculator() {
  const [expr, setExpr] = useState("");
  const [history, setHistory] = useState([]);

  function evaluateExpression() {
    try {
      const scope = {
        ln: (x) => Math.log(x),
        log: (x) => Math.log10(x),
        pi: Math.PI,
        e: Math.E,
      };
      const res = math.evaluate(expr, scope);
      const resultStr = String(res);
      setHistory((prev) => [...prev, `${expr}=${resultStr}`].slice(-3));
      setExpr(resultStr);
    } catch {
      setExpr("Error");
    }
  }

  const push = (s) => setExpr((p) => p + s);
  const clearAll = () => setExpr("");
  const backspace = () => setExpr((p) => (p ? p.slice(0, -1) : ""));

  const toggleSign = () => {
    setExpr((p) => {
      const m = /(-?\d+(?:\.\d+)?)\s*$/.exec(p);
      if (!m) return p || "";
      const start = m.index;
      const num = m[1];
      return p.slice(0, start) + (num.startsWith("-") ? num.slice(1) : "-" + num);
    });
  };

  const percent = () => {
    setExpr((p) => {
      const m = /(\d+(?:\.\d+)?)\s*$/.exec(p);
      if (!m) return p || "";
      const start = m.index;
      const num = m[1];
      return p.slice(0, start) + `(${num}/100)`;
    });
  };

  const Btn = ({ children, onClick, variant = "neutral" }) => {
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